package com.aleinin.goty.configuration

import jakarta.validation.constraints.NotEmpty
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.validation.annotation.Validated

@ConfigurationProperties("goty.admin")
@Validated
data class AdminCredentials(
    @field:NotEmpty
    var apiKey: String? = null
)
