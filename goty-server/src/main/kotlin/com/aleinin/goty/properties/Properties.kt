package com.aleinin.goty.properties

import java.time.ZoneId
import java.time.ZonedDateTime

data class Properties(
    val title: String,
    val year: Int,
    val searchYears: List<Int>?,
    val gotyQuestion: GotyQuestion,
    val tiePoints: List<Int>,
    val deadline: ZonedDateTime,
    val hasGiveaway: Boolean,
    val giveawayAmountUSD: Int,
    val defaultLocalTimeZone: ZoneId?
) {
    init {
        require(tiePoints.isNotEmpty()) { "tiePoints must not be empty" }
        require(tiePoints.sortedDescending() == tiePoints) { "tiePoints must be in descending order"}
    }
}