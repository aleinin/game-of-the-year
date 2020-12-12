package com.aleinin.goty.game

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
internal class GameController(
        private val gameCountService: GameCountService,
        private val gameSearchService: GameSearchService) {

    @GetMapping("/games")
    fun gameSearch(@RequestParam name: String,
                   @RequestParam(defaultValue = "5") limit: Int,
                   @RequestParam(required = false) year: Int?,
                   @RequestParam(defaultValue = "false") mainGame: Boolean) =
        gameSearchService.search(GameSearchRequest(
            name = name,
            limit = limit,
            year = year,
            mainGame = mainGame
        ))

    @GetMapping("/games/count")
    fun count() = gameCountService.count()
}
