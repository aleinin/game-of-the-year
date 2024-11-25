package com.aleinin.goty

import com.aleinin.goty.result.RankedGameResult
import com.aleinin.goty.result.ResultResponse
import com.aleinin.goty.result.ScoredGameResult
import com.aleinin.goty.submission.GameSubmission
import com.aleinin.goty.submission.RankedGameSubmission
import com.aleinin.goty.submission.SecretSubmission
import com.aleinin.goty.submission.Submission
import com.aleinin.goty.submission.SubmissionCreationRequest
import com.aleinin.goty.submission.SubmissionUpdateRequest
import java.util.UUID

// Helper class with representative data to make testing easier
class SubmissionDataHelper {
    companion object {
        private const val defaultYear = "2050"

        fun secret(submissions: List<Submission>): List<SecretSubmission> = submissions.map { secret(it) }
        fun secret(submission: Submission): SecretSubmission =
            SecretSubmission(
                id = submission.id,
                year = submission.year,
                secret = UUID.randomUUID(),
                name = submission.name,
                gamesOfTheYear = submission.gamesOfTheYear,
                mostAnticipated = submission.mostAnticipated,
                mostDisappointing = submission.mostDisappointing,
                bestOldGame = submission.bestOldGame,
                enteredGiveaway = submission.enteredGiveaway,
                enteredOn = submission.enteredOn,
                updatedOn = submission.updatedOn
            )

        fun everything(year: String = defaultYear): List<Submission> = listOf(
            theMaximalSubmission(year),
            theMinimalSubmission(year),
            theAverageSubmission(year),
            theTieBreakerSubmission(year)
        )

        fun creationRequest(submission: Submission) = SubmissionCreationRequest(
            name = submission.name,
            gamesOfTheYear = submission.gamesOfTheYear,
            mostAnticipated = submission.mostAnticipated,
            bestOldGame = submission.bestOldGame,
            mostDisappointing = submission.mostDisappointing,
            enteredGiveaway = submission.enteredGiveaway
        )

        fun creationRequest(submission: SecretSubmission) = SubmissionCreationRequest(
            name = submission.name,
            gamesOfTheYear = submission.gamesOfTheYear,
            mostAnticipated = submission.mostAnticipated,
            bestOldGame = submission.bestOldGame,
            mostDisappointing = submission.mostDisappointing,
            enteredGiveaway = submission.enteredGiveaway
        )

        fun updateRequest(submission: SecretSubmission) = SubmissionUpdateRequest(
            name = submission.name,
            secret = submission.secret,
            gamesOfTheYear = submission.gamesOfTheYear,
            mostAnticipated = submission.mostAnticipated,
            bestOldGame = submission.bestOldGame,
            mostDisappointing = submission.mostDisappointing,
            enteredGiveaway = submission.enteredGiveaway
        )

        fun everythingScored(year: String = defaultYear): ResultResponse = ResultResponse(
            year = year,
            gamesOfTheYear = listOf(
                aScoredGameResult("Call of Duty Modern Warfare II", 30, 2, 0),
                aScoredGameResult("Clicker Pro", 28, 2, 1),
                aScoredGameResult("PlateUp!", 26, 2, 2),
                aScoredGameResult("Stray", 20, 2, 3),
                aScoredGameResult("Overwatch 2", 19, 2, 4),
                aScoredGameResult("Bayonetta 3", 16, 2, 5),
                aScoredGameResult("Elden Ring", 15, 2, 6),
                aScoredGameResult("OlliOlli World", 7, 1, 7),
                aScoredGameResult("Tiny Tina's Wonderland", 6, 1, 8),
            ),
            mostAnticipated = listOf(
                aRankedGameResult("Cant wait", 0, 2),
                aRankedGameResult("Call of Duty XIX", 1, 1)
            ),
            bestOldGame = listOf(
                aRankedGameResult("Nostalgia", 0, 2),
                aRankedGameResult("Elder Scrolls V: Skyrim", 1, 1)
            ),
            mostDisappointing = listOf(
                aRankedGameResult("Over-hyped", 0, 2),
                aRankedGameResult("Buggy", 1, 1)
            ),
            participants = listOf(
                theMaximalSubmission(year).name,
                theMinimalSubmission(year).name,
                theAverageSubmission(year).name,
                theTieBreakerSubmission(year).name
            ),
            giveawayParticipants = listOf(theMaximalSubmission(year).name, theAverageSubmission(year).name)
        )

        val tiePoints = listOf(
            15,
            13,
            11,
            7,
            6,
            5,
            4,
            3,
            2,
            1
        )

        fun minimal(year: String = defaultYear) = theMinimalSubmission(year)
        fun maximal(year: String = defaultYear, enteredOn: Long = 1, updatedOn: Long = 2) =
            theMaximalSubmission(year, enteredOn, updatedOn)

        private fun theMaximalSubmission(year: String, enteredOn: Long = 1, updatedOn: Long = 2) = Submission(
            id = UUID.randomUUID(),
            year = year,
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
            mostDisappointing = aGameSubmission("Over-hyped"),
            enteredGiveaway = true,
            enteredOn = enteredOn,
            updatedOn = updatedOn
        )

        private fun theMinimalSubmission(year: String, enteredOn: Long = 1, updatedOn: Long = 2) = Submission(
            id = UUID.randomUUID(),
            year = year,
            name = "Lazy Luna",
            gamesOfTheYear = gamesOfTheYear("Clicker Pro"),
            mostAnticipated = null,
            bestOldGame = null,
            mostDisappointing = null,
            enteredGiveaway = false,
            enteredOn = enteredOn,
            updatedOn = updatedOn
        )

        private fun theAverageSubmission(year: String, enteredOn: Long = 1, updatedOn: Long = 2) = Submission(
            id = UUID.randomUUID(),
            year = year,
            name = "Average Andy",
            gamesOfTheYear = gamesOfTheYear("PlateUp!", "Overwatch 2", "Elden Ring"),
            mostAnticipated = aGameSubmission("Call of Duty XIX"),
            bestOldGame = aGameSubmission("Elder Scrolls V: Skyrim"),
            mostDisappointing = aGameSubmission("Buggy"),
            enteredGiveaway = true,
            enteredOn = enteredOn,
            updatedOn = updatedOn
        )

        private fun theTieBreakerSubmission(year: String, enteredOn: Long = 101, updatedOn: Long = 404) = Submission(
            id = UUID.randomUUID(),
            year = year,
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
            mostDisappointing = aGameSubmission("Over-hyped"),
            enteredGiveaway = false,
            enteredOn = enteredOn,
            updatedOn = updatedOn
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
