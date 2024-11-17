package com.aleinin.goty.configuration

import jakarta.validation.constraints.Positive
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.validation.annotation.Validated

@ConfigurationProperties("goty.default.active-year")
@Validated
data class DefaultActiveYear(
    @field:Positive
    val year: Int,
)
