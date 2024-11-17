package com.aleinin.goty.properties

data class PropertiesResponse(
    val title: ResolvedTemplate,
    val year: Int,
    val gotyQuestion: GotyQuestionResponse,
    val tiePoints: List<Int>,
    val hasGiveaway: Boolean,
    val giveawayAmountUSD: Int,
)
