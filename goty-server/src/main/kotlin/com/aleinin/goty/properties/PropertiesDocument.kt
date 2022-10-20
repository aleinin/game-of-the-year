package com.aleinin.goty.properties

import java.time.ZoneId
import java.util.Date

data class PropertiesDocument(
    val id: String,
    val tiePoints: List<Int>,
    val deadlineDate: Date,
    val zoneId: ZoneId,
    val hasGiveaway: Boolean,
    val giveawayAmountUSD: Int
)
