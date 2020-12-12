package com.aleinin.goty.submit

import org.springframework.data.mongodb.repository.MongoRepository
import java.util.*

interface GameOfTheYearRepository : MongoRepository<GameOfTheYearSubmission, UUID>
