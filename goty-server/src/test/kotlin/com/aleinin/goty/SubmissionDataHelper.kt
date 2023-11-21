package com.aleinin.goty

import com.aleinin.goty.result.RankedGameResult
import com.aleinin.goty.result.ScoredGameResult
import com.aleinin.goty.submission.GameSubmission
import com.aleinin.goty.submission.RankedGameSubmission
import com.aleinin.goty.submission.SecretSubmission
import com.aleinin.goty.submission.Submission
import java.util.UUID

// Helper class with representative data to make testing easier
class SubmissionDataHelper {
    companion object {

        fun secret(submissions: List<Submission>): List<SecretSubmission> = submissions.map { secret(it) }
        fun secret(submission: Submission): SecretSubmission =
            SecretSubmission(
                id = submission.id,
                secret = UUID.randomUUID(),
                name = submission.name,
                gamesOfTheYear = submission.gamesOfTheYear,
                mostAnticipated = submission.mostAnticipated,
                bestOldGame = submission.bestOldGame,
                enteredGiveaway = submission.enteredGiveaway,
                enteredOn = submission.enteredOn,
                updatedOn = submission.updatedOn
            )
        fun everything(): List<Submission> = listOf(
            theMaximalSubmission,
            theMinimalSubmission,
            theAverageSubmission,
            theTieBreakerSubmission
        )

        fun minimal() = theMinimalSubmission
        fun maximal() = theMaximalSubmission

        private val theMaximalSubmission = Submission(
            id = UUID.randomUUID(),
            name = "Maxi Max",
            gamesOfTheYear = gamesOfTheYear(
                "Call of Duty Modern Warfare II",
                "Stray",
                "Bayonetta 3",
                "OlliOlli World",
                "Tiny Tina's Wonderland"
            ),
            mostAnticipated = aGameSubmission("Cant wait"),
            bestOldGame = aGameSubmission("Nostalgia"),
            enteredGiveaway = true,
            enteredOn = 1,
            updatedOn = 2
        )

        private val theMinimalSubmission = Submission(
            id = UUID.randomUUID(),
            name = "Lazy Luna",
            gamesOfTheYear = gamesOfTheYear("Clicker Pro"),
            mostAnticipated = null,
            bestOldGame = null,
            enteredGiveaway = false,
            enteredOn = 1,
            updatedOn = 1
        )

        private val theAverageSubmission = Submission(
            id = UUID.randomUUID(),
            name = "Average Andy",
            gamesOfTheYear = gamesOfTheYear("PlateUp!", "Overwatch 2", "Elden Ring"),
            mostAnticipated = aGameSubmission("Call of Duty XIX"),
            bestOldGame = aGameSubmission("Elder Scrolls V: Skyrim"),
            enteredGiveaway = true,
            enteredOn = 1,
            updatedOn = 1
        )

        private val theTieBreakerSubmission = Submission(
            id = UUID.randomUUID(),
            name = "Ty Tie-Breaker",
            gamesOfTheYear = gamesOfTheYear(
                "Call of Duty Modern Warfare II",
                "Clicker Pro",
                "PlateUp!",
                "Stray",
                "Overwatch 2",
                "Bayonetta 3",
                "Elden Ring"
            ),
            mostAnticipated = aGameSubmission("Cant wait"),
            bestOldGame = aGameSubmission("Nostalgia"),
            enteredGiveaway = false,
            enteredOn = 101,
            updatedOn = 404
        )

        fun aGameSubmission(name: String) = GameSubmission(name, name)
        fun aRankedGameSubmission(name: String, rank: Int) = RankedGameSubmission(name, name, rank)
        fun gamesOfTheYear(vararg games: String): List<RankedGameSubmission> =
            games.mapIndexed { index, game -> aRankedGameSubmission(game, index) }

        fun aRankedGameResult(title: String, rank: Int, votes: Int) = RankedGameResult(
            id = title,
            title = title,
            votes = votes,
            rank = rank
        )

        fun aScoredGameResult(title: String, points: Int, votes: Int, rank: Int) =
            ScoredGameResult(
                id = title,
                title = title,
                points = points,
                votes = votes,
                rank = rank
            )

    }
}
