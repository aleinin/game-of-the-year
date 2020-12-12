package com.aleinin.goty.game

import org.springframework.web.bind.annotation.RequestParam

data class GameSearchRequest(
        @RequestParam val name: String,
        @RequestParam(defaultValue = "5") val limit: Int = 5,
        @RequestParam(required = false) val year: Int?,
        @RequestParam(defaultValue = "false") val mainGame: Boolean = false)
