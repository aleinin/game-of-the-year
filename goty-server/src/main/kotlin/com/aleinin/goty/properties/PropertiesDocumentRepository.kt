package com.aleinin.goty.properties

import org.springframework.data.mongodb.repository.MongoRepository

interface PropertiesDocumentRepository : MongoRepository<PropertiesDocument, String>
