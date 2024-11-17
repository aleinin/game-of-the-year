package com.aleinin.goty.properties

import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository
import java.util.Optional

@Repository
interface PropertiesDocumentRepository : MongoRepository<PropertiesDocument, String> {
    fun findByYear(year: Int): Optional<PropertiesDocument>
    fun deleteByYear(year: Int)
}

