package com.aleinin.goty.mongo

import org.bson.UuidRepresentation
import org.springframework.boot.autoconfigure.mongo.MongoClientSettingsBuilderCustomizer
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class MongoClientConfiguration {

    @Bean
    fun customizer() = MongoClientSettingsBuilderCustomizer { it.uuidRepresentation(UuidRepresentation.STANDARD) }
}
