package com.aleinin.goty.configuration

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import java.time.Clock

@Configuration
class ApplicationConfiguration {

    @Bean
    fun objectMapper() = jacksonObjectMapper()

    @Bean
    fun clock(): Clock = Clock.systemDefaultZone()
}
