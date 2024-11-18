package com.aleinin.goty.csv

import com.aleinin.goty.SubmissionDataHelper
import com.aleinin.goty.UTC
import com.aleinin.goty.csv.CSVData.Companion.assertEqualNormalizeLineEnds
import com.aleinin.goty.properties.GotyQuestion
import com.aleinin.goty.properties.GotyQuestionResponse
import com.aleinin.goty.properties.Properties
import com.aleinin.goty.properties.PropertiesResponse
import com.aleinin.goty.properties.PropertiesService
import com.aleinin.goty.properties.ResolvedTemplate
import com.aleinin.goty.result.ResultResponse
import com.aleinin.goty.result.ResultService
import com.aleinin.goty.submission.SubmissionService
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.junit.jupiter.MockitoExtension
import org.mockito.kotlin.any
import org.mockito.kotlin.eq
import org.mockito.kotlin.whenever
import java.time.ZoneId
import java.time.ZonedDateTime
import java.util.Optional
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
    lateinit var csvService: CSVService
    @Test
    fun `it should handle no results`() {
        val year = 2020
        whenever(submissionService.getSubmissionsForYear(eq(year))).thenReturn(emptyList())
        whenever(resultService.calculate(any(), eq(year))).thenReturn(ResultResponse(
                year = year,
                gamesOfTheYear = emptyList(),
                mostAnticipated = emptyList(),
                bestOldGame = emptyList(),
                mostDisappointing = emptyList(),
                participants = emptyList(),
                giveawayParticipants = emptyList()
        ))
        val properties = PropertiesResponse(
                title = ResolvedTemplate(
                    template = "myTitle",
                    text = "myTitle"
                ),
                year = year,
                gotyQuestion = GotyQuestionResponse(
                    title = ResolvedTemplate(
                        template = "hello",
                        text = "hello"
                    ),
                    question = ResolvedTemplate(
                        template = "world",
                        text = "world"
                    ),
                    rules = emptyList()
                ),
                tiePoints = listOf(1),
                deadline = ZonedDateTime.of(2000, 1, 1, 12, 12, 12, 0, ZoneId.of("Etc/GMT")),
                defaultLocalTimeZone = null,
                giveawayAmountUSD = 0,
                hasGiveaway = false
        )
        whenever(propertiesService.getPropertiesResponse(year, UTC)).thenReturn(Optional.of(properties))
        val actual = csvService.dumpToCSV(year, UTC)
        assertEqualNormalizeLineEnds(CSVData.emptyCSV(year), actual)
    }

    @Test
    fun `it should populate csv with results`() {
        val year = 2050
        val expectedUUIDs = listOf(
                UUID.fromString("f11186fe-3cfb-44cb-a429-67005ab60584"),
                UUID.fromString("98a8332d-1f2c-47ed-a9a0-fd2a36467d8f"),
                UUID.fromString("a8665bae-d4c0-4349-99e4-f054649903e8"),
                UUID.fromString("0ffefab3-2dc5-4218-9a6a-b06287934d08"),
        )
        val submissions = SubmissionDataHelper.everything(year)
                .mapIndexed { index, submission ->  submission.copy(id=expectedUUIDs[index])}
        whenever(submissionService.getSubmissionsForYear(eq(year))).thenReturn(submissions)
        whenever(resultService.calculate(submissions, year)).thenReturn(SubmissionDataHelper.everythingScored(year))
        val properties = PropertiesResponse(
            title = ResolvedTemplate(
                template = "myTitle",
                text = "myTitle"
            ),
            year = year,
            gotyQuestion = GotyQuestionResponse(
                title = ResolvedTemplate(
                    template = "hello",
                    text = "hello"
                ),
                question = ResolvedTemplate(
                    template = "world",
                    text = "world"
                ),
                rules = emptyList()
            ),
            tiePoints = listOf(15, 13, 11, 7, 6, 5, 4, 3, 2, 1),
            deadline = ZonedDateTime.of(2000, 1, 1, 12, 12, 12, 0, ZoneId.of("Etc/GMT")),
            defaultLocalTimeZone = null,
            giveawayAmountUSD = 0,
            hasGiveaway = false
        )
        whenever(propertiesService.getPropertiesResponse(year, UTC)).thenReturn(Optional.of(properties))
        val actual = csvService.dumpToCSV(year, UTC)
        assertEqualNormalizeLineEnds(CSVData.fullCSV(year), actual)
    }
}