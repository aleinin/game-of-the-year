package com.aleinin.gotyscraper;

import com.aleinin.gotyscraper.Game.GameCover;
import com.api.igdb.apicalypse.APICalypse;
import com.api.igdb.exceptions.RequestException;
import com.api.igdb.request.IGDBWrapper;
import com.api.igdb.utils.Endpoints;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.collect.ImmutableListMultimap;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;

import static com.google.common.collect.ImmutableList.toImmutableList;
import static java.util.Comparator.comparing;
import static java.util.function.Function.identity;

@Slf4j
@Component
@RequiredArgsConstructor
class IGDBScraper {

    private static final List<String> titles_and_follows = List.of(
            "name",
            "alternative_names.name",
            "cover.*",
            "follows",
            "release_dates.*"
    );

    private static final List<String> all_fields = List.of(
            "*",
            "age_ratings.*",
            "alternative_names.*",
            "artworks.*",
            "external_games.*",
            "franchises.*",
            "game_modes.*",
            "genres.*",
            "involved_companies.*",
            "keywords.*",
            "multiplayer_modes.*",
            "platforms.*",
            "player_perspectives.*",
            "release_dates.*",
            "screenshots.*",
            "themes.*",
            "videos.*",
            "websites.*"
    );

    // https://api-docs.igdb.com/#release-date
    private static final String REGION_NORTH_AMERICA = "2";
    private static final String REGION_WORLDWIDE = "8";

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
                .map(this::parseGame)
                .sorted(comparing(Game::getId))
                .collect(toImmutableList());

        objectMapper.writer().writeValue(new File("games.json"), allGamesSorted);
    }

    private List<JsonNode> queryForPage(int page) throws JsonProcessingException, RequestException {
        var request = new APICalypse()
                .fields(String.join(",", titles_and_follows))
                .where(buildWhere(page))
                .limit(500);

        var response = objectMapper.readTree(igdbClient.apiJsonRequest(Endpoints.GAMES, request.buildQuery()));

        return StreamSupport.stream(response.spliterator(), false)
                .collect(toImmutableList());
    }

    private String buildWhere(int page) {
        return "id >= %d & id < %d".formatted(page * 500, (page + 1) * 500);
    }

    private Game parseGame(JsonNode game) {
        var primaryTitle = game.get("name").asText();
        var alternativeTitles = parseAlternativeNames(game);
        var aliases = Stream.concat(Stream.of(primaryTitle), alternativeTitles.stream()).collect(toImmutableList());
        var follows = game.has("follows") ? game.get("follows").asInt() : 0;

        return Game.builder()
                .id(game.get("id").asInt())
                .aliases(aliases)
                .cover(parseCover(game))
                .follows(follows)
                .primaryTitle(primaryTitle)
                .release(parseRelease(game))
                .build();
    }

    private List<String> parseAlternativeNames(JsonNode game) {
        if (game.has("alternative_names")) {
            return StreamSupport.stream(game.get("alternative_names").spliterator(), false)
                    .map(alternativeName -> alternativeName.get("name").asText())
                    .collect(toImmutableList());
        }

        return Collections.emptyList();
    }

    private GameCover parseCover(JsonNode game) {
        if (game.has("cover")) {
            var gameCover = game.get("cover");
            return GameCover.builder()
                    .id(gameCover.has("image_id") ? gameCover.get("image_id").asText() : null)
                    .height(gameCover.has("height") ? gameCover.get("height").asInt() : 0)
                    .width(gameCover.has("width") ? gameCover.get("width").asInt() : 0)
                    .build();
        }

        return null;
    }

    private Long parseRelease(JsonNode game) {
        if (game.has("release_dates")) {
            var releaseDates = game.get("release_dates");
            var releaseByRegion = StreamSupport.stream(releaseDates.spliterator(), false)
                    .collect(ImmutableListMultimap.toImmutableListMultimap(releaseDate -> releaseDate.get("region").asText(), identity()));
            if (releaseByRegion.containsKey(REGION_NORTH_AMERICA)) {
                return findEarliestRelease(releaseByRegion, REGION_NORTH_AMERICA);
            } else if (releaseByRegion.containsKey(REGION_WORLDWIDE)) {
                return findEarliestRelease(releaseByRegion, REGION_WORLDWIDE);
            }
        }

        return null;
    }

    private Long findEarliestRelease(ImmutableListMultimap<String, JsonNode> releaseByRegion, String regionNorthAmerica) {
        return releaseByRegion.get(regionNorthAmerica)
                .stream()
                .filter(releaseDate -> releaseDate.has("date"))
                .mapToLong(releaseDate -> releaseDate.get("date").asLong())
                .sorted()
                .findFirst()
                .orElse(0);
    }
}
