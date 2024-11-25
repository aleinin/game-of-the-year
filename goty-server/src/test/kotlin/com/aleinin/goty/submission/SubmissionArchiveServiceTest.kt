package com.aleinin.goty.submission

import com.aleinin.goty.SubmissionDataHelper
import com.aleinin.goty.properties.Properties
import com.aleinin.goty.properties.PropertiesService
import com.aleinin.goty.properties.YearNotFoundException
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
import java.util.Optional
import java.util.UUID

@ExtendWith(MockitoExtension::class)
class SubmissionArchiveServiceTest {
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

    @InjectMocks lateinit var submissionArchiveService: SubmissionArchiveService

    @Test
    fun `Should get all secret submissions for year`() {
        val year = "2000"
        val expectedSubmissions = SubmissionDataHelper.everything(year).map { SubmissionDataHelper.secret(it) }
        whenever(secretSubmissionRepository.findByYear(year)).thenReturn(expectedSubmissions)
        val actualSubmissions = submissionArchiveService.getAllSecretSubmissionsForYear(year)
        assertEquals(expectedSubmissions, actualSubmissions)
    }

    @Test
    fun `Should get all submissions for year`() {
        val year = "2000"
        val expectedSubmissions = SubmissionDataHelper.everything(year)
        whenever(submissionRepository.findSubmissionsByYear(year)).thenReturn(expectedSubmissions)
        val actualSubmissions = submissionArchiveService.getAllSubmissionsForYear(year)
        assertEquals(expectedSubmissions, actualSubmissions)
    }

    @Test
    fun `Should get submission years`() {
        val distinctYears = listOf("2019", "2020", "2021")
        val thisYear = "2022"
        whenever(propertiesService.getActiveYear()).thenReturn(thisYear)
        whenever(submissionRepository.findSubmissionYears()).thenReturn(distinctYears)
        val expectedYears = distinctYears.plus(thisYear).sortedDescending()
        val actualYears = submissionArchiveService.getSubmissionYears()
        assertEquals(expectedYears, actualYears)
    }

    @Test
    fun `Should not duplicate year for getting all submission years`() {
        val distinctYears = listOf("2019", "2020", "2021")
        val thisYear = "2021"
        whenever(propertiesService.getActiveYear()).thenReturn(thisYear)
        whenever(submissionRepository.findSubmissionYears()).thenReturn(distinctYears)
        val expectedYears = distinctYears.sortedDescending()
        val actualYears = submissionArchiveService.getSubmissionYears()
        assertEquals(expectedYears, actualYears)
    }

    @Test
    fun `Should create submission for year`() {
        val year = "2000"
        val now = Instant.now()
        whenever(clock.millis()).thenReturn(now.toEpochMilli())
        val expectedSubmission = SubmissionDataHelper.secret(SubmissionDataHelper.maximal(year, now.toEpochMilli(), now.toEpochMilli()))
        val submissionCreationRequest = SubmissionDataHelper.creationRequest(expectedSubmission)
        whenever(uuidService.randomID()).thenReturn(expectedSubmission.id)
        whenever(uuidService.randomSecret()).thenReturn(expectedSubmission.secret)
        whenever(properties.tiePoints).thenReturn((expectedSubmission.gamesOfTheYear.size downTo 1).toList())
        whenever(propertiesService.getProperties(year)).thenReturn(Optional.of(properties))
        whenever(secretSubmissionRepository.save(expectedSubmission)).thenReturn(expectedSubmission)

        val actualSubmission = submissionArchiveService.createSubmissionForYear(year, submissionCreationRequest)
        assertEquals(expectedSubmission, actualSubmission)
        verify(secretSubmissionRepository, times(1)).save(expectedSubmission)
    }

    @Test
    fun `Should throw when creating if properties for year dont exist`() {
        val year = "2000"
        val submissionCreationRequest = SubmissionDataHelper.creationRequest(SubmissionDataHelper.maximal())
        whenever(propertiesService.getProperties(year)).thenReturn(Optional.empty())
        assertThrows<YearNotFoundException> {
            submissionArchiveService.createSubmissionForYear(year, submissionCreationRequest)
        }
    }

    @Test
    fun `Should throw when creating if too many games of the  year`() {
        val year = "2000"
        val submissionCreationRequest = SubmissionDataHelper.creationRequest(SubmissionDataHelper.maximal())
        whenever(properties.tiePoints).thenReturn((submissionCreationRequest.gamesOfTheYear.size - 1 downTo 1).toList())
        whenever(propertiesService.getProperties(year)).thenReturn(Optional.of(properties))
        assertThrows<TooManyGamesException> {
            submissionArchiveService.createSubmissionForYear(year, submissionCreationRequest)
        }
    }

    @Test
    fun `Should get submission for year by id`() {
        val year = "2000"
        val expectedSubmission = SubmissionDataHelper.maximal(year)
        whenever(submissionRepository.findSubmissionByIdAndYear(expectedSubmission.id, year)).thenReturn(Optional.of(expectedSubmission))
        val actualSubmission = submissionArchiveService.getSubmissionForYearById(year, expectedSubmission.id)
        assertEquals(Optional.of(expectedSubmission), actualSubmission)
    }

    @Test
    fun `Should return empty optional if submission for year by id does not exist`() {
        val year = "2000"
        val id = UUID.randomUUID()
        whenever(submissionRepository.findSubmissionByIdAndYear(id, year)).thenReturn(Optional.empty())
        val actualSubmission = submissionArchiveService.getSubmissionForYearById(year, id)
        assertTrue(actualSubmission.isEmpty)
    }

    @Test
    fun `Should update submission for year by id`() {
        val year = "2000"
        val now = Instant.now()
        whenever(clock.millis()).thenReturn(now.toEpochMilli())
        val expectedSubmission = SubmissionDataHelper.secret(SubmissionDataHelper.maximal(year, now.toEpochMilli(), now.toEpochMilli()))
        val submissionUpdateRequest = SubmissionDataHelper.updateRequest(expectedSubmission)
        whenever(properties.tiePoints).thenReturn((expectedSubmission.gamesOfTheYear.size downTo 1).toList())
        whenever(propertiesService.getProperties(year)).thenReturn(Optional.of(properties))
        whenever(secretSubmissionRepository.save(expectedSubmission)).thenReturn(expectedSubmission)
        whenever(secretSubmissionRepository.findById(expectedSubmission.id)).thenReturn(Optional.of(expectedSubmission))

        val actualSubmission =
            submissionArchiveService.updateSubmissionForYearById(year, expectedSubmission.id, submissionUpdateRequest)
        assertEquals(expectedSubmission.toSubmission(), actualSubmission.get())
        verify(secretSubmissionRepository, times(1)).save(expectedSubmission)
    }

    @Test
    fun `Should not update submission if no submission by that id`() {
        val year = "2000"
        val now = Instant.now()
        val expectedSubmission = SubmissionDataHelper.secret(SubmissionDataHelper.maximal(year, now.toEpochMilli(), now.toEpochMilli()))
        val submissionUpdateRequest = SubmissionDataHelper.updateRequest(expectedSubmission)
        whenever(secretSubmissionRepository.findById(expectedSubmission.id)).thenReturn(Optional.empty())
        whenever(properties.tiePoints).thenReturn((expectedSubmission.gamesOfTheYear.size downTo 1).toList())
        whenever(propertiesService.getProperties(year)).thenReturn(Optional.of(properties))
        val actual = submissionArchiveService.updateSubmissionForYearById(year, expectedSubmission.id, submissionUpdateRequest)
        assertEquals(Optional.empty<Submission>(), actual)
        verify(secretSubmissionRepository, times(0)).save(expectedSubmission)
    }

    @Test
    fun `Should not update submission if too many games of the year`() {
        val year = "2000"
        val now = Instant.now()
        val expectedSubmission = SubmissionDataHelper.secret(SubmissionDataHelper.maximal(year, now.toEpochMilli(), now.toEpochMilli()))
        val submissionUpdateRequest = SubmissionDataHelper.updateRequest(expectedSubmission)
        whenever(secretSubmissionRepository.findById(expectedSubmission.id)).thenReturn(Optional.of(expectedSubmission))
        whenever(properties.tiePoints).thenReturn((expectedSubmission.gamesOfTheYear.size - 1 downTo 1).toList())
        whenever(propertiesService.getProperties(year)).thenReturn(Optional.of(properties))
        assertThrows<TooManyGamesException> {
            submissionArchiveService.updateSubmissionForYearById(year, expectedSubmission.id, submissionUpdateRequest)
        }
        verify(secretSubmissionRepository, times(0)).save(expectedSubmission)
    }

    @Test
    fun `Should not update submission if secret is wrong`() {
        val year = "2000"
        val now = Instant.now()
        val expectedSubmission = SubmissionDataHelper.secret(SubmissionDataHelper.maximal(year, now.toEpochMilli(), now.toEpochMilli()))
        val submissionUpdateRequest = SubmissionDataHelper.updateRequest(expectedSubmission)
        whenever(secretSubmissionRepository.findById(expectedSubmission.id)).thenReturn(Optional.of(expectedSubmission))
        whenever(properties.tiePoints).thenReturn((expectedSubmission.gamesOfTheYear.size downTo 1).toList())
        whenever(propertiesService.getProperties(year)).thenReturn(Optional.of(properties))
        assertThrows<IncorrectSecretException> {
            submissionArchiveService.updateSubmissionForYearById(year, expectedSubmission.id, submissionUpdateRequest.copy(secret = UUID.randomUUID()))
        }
        verify(secretSubmissionRepository, times(0)).save(expectedSubmission)
    }

    @Test
    fun `Should delete submission for year by id`() {
        val year = "2000"
        val id = UUID.randomUUID()
        val expectedSubmission = SubmissionDataHelper.secret(SubmissionDataHelper.maximal(year))
        whenever(secretSubmissionRepository.findByIdAndYear(id, year)).thenReturn(Optional.of(expectedSubmission))
        val actual = submissionArchiveService.deleteSubmissionForYearById(year, id)
        assertTrue(actual.isPresent)
        verify(secretSubmissionRepository, times(1)).deleteById(expectedSubmission.id)
    }

    @Test
    fun `Should return empty if trying to delete non existant id`() {
        val year = "2000"
        val id = UUID.randomUUID()
        whenever(secretSubmissionRepository.findByIdAndYear(id, year)).thenReturn(Optional.empty())
        val actual = submissionArchiveService.deleteSubmissionForYearById(year, id)
        assertTrue(actual.isEmpty)
        verify(secretSubmissionRepository, times(0)).deleteById(id)
    }

}
