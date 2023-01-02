package com.aleinin.goty.submit

import com.aleinin.goty.SubmissionDataHelper
import com.aleinin.goty.properties.Properties
import com.fasterxml.jackson.databind.ObjectMapper
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.Mockito
import org.mockito.kotlin.any
import org.mockito.kotlin.times
import org.mockito.kotlin.verify
import org.mockito.kotlin.whenever
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.http.MediaType
import org.springframework.security.test.context.support.WithMockUser
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.content
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import java.time.Clock
import java.time.Instant
import java.util.Optional
import java.util.UUID

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
internal class SubmissionControllerTest {
    @Autowired
    lateinit var mockMvc: MockMvc

    @Autowired
    lateinit var properties: Properties

    @Autowired
    lateinit var objectMapper: ObjectMapper

    @MockBean
    lateinit var submissionRepository: SubmissionRepository

    @MockBean
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
        val invalidSubmissionRequestBlankName =
            invalidSubmissionRequestJSONGenerator("", validSubmission.gamesOfTheYear)
        Mockito.verify(submissionRepository, times(0)).insert(any<Submission>())
        mockMvc.perform(
            post("/submissions")
                .content(objectMapper.writeValueAsString(invalidSubmissionRequestEmptyGOTY))
                .contentType(MediaType.APPLICATION_JSON)
        )
            .andExpect(status().isBadRequest)
        mockMvc.perform(
            post("/submissions")
                .content(objectMapper.writeValueAsString(invalidSubmissionRequestBlankName))
                .contentType(MediaType.APPLICATION_JSON)
        )
            .andExpect(status().isBadRequest)
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
    fun `Should reject a submission with too many gamesOfTheYear`() {
        val request = SubmissionRequest(
            name = "tooMany",
            gamesOfTheYear = (1..15).mapIndexed { index, _ -> RankedGameSubmission("", "", index) },
            mostAnticipated = null,
            bestOldGame = null,
            enteredGiveaway = false
        )
        mockMvc.perform(
            post("/submissions")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))
        )
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
        val request = SubmissionRequest(
            name = validUnsubmittedSubmission.name,
            gamesOfTheYear = validUnsubmittedSubmission.gamesOfTheYear,
            mostAnticipated = validUnsubmittedSubmission.mostAnticipated,
            bestOldGame = validUnsubmittedSubmission.bestOldGame,
            enteredGiveaway = validUnsubmittedSubmission.enteredGiveaway
        )
        whenever(submissionRepository.findById(any())).thenReturn(Optional.empty())
        mockMvc.perform(
            put("/submissions/${validUnsubmittedSubmission.id}")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))
        )
            .andExpect(status().isNotFound)
    }

    @Test
    fun `Should reject a submission update with too many gamesOfTheYear`() {
        val request = SubmissionRequest(
            name = "tooMany",
            gamesOfTheYear = (1..15).mapIndexed { index, _ -> RankedGameSubmission("", "", index) },
            mostAnticipated = null,
            bestOldGame = null,
            enteredGiveaway = false
        )
        mockMvc.perform(
            put("/submissions/${UUID.randomUUID()}")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))
        )
            .andExpect(status().isBadRequest)
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

    @Test
    fun `Should not allow unauthenticated to delete a submission`() {
        mockMvc.perform(
            delete("/submissions/${UUID.randomUUID()}")
        )
            .andExpect(status().isUnauthorized)
    }

    @Test
    @WithMockUser(roles = ["USER"])
    fun `Should only allow admins to delete a submission`() {
        mockMvc.perform(
            delete("/submissions/${UUID.randomUUID()}")
        )
            .andExpect(status().isForbidden)
    }

    @Test
    @WithMockUser(roles = ["ADMIN"])
    fun `Should respond NotFound when attempting to delete a submission that does not exist`() {
        mockMvc.perform(
            delete("/submissions/${UUID.randomUUID()}")
        ).andExpect(status().isNotFound)
    }

    @Test
    @WithMockUser(roles = ["ADMIN"])
    fun `Should delete a submission`() {
        val mockSubmission = SubmissionDataHelper.maximal()
        whenever(submissionRepository.findById(mockSubmission.id)).thenReturn(Optional.of(mockSubmission))
        mockMvc.perform(
            delete("/submissions/${mockSubmission.id}")
        ).andExpect(status().isOk)
        verify(submissionRepository).delete(mockSubmission)
    }

    @Test
    fun `Should not allow unauthenticated to delete all submissions`() {
        mockMvc.perform(
            delete("/submissions")
        )
            .andExpect(status().isUnauthorized)
    }

    @Test
    @WithMockUser(roles = ["USER"])
    fun `Should only allow admins to delete all submission`() {
        mockMvc.perform(
            delete("/submissions")
        )
            .andExpect(status().isForbidden)
    }

    @Test
    @WithMockUser(roles = ["ADMIN"])
    fun `Should require override when deleting all before deadline`() {
        mockMvc.perform(
            delete("/submissions")
        )
            .andExpect(status().isBadRequest)
    }

    @Test
    @WithMockUser(roles = ["ADMIN"])
    fun `Should delete all when override supplied before deadline`() {
        mockMvc.perform(
            delete("/submissions?override=true")
        )
            .andExpect(status().isOk)
        verify(submissionRepository, times(1)).deleteAll()
    }

    @Test
    @WithMockUser(roles = ["ADMIN"])
    fun `Should not require override when deleting all after deadline`() {
        whenever(clock.instant()).thenReturn(properties.deadline.toInstant().plusSeconds(1))
        mockMvc.perform(
            delete("/submissions")
        )
            .andExpect(status().isOk)
        verify(submissionRepository, times(1)).deleteAll()
    }
}
