package com.aleinin.goty.properties

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import java.time.Instant
import java.time.ZoneId

@Document(collection = "properties")
data class PropertiesDocument(
    @Id val year: Int,
    var title: String,
    val searchYears: List<Int>?,
    val gotyQuestion: GotyQuestion,
    val tiePoints: List<Int>,
    val deadline: Instant,
    val zoneId: ZoneId,
    val hasGiveaway: Boolean,
    val giveawayAmountUSD: Int,
    val defaultLocalTimeZone: ZoneId?
)
