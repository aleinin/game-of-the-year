package com.aleinin.goty.game

import com.api.igdb.apicalypse.APICalypse
import com.api.igdb.request.IGDBWrapper
import com.api.igdb.utils.Endpoints
import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import com.google.common.collect.ImmutableList
import org.springframework.context.annotation.Profile
import org.springframework.stereotype.Component
import java.util.stream.StreamSupport

@Component
@Profile("prod")
class IGDBGameSearchClient(
    private val igdbWrapper: IGDBWrapper,
    private val objectMapper: ObjectMapper,
) : GameSearchClient {

    override fun findGames(title: String, years: List<Int>?, mainGame: Boolean, limit: Int): List<GameSearchResponse> {
        val request = APICalypse()
            .fields("id, name")
            .search(title)
            .apply {
                val conditions = mutableListOf<String>()
                if (!years.isNullOrEmpty()) {
                    conditions.add(buildReleaseDateWhere(years))
                }
                if (mainGame) {
                    conditions.add(buildMainGameWhere())
                }
                if (conditions.isNotEmpty()) {
                    where(conditions.joinToString(" & "))
                }
            }
            .limit(limit)
        val response = igdbWrapper.apiJsonRequest(Endpoints.GAMES, request.buildQuery())
        val responseTree = objectMapper.readTree(response)
        return StreamSupport.stream(responseTree.spliterator(), false)
            .map { game: JsonNode? ->
                GameSearchResponse(id = game?.get("id")!!.asText(), title = game.get("name")!!.asText())
            }
            .collect(ImmutableList.toImmutableList())
    }


    private fun buildReleaseDateWhere(years: List<Int>): String {
        return years.joinToString(" | ") { "release_dates.y = $it" }.let { "($it)" }
    }

    private fun buildMainGameWhere(): String {
        return "category = 0"
    }
}
