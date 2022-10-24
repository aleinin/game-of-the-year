package com.aleinin.goty.result

import com.aleinin.goty.SubmissionDataHelper
import com.aleinin.goty.SubmissionDataHelper.Companion.aRankedGameResult
import com.aleinin.goty.SubmissionDataHelper.Companion.aScoredGameResult
import com.aleinin.goty.submit.Submission
import com.aleinin.goty.submit.SubmissionRepository
import com.fasterxml.jackson.databind.ObjectMapper
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mock
import org.mockito.kotlin.whenever
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.junit.jupiter.SpringExtension
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.setup.MockMvcBuilders.standaloneSetup
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.content
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

@ExtendWith(SpringExtension::class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
internal class ResultControllerTest {
    lateinit var mockMvc: MockMvc

    @Autowired
    lateinit var resultService: ResultService

    @Autowired
    lateinit var objectMapper: ObjectMapper

    @Mock
    lateinit var submissionRepository: SubmissionRepository

    @BeforeEach
    fun setup() {
        mockMvc = standaloneSetup(ResultController(submissionRepository, resultService)).build()
    }

    @Test
    fun `Should handle no submissions`() {
        val mockSubmissions = emptyList<Submission>()
        val expected = ResultResponse(
            gamesOfTheYear = emptyList(),
            mostAnticipated = emptyList(),
            bestOldGame = emptyList(),
            participants = emptyList(),
            giveawayParticipants = emptyList()
        )
        whenever(submissionRepository.findAll()).thenReturn(mockSubmissions)
        mockMvc.perform(get("/results")
            .contentType("application/json"))
            .andExpect(status().isOk)
            .andExpect(content().json(objectMapper.writeValueAsString(expected), true))
    }

    @Test
    fun `Should correctly calculate results from submissions`() {
        val mockSubmissions = SubmissionDataHelper.everything()
        val expected = ResultResponse(
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
            participants = mockSubmissions.map { it.name },
            giveawayParticipants = mockSubmissions.filter { it.enteredGiveaway }.map { it.name }
        )
        whenever(submissionRepository.findAll()).thenReturn(mockSubmissions)
        mockMvc.perform(get("/results")
            .contentType("application/json"))
            .andExpect(status().isOk)
            .andExpect(content().json(objectMapper.writeValueAsString(expected), true))
    }
}

