package com.aleinin.goty.csv

import com.aleinin.goty.SubmissionDataHelper
import com.aleinin.goty.csv.CSVData.Companion.assertEqualNormalizeLineEnds
import com.aleinin.goty.properties.GotyQuestion
import com.aleinin.goty.properties.Properties
import com.aleinin.goty.properties.PropertiesService
import com.aleinin.goty.result.ResultResponse
import com.aleinin.goty.result.ResultService
import com.aleinin.goty.submission.SubmissionService
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.junit.jupiter.MockitoExtension
import org.mockito.kotlin.any
import org.mockito.kotlin.whenever
import java.time.ZoneId
import java.time.ZonedDateTime
import java.util.UUID

@ExtendWith(MockitoExtension::class)
class CSVServiceTest {
    @Mock
    lateinit var submissionService: SubmissionService

    @Mock
    lateinit var resultService: ResultService

    @Mock
    lateinit var propertiesService: PropertiesService

    @InjectMocks
    lateinit var CSVService: CSVService
    @Test
    fun `it should handle no results`() {
        whenever(submissionService.getAllSubmissions()).thenReturn(emptyList())
        whenever(resultService.calculate(any())).thenReturn(ResultResponse(
                gamesOfTheYear = emptyList(),
                mostAnticipated = emptyList(),
                bestOldGame = emptyList(),
                participants = emptyList(),
                giveawayParticipants = emptyList()
        ))
        val properties = Properties(
                title = "myTitle",
                year = 2000,
                gotyQuestion = GotyQuestion("myGotyTitle", "myGotyQuestion",  emptyList()),
                tiePoints = listOf(1),
                deadline = ZonedDateTime.of(2000, 1, 1, 12, 12, 12, 0, ZoneId.of("Etc/GMT")),
                defaultLocalTimeZone = null,
                giveawayAmountUSD = 0,
                hasGiveaway = false
        )
        whenever(propertiesService.getProperties()).thenReturn(properties)
        val actual = CSVService.dumpToCSV()
        assertEqualNormalizeLineEnds(CSVData.EMPTY_CSV, actual)
    }

    @Test
    fun `it should populate csv with results`() {
        val expectedUUIDs = listOf(
                UUID.fromString("f11186fe-3cfb-44cb-a429-67005ab60584"),
                UUID.fromString("98a8332d-1f2c-47ed-a9a0-fd2a36467d8f"),
                UUID.fromString("a8665bae-d4c0-4349-99e4-f054649903e8"),
                UUID.fromString("0ffefab3-2dc5-4218-9a6a-b06287934d08"),
        )
        val submissions = SubmissionDataHelper.everything()
                .mapIndexed() { index, submission ->  submission.copy(id=expectedUUIDs[index])}
        whenever(submissionService.getAllSubmissions()).thenReturn(submissions)
        whenever(resultService.calculate(submissions)).thenReturn(SubmissionDataHelper.everythingScored())
        val properties = Properties(
                title = "my cool title",
                year = 2023,
                gotyQuestion = GotyQuestion("hello", "world",  listOf("rule1", "rule2", "rule3")),
                tiePoints = listOf(15, 13, 11, 7, 6, 5, 4, 3, 2, 1),
                deadline = ZonedDateTime.of(2000, 1, 1, 12, 12, 12, 0, ZoneId.of("Etc/GMT")),
                defaultLocalTimeZone = ZoneId.of("America/Chicago"),
                giveawayAmountUSD = 999,
                hasGiveaway = true
        )
        whenever(propertiesService.getProperties()).thenReturn(properties)
        val actual = CSVService.dumpToCSV()
        assertEqualNormalizeLineEnds(CSVData.FULL_CSV, actual)
    }
}