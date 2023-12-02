package com.aleinin.goty.submission

import org.springframework.stereotype.Repository
import java.util.Optional
import java.util.UUID

@Repository
class SubmissionRepository(private val secretSubmissionRepository: SecretSubmissionRepository) {
    fun findAllSubmissions() = secretSubmissionRepository.findAll().map { it.toSubmission() }

    fun findSubmissionYears() = secretSubmissionRepository.findAll().map { it.year }.distinct()

    fun findSubmissionsByYear(year:  Int) = secretSubmissionRepository.findByYear(year).map { it.toSubmission() }

    fun findSubmissionById(id: UUID): Optional<Submission> = secretSubmissionRepository.findById(id).map { it.toSubmission() }

    fun deleteSubmissionById(id: UUID) = secretSubmissionRepository.deleteById(id)
}
