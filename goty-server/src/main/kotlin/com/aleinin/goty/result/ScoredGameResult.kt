package com.aleinin.goty.result

data class ScoredGameResult(
    val id: String,
    val title: String,
    val points: Int = 0,
    val votes: Int = 0,
    val rank: Int = 0,
)
