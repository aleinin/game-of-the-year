package com.aleinin.goty.result

import com.aleinin.goty.SubmissionDataHelper
import com.aleinin.goty.properties.PropertiesService
import com.aleinin.goty.submission.SubmissionArchiveService
import com.aleinin.goty.submission.SubmissionService
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mock
import org.mockito.junit.jupiter.MockitoExtension
import org.mockito.kotlin.whenever

@ExtendWith(MockitoExtension::class)
internal class ResultServiceTest {
    @Mock
    lateinit var submissionService: SubmissionService

    @Mock
    lateinit var submissionArchiveService: SubmissionArchiveService

    @Mock
    lateinit var propertiesService: PropertiesService

    private val gameRankingService = GameRankingService()
    private val gameScoringService = GameScoringService()

    lateinit var resultsService: ResultService

    @BeforeEach
    fun setup() {
        resultsService = ResultService(
            gameRankingService,
            gameScoringService,
            propertiesService,
            submissionService,
            submissionArchiveService
        )
    }

    @Test
    fun `Should get results for active year`() {
        val year = "2077"
        whenever(propertiesService.getActiveYear()).thenReturn(year)
        whenever(submissionService.getAllSubmissions()).thenReturn(SubmissionDataHelper.everything(year))
        whenever(propertiesService.getTiePoints(year)).thenReturn(SubmissionDataHelper.tiePoints)
        val expected = SubmissionDataHelper.everythingScored(year)
        val actual = resultsService.getResultsForActiveYear()
        assertEquals(expected, actual)
    }

    @Test
    fun `Should get results for year`() {
        val year = "2077"
        whenever(submissionArchiveService.getAllSubmissionsForYear(year)).thenReturn(SubmissionDataHelper.everything(year))
        whenever(propertiesService.getTiePoints(year)).thenReturn(SubmissionDataHelper.tiePoints)
        val expected = SubmissionDataHelper.everythingScored(year)
        val actual = resultsService.getResultsForYear(year)
        assertEquals(expected, actual)
    }

    @Test
    fun `Should get result years`() {
        val years = listOf("2077", "2076", "2075")
        whenever(submissionArchiveService.getSubmissionYears()).thenReturn(years)
        val expected = years
        val actual = resultsService.getResultsYears()
        assertEquals(expected, actual)
    }
}
