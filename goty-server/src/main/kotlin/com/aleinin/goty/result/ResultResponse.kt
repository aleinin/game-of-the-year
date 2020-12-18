package com.aleinin.goty.result

data class ResultResponse(
    val gamesOfTheYear: List<RankedGameResult>,
    val mostAnticipated: List<GameResult>,
    val bestOldGame: List<GameResult>,
    val giveawayParticipants: List<String>,
)
