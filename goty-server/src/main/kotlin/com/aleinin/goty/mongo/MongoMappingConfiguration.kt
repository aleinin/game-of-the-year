package com.aleinin.goty.mongo

import org.springframework.context.ApplicationListener
import org.springframework.context.annotation.Configuration
import org.springframework.context.event.ContextRefreshedEvent
import org.springframework.data.mongodb.core.convert.DefaultMongoTypeMapper
import org.springframework.data.mongodb.core.convert.MappingMongoConverter

@Configuration
class MongoMappingConfiguration(
    private val mappingMongoConverter: MappingMongoConverter,
) : ApplicationListener<ContextRefreshedEvent> {

    override fun onApplicationEvent(event: ContextRefreshedEvent) =
        mappingMongoConverter.setTypeMapper(DefaultMongoTypeMapper(null))
}
