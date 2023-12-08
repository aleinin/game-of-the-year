package com.aleinin.goty.submission

import java.util.UUID

data class Submission(
    val id: UUID,
    val name: String,
    val year: Int,
    val gamesOfTheYear: List<RankedGameSubmission>,
    val mostAnticipated: GameSubmission?,
    val bestOldGame: GameSubmission?,
    val enteredGiveaway: Boolean,
    val enteredOn: Long,
    val updatedOn: Long,
)
