package com.aleinin.goty.properties

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
@Document(collection = "activeYear")
data class ActiveYearDocument(
    @Id val id: String = PropertiesService.ACTIVE_YEAR_ID,
    val year: String,
)