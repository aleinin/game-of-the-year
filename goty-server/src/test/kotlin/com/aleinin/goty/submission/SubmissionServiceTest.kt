package com.aleinin.goty.submission

import com.aleinin.goty.SubmissionDataHelper
import com.aleinin.goty.properties.Properties
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertDoesNotThrow
import org.junit.jupiter.api.assertThrows
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.junit.jupiter.MockitoExtension
import org.mockito.kotlin.whenever
import java.time.Clock
import java.time.ZoneId
import java.time.ZonedDateTime
import java.util.*

@ExtendWith(MockitoExtension::class)
class SubmissionServiceTest {
    @Mock
    lateinit var clock: Clock

    @Mock
    lateinit var properties: Properties

    @Mock
    lateinit var submissionRepository: SubmissionRepository

    @Mock
    lateinit var secretSubmissionRepository: SecretSubmissionRepository

    @InjectMocks
    lateinit var submissionService: SubmissionService

    @BeforeEach
    fun setup() {

    }
    private val testTime = ZonedDateTime.of(2023, 1, 5, 0, 0, 0, 0, ZoneId.of("UTC"))

    private fun setupBeforeDeadline() {
        whenever(properties.deadline).thenReturn(testTime)
        whenever(clock.instant()).thenReturn(testTime.toInstant().minusSeconds(1))
    }

    private fun setupAfterDeadline() {
        whenever(properties.deadline).thenReturn(testTime)
        whenever(clock.instant()).thenReturn(testTime.toInstant().plusSeconds(1))
    }

    @Test
    fun `Should get all submissions`() {
        whenever(submissionRepository.findAllSubmissions()).thenReturn(SubmissionDataHelper.everything())
        val expected = SubmissionDataHelper.everything()
        assertEquals(expected, submissionService.getAllSubmissions())
    }

    @Test
    fun `should get submissions by id`() {
        val expected = SubmissionDataHelper.maximal()
        whenever(submissionRepository.findSubmissionById(expected.id)).thenReturn(Optional.of(expected))
        assertEquals(Optional.of(expected), submissionService.getSubmission(expected.id))
    }

    @Test
    fun `Should return an empty optional if no submission by id`() {
        val expected = Optional.empty<Submission>()
        val id = UUID.randomUUID()
        whenever(submissionRepository.findSubmissionById(id)).thenReturn(Optional.empty())
        assertEquals(expected, submissionService.getSubmission(id))
    }

    @Test
    fun `Should not allow submissions after the deadline when saving a submission`() {
        val request = SubmissionRequest(
            name = "name",
            gamesOfTheYear = SubmissionDataHelper.gamesOfTheYear("game"),
            mostAnticipated = null,
            bestOldGame = null,
            enteredGiveaway = false
        )
        setupAfterDeadline()
        assertThrows<AfterDeadlineException> { submissionService.saveSubmission(request) }
    }

    @Test
    fun `Should not allow too many games of the year when saving a submission`() {
        val request = SubmissionRequest(
            name = "name",
            gamesOfTheYear = SubmissionDataHelper.gamesOfTheYear("game1", "game2", "game3", "gaem4"),
            mostAnticipated = null,
            bestOldGame = null,
            enteredGiveaway = false
        )
        setupBeforeDeadline()
        whenever(properties.tiePoints).thenReturn(listOf(3, 2, 1))
        assertThrows<TooManyGamesException> { submissionService.saveSubmission(request) }
    }

    @Test
    fun `Should delete all submissions if after the deadline`() {
        setupAfterDeadline()
        assertDoesNotThrow { submissionService.deleteAllSubmissions(false) }
        assertDoesNotThrow { submissionService.deleteAllSubmissions(true) }
    }

    @Test
    fun `Should require override if before the deadline when attempting to delete all`() {
        setupBeforeDeadline()
        assertThrows<OverrideRequiredException> { submissionService.deleteAllSubmissions(false) }
        assertDoesNotThrow { submissionService.deleteAllSubmissions(true) }
    }

    @Test
    fun `Should return Optional when deleting by id`() {
        val submission = SubmissionDataHelper.maximal()
        whenever(submissionRepository.findSubmissionById(submission.id)).thenReturn(Optional.of(submission))
        assertEquals(Optional.of(Unit), submissionService.deleteSubmission(submission.id))
    }

    @Test
    fun `Should return empty Optional when deleting by invalid id`() {
        val submission = SubmissionDataHelper.maximal()
        whenever(submissionRepository.findSubmissionById(submission.id)).thenReturn(Optional.empty())
        assertEquals(Optional.empty<Unit>(), submissionService.deleteSubmission(submission.id))
    }

    @Test
    fun `Should not allow updates after the deadline`() {
        val id = UUID.randomUUID()
        val secret = UUID.randomUUID()
        val request = SubmissionUpdateRequest(
            secret = secret,
            name = "name",
            gamesOfTheYear = SubmissionDataHelper.gamesOfTheYear("game"),
            mostAnticipated = null,
            bestOldGame = null,
            enteredGiveaway = false
        )
        setupAfterDeadline()
        assertThrows<AfterDeadlineException> { submissionService.updateSubmission(id, request) }
    }

    @Test
    fun `Should not allow updates that add too many games of the year`() {
        val id = UUID.randomUUID()
        val secret = UUID.randomUUID()
        val request = SubmissionUpdateRequest(
            name = "name",
            secret = secret,
            gamesOfTheYear = SubmissionDataHelper.gamesOfTheYear("game1", "game2", "game3", "gaem4"),
            mostAnticipated = null,
            bestOldGame = null,
            enteredGiveaway = false
        )
        setupBeforeDeadline()
        whenever(properties.tiePoints).thenReturn(listOf(3, 2, 1))
        assertThrows<TooManyGamesException> { submissionService.updateSubmission(id, request) }
    }

    @Test
    fun `Should return empty optional if no submission of id is found when updating`() {
        val id = UUID.randomUUID()
        val secret = UUID.randomUUID()
        val request = SubmissionUpdateRequest(
            name = "name",
            secret = secret,
            gamesOfTheYear = SubmissionDataHelper.gamesOfTheYear("game"),
            mostAnticipated = null,
            bestOldGame = null,
            enteredGiveaway = false
        )
        whenever(secretSubmissionRepository.findById(id)).thenReturn(Optional.empty())
        whenever(properties.tiePoints).thenReturn(listOf(3, 2, 1))
        setupBeforeDeadline()
        assertEquals(Optional.empty<Submission>(), submissionService.updateSubmission(id, request))
    }

    @Test
    fun `Should return empty optional if secrets do not match`() {
        val secretSubmission = SubmissionDataHelper.secret(SubmissionDataHelper.maximal())
        val id = secretSubmission.id
        val request = SubmissionUpdateRequest(
            name = "name",
            secret = UUID.randomUUID(),
            gamesOfTheYear = SubmissionDataHelper.gamesOfTheYear("game"),
            mostAnticipated = null,
            bestOldGame = null,
            enteredGiveaway = false
        )
        whenever(secretSubmissionRepository.findById(id)).thenReturn(Optional.of(secretSubmission))
        whenever(properties.tiePoints).thenReturn(listOf(3, 2, 1))
        setupBeforeDeadline()
        assertEquals(Optional.empty<Submission>(), submissionService.updateSubmission(id, request))
    }

    @Test
    fun `Should return a submission when updating`() {
        val secretSubmission = SubmissionDataHelper.secret(SubmissionDataHelper.maximal())
        val id = secretSubmission.id
        val millis = testTime.toInstant().toEpochMilli();
        val request = SubmissionUpdateRequest(
            name = "name",
            secret = secretSubmission.secret,
            gamesOfTheYear = SubmissionDataHelper.gamesOfTheYear("game"),
            mostAnticipated = null,
            bestOldGame = null,
            enteredGiveaway = false
        )
        val expected = SecretSubmission(
            id = id,
            name = "name",
            secret = secretSubmission.secret,
            gamesOfTheYear = SubmissionDataHelper.gamesOfTheYear("game"),
            mostAnticipated = null,
            bestOldGame = null,
            enteredGiveaway = false,
            enteredOn = secretSubmission.enteredOn,
            updatedOn = millis
        )
        whenever(secretSubmissionRepository.findById(id)).thenReturn(Optional.of(secretSubmission))
        whenever(properties.tiePoints).thenReturn(listOf(3, 2, 1))
        whenever(secretSubmissionRepository.save(expected)).thenReturn(expected)
        whenever(clock.millis()).thenReturn(millis)
        setupBeforeDeadline()
        assertEquals(Optional.of(expected.toSubmission()), submissionService.updateSubmission(id, request))
    }
}