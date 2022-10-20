package com.aleinin.goty.configuration

import com.fasterxml.jackson.core.JsonGenerator
import com.fasterxml.jackson.databind.JsonSerializer
import com.fasterxml.jackson.databind.SerializerProvider
import java.time.ZonedDateTime
import java.time.temporal.ChronoUnit

class ZonedDateTimeSerializer : JsonSerializer<ZonedDateTime>() {
    override fun serialize(value: ZonedDateTime?, generator: JsonGenerator?, serializers: SerializerProvider?) {
        if (value == null || generator == null) {
            throw IllegalArgumentException("value and generator cannot be null")
        }
        // ISO 8601
        // ex: 2022-10-26T03:42:53+00:00
        generator.writeString(value
            .truncatedTo(ChronoUnit.SECONDS)
            .toOffsetDateTime()
            .toString())
    }
}
