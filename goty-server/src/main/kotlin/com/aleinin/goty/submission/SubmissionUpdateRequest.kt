package com.aleinin.goty.submission

import java.util.UUID

data class SubmissionUpdateRequest(
    val name: String,
    val secret: UUID,
    val gamesOfTheYear: List<RankedGameSubmission>,
    val mostAnticipated: GameSubmission?,
    val mostDisappointing: GameSubmission?,
    val bestOldGame: GameSubmission?,
    val enteredGiveaway: Boolean = false
) {
    init {
        require(name.isNotBlank()) { "name cannot be blank"}
        require(gamesOfTheYear.isNotEmpty()) { "gamesOfTheYear cannot be empty"}
    }
}
