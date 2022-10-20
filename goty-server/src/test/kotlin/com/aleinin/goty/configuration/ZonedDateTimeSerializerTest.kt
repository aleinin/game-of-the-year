package com.aleinin.goty.configuration

import com.fasterxml.jackson.core.JsonGenerator
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.ArgumentCaptor
import org.mockito.Captor
import org.mockito.Mock
import org.mockito.Mockito
import org.mockito.junit.jupiter.MockitoExtension
import org.mockito.kotlin.capture
import org.mockito.kotlin.firstValue
import org.mockito.kotlin.times
import java.time.ZoneOffset
import java.time.ZonedDateTime

@ExtendWith(MockitoExtension::class)
internal class ZonedDateTimeSerializerTest {
    @Mock
    lateinit var generator: JsonGenerator

    @Captor
    lateinit var valueCaptor: ArgumentCaptor<String>

    private val serializer = ZonedDateTimeSerializer()

    @Test
    fun `Should serialize ZonedDateTimes and truncate to seconds`() {
        val zonedDateTime = ZonedDateTime.of(
            2022,
            11,
            26,
            4,
            26,
            45,
            14,
            ZoneOffset.ofHours(-5)
        )
        val expected = "2022-11-26T04:26:45-05:00"
        serializer.serialize(zonedDateTime, generator, null)
        Mockito.verify(generator, times(1)).writeString(capture(valueCaptor))
        val actual = valueCaptor.firstValue
        assertEquals(expected, actual)
    }

    @Test
    fun `Should reject value or generator being null`() {
        assertThrows(IllegalArgumentException::class.java) {
            serializer.serialize(null, generator, null)
        }
        assertThrows(IllegalArgumentException::class.java) {
            serializer.serialize(ZonedDateTime.now(), null, null)
        }
    }
}