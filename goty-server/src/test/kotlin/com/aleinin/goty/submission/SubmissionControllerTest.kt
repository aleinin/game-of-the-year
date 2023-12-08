package com.aleinin.goty.submission

import com.aleinin.goty.SubmissionDataHelper
import com.aleinin.goty.configuration.DefaultProperties
import com.aleinin.goty.properties.PropertiesRepository
import com.fasterxml.jackson.databind.ObjectMapper
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.Mockito
import org.mockito.kotlin.any
import org.mockito.kotlin.eq
import org.mockito.kotlin.times
import org.mockito.kotlin.verify
import org.mockito.kotlin.whenever
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.context.properties.EnableConfigurationProperties
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
@EnableConfigurationProperties
internal class SubmissionControllerTest {
    @Autowired
    lateinit var mockMvc: MockMvc

    @Autowired
    lateinit var objectMapper: ObjectMapper

    @Autowired
    lateinit var defaultProperties: DefaultProperties

    @MockBean
    lateinit var propertiesRepository: PropertiesRepository

    @MockBean
    lateinit var secretSubmissionRepository: SecretSubmissionRepository

    @MockBean
    lateinit var clock: Clock

    private var currentTestTime: Long = 0

    @BeforeEach()
    fun setup() {
        whenever(propertiesRepository.findProperties()).thenReturn(Optional.empty())
    }


    private fun setupBeforeDeadline() {
        val deadline = defaultProperties.deadline
        whenever(clock.instant()).thenReturn(deadline.toInstant().minusSeconds(1))
    }

    private fun setupAfterDeadline() {
        val deadline = defaultProperties.deadline
        whenever(clock.instant()).thenReturn(deadline.toInstant())
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
    fun `Should return all Submissions for current year if year not provided`() {
        val submissions = SubmissionDataHelper.everything(defaultProperties.year)
        val secretSubmissions = SubmissionDataHelper.secret(submissions)
        whenever(secretSubmissionRepository.findByYear(eq(defaultProperties.year))).thenReturn(secretSubmissions)
        val expectedJson = objectMapper.writeValueAsString(submissions)
        mockMvc.perform(get("/submissions"))
            .andExpect(status().isOk)
            .andExpect(content().json(expectedJson, true))
    }

    @Test
    fun `Should return a specific Submission with the id and year`() {
        val year = 2000
        val submission = SubmissionDataHelper.maximal(year)
        val secretSubmission = SubmissionDataHelper.secret(submission)
        whenever(secretSubmissionRepository.findByIdAndYear(secretSubmission.id, year)).thenReturn(Optional.of(secretSubmission))
        val expectedJson = objectMapper.writeValueAsString(submission)
        mockMvc.perform(get("/submissions/${submission.id}?year=$year"))
            .andExpect(status().isOk)
            .andExpect(content().json(expectedJson, true))
    }

    @Test
    fun `Should default to this year if no year provided when getting submission`() {
        val year = defaultProperties.year
        val submission = SubmissionDataHelper.maximal(year)
        val secretSubmission = SubmissionDataHelper.secret(submission)
        whenever(secretSubmissionRepository.findByIdAndYear(secretSubmission.id, year)).thenReturn(Optional.of(secretSubmission))
        val expectedJson = objectMapper.writeValueAsString(submission)
        mockMvc.perform(get("/submissions/${submission.id}"))
                .andExpect(status().isOk)
                .andExpect(content().json(expectedJson, true))
    }

    @Test
    fun `Should return Not Found if invalid submission id`() {
        whenever(secretSubmissionRepository.findByIdAndYear(any(), any())).thenReturn(Optional.empty())
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
        val submission = SubmissionDataHelper.maximal(defaultProperties.year)
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
            year = defaultProperties.year,
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

    @Test
    fun `Should get submissions for provided year`() {
        val expectedYear = 2010
        val submissions = SubmissionDataHelper.secret(listOf(
                SubmissionDataHelper.maximal(2010),
                SubmissionDataHelper.maximal(2010),
        ))
        whenever(secretSubmissionRepository.findByYear(expectedYear)).thenReturn(submissions)
        val expected = submissions.map { it.toSubmission() }
        val expectedJson = objectMapper.writeValueAsString(expected)
        mockMvc.perform(
            get("/submissions?year=$expectedYear")
        )
            .andExpect(status().isOk)
            .andExpect(content().json(expectedJson, true))
    }

    @Test
    fun `Should get submissions for this year if not provided`() {
        val submissions = SubmissionDataHelper.secret(listOf(
                SubmissionDataHelper.maximal(defaultProperties.year),
                SubmissionDataHelper.maximal(defaultProperties.year),
        ))
        whenever(secretSubmissionRepository.findByYear(defaultProperties.year)).thenReturn(submissions)
        val expected = submissions.map { it.toSubmission() }
        val expectedJson = objectMapper.writeValueAsString(expected)
        mockMvc.perform(
                get("/submissions")
        )
                .andExpect(status().isOk)
                .andExpect(content().json(expectedJson, true))
    }

    @Test
    fun `Should get distinct submissions years`() {
        val thisYear = defaultProperties.year
        val submissions = SubmissionDataHelper.secret(listOf(
            SubmissionDataHelper.maximal(thisYear - 3),
            SubmissionDataHelper.maximal(thisYear - 2),
            SubmissionDataHelper.maximal(thisYear - 1),
            SubmissionDataHelper.maximal(thisYear)
        ))
        whenever(secretSubmissionRepository.findAll()).thenReturn(submissions)
        val expected = listOf(thisYear - 3, thisYear - 2, thisYear - 1, thisYear).sortedDescending()
        val expectedJson = objectMapper.writeValueAsString(expected)
        mockMvc.perform(
            get("/submissions/years")
        )
            .andExpect(status().isOk)
            .andExpect(content().json(expectedJson, true))
    }

    @Test
    @WithMockUser(roles = ["ADMIN"])
    fun `Should all secretSubmissions if submission year not provided`() {
        val submissions = SubmissionDataHelper.secret(listOf(
                SubmissionDataHelper.maximal(defaultProperties.year),
                SubmissionDataHelper.maximal(defaultProperties.year),
                SubmissionDataHelper.maximal(2011),
                SubmissionDataHelper.maximal(2015)
        ))
        whenever(secretSubmissionRepository.findAll()).thenReturn(submissions)
        val expectedJson = objectMapper.writeValueAsString(submissions)
        mockMvc.perform(
                get("/submissions/secret")
        )
                .andExpect(status().isOk)
                .andExpect(content().json(expectedJson, true))
    }

    @Test
    @WithMockUser(roles = ["ADMIN"])
    fun `Should get years secretSubmissions if year provided`() {
        val expectedYear = 2015
        val submissions = SubmissionDataHelper.secret(listOf(
                SubmissionDataHelper.maximal(defaultProperties.year),
                SubmissionDataHelper.maximal(defaultProperties.year),
        ))
        whenever(secretSubmissionRepository.findByYear(expectedYear)).thenReturn(submissions)
        val expectedJson = objectMapper.writeValueAsString(submissions)
        mockMvc.perform(
                get("/submissions/secret?year=$expectedYear")
        )
                .andExpect(status().isOk)
                .andExpect(content().json(expectedJson, true))
    }
}
