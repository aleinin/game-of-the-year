package com.aleinin.goty.submission

import org.springframework.data.mongodb.repository.MongoRepository
import java.util.Optional
import java.util.UUID


interface SecretSubmissionRepository : MongoRepository<SecretSubmission, UUID> {
    fun findByYear(year: String): List<SecretSubmission>

    fun findByIdAndYear(id: UUID, year: String): Optional<SecretSubmission>
}
