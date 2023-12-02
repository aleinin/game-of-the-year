package com.aleinin.goty.result

import com.aleinin.goty.SubmissionDataHelper
import com.aleinin.goty.SubmissionDataHelper.Companion.aRankedGameResult
import com.aleinin.goty.SubmissionDataHelper.Companion.aScoredGameResult
import com.aleinin.goty.configuration.DefaultProperties
import com.aleinin.goty.properties.PropertiesDocumentRepository
import com.aleinin.goty.properties.PropertiesService
import com.aleinin.goty.submission.SecretSubmission
import com.aleinin.goty.submission.SecretSubmissionRepository
import com.aleinin.goty.submission.SubmissionService
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
    lateinit var propertiesDocumentRepository: PropertiesDocumentRepository

    @Autowired
    lateinit var resultService: ResultService

    @Autowired
    lateinit var submissionService: SubmissionService

    @Autowired
    lateinit var propertiesService: PropertiesService

    @Autowired
    lateinit var objectMapper: ObjectMapper

    @Autowired
    lateinit var defaultProperties: DefaultProperties

    @MockBean
    lateinit var secretSubmissionRepository: SecretSubmissionRepository

    @BeforeEach
    fun setup() {
        mockMvc = standaloneSetup(ResultController(submissionService, resultService, propertiesService)).build()
        whenever(propertiesDocumentRepository.findById(any())).thenReturn(Optional.empty())
    }

    @Test
    fun `Should handle no submissions`() {
        val mockSubmissions = emptyList<SecretSubmission>()
        val expected = ResultResponse(
            year = defaultProperties.year,
            gamesOfTheYear = emptyList(),
            mostAnticipated = emptyList(),
            bestOldGame = emptyList(),
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
        val expected = ResultResponse(
            year = defaultProperties.year,
            gamesOfTheYear = listOf(
                aScoredGameResult("Call of Duty Modern Warfare II", 30, 2, 0),
                aScoredGameResult("Clicker Pro", 28, 2, 1),
                aScoredGameResult("PlateUp!", 26, 2, 2),
                aScoredGameResult("Stray", 20, 2, 3),
                aScoredGameResult("Overwatch 2", 19 ,2 ,4),
                aScoredGameResult("Bayonetta 3", 16, 2, 5),
                aScoredGameResult("Elden Ring", 15, 2, 6),
                aScoredGameResult("OlliOlli World", 7, 1,  7),
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
            participants = mockSubmissions.filter { it.year == defaultProperties.year }.map { it.name },
            giveawayParticipants = mockSubmissions.filter { it.enteredGiveaway && it.year == defaultProperties.year }.map { it.name }
        )
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
                participants = mockSubmissions.map { it.name },
                giveawayParticipants = mockSubmissions.filter { it.enteredGiveaway }.map { it.name }
        )
        whenever(secretSubmissionRepository.findByYear(expectedYear)).thenReturn(mockSubmissions)
        mockMvc.perform(get("/results?year=$expectedYear")
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
                participants = emptyList(),
                giveawayParticipants = emptyList()
        )
        whenever(secretSubmissionRepository.findAll()).thenReturn(mockSubmissions)
        mockMvc.perform(get("/results?year=$noSubmissionYear")
                .contentType("application/json"))
                .andExpect(status().isOk)
                .andExpect(content().json(objectMapper.writeValueAsString(expected), true))
    }
}
