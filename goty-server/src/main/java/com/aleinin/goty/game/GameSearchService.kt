package com.aleinin.goty.game

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import org.elasticsearch.client.RequestOptions
import org.elasticsearch.client.Requests
import org.elasticsearch.client.RestHighLevelClient
import org.elasticsearch.common.unit.Fuzziness
import org.elasticsearch.index.query.BoolQueryBuilder
import org.elasticsearch.index.query.QueryBuilders
import org.elasticsearch.search.builder.SearchSourceBuilder
import org.springframework.stereotype.Component

@Component
class GameSearchService(
        private val elasticsearchClient: RestHighLevelClient,
        private val objectMapper: ObjectMapper) {

    companion object {
        private const val index = "games"
        private val includeFields = arrayOf("name", "id")
    }

    fun search(gameSearchRequest: GameSearchRequest) =
            elasticsearchClient
                    .search(buildGameSearchRequest(gameSearchRequest), RequestOptions.DEFAULT)
                    .hits
                    .hits
                    .map { it.sourceAsString }
                    .map { objectMapper.readTree(it) }
                    .map { buildGameResponse(it) }

    private fun buildGameSearchRequest(gameSearchRequest: GameSearchRequest) =
            Requests.searchRequest(index)
                    .source(buildGameSearchSource(gameSearchRequest))

    private fun buildGameSearchSource(gameSearchRequest: GameSearchRequest) =
            SearchSourceBuilder.searchSource()
                    .query(buildGameQuery(gameSearchRequest))
                    .size(gameSearchRequest.limit)
                    .fetchSource(includeFields, arrayOf())

    private fun buildGameQuery(gameSearchRequest: GameSearchRequest) =
            QueryBuilders.boolQuery()
                    .mustMatchName(gameSearchRequest.name)
                    .mustMatchMainGame(gameSearchRequest.mainGame)
                    .mustMatchYear(gameSearchRequest.year)

    private fun BoolQueryBuilder.mustMatchName(name: String) =
            this.must(QueryBuilders.boolQuery()
                    .shouldMatchFuzzy("name", name)
                    .shouldMatchFuzzy("alternative_names.name", name))

    private fun BoolQueryBuilder.shouldMatchFuzzy(field: String, text: String) =
            this.should(QueryBuilders.matchQuery(field, text).fuzziness(Fuzziness.AUTO))
                    .should(QueryBuilders.matchPhraseQuery(field, text))

    private fun BoolQueryBuilder.mustMatchMainGame(mainGame: Boolean?) =
            if (mainGame == true) this.must(QueryBuilders.matchQuery("category", "MAIN_GAME")) else this

    private fun BoolQueryBuilder.mustMatchYear(year: Int?) =
            if (year != null) this.must(QueryBuilders.matchQuery("release_dates.y", year)) else this

    private fun buildGameResponse(game: JsonNode) =
            GameSearchResponse(id = game["id"].asText(), name = game["name"].asText())
}
