package com.aleinin.gotyscraper;

import com.api.igdb.apicalypse.APICalypse;
import com.api.igdb.exceptions.RequestException;
import com.api.igdb.request.IGDBWrapper;
import com.api.igdb.utils.Endpoints;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import lombok.Value;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;

@Slf4j
@Component
@RequiredArgsConstructor
class IGDBScraper {

    private static final List<String> fields = List.of(
            "name",
            "alternative_names.name"
    );

    private static final List<String> all_fields = List.of(
            "*",
            "age_ratings.*",
            "alternative_names.*",
            "artworks.*",
            "bundles.*",
            "external_games.*",
            "franchises.*",
            "game_modes.*",
            "genres.*",
            "involved_companies.*",
            "keywords.*",
            "platforms.*",
            "player_perspectives.*",
            "release_dates.*",
            "screenshots.*",
            "standalone_expansions.*",
            "themes.*",
            "videos.*",
            "websites.*"
    );

    private final IGDBWrapper igdbClient;
    private final ObjectMapper objectMapper;

    @PostConstruct
    void scrapeTitles() throws RequestException, IOException {
        var page = 0;
        var games = queryForPage(page);
        var allGames = new ArrayList<JsonNode>();

        while (!games.isEmpty()) {
            log.info("page = %d, begin = %d, end = %d, results = %d"
                    .formatted(page, page * 500, (page + 1) * 500, games.size()));
            allGames.addAll(games);
            games = queryForPage(++page);
        }

        var allGamesSorted = allGames.stream()
                .map(this::asFormattedGame)
                .sorted(Comparator.comparing(Game::getId))
                .collect(Collectors.toUnmodifiableList());

        objectMapper.writer().writeValue(new File("game_titles.json"), allGamesSorted);
    }

    private Game asFormattedGame(JsonNode game) {
        var name = game.get("name").asText();
        var alternativeNames = parseAlternativeNames(game);

        return Game.builder()
                .id(game.get("id").asInt())
                .name(name)
                .names(Stream.concat(Stream.of(name), alternativeNames.stream()).collect(Collectors.toUnmodifiableList()))
                .build();
    }

    private List<String> parseAlternativeNames(JsonNode game) {
        if (game.has("alternative_names")) {
            return StreamSupport.stream(game.get("alternative_names").spliterator(), false)
                    .map(alternativeName -> alternativeName.get("name").asText())
                    .collect(Collectors.toUnmodifiableList());
        }

        return Collections.emptyList();
    }

    private List<JsonNode> queryForPage(int page) throws JsonProcessingException, RequestException {
        var request = new APICalypse()
                .fields(String.join(",", fields))
                .where(buildWhere(page))
                .limit(500);

        var response = objectMapper.readTree(igdbClient.apiJsonRequest(Endpoints.GAMES, request.buildQuery()));

        return StreamSupport.stream(response.spliterator(), false)
                .collect(Collectors.toUnmodifiableList());
    }

    private String buildWhere(int page) {
        return "id >= %d & id < %d".formatted(page * 500, (page + 1) * 500);
    }

    @Value
    @Builder
    private static class Game {

        int id;
        String name;
        List<String> names;
    }
}
