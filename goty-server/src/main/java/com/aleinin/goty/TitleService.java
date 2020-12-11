package com.aleinin.goty;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.collect.ImmutableList;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import lombok.Value;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;
import java.util.List;

import static com.google.common.collect.ImmutableList.toImmutableList;

@Slf4j
@Component
@RequiredArgsConstructor
class TitleService implements ApplicationListener<ContextRefreshedEvent> {

    private ImmutableList<Game> games = ImmutableList.of();

    private final ObjectMapper objectMapper;

    public List<String> search(String word, int count) {
        return games.stream()
                .filter(game -> game.getNames()
                        .stream()
                        .anyMatch(name -> StringUtils.containsIgnoreCase(name, word)))
                .limit(count)
                .map(Game::getName)
                .collect(toImmutableList());
    }

    @Override
    public void onApplicationEvent(@NonNull ContextRefreshedEvent event) {
        try {
            games = ImmutableList.copyOf(objectMapper.readValue(new File("game_titles.json"), Game[].class));
        } catch (IOException e) {
            log.error(e.getMessage(), e);
        }
    }

    @Value
    @Builder
    private static class Game {

        int id;
        String name;
        List<String> names;
    }
}
