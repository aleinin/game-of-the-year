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
@Profile("igdb")
class IGDBGameSearchClient(
    private val igdbWrapper: IGDBWrapper,
    private val objectMapper: ObjectMapper,
) : GameSearchClient {

    override fun findGames(title: String, year: Int?, mainGame: Boolean, limit: Int): List<GameSearchResponse> {
        val request = APICalypse()
            .fields("id, name")
            .search(title)
            .apply {
                if (year != null || mainGame) {
                    where(buildWhere(year, mainGame))
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

    fun buildWhere(year: Int?, mainGame: Boolean) =
        if (mainGame && year != null) {
            "release_dates.y = $year & category = 0"
        } else if (year != null) {
            "release_dates.y = $year"
        } else if (mainGame) {
            "category = 0"
        } else {
            throw IllegalArgumentException("year must be defined and/or main game must be true")
        }
}
