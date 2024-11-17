package com.aleinin.goty.activeYear

import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository

@Repository
interface ActiveYearUpdaterRepository: MongoRepository<ActiveYearDocument, String>