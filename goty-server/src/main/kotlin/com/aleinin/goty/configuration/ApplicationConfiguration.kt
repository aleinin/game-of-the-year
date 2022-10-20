package com.aleinin.goty.configuration

import com.aleinin.goty.properties.Properties
import com.aleinin.goty.properties.PropertiesService
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import java.time.Clock

@Configuration
class ApplicationConfiguration {

    @Bean
    fun objectMapper(): ObjectMapper = jacksonObjectMapper()

    @Bean
    fun clock(): Clock = Clock.systemDefaultZone()

    @Bean
    fun properties(propertiesService: PropertiesService): Properties = propertiesService.getProperties()
}
