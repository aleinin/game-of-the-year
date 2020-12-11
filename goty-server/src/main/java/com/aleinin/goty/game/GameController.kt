package com.aleinin.goty.game

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
internal class GameController(
        private val gameCountService: GameCountService,
        private val gameSearchService: GameSearchService) {

    @GetMapping("/games")
    fun gameSearch(gameSearchRequest: GameSearchRequest) = gameSearchService.search(gameSearchRequest)

    @GetMapping("/games/count")
    fun count() = gameCountService.count()
}
