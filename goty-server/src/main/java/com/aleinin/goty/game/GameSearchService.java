package com.aleinin.goty.game;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.collect.ImmutableList;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.Requests;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.common.unit.Fuzziness;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;

import static com.google.common.collect.ImmutableList.toImmutableList;

@Slf4j
@Component
@RequiredArgsConstructor
class GameSearchService {

    private static final String[] includeFields = new String[] {"name", "id"};

    private final RestHighLevelClient elasticsearchClient;
    private final ObjectMapper objectMapper;

    public List<GameSearchResponse> search(String query, Integer year, boolean mainGame, int limit) throws IOException {
        var mustMatch = QueryBuilders.boolQuery();
        mustMatchName(mustMatch, query);
        mustMatchMainGame(mustMatch, mainGame);
        mustMatchYear(mustMatch, year);
        var result = search(mustMatch, limit);
        return toGameResponse(result);
    }

    private void mustMatchName(BoolQueryBuilder queryBuilder, String query) {
        queryBuilder.must(shouldMatchName(query));
    }

    private BoolQueryBuilder shouldMatchName(String query) {
        return QueryBuilders.boolQuery()
                .should(QueryBuilders.matchQuery("name", query).fuzziness(Fuzziness.AUTO))
                .should(QueryBuilders.matchPhraseQuery("name", query))
                .should(QueryBuilders.matchQuery("alternative_names.name", query).fuzziness(Fuzziness.AUTO))
                .should(QueryBuilders.matchPhraseQuery("alternative_names.name", query));
    }

    private void mustMatchMainGame(BoolQueryBuilder queryBuilder, boolean mainGame) {
        if (mainGame) {
            queryBuilder.must(QueryBuilders.matchQuery("category", "MAIN_GAME"));
        }
    }

    private void mustMatchYear(BoolQueryBuilder queryBuilder, Integer year) {
        if (year != null) {
            queryBuilder.must(QueryBuilders.matchQuery("release_dates.y", year));
        }
    }

    private SearchResponse search(QueryBuilder queryBuilder, int limit) throws IOException {
        return elasticsearchClient.search(buildSearchRequest(queryBuilder, limit), RequestOptions.DEFAULT);
    }

    private SearchRequest buildSearchRequest(QueryBuilder queryBuilder, int limit) {
        return Requests.searchRequest("games")
                .source(searchSource(queryBuilder, limit));
    }

    private SearchSourceBuilder searchSource(QueryBuilder queryBuilder, int limit) {
        return SearchSourceBuilder.searchSource()
                .query(queryBuilder)
                .size(limit)
                .fetchSource(includeFields, new String[]{});
    }

    private ImmutableList<GameSearchResponse> toGameResponse(SearchResponse result) {
        return Arrays.stream(result.getHits().getHits())
                .map(SearchHit::getSourceAsString)
                .map(this::readTree)
                .filter(Objects::nonNull)
                .map(this::buildGameResponse)
                .collect(toImmutableList());
    }

    private JsonNode readTree(String json) {
        try {
            return objectMapper.readTree(json);
        } catch (JsonProcessingException e) {
            log.error(e.getMessage(), e);
        }

        return null;
    }

    private GameSearchResponse buildGameResponse(JsonNode game) {
        return GameSearchResponse.builder()
                .id(game.get("id").asText())
                .name(game.get("name").asText())
                .build();
    }
}
