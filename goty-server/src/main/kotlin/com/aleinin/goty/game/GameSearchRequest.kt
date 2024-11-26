package com.aleinin.goty.game

data class GameSearchRequest(
    val title: String,
    val limit: Int,
    val years: List<Int>?,
    val mainGame: Boolean,
)
