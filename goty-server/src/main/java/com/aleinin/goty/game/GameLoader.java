package com.aleinin.goty.game;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.collect.ImmutableMap;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;
import java.util.Arrays;
import java.util.function.Function;

import static com.google.common.collect.ImmutableMap.toImmutableMap;

@Slf4j
@Component
@RequiredArgsConstructor
class GameLoader {

    private static final String gamesFilename = "games.json";

    private final ObjectMapper objectMapper;

    public ImmutableMap<String, Game> fromFile() {
        try {
            return Arrays.stream(objectMapper.readValue(new File(gamesFilename), Game[].class))
                    .collect(toImmutableMap(Game::getId, Function.identity()));
        } catch (IOException e) {
            log.error(e.getMessage(), e);
        }

        return ImmutableMap.of();
    }
}
