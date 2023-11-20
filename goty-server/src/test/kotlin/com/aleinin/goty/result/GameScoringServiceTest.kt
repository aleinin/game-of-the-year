package com.aleinin.goty.result

import com.aleinin.goty.SubmissionDataHelper.Companion.aRankedGameSubmission
import com.aleinin.goty.submission.RankedGameSubmission
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.junit.jupiter.MockitoExtension
import org.mockito.kotlin.whenever

@ExtendWith(MockitoExtension::class)
internal class GameScoringServiceTest {
    @Mock
    lateinit var pointSerice: PointsService

    @InjectMocks
    lateinit var gameScoringService: GameScoringService

    @Test
    fun `Should score a list of RankedGameSubmission`() {
        val submissions = listOf(
            aRankedGameSubmission("Elden Ring", 1),
            aRankedGameSubmission("Elden Ring", 2),
            aRankedGameSubmission("Elden Ring", 0),
            aRankedGameSubmission("PlateUp", 2),
            aRankedGameSubmission("Oblivion", 0),
            aRankedGameSubmission("Oblivion", 2),
            aRankedGameSubmission("Overwatch 2", 1)
        )
        val expected = listOf(
            ScoredGameResult(
                id = "Elden Ring",
                title = "Elden Ring",
                points = 39,
                rank = 0,
                votes = 3
            ),
            ScoredGameResult(
                id = "Oblivion",
                title = "Oblivion",
                points = 26,
                rank = 1,
                votes = 2
            ),
            ScoredGameResult(
                id = "Overwatch 2",
                title = "Overwatch 2",
                points = 13,
                rank = 2,
                votes = 1
            ),
            ScoredGameResult(
                id = "PlateUp",
                title = "PlateUp",
                points = 11,
                rank = 3,
                votes = 1
            )
        )
        whenever(pointSerice.calculatePoints(0)).thenReturn(15)
        whenever(pointSerice.calculatePoints(1)).thenReturn(13)
        whenever(pointSerice.calculatePoints(2)).thenReturn(11)
        val actual = gameScoringService.score(submissions)
        assertEquals(expected, actual)
    }

    @Test
    fun `Should score a list of a single RankedGameSubmission`() {
        val submissions = listOf(aRankedGameSubmission("Game", 0))
        val expected = listOf(
            ScoredGameResult(
                id = submissions[0].id,
                title = submissions[0].title,
                rank = submissions[0].rank,
                points = 15,
                votes = 1
            )
        )
        whenever(pointSerice.calculatePoints(0)).thenReturn(15)
        val actual = gameScoringService.score(submissions)
        assertEquals(expected, actual)
    }

    @Test
    fun `Should handle an empty list of RankedGameSubmission`() {
        val submissions = emptyList<RankedGameSubmission>()
        val expected = emptyList<ScoredGameResult>()
        val actual = gameScoringService.score(submissions)
        assertEquals(expected, actual)
    }
}