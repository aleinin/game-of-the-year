package com.aleinin.goty.submission

import com.aleinin.goty.SubmissionDataHelper
import com.aleinin.goty.properties.Properties
import com.aleinin.goty.properties.PropertiesService
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.junit.jupiter.MockitoExtension
import org.mockito.kotlin.times
import org.mockito.kotlin.verify
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

    private fun setupBeforeDeadline(): ZonedDateTime {
        whenever(propertiesService.getActiveYearProperties()).thenReturn(properties)
        whenever(properties.deadline).thenReturn(testTime)
        whenever(clock.instant()).thenReturn(testTime.toInstant().minusSeconds(1))
        return testTime
    }

    private fun setupAfterDeadline(): ZonedDateTime {
        whenever(propertiesService.getActiveYearProperties()).thenReturn(properties)
        whenever(properties.deadline).thenReturn(testTime)
        whenever(clock.instant()).thenReturn(testTime.toInstant().plusSeconds(1))
        return testTime
    }

    @Test
    fun `Should get all submissions`() {
        val expected = SubmissionDataHelper.everything()
        val year = 2000
        whenever(propertiesService.getActiveYear()).thenReturn(year)
        whenever(submissionRepository.findSubmissionsByYear(year)).thenReturn(expected)
        assertEquals(expected, submissionService.getAllSubmissions())
    }

    @Test
    fun `Should get all secret submissions`() {
        val year = 2000
        val expected = SubmissionDataHelper.secret(SubmissionDataHelper.everything())
        whenever(propertiesService.getActiveYear()).thenReturn(year)
        whenever(secretSubmissionRepository.findByYear(year)).thenReturn(expected)
        assertEquals(expected, submissionService.getAllSecretSubmissions())
    }

    @Test
    fun `Should get submission by id`() {
        val year = 2000
        val id = UUID.randomUUID()
        val expected = SubmissionDataHelper.minimal()
        whenever(propertiesService.getActiveYear()).thenReturn(year)
        whenever(submissionRepository.findSubmissionByIdAndYear(id, year)).thenReturn(Optional.of(expected))
        assertEquals(Optional.of(expected), submissionService.getSubmission(id))
    }

    @Test
    fun `Should return empty if no submission by id`() {
        val year = 2000
        val id = UUID.randomUUID()
        whenever(propertiesService.getActiveYear()).thenReturn(year)
        whenever(submissionRepository.findSubmissionByIdAndYear(id, year)).thenReturn(Optional.empty())
        assertEquals(Optional.empty<Submission>(), submissionService.getSubmission(id))
    }

    @Test
    fun `Should create submission`() {
        val submission = SubmissionDataHelper.secret(SubmissionDataHelper.maximal(testTime.year, testTimeMillis, testTimeMillis))
        setupBeforeDeadline()
        whenever(properties.tiePoints).thenReturn((submission.gamesOfTheYear.size downTo 1).toList())
        whenever(propertiesService.getActiveYear()).thenReturn(testTime.year)
        val request = SubmissionDataHelper.creationRequest(submission)
        whenever(secretSubmissionRepository.save(submission)).thenReturn(submission)
        whenever(uuidService.randomID()).thenReturn(submission.id)
        whenever(uuidService.randomSecret()).thenReturn(submission.secret)
        val actual = submissionService.createSubmission(request)
        assertEquals(submission, actual)
        verify(secretSubmissionRepository, times(1)).save(submission)
    }

    @Test
    fun `Should reject submission after deadline`() {
        val submission = SubmissionDataHelper.secret(SubmissionDataHelper.maximal(testTime.year, testTimeMillis, testTimeMillis))
        setupAfterDeadline()
        val request = SubmissionDataHelper.creationRequest(submission)
        assertThrows<AfterDeadlineException> {
            submissionService.createSubmission(request)
        }
        verify(secretSubmissionRepository, times(0)).save(submission)
    }

    @Test
    fun `Should reject submissions with too many games of the year`() {
        val submission = SubmissionDataHelper.secret(SubmissionDataHelper.maximal(testTime.year, testTimeMillis, testTimeMillis))
        setupBeforeDeadline()
        val request = SubmissionDataHelper.creationRequest(submission)
        whenever(properties.tiePoints).thenReturn((submission.gamesOfTheYear.size - 1 downTo 1).toList())
        assertThrows<TooManyGamesException> {
            submissionService.createSubmission(request)
        }
        verify(secretSubmissionRepository, times(0)).save(submission)
    }

    @Test
    fun `Should delete submission by id`() {
        val year = 2000
        whenever(propertiesService.getActiveYear()).thenReturn(year)
        val submission = SubmissionDataHelper.minimal()
        whenever(submissionRepository.findSubmissionByIdAndYear(submission.id, year)).thenReturn(Optional.of(submission))
        val actual = submissionService.deleteSubmission(submission.id)
        assertTrue(actual.isPresent)
        verify(submissionRepository, times(1)).deleteSubmissionById(submission.id)
    }

    @Test
    fun `Should not delete if no submission by id`() {
        val year = 2000
        whenever(propertiesService.getActiveYear()).thenReturn(year)
        val id = UUID.randomUUID()
        whenever(submissionRepository.findSubmissionByIdAndYear(id, year)).thenReturn(Optional.empty())
        val actual = submissionService.deleteSubmission(id)
        assertTrue(actual.isEmpty)
        verify(submissionRepository, times(0)).deleteSubmissionById(id)
    }

    @Test
    fun `Should update submission`() {
        val submission = SubmissionDataHelper.secret(SubmissionDataHelper.maximal(testTime.year, testTimeMillis, testTimeMillis))
        setupBeforeDeadline()
        whenever(properties.tiePoints).thenReturn((submission.gamesOfTheYear.size downTo 1).toList())
        whenever(propertiesService.getActiveYear()).thenReturn(testTime.year)
        val request = SubmissionDataHelper.updateRequest(submission)
        whenever(secretSubmissionRepository.save(submission)).thenReturn(submission)
        whenever(secretSubmissionRepository.findByIdAndYear(submission.id, testTime.year)).thenReturn(Optional.of(submission))
        val actual = submissionService.updateSubmission(submission.id, request)
        assertEquals(Optional.of(submission.toSubmission()), actual)
        verify(secretSubmissionRepository, times(1)).save(submission)
    }

    @Test
    fun `Should reject submission update after deadline`() {
        val submission = SubmissionDataHelper.secret(SubmissionDataHelper.maximal(testTime.year, testTimeMillis, testTimeMillis))
        setupAfterDeadline()
        val request = SubmissionDataHelper.updateRequest(submission)
        assertThrows<AfterDeadlineException> {
            submissionService.updateSubmission(submission.id, request)
        }
        verify(secretSubmissionRepository, times(0)).save(submission)
    }

    @Test
    fun `Should reject submissions update with too many games of the year`() {
        val submission = SubmissionDataHelper.secret(SubmissionDataHelper.maximal(testTime.year, testTimeMillis, testTimeMillis))
        setupBeforeDeadline()
        val request = SubmissionDataHelper.updateRequest(submission)
        whenever(properties.tiePoints).thenReturn((submission.gamesOfTheYear.size - 1 downTo 1).toList())
        assertThrows<TooManyGamesException> {
            submissionService.updateSubmission(submission.id, request)
        }
        verify(secretSubmissionRepository, times(0)).save(submission)
    }

    @Test
    fun `Should reject submission updates with wrong secret`() {
        val submission = SubmissionDataHelper.secret(SubmissionDataHelper.maximal(testTime.year, testTimeMillis, testTimeMillis))
        setupBeforeDeadline()
        val request = SubmissionDataHelper.updateRequest(submission)
        whenever(secretSubmissionRepository.findByIdAndYear(submission.id, testTime.year)).thenReturn(Optional.of(submission))
        whenever(propertiesService.getActiveYear()).thenReturn(testTime.year)
        whenever(properties.tiePoints).thenReturn((submission.gamesOfTheYear.size downTo 1).toList())
        assertThrows<IncorrectSecretException> {
            submissionService.updateSubmission(submission.id, request.copy(secret = UUID.randomUUID()))
        }
        verify(secretSubmissionRepository, times(0)).save(submission)
    }
}
