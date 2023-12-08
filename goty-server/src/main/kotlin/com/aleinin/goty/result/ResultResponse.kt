package com.aleinin.goty.result

data class ResultResponse(
    val year: Int,
    val gamesOfTheYear: List<ScoredGameResult>,
    val mostAnticipated: List<RankedGameResult>,
    val bestOldGame: List<RankedGameResult>,
    val participants: List<String>,
    val giveawayParticipants: List<String>,
)
