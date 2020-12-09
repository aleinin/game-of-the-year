package com.aleinin.goty.game;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
class GameController {

    private final GameService gameService;

    @GetMapping("/games")
    List<Game> games(@RequestParam String game, @RequestParam(defaultValue = "5") int count) {
        return gameService.search(game, count);
    }
}
