package com.aleinin.goty.game

interface GameSearchClient {
    fun findGames(title: String, year: Int? = null, mainGame: Boolean, limit: Int): List<GameSearchResponse>
}
