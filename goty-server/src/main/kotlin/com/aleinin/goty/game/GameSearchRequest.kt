package com.aleinin.goty.game

data class GameSearchRequest(
    val title: String,
    val limit: Int,
    val year: Int?,
    val mainGame: Boolean,
)
