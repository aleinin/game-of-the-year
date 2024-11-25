package com.aleinin.goty.result

import com.aleinin.goty.SubmissionDataHelper
import com.aleinin.goty.SubmissionDataHelper.Companion.aRankedGameResult
import com.aleinin.goty.SubmissionDataHelper.Companion.aScoredGameResult
import com.aleinin.goty.configuration.DefaultProperties
import com.aleinin.goty.properties.ActiveYearDocument
import com.aleinin.goty.properties.ActiveYearRepository
import com.aleinin.goty.properties.PropertiesRepository
import com.aleinin.goty.properties.PropertiesService.Companion.ACTIVE_YEAR_ID
import com.aleinin.goty.submission.SecretSubmission
import com.aleinin.goty.submission.SecretSubmissionRepository
import com.fasterxml.jackson.databind.ObjectMapper
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.kotlin.any
import org.mockito.kotlin.eq
import org.mockito.kotlin.whenever
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.content
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import org.springframework.test.web.servlet.setup.MockMvcBuilders.standaloneSetup
import java.util.Optional

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
internal class ResultControllerTest {
    lateinit var mockMvc: MockMvc

    @MockBean
    lateinit var propertiesRepository: PropertiesRepository

    @MockBean
    lateinit var activeYearRepository: ActiveYearRepository

    @Autowired
    lateinit var resultService: ResultService

    @Autowired
    lateinit var objectMapper: ObjectMapper

    @Autowired
    lateinit var defaultProperties: DefaultProperties

    @MockBean
    lateinit var secretSubmissionRepository: SecretSubmissionRepository

    @BeforeEach
    fun setup() {
        mockMvc = standaloneSetup(ResultController(resultService)).build()
        whenever(propertiesRepository.findById(any())).thenReturn(Optional.empty())
    }

    @Test
    fun `Should handle no submissions`() {
        val mockSubmissions = emptyList<SecretSubmission>()
        val expected = ResultResponse(
            year = defaultProperties.year,
            gamesOfTheYear = emptyList(),
            mostAnticipated = emptyList(),
            bestOldGame = emptyList(),
            mostDisappointing = emptyList(),
            participants = emptyList(),
            giveawayParticipants = emptyList()
        )
        whenever(secretSubmissionRepository.findAll()).thenReturn(mockSubmissions)
        mockMvc.perform(get("/results")
            .contentType("application/json"))
            .andExpect(status().isOk)
            .andExpect(content().json(objectMapper.writeValueAsString(expected), true))
    }

    @Test
    fun `Should calculate results using properties year by default`() {
        val mockSubmissions = SubmissionDataHelper.secret(SubmissionDataHelper.everything(defaultProperties.year))
        val expected = SubmissionDataHelper.everythingScored(defaultProperties.year)
        whenever(secretSubmissionRepository.findByYear(eq(defaultProperties.year))).thenReturn(mockSubmissions)
        mockMvc.perform(get("/results")
            .contentType("application/json"))
            .andExpect(status().isOk)
            .andExpect(content().json(objectMapper.writeValueAsString(expected), true))
    }

    @Test
    fun `Should calculate results for year if specified`() {
        val expectedYear = defaultProperties.year - 1
        val thisYearSubmission = SubmissionDataHelper.secret(SubmissionDataHelper.maximal(expectedYear))
        val mockSubmissions = listOf(thisYearSubmission)
        val expected = ResultResponse(
                year = expectedYear,
                gamesOfTheYear = thisYearSubmission.gamesOfTheYear
                        .mapIndexed { index, it -> aScoredGameResult(it.title, defaultProperties.tiePoints[index], 1, index) },
                mostAnticipated = listOf(aRankedGameResult(thisYearSubmission.mostAnticipated?.title ?: throw Exception(), 0, 1)),
                bestOldGame = listOf(aRankedGameResult(thisYearSubmission.bestOldGame?.title ?: throw Exception(), 0, 1)),
                mostDisappointing = listOf(aRankedGameResult(thisYearSubmission.mostDisappointing?.title ?: throw Exception(), 0, 1)),
                participants = mockSubmissions.map { it.name },
                giveawayParticipants = mockSubmissions.filter { it.enteredGiveaway }.map { it.name }
        )
        whenever(secretSubmissionRepository.findByYear(expectedYear)).thenReturn(mockSubmissions)
        mockMvc.perform(get("/results/$expectedYear")
                .contentType("application/json"))
                .andExpect(status().isOk)
                .andExpect(content().json(objectMapper.writeValueAsString(expected), true))
    }

    @Test
    fun `Should handle a year being passed that has no submissions`() {
        val noSubmissionYear = 1996
        val mockSubmissions = emptyList<SecretSubmission>()
        val expected = ResultResponse(
                year = noSubmissionYear,
                gamesOfTheYear = emptyList(),
                mostAnticipated = emptyList(),
                bestOldGame = emptyList(),
                mostDisappointing = emptyList(),
                participants = emptyList(),
                giveawayParticipants = emptyList()
        )
        whenever(secretSubmissionRepository.findAll()).thenReturn(mockSubmissions)
        mockMvc.perform(get("/results/$noSubmissionYear")
                .contentType("application/json"))
                .andExpect(status().isOk)
                .andExpect(content().json(objectMapper.writeValueAsString(expected), true))
    }

    @Test
    fun `Should get the submission years`() {
        val submissions = listOf(
            SubmissionDataHelper.maximal(2000),
            SubmissionDataHelper.minimal(2000),
            SubmissionDataHelper.minimal(2001)
        )
        val years = listOf(2000, 2001, defaultProperties.year).sortedDescending()
        whenever(secretSubmissionRepository.findAll()).thenReturn(SubmissionDataHelper.secret(submissions))
        whenever(activeYearRepository.findById(ACTIVE_YEAR_ID)).thenReturn(Optional.of(ActiveYearDocument(ACTIVE_YEAR_ID, defaultProperties.year)))
        mockMvc.perform(get("/results/years")
            .contentType("application/json"))
            .andExpect(status().isOk)
            .andExpect(content().json(objectMapper.writeValueAsString(years), true))
    }
}
