package com.aleinin.goty.submit

import org.springframework.data.annotation.Id
import java.util.*

data class GameOfTheYearSubmission(
        @Id val id: UUID,
        val name: String,
        val gameSubmissions: List<RankedGameSubmission>,
        val mostAnticipated: GameSubmission,
        val bestOldGame: GameSubmission) {

    data class GameSubmission(
            val id: String,
            val title: String)

    data class RankedGameSubmission(
            val id: String,
            val title: String,
            val rank: Int)
}

