package com.aleinin.goty.configuration

import com.aleinin.goty.properties.Properties
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.format.annotation.DateTimeFormat
import org.springframework.validation.annotation.Validated
import java.time.ZonedDateTime
import jakarta.validation.constraints.NotEmpty
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.PositiveOrZero

fun DefaultProperties.toProperties() = Properties(
    gotyYear = this.gotyYear,
    tiePoints = this.tiePoints,
    deadline = this.deadline,
    hasGiveaway = this.hasGiveaway,
    giveawayAmountUSD = this.giveawayAmountUSD
)


@ConfigurationProperties("goty.default")
@Validated
data class DefaultProperties(
    @field:NotNull
    val gotyYear: Int,

    @field:NotEmpty
    val tiePoints: List<Int>,

    @field:NotNull
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) val deadline: ZonedDateTime,

    @field:NotNull
    val hasGiveaway: Boolean,

    @field:PositiveOrZero
    val giveawayAmountUSD: Int,
)