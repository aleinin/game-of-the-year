package com.aleinin.goty.submission

import com.aleinin.goty.SubmissionDataHelper
import com.aleinin.goty.properties.Properties
import com.fasterxml.jackson.databind.ObjectMapper
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
    lateinit var secretSubmissionRepository: SecretSubmissionRepository

    @MockBean
    lateinit var clock: Clock

    var currentTestTime: Long = 0


    private fun setupBeforeDeadline() {
        whenever(clock.instant()).thenReturn(properties.deadline.toInstant().minusSeconds(1))
    }

    private fun setupAfterDeadline() {
        whenever(clock.instant()).thenReturn(properties.deadline.toInstant())
    }

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

    @Test
    fun `Should return all Submissions`() {
        val submissions = SubmissionDataHelper.everything()
        val secretSubmissions = SubmissionDataHelper.secret(submissions)
        whenever(secretSubmissionRepository.findAll()).thenReturn(secretSubmissions)
        val expectedJson = objectMapper.writeValueAsString(submissions)
        mockMvc.perform(get("/submissions"))
            .andExpect(status().isOk)
            .andExpect(content().json(expectedJson, true))
    }

    @Test
    fun `Should return a specific Submission`() {
        val submission = SubmissionDataHelper.maximal()
        val secretSubmission = SubmissionDataHelper.secret(submission)
        whenever(secretSubmissionRepository.findById(secretSubmission.id)).thenReturn(Optional.of(secretSubmission))
        val expectedJson = objectMapper.writeValueAsString(submission)
        mockMvc.perform(get("/submissions/${submission.id}"))
            .andExpect(status().isOk)
            .andExpect(content().json(expectedJson, true))
    }

    @Test
    fun `Should return Not Found if invalid submission id`() {
        whenever(secretSubmissionRepository.findById(any())).thenReturn(Optional.empty())
        mockMvc.perform(get("/submissions/${UUID.randomUUID()}"))
            .andExpect(status().isNotFound)
    }

    @Test
    fun `Should accept a valid SubmissionRequest and return a SecretSubmission`() {
        val validSubmission = SubmissionDataHelper.maximal()
        val validSubmissionCreationRequest = SubmissionCreationRequest(
            name = validSubmission.name,
            gamesOfTheYear = validSubmission.gamesOfTheYear,
            mostAnticipated = validSubmission.mostAnticipated,
            bestOldGame = validSubmission.bestOldGame,
            enteredGiveaway = validSubmission.enteredGiveaway
        )
        val secretSubmission = SubmissionDataHelper.secret(validSubmission)
        whenever(secretSubmissionRepository.save(any<SecretSubmission>())).thenReturn(secretSubmission)
        setupBeforeDeadline()
        mockMvc.perform(
            post("/submissions")
                .content(objectMapper.writeValueAsString(validSubmissionCreationRequest))
                .contentType(MediaType.APPLICATION_JSON)
        )
            .andExpect(status().isOk)
            .andExpect(content().json(objectMapper.writeValueAsString(secretSubmission), true))
    }

    @Test
    fun `Should reject an invalid submission`() {
        val validSubmission = SubmissionDataHelper.maximal()
        val invalidSubmissionRequestEmptyGOTY = invalidSubmissionRequestJSONGenerator(validSubmission.name, emptyList())
        val invalidSubmissionRequestBlankName =
            invalidSubmissionRequestJSONGenerator("", validSubmission.gamesOfTheYear)
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
        Mockito.verify(secretSubmissionRepository, times(0)).save(any<SecretSubmission>())
    }

    @Test
    fun `Should reject submission after deadline`() {
        setupAfterDeadline()
        val validSubmissionCreationRequest = SubmissionCreationRequest(
            name = "too late",
            gamesOfTheYear = SubmissionDataHelper.minimal().gamesOfTheYear,
            bestOldGame = null,
            mostAnticipated = null,
            enteredGiveaway = false
        )
        mockMvc.perform(
            post("/submissions")
                .content(objectMapper.writeValueAsString(validSubmissionCreationRequest))
                .contentType(MediaType.APPLICATION_JSON)
        )
            .andExpect(status().isForbidden)
    }

    @Test
    fun `Should reject a submission with too many gamesOfTheYear`() {
        setupBeforeDeadline()
        val request = SubmissionCreationRequest(
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
        val submission = SubmissionDataHelper.maximal()
        val secretSubmission = SubmissionDataHelper.secret(submission)
        val validSubmissionRequest = SubmissionUpdateRequest(
            secret = secretSubmission.secret,
            name = secretSubmission.name,
            gamesOfTheYear = secretSubmission.gamesOfTheYear,
            mostAnticipated = secretSubmission.mostAnticipated,
            bestOldGame = null, // removed best old game entry
            enteredGiveaway = secretSubmission.enteredGiveaway
        )
        val updatedSecretSubmission = SecretSubmission(
            id = submission.id,
            secret = secretSubmission.secret,
            name = submission.name,
            gamesOfTheYear = submission.gamesOfTheYear,
            mostAnticipated = submission.mostAnticipated,
            bestOldGame = null,
            enteredGiveaway = submission.enteredGiveaway,
            enteredOn = submission.enteredOn,
            updatedOn = currentTestTime
        )
        val expectedUpdatedSubmission = updatedSecretSubmission.toSubmission()
        setupBeforeDeadline()
        whenever(secretSubmissionRepository.findById(secretSubmission.id)).thenReturn(Optional.of(secretSubmission))
        whenever(secretSubmissionRepository.save(updatedSecretSubmission)).thenReturn(updatedSecretSubmission)
        mockMvc.perform(
            put("/submissions/${submission.id}")
                .content(objectMapper.writeValueAsString(validSubmissionRequest))
                .contentType(MediaType.APPLICATION_JSON)
        )
            .andExpect(status().isOk)
            .andExpect(content().json(objectMapper.writeValueAsString(expectedUpdatedSubmission), true))
    }

    @Test
    fun `Should reject an invalid submission update`() {
        val validGamesOfTheYear = SubmissionDataHelper.minimal().gamesOfTheYear
        val invalidRequestEmptyGOTY = invalidSubmissionRequestJSONGenerator("name", emptyList())
        val invalidRequestBlankName = invalidSubmissionRequestJSONGenerator("", validGamesOfTheYear)
        whenever(secretSubmissionRepository.findById(any())).thenReturn(Optional.empty())
        Mockito.verify(secretSubmissionRepository, times(0)).save(any())
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
        val validUnsubmittedSecretSubmission = SubmissionDataHelper.secret(SubmissionDataHelper.maximal())
        val request = SubmissionUpdateRequest(
            name = validUnsubmittedSecretSubmission.name,
            secret = validUnsubmittedSecretSubmission.secret,
            gamesOfTheYear = validUnsubmittedSecretSubmission.gamesOfTheYear,
            mostAnticipated = validUnsubmittedSecretSubmission.mostAnticipated,
            bestOldGame = validUnsubmittedSecretSubmission.bestOldGame,
            enteredGiveaway = validUnsubmittedSecretSubmission.enteredGiveaway
        )
        setupBeforeDeadline()
        whenever(secretSubmissionRepository.findById(any())).thenReturn(Optional.empty())
        mockMvc.perform(
            put("/submissions/${validUnsubmittedSecretSubmission.id}")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))
        )
            .andExpect(status().isNotFound)
    }

    @Test
    fun `Should reject a submission update with too many gamesOfTheYear`() {
        val request = SubmissionUpdateRequest(
            name = "tooMany",
            secret = UUID.randomUUID(),
            gamesOfTheYear = (1..15).mapIndexed { index, _ -> RankedGameSubmission("", "", index) },
            mostAnticipated = null,
            bestOldGame = null,
            enteredGiveaway = false
        )
        setupBeforeDeadline()
        mockMvc.perform(
            put("/submissions/${UUID.randomUUID()}")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))
        )
            .andExpect(status().isBadRequest)
    }

    @Test
    fun `Should reject submission update after deadline`() {
        setupAfterDeadline()
        val validSubmissionRequest = SubmissionUpdateRequest(
            name = "too late",
            secret = UUID.randomUUID(),
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
        val secretSubmission = SubmissionDataHelper.secret(SubmissionDataHelper.maximal())
        whenever(secretSubmissionRepository.findById(secretSubmission.id)).thenReturn(Optional.of(secretSubmission))
        mockMvc.perform(
            delete("/submissions/${secretSubmission.id}")
        ).andExpect(status().isOk)
        verify(secretSubmissionRepository).deleteById(secretSubmission.id)
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
        setupBeforeDeadline()
        mockMvc.perform(
            delete("/submissions")
        )
            .andExpect(status().isBadRequest)
    }

    @Test
    @WithMockUser(roles = ["ADMIN"])
    fun `Should delete all when override supplied before deadline`() {
        setupBeforeDeadline()
        mockMvc.perform(
            delete("/submissions?override=true")
        )
            .andExpect(status().isOk)
        verify(secretSubmissionRepository, times(1)).deleteAll()
    }

    @Test
    @WithMockUser(roles = ["ADMIN"])
    fun `Should not require override when deleting all after deadline`() {
        setupAfterDeadline()
        mockMvc.perform(
            delete("/submissions")
        )
            .andExpect(status().isOk)
        verify(secretSubmissionRepository, times(1)).deleteAll()
    }

    @Test
    fun `Should not allow unauthenticated to get secret submissions`() {
        mockMvc.perform(
            get("/submissions/secret")
        )
            .andExpect(status().isUnauthorized)
    }

    @Test
    @WithMockUser(roles = ["USER"])
    fun `Should only allow admins to get secret submissions`() {
        mockMvc.perform(
            get("/submissions/secret")
        )
            .andExpect(status().isForbidden)
    }

    @Test
    @WithMockUser(roles = ["ADMIN"])
    fun `Should get secret submissions`() {
        val submissions = SubmissionDataHelper.secret(SubmissionDataHelper.everything())
        whenever(secretSubmissionRepository.findAll()).thenReturn(submissions)
        val expectedJson = objectMapper.writeValueAsString(submissions)
        mockMvc.perform(
            get("/submissions/secret")
        )
            .andExpect(status().isOk)
            .andExpect(content().json(expectedJson, true))
    }
}