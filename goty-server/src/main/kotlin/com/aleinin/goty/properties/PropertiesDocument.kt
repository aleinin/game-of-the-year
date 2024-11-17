package com.aleinin.goty.properties

import org.springframework.data.mongodb.core.index.Indexed
import org.springframework.data.mongodb.core.mapping.Document
import java.time.Instant
import java.time.ZoneId

@Document(collection = "properties")
data class PropertiesDocument(
    val title: String,
    @Indexed(unique = true) val year: Int,
    val gotyQuestion: GotyQuestion,
    val tiePoints: List<Int>,
    val deadline: Instant,
    val zoneId: ZoneId,
    val hasGiveaway: Boolean,
    val giveawayAmountUSD: Int,
    val defaultLocalTimeZone: ZoneId?
)
