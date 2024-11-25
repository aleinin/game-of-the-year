package com.aleinin.goty.result

data class ResultResponse(
    val year: String,
    val gamesOfTheYear: List<ScoredGameResult>,
    val mostAnticipated: List<RankedGameResult>,
    val mostDisappointing: List<RankedGameResult>,
    val bestOldGame: List<RankedGameResult>,
    val participants: List<String>,
    val giveawayParticipants: List<String>,
)
