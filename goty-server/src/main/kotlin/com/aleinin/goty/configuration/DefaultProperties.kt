package com.aleinin.goty.configuration

import com.aleinin.goty.properties.GotyQuestion
import com.aleinin.goty.properties.Properties
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.format.annotation.DateTimeFormat
import org.springframework.validation.annotation.Validated
import java.time.ZonedDateTime
import jakarta.validation.constraints.NotEmpty
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Positive
import jakarta.validation.constraints.PositiveOrZero
import java.time.ZoneId

fun DefaultProperties.toProperties() = Properties(
    title = this.title,
    gotyQuestion = this.gotyQuestion,
    year = this.year,
    tiePoints = this.tiePoints,
    deadline = this.deadline,
    hasGiveaway = this.hasGiveaway,
    giveawayAmountUSD = this.giveawayAmountUSD,
    defaultLocalTimeZone = this.defaultLocalTimeZone,
)

@ConfigurationProperties("goty.default.properties")
@Validated
data class DefaultProperties(
    @field:NotNull
    val title: String,

    @field:NotNull
    val gotyQuestion: GotyQuestion,

    @field:Positive
    val year: Int,

    @field:NotEmpty
    val tiePoints: List<Int>,

    @field:NotNull
    val defaultLocalTimeZone: ZoneId,

    @field:NotNull
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) val deadline: ZonedDateTime,

    @field:NotNull
    val hasGiveaway: Boolean,

    @field:PositiveOrZero
    val giveawayAmountUSD: Int,
)
