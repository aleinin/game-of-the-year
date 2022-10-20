package com.aleinin.goty.properties

import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository

@Repository
interface PropertiesDocumentRepository : MongoRepository<PropertiesDocument, String>
