package com.aleinin.goty.submission

import java.util.UUID

data class Submission(
    val id: UUID,
    val name: String,
    val year: String,
    val gamesOfTheYear: List<RankedGameSubmission>,
    val mostAnticipated: GameSubmission?,
    val mostDisappointing: GameSubmission?,
    val bestOldGame: GameSubmission?,
    val enteredGiveaway: Boolean,
    val enteredOn: Long,
    val updatedOn: Long,
)
