package com.aleinin.goty.game;

import lombok.RequiredArgsConstructor;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.client.core.CountRequest;
import org.elasticsearch.index.query.QueryBuilders;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
class GameCountService {

    private final RestHighLevelClient elasticsearchClient;

    long count() throws IOException {
        var countRequest = new CountRequest("games")
                .query(QueryBuilders.matchAllQuery());
        return elasticsearchClient
                .count(countRequest, RequestOptions.DEFAULT)
                .getCount();
    }
}
