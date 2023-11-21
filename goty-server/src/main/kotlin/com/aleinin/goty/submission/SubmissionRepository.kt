package com.aleinin.goty.submission

import org.springframework.stereotype.Repository
import java.util.Optional
import java.util.UUID

@Repository
class SubmissionRepository(private val secretSubmissionRepository: SecretSubmissionRepository) {
    fun findAllSubmissions() = secretSubmissionRepository.findAll().map { it.toSubmission() }

    fun findSubmissionById(id: UUID): Optional<Submission> = secretSubmissionRepository.findById(id).map { it.toSubmission() }

    fun deleteAllSubmissions() = secretSubmissionRepository.deleteAll()

    fun deleteSubmissionById(id: UUID) = secretSubmissionRepository.deleteById(id)
}
