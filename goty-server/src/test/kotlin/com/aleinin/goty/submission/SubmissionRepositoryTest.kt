package com.aleinin.goty.submission

import com.aleinin.goty.SubmissionDataHelper
import com.aleinin.goty.SubmissionDataHelper.Companion.secret
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.Mockito
import org.mockito.junit.jupiter.MockitoExtension
import org.mockito.kotlin.verify
import org.mockito.kotlin.whenever
import java.util.Optional
import java.util.UUID

@ExtendWith(MockitoExtension::class)
class SubmissionRepositoryTest {
    @Mock
    lateinit var secretSubmissionRepository: SecretSubmissionRepository

    @InjectMocks
    lateinit var submissionRepository: SubmissionRepository

    @Test
    fun `Should find distinct submission years`() {
        val submissions = secret(SubmissionDataHelper.everything("2019")
                .plus(SubmissionDataHelper.everything("2020"))
                .plus(SubmissionDataHelper.everything("2021"))
        )
        val expectedYears = listOf("2019", "2020", "2021")
        whenever(secretSubmissionRepository.findAll()).thenReturn(submissions)
        val actualYears = submissionRepository.findSubmissionYears()
        assertEquals(expectedYears, actualYears)
    }

    @Test
    fun `Should find submissions by year`() {
        val expectedYear = "2019"
        val expectedSubmissions = SubmissionDataHelper.everything(expectedYear)
        val submissions = secret(expectedSubmissions
                .plus(SubmissionDataHelper.everything("2020"))
                .plus(SubmissionDataHelper.everything("2021"))
        )
        whenever(secretSubmissionRepository.findByYear(expectedYear)).thenReturn(submissions.filter { it.year == expectedYear })
        val actualSubmissions = submissionRepository.findSubmissionsByYear(expectedYear)
        assertEquals(expectedSubmissions, actualSubmissions)
    }

    @Test
    fun `Should find submission by id`() {

        val expectedSubmission = SubmissionDataHelper.maximal()
        val id = expectedSubmission.id
        whenever(secretSubmissionRepository.findById(id)).thenReturn(Optional.of(secret(expectedSubmission)))
        val actualSubmission = submissionRepository.findSubmissionById(id)
        assertEquals(Optional.of(expectedSubmission), actualSubmission)
    }

    @Test
    fun `Should find submission by id and year`() {
        val id = UUID.randomUUID()
        val year = "2050"
        val expectedSubmission = SubmissionDataHelper.maximal(year)
        whenever(secretSubmissionRepository.findByIdAndYear(id ,year)).thenReturn(Optional.of(secret(expectedSubmission)))
        val actualSubmission = submissionRepository.findSubmissionByIdAndYear(id, year)
        assertEquals(Optional.of(expectedSubmission), actualSubmission)
    }

    @Test
    fun `Should delete submission by id`() {
        val id = UUID.randomUUID()
        submissionRepository.deleteSubmissionById(id)
        verify(secretSubmissionRepository, Mockito.times(1)).deleteById(id)
    }
}