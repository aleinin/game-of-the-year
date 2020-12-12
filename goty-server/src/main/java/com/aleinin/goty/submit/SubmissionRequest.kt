package com.aleinin.goty.submit

import org.springframework.data.annotation.Id
import java.util.*

data class SubmissionRequest(
        @Id val id: UUID?,
        val name: String,
        val gamesOfTheYear: List<RankedGameSubmission>,
        val mostAnticipated: GameSubmission,
        val bestOldGame: GameSubmission,
        val enteredGiveaway: Boolean
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

