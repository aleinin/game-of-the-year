package com.aleinin.goty.game

interface GameSearchClient {
    fun findGames(title: String, years: List<Int>? = null, mainGame: Boolean, limit: Int): List<GameSearchResponse>
}
