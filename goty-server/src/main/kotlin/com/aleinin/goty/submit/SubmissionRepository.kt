package com.aleinin.goty.submit

import org.springframework.data.mongodb.repository.MongoRepository
import java.util.UUID

interface SubmissionRepository : MongoRepository<Submission, UUID>
