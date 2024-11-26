package com.aleinin.goty.properties

import java.time.ZoneId
import java.time.ZonedDateTime

data class PropertiesResponse(
    val title: ResolvedTemplate,
    val year: String,
    val searchYears: List<Int>?,
    val gotyQuestion: GotyQuestionResponse,
    val tiePoints: List<Int>,
    val deadline: ZonedDateTime,
    val hasGiveaway: Boolean,
    val giveawayAmountUSD: Int,
    val defaultLocalTimeZone: ZoneId?
)
