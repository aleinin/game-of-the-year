package com.aleinin.goty.objectmapper

import com.fasterxml.jackson.databind.json.JsonMapper
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class ObjectMapperConfiguration {

    @Bean
    fun objectMapper() = JsonMapper.builder().build()!!
}
