package com.aleinin.goty.result

import com.aleinin.goty.SubmissionDataHelper.Companion.aGameSubmission
import com.aleinin.goty.submission.GameSubmission
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

internal class GameRankingServiceTest {
    private val gameRankingService = GameRankingService()

    @Test
    fun `Should calculate rank for a list of GameSubmission`() {
        val submissions = listOf("twice", "thrice", "once", "twice", "thrice", "thrice")
            .map { aGameSubmission(it) }
        val actual = gameRankingService.rank(submissions)
        val expected = listOf(
            RankedGameResult(
                "twice",
                "twice",
                votes = 2,
                rank = 1
            ),
            RankedGameResult(
                "once",
                "once",
                votes = 1,
                rank = 2
            ),
            RankedGameResult(
                "thrice",
                "thrice",
                votes = 3,
                rank = 0
            )
        ).sortedBy { it.rank }
        assertEquals(expected, actual)
    }

    @Test
    fun `Should handle list of single GameSubmission`() {
        val submission = listOf(aGameSubmission("once"))
        val expected = listOf(RankedGameResult("once", "once", 1, 0))
        val actual = gameRankingService.rank(submission)
        assertEquals(expected, actual)
    }

    @Test
    fun `Should handle empty list of GameSubmission`() {
        val submissions = emptyList<GameSubmission>()
        val expected = emptyList<RankedGameResult>()
        val actual = gameRankingService.rank(submissions)
        assertEquals(expected, actual)
    }
}
