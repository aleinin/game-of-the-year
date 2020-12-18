package com.aleinin.goty.result

data class RankedGameResult(
    val id: String = "",
    val title: String = "",
    val points: Int = 0,
    val votes: Int = 0,
    val rank: Int = 0,
)
