package com.aleinin.goty.properties

import com.aleinin.goty.configuration.ZonedDateTimeDeserializer
import com.aleinin.goty.configuration.ZonedDateTimeSerializer
import com.fasterxml.jackson.databind.annotation.JsonDeserialize
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import org.springframework.format.annotation.DateTimeFormat
import java.time.Instant
import java.time.ZonedDateTime

data class Properties(
    val tiePoints: List<Int>,
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    @JsonDeserialize(using = ZonedDateTimeDeserializer::class)
    @JsonSerialize(using = ZonedDateTimeSerializer::class)
    val deadline: ZonedDateTime,
    val hasGiveaway: Boolean,
    val giveawayAmountUSD: Int,
) {
    init {
        require(tiePoints.isNotEmpty()) { "tiePoints must not be empty" }
        require(tiePoints.sortedDescending() == tiePoints) { "tiePoints must be in descending order"}
        require(giveawayAmountUSD >= 0) { "giveawayAmountUSD must be greater than or equal to 0" }
        require(Instant.now().atZone(deadline.zone).isBefore(deadline)) { "deadline cannot be in the past" }
    }
}