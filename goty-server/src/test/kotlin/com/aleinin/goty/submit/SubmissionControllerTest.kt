package com.aleinin.goty.submit

import com.aleinin.goty.SubmissionDataHelper
import com.aleinin.goty.properties.Properties
import com.fasterxml.jackson.databind.ObjectMapper
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.Mock
import org.mockito.Mockito
import org.mockito.kotlin.any
import org.mockito.kotlin.times
import org.mockito.kotlin.whenever
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.content
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import org.springframework.test.web.servlet.setup.MockMvcBuilders.standaloneSetup
import java.time.Clock
import java.time.Instant
import java.util.Optional
import java.util.UUID

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
internal class SubmissionControllerTest {
    lateinit var mockMvc: MockMvc

    @Autowired
    lateinit var properties: Properties

    @Autowired
    lateinit var objectMapper: ObjectMapper

    @Mock
    lateinit var submissionRepository: SubmissionRepository

    @Mock
    lateinit var clock: Clock

    var currentTestTime: Long = 0

    private fun invalidSubmissionRequestJSONGenerator(
        name: String,
        gamesOfTheYear: List<Any>
    ): String = """
        {
            "name": ${name},
            "gamesOfTheYear": ${gamesOfTheYear},
            "mostAnticipated": null,
            "bestOldGame": null,
        }
    """.trimIndent()

    @BeforeEach
    fun setup() {
        mockMvc = standaloneSetup(
            SubmissionController(
                properties,
                submissionRepository,
                clock
            )
        ).build()
        currentTestTime = properties.deadline.toInstant().toEpochMilli() - 1
        whenever(clock.millis()).thenReturn(currentTestTime)
        whenever(clock.instant()).thenReturn(Instant.ofEpochMilli(currentTestTime))
    }

    @Test
    fun `Should return all submissions`() {
        val mockSubmissions = SubmissionDataHelper.everything()
        whenever(submissionRepository.findAll()).thenReturn(mockSubmissions)
        val expectedJson = objectMapper.writeValueAsString(mockSubmissions)
        mockMvc.perform(get("/submissions"))
            .andExpect(status().isOk)
            .andExpect(content().json(expectedJson, true))

    }

    @Test
    fun `Should return a specific submission`() {
        val mockSubmission = SubmissionDataHelper.maximal()
        whenever(submissionRepository.findById(mockSubmission.id)).thenReturn(Optional.of(mockSubmission))
        val expectedJson = objectMapper.writeValueAsString(mockSubmission)
        mockMvc.perform(get("/submissions/${mockSubmission.id}"))
            .andExpect(status().isOk)
            .andExpect(content().json(expectedJson, true))
    }

    @Test
    fun `Should return Not Found if invalid submission id`() {
        whenever(submissionRepository.findById(any())).thenReturn(Optional.empty())
        mockMvc.perform(get("/submissions/${UUID.randomUUID()}"))
            .andExpect(status().isNotFound)
    }

    @Test
    fun `Should accept a valid submission`() {
        val validSubmission = SubmissionDataHelper.maximal()
        val validSubmissionRequest = SubmissionRequest(
            name = validSubmission.name,
            gamesOfTheYear = validSubmission.gamesOfTheYear,
            mostAnticipated = validSubmission.mostAnticipated,
            bestOldGame = validSubmission.bestOldGame,
            enteredGiveaway = validSubmission.enteredGiveaway
        )
        whenever(submissionRepository.insert(any<Submission>())).thenReturn(validSubmission)
        mockMvc.perform(
            post("/submissions")
                .content(objectMapper.writeValueAsString(validSubmissionRequest))
                .contentType(MediaType.APPLICATION_JSON)
        )
            .andExpect(status().isOk)
            .andExpect(content().json(objectMapper.writeValueAsString(validSubmission), true))
    }

    @Test
    fun `Should reject an invalid submission`() {
        val validSubmission = SubmissionDataHelper.maximal()
        val invalidSubmissionRequestEmptyGOTY = invalidSubmissionRequestJSONGenerator(validSubmission.name, emptyList())
        val invalidSubmissionRequestBlankName = invalidSubmissionRequestJSONGenerator(validSubmission.name, emptyList())
        Mockito.verify(submissionRepository, times(0)).insert(any<Submission>())
        mockMvc.perform(post("/submissions")
            .content(objectMapper.writeValueAsString(invalidSubmissionRequestEmptyGOTY))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isBadRequest)
        mockMvc.perform(post("/submissions")
            .content(objectMapper.writeValueAsString(invalidSubmissionRequestBlankName))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isBadRequest)
    }

    @Test
    fun `Should accept a valid submission update`() {
        val validSubmission = SubmissionDataHelper.maximal()
        val validSubmissionRequest = SubmissionRequest(
            name = validSubmission.name,
            gamesOfTheYear = validSubmission.gamesOfTheYear,
            mostAnticipated = validSubmission.mostAnticipated,
            bestOldGame = null, // removed best old game entry
            enteredGiveaway = validSubmission.enteredGiveaway
        )
        val expectedValidSubmission = Submission(
            id = validSubmission.id,
            name = validSubmission.name,
            gamesOfTheYear = validSubmission.gamesOfTheYear,
            mostAnticipated = validSubmission.mostAnticipated,
            bestOldGame = null,
            enteredGiveaway = validSubmission.enteredGiveaway,
            enteredOn = validSubmission.enteredOn,
            updatedOn = currentTestTime
        )
        whenever(submissionRepository.findById(validSubmission.id)).thenReturn(Optional.of(validSubmission))
        whenever(submissionRepository.save(expectedValidSubmission)).thenReturn(expectedValidSubmission)
        mockMvc.perform(
            put("/submissions/${validSubmission.id}")
                .content(objectMapper.writeValueAsString(validSubmissionRequest))
                .contentType(MediaType.APPLICATION_JSON)
        )
            .andExpect(status().isOk)
            .andExpect(content().json(objectMapper.writeValueAsString(expectedValidSubmission), true))
    }

    @Test
    fun `Should reject an invalid submission update`() {
        val validGamesOfTheYear = SubmissionDataHelper.minimal().gamesOfTheYear
        val invalidRequestEmptyGOTY = invalidSubmissionRequestJSONGenerator("name", emptyList())
        val invalidRequestBlankName = invalidSubmissionRequestJSONGenerator("", validGamesOfTheYear)
        whenever(submissionRepository.findById(any())).thenReturn(Optional.empty())
        Mockito.verify(submissionRepository, times(0)).save(any())
        mockMvc.perform(
            put("/submissions/${UUID.randomUUID()}")
                .content(invalidRequestEmptyGOTY)
                .contentType(MediaType.APPLICATION_JSON)
        )
            .andExpect(status().isBadRequest)
        mockMvc.perform(
            put("/submissions/${UUID.randomUUID()}")
                .content(invalidRequestBlankName)
                .contentType(MediaType.APPLICATION_JSON)
        )
            .andExpect(status().isBadRequest)
    }


    @Test
    fun `Should respond NotFound when attempting to update a submission that doesnt exist`() {
        val validUnsubmittedSubmission = SubmissionDataHelper.maximal()
        whenever(submissionRepository.findById(any())).thenReturn(Optional.empty())
        mockMvc.perform(
            put("/submissions/${validUnsubmittedSubmission.id}")
                .content(objectMapper.writeValueAsString(validUnsubmittedSubmission))
                .contentType(MediaType.APPLICATION_JSON)
        )
            .andExpect(status().isNotFound)
    }

    @Test
    fun `Should reject submission after cutoff`() {
        val deadline = properties.deadline
        whenever(clock.instant()).thenReturn(deadline.toInstant())
        val validSubmissionRequest = SubmissionRequest(
            name = "too late",
            gamesOfTheYear = SubmissionDataHelper.minimal().gamesOfTheYear,
            bestOldGame = null,
            mostAnticipated = null,
            enteredGiveaway = false
        )
        mockMvc.perform(
            post("/submissions")
                .content(objectMapper.writeValueAsString(validSubmissionRequest))
                .contentType(MediaType.APPLICATION_JSON)
        )
            .andExpect(status().isForbidden)
    }

    @Test
    fun `Should reject submission update after cutoff`() {
        val deadline = properties.deadline
        whenever(clock.instant()).thenReturn(deadline.toInstant())
        val validSubmissionRequest = SubmissionRequest(
            name = "too late",
            gamesOfTheYear = SubmissionDataHelper.minimal().gamesOfTheYear,
            bestOldGame = null,
            mostAnticipated = null,
            enteredGiveaway = false
        )
        mockMvc.perform(
            put("/submissions/${UUID.randomUUID()}")
                .content(objectMapper.writeValueAsString(validSubmissionRequest))
                .contentType(MediaType.APPLICATION_JSON)
        )
            .andExpect(status().isForbidden)
    }
}
