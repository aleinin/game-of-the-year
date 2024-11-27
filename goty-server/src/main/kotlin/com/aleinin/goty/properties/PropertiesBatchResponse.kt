package com.aleinin.goty.properties

data class PropertiesBatchResponse(
    val created: List<PropertiesResponse>,
    val notCreated: List<PropertiesBatchFailure>
)

data class PropertiesBatchFailure(
    val reason: String,
    val input: Properties
)