package com.aleinin.goty.configuration

import com.fasterxml.jackson.core.JsonParser
import com.fasterxml.jackson.databind.DeserializationContext
import com.fasterxml.jackson.databind.JsonDeserializer
import java.time.ZonedDateTime
import java.time.format.DateTimeFormatter
import java.time.format.DateTimeFormatterBuilder

class ZonedDateTimeDeserializer : JsonDeserializer<ZonedDateTime>() {
    companion object {
        private val formatter = DateTimeFormatterBuilder()
            .appendPattern("['T'][' ']")
            .append(DateTimeFormatter.ISO_DATE_TIME)
            .appendPattern("[XX][XXX]")
            .toFormatter()
    }
    override fun deserialize(parser: JsonParser?, context: DeserializationContext?): ZonedDateTime {
        if (parser == null) {
            throw IllegalArgumentException("parser cannot be null")
        }
        val time = parser.readValueAs(String::class.java)
        return formatter.parse(time, ZonedDateTime::from)
    }
}
