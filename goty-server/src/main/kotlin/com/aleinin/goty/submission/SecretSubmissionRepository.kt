package com.aleinin.goty.submission

import org.springframework.data.mongodb.repository.MongoRepository
import java.util.UUID

interface SecretSubmissionRepository : MongoRepository<SecretSubmission, UUID>
