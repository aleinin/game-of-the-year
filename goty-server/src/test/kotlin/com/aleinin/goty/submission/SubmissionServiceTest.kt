package com.aleinin.goty.submission

import com.aleinin.goty.SubmissionDataHelper
import com.aleinin.goty.properties.Properties
import com.aleinin.goty.properties.PropertiesService
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.junit.jupiter.MockitoExtension
import org.mockito.kotlin.eq
import org.mockito.kotlin.whenever
import java.time.Clock
import java.time.Instant
import java.time.ZoneId
import java.time.ZonedDateTime
import java.util.Optional
import java.util.UUID

@ExtendWith(MockitoExtension::class)
class SubmissionServiceTest {

    @Mock
    lateinit var properties: Properties

    @Mock
    lateinit var clock: Clock

    @Mock
    lateinit var propertiesService: PropertiesService

    @Mock
    lateinit var submissionRepository: SubmissionRepository

    @Mock
    lateinit var secretSubmissionRepository: SecretSubmissionRepository

    @Mock
    lateinit var uuidService: UUIDService

    @InjectMocks
    lateinit var submissionService: SubmissionService

    private val testTimeMillis = Instant.EPOCH.toEpochMilli()

    private val testTime = ZonedDateTime.of(2023, 1, 5, 0, 0, 0, 0, ZoneId.of("UTC"))

    private val incorrectSecretMessage = "Incorrect secret."
    private fun getExpectedAfterDeadlineMessage(deadline: ZonedDateTime) = "Submission deadline of $deadline has been met."

    private fun getIncorrectYearMessage(requestYear: Int, submissionYear: Int) = "Submission year $requestYear has ended. Submission year $submissionYear is in progress."
    private fun getExpectedTooManyGamesMessage(tiePoints: List<Int>) = "Too many games of the year. The maximum allowed is ${tiePoints.size}."

    private fun setupBeforeDeadline(): ZonedDateTime {
        whenever(propertiesService.getProperties()).thenReturn(properties)
        whenever(properties.deadline).thenReturn(testTime)
        whenever(clock.instant()).thenReturn(testTime.toInstant().minusSeconds(1))
        return testTime
    }

    private fun setupAfterDeadline(): ZonedDateTime {
        whenever(propertiesService.getProperties()).thenReturn(properties)
        whenever(properties.deadline).thenReturn(testTime)
        whenever(clock.instant()).thenReturn(testTime.toInstant().plusSeconds(1))
        return testTime
    }

    private fun mockTiePoints(mock: List<Int>) {
        whenever(propertiesService.getProperties()).thenReturn(properties)
        whenever(properties.tiePoints).thenReturn(mock)
    }

    @Test
    fun `Should get submissions for year`() {
        val expectedYear = 2054
        val expected = SubmissionDataHelper.everything(expectedYear)
        whenever(submissionRepository.findSubmissionsByYear(eq(expectedYear))).thenReturn(expected)
        assertEquals(expected, submissionService.getSubmissionsForYear(expectedYear))
    }

    @Test
    fun `Should get distinct years of submissions`() {
        val expected = listOf(2000, 2001, 2002)
        whenever(submissionRepository.findSubmissionYears()).thenReturn(expected)
        assertEquals(expected, submissionService.getSubmissionYears())

    }

    @Test
    fun `Should get secret submissions for year`() {
        val expectedYear = 2004
        val secretSubmissions = SubmissionDataHelper.secret(SubmissionDataHelper.everything(expectedYear))
        val expected = secretSubmissions.filter { it.year == expectedYear}
        whenever(secretSubmissionRepository.findByYear(expectedYear)).thenReturn(secretSubmissions)
        assertEquals(expected, submissionService.getAllSecretSubmissions(expectedYear))
    }

    @Test
    fun `Should get all secret submissions if no year provided`() {
        val secretSubmissions = SubmissionDataHelper.secret(SubmissionDataHelper.everything())
                .plus(SubmissionDataHelper.secret(SubmissionDataHelper.everything(2004)))
        whenever(secretSubmissionRepository.findAll()).thenReturn(secretSubmissions)
        assertEquals(secretSubmissions, submissionService.getAllSecretSubmissions(null))
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
        val request = SubmissionCreationRequest(
            name = "name",
            gamesOfTheYear = SubmissionDataHelper.gamesOfTheYear("game"),
            mostAnticipated = null,
            bestOldGame = null,
            enteredGiveaway = false
        )
        val deadline = setupAfterDeadline()
        val thrown = assertThrows<AfterDeadlineException> { submissionService.saveSubmission(request) }
        assertEquals(getExpectedAfterDeadlineMessage(deadline), thrown.message)
    }

    @Test
    fun `Should not allow too many games of the year when saving a submission`() {
        val request = SubmissionCreationRequest(
            name = "name",
            gamesOfTheYear = SubmissionDataHelper.gamesOfTheYear("game1", "game2", "game3", "game4"),
            mostAnticipated = null,
            bestOldGame = null,
            enteredGiveaway = false
        )
        setupBeforeDeadline()
        val tiePoints = listOf(3, 2, 1)
        mockTiePoints(tiePoints)
        val thrown = assertThrows<TooManyGamesException> { submissionService.saveSubmission(request) }
        assertEquals(getExpectedTooManyGamesMessage(tiePoints), thrown.message)
    }

    @Test
    fun `Should return a SecretSubmission when saving a submission`() {
        val request = SubmissionCreationRequest(
                name = "name",
                gamesOfTheYear = SubmissionDataHelper.gamesOfTheYear("game1", "game2", "game3"),
                mostAnticipated = null,
                bestOldGame = null,
                enteredGiveaway = false
        )
        val expectedYear = 1970
        val expectedId = UUID.randomUUID()
        val expectedSecret = UUID.randomUUID()
        val expected = SecretSubmission(
            id = expectedId,
            secret = expectedSecret,
            name = request.name,
            year = expectedYear,
            gamesOfTheYear = request.gamesOfTheYear,
            mostAnticipated = request.mostAnticipated,
            bestOldGame = request.bestOldGame,
            enteredGiveaway = request.enteredGiveaway,
            enteredOn = testTimeMillis,
            updatedOn = testTimeMillis,
        )
        val tiePoints = listOf(3, 2, 1)
        mockTiePoints(tiePoints)
        setupBeforeDeadline()
        whenever(propertiesService.getThisYear()).thenReturn(expectedYear)
        whenever(clock.millis()).thenReturn(testTimeMillis)
        whenever(secretSubmissionRepository.save(expected)).thenReturn(expected)
        whenever(uuidService.randomID()).thenReturn(expectedId)
        whenever(uuidService.randomSecret()).thenReturn(expectedSecret)
        val actual = submissionService.saveSubmission(request)
        assertEquals(expected, actual)
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
        val deadline = setupAfterDeadline()
        val thrown = assertThrows<AfterDeadlineException> { submissionService.updateSubmission(id, request) }
        assertEquals(getExpectedAfterDeadlineMessage(deadline), thrown.message)
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
        val tiePoints = listOf(3, 2, 1)
        mockTiePoints(tiePoints)
        val thrown = assertThrows<TooManyGamesException> { submissionService.updateSubmission(id, request) }
        assertEquals(getExpectedTooManyGamesMessage(tiePoints), thrown.message)
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
        mockTiePoints(listOf(3, 2, 1))
        setupBeforeDeadline()
        assertEquals(Optional.empty<Submission>(), submissionService.updateSubmission(id, request))
    }

    @Test
    fun `Should throw IncorrectSecretException if secrets do not match`() {
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
        mockTiePoints(listOf(3, 2, 1))
        setupBeforeDeadline()
        val thrown = assertThrows<IncorrectSecretException> { submissionService.updateSubmission(id, request) }
        assertEquals(incorrectSecretMessage, thrown.message)
    }

    @Test
    fun `Should throw AfterDeadlineException if attempting to update a different year submission`() {
        val requestYear = 2000
        val secretSubmission = SubmissionDataHelper.secret(SubmissionDataHelper.maximal(2000))
        val id = secretSubmission.id
        val request = SubmissionUpdateRequest(
                name = "name",
                secret = secretSubmission.secret,
                gamesOfTheYear = SubmissionDataHelper.gamesOfTheYear("game"),
                mostAnticipated = null,
                bestOldGame = null,
                enteredGiveaway = false
        )
        whenever(secretSubmissionRepository.findById(id)).thenReturn(Optional.of(secretSubmission))
        whenever(properties.year).thenReturn(testTime.year)
        mockTiePoints(listOf(3, 2, 1))
        setupBeforeDeadline()
        val thrown = assertThrows<AfterDeadlineException> { submissionService.updateSubmission(id, request) }
        assertEquals(getIncorrectYearMessage(requestYear, testTime.year), thrown.message)
    }

    @Test
    fun `Should return a submission when updating`() {
        val year = testTime.year
        val secretSubmission = SubmissionDataHelper.secret(SubmissionDataHelper.maximal(year))
        val id = secretSubmission.id
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
            year = year,
            name = "name",
            secret = secretSubmission.secret,
            gamesOfTheYear = SubmissionDataHelper.gamesOfTheYear("game"),
            mostAnticipated = null,
            bestOldGame = null,
            enteredGiveaway = false,
            enteredOn = secretSubmission.enteredOn,
            updatedOn = testTimeMillis
        )
        whenever(secretSubmissionRepository.findById(id)).thenReturn(Optional.of(secretSubmission))
        whenever(properties.year).thenReturn(testTime.year)
        mockTiePoints(listOf(3, 2, 1))
        whenever(secretSubmissionRepository.save(expected)).thenReturn(expected)
        whenever(clock.millis()).thenReturn(testTimeMillis)
        setupBeforeDeadline()
        assertEquals(Optional.of(expected.toSubmission()), submissionService.updateSubmission(id, request))
    }
}
