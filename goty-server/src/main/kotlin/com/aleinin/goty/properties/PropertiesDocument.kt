package com.aleinin.goty.properties

import java.time.Instant
import java.time.ZoneId

data class PropertiesDocument(
    val id: String,
    val title: String,
    val year: Int,
    val gotyQuestion: GotyQuestion,
    val tiePoints: List<Int>,
    val deadline: Instant,
    val zoneId: ZoneId,
    val hasGiveaway: Boolean,
    val giveawayAmountUSD: Int,
    val defaultLocalTimeZone: ZoneId?
)
