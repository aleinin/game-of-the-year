package com.aleinin.goty.submission

import org.springframework.data.mongodb.repository.MongoRepository
import java.util.Optional
import java.util.UUID


interface SecretSubmissionRepository : MongoRepository<SecretSubmission, UUID> {
    fun findByYear(year: Int): List<SecretSubmission>

    fun findByIdAndYear(id: UUID, year: Int): Optional<SecretSubmission>
}
