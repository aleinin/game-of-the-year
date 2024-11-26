package com.aleinin.goty.game

import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@CrossOrigin
@RestController
class GameController(
    private val gameSearchService: GameSearchService,
) {

    @GetMapping("/games")
    fun gameSearch(
        @RequestParam title: String,
        @RequestParam(defaultValue = "10") limit: Int,
        @RequestParam(required = false) years: List<Int>?,
        @RequestParam(defaultValue = "true") mainGame: Boolean,
    ) = gameSearchService.search(GameSearchRequest(title = title, limit = limit, years = years, mainGame = mainGame))
}
