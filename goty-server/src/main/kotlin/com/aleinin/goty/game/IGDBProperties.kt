package com.aleinin.goty.game

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.context.annotation.Profile
import org.springframework.validation.annotation.Validated
import javax.validation.constraints.NotEmpty

@ConfigurationProperties("goty.igdb")
@Profile("prod")
@Validated
data class IGDBProperties(
    @field:NotEmpty
    var twitchClientId: String? = null,

    @field:NotEmpty
    var twitchClientSecret: String? = null
)
