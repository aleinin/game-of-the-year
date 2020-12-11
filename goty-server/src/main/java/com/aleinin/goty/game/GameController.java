package com.aleinin.goty.game;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/games")
@RequiredArgsConstructor
class GameController {

    private final GameCountService gameCountService;
    private final GameSearchService gameSearchService;

    @GetMapping
    List<GameSearchResponse> gameSearch(@RequestParam String query,
                                        @RequestParam(required = false) Integer year,
                                        @RequestParam(defaultValue = "true") boolean mainGame,
                                        @RequestParam(defaultValue = "5") int limit) throws IOException {
        return gameSearchService.search(query, year, mainGame, limit);
    }

    @GetMapping("/count")
    long count() throws IOException {
        return gameCountService.count();
    }
}
