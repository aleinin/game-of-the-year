package com.aleinin.goty.properties

import java.time.ZonedDateTime

data class Properties(
    val gotyYear: Int,
    val tiePoints: List<Int>,
    val deadline: ZonedDateTime,
    val hasGiveaway: Boolean,
    val giveawayAmountUSD: Int,
) {
    init {
        require(tiePoints.isNotEmpty()) { "tiePoints must not be empty" }
        require(tiePoints.sortedDescending() == tiePoints) { "tiePoints must be in descending order"}
        require(giveawayAmountUSD >= 0) { "giveawayAmountUSD must be greater than or equal to 0" }
        require(ZonedDateTime.now().isBefore(deadline)) { "deadline cannot be in the past" }
    }
}