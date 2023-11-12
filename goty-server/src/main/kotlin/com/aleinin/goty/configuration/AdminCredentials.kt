package com.aleinin.goty.configuration

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.validation.annotation.Validated
import jakarta.validation.constraints.NotEmpty

@ConfigurationProperties("goty.admin")
@Validated
data class AdminCredentials(
    @field:NotEmpty
    var username: String? = null,

    @field:NotEmpty
    var password: String? = null
)
