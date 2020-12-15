package com.aleinin.goty.submit

import org.springframework.data.annotation.Id
import java.util.UUID

data class SubmissionRequest(
    @Id val id: UUID?,
    val name: String,
    val gamesOfTheYear: List<RankedGameSubmission>,
    val mostAnticipated: GameSubmission?,
    val bestOldGame: GameSubmission?,
    val enteredGiveaway: Boolean = false,
    val enteredOn: Long?,
    val updatedOn: Long?,
) {

    data class GameSubmission(
        val id: String,
        val title: String,
    )

    data class RankedGameSubmission(
        val id: String,
        val title: String,
        val rank: Int,
    )
}
