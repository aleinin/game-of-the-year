package com.aleinin.goty.game

data class GameSearchRequest(
        val name: String,
        val limit: Int = 5,
        val year: Int?,
        val mainGame: Boolean = false)
