package com.aleinin.goty.properties

import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository
import java.util.Optional

@Repository
interface PropertiesRepository : MongoRepository<PropertiesDocument, String> {
    fun findByYear(year: String): Optional<PropertiesDocument>
}

