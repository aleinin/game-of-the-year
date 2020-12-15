package com.aleinin.goty.game

import org.elasticsearch.client.RequestOptions
import org.elasticsearch.client.RestHighLevelClient
import org.elasticsearch.client.core.CountRequest
import org.elasticsearch.index.query.QueryBuilders
import org.springframework.stereotype.Component

@Component
class GameCountService(private val elasticsearchClient: RestHighLevelClient) {

    fun count() =
        elasticsearchClient.count(
            CountRequest("games").query(QueryBuilders.matchAllQuery()),
            RequestOptions.DEFAULT
        ).count
}
