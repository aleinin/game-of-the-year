package com.aleinin.goty.game;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.common.unit.Fuzziness;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;

import static com.google.common.collect.ImmutableList.toImmutableList;

@Slf4j
@RestController
@RequiredArgsConstructor
class GameController {

    private final RestHighLevelClient elasticsearchClient;
    private final ObjectMapper objectMapper;

    @GetMapping("/games")
    List<String> games(@RequestParam String name, @RequestParam(defaultValue = "5") int count) throws IOException {
        var shouldMatch = QueryBuilders.boolQuery()
                .should(QueryBuilders.matchQuery("name", name).fuzziness(Fuzziness.AUTO))
                .should(QueryBuilders.matchPhraseQuery("name", name))
                .should(QueryBuilders.matchQuery("alternative_names.name", name).fuzziness(Fuzziness.AUTO))
                .should(QueryBuilders.matchPhraseQuery("alternative_names.name", name));
        var mustMatch = QueryBuilders.boolQuery()
                .must(shouldMatch)
                .must(QueryBuilders.matchQuery("category", "MAIN_GAME"));
        var searchSource = new SearchSourceBuilder()
                .query(mustMatch)
                .size(count)
                .fetchSource("name", "");
        var searchRequest = new SearchRequest()
                .indices("games")
                .source(searchSource);
        var result = elasticsearchClient.search(searchRequest, RequestOptions.DEFAULT);
        return Arrays.stream(result.getHits().getHits())
                .map(SearchHit::getSourceAsString)
                .map(this::readTree)
                .filter(Objects::nonNull)
                .map(game -> game.get("name").asText())
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
}
