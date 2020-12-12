package com.aleinin.goty.game

data class GameSearchRequest(
        val name: String,
        val limit: Int,
        val year: Int?,
        val mainGame: Boolean)
