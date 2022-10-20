package com.aleinin.goty.configuration

import com.fasterxml.jackson.core.JsonParser
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mock
import org.mockito.junit.jupiter.MockitoExtension
import org.mockito.kotlin.whenever
import java.time.ZoneId
import java.time.ZonedDateTime
import java.time.format.DateTimeParseException

@ExtendWith(MockitoExtension::class)
internal class ZonedDateTimeDeserializerTest {
    @Mock
    lateinit var jsonParser: JsonParser

    val deserializer = ZonedDateTimeDeserializer()

    @Test
    fun `Should accept supported ISO-8061 compliant strings`() {
        var actual: ZonedDateTime
        val tests: List<Pair<String, ZonedDateTime>> = listOf(
            generateZonedDateTimes("+0200"),
            generateZonedDateTimes("+02:00"),
            generateZonedDateTimes("-0200"),
            generateZonedDateTimes("-02:00"),
            generateZonedDateTimes(offset = "Z", micros = "123456"),
            generateZonedDateTimes("Z")
        )
        tests.forEach {
            whenever(jsonParser.readValueAs(String::class.java)).thenReturn(it.first)
            actual = deserializer.deserialize(jsonParser, null)
            assertEquals(it.second, actual)
        }
    }

    @Test
    fun `Should reject jsonParser being null`() {
        assertThrows(IllegalArgumentException::class.java) {
            deserializer.deserialize(null, null)
        }
    }

    @Test
    fun `Should throw if unsupported string`() {
        whenever(jsonParser.readValueAs(String::class.java)).thenReturn("2022-10-26T10:20:30")
        assertThrows(DateTimeParseException::class.java) {
            deserializer.deserialize(jsonParser, null)
        }
    }

    private fun generateZonedDateTimes(
        offset: String,
        year: String = "2022",
        month: String = "10",
        day: String = "26",
        hour: String = "15",
        minute: String = "31",
        second: String = "05",
        micros: String = "0"
    ) = Pair(
        "$year-$month-${day}T$hour:$minute:$second${getMicros(micros)}$offset",
        ZonedDateTime.of(
            year.toInt(),
            month.toInt(),
            day.toInt(),
            hour.toInt(),
            minute.toInt(),
            second.toInt(),
            micros.toInt() * 1000,
            ZoneId.of(offset)
        )
    )

    private fun getMicros(micros: String) = if (micros.isNotBlank()) ".$micros" else ""
}