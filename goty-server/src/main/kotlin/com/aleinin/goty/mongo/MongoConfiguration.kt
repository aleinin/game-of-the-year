package com.aleinin.goty.mongo

import com.mongodb.MongoClientSettings
import org.bson.UuidRepresentation
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Configuration
import org.springframework.data.mongodb.config.AbstractMongoClientConfiguration

@Configuration
class MongoConfiguration(
    @Value("\${spring.data.mongodb.database}") private val databaseName: String,
) : AbstractMongoClientConfiguration() {

    override fun getDatabaseName() = databaseName

    override fun configureClientSettings(builder: MongoClientSettings.Builder) =
        builder.uuidRepresentation(UuidRepresentation.STANDARD).run { }
}
