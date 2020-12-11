package com.aleinin.goty.submit

import org.springframework.data.mongodb.repository.MongoRepository

interface GameOfTheYearRepository : MongoRepository<GameOfTheYearSubmission, String>
