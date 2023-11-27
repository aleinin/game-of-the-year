package com.aleinin.goty.configuration

import com.aleinin.goty.properties.GotyQuestion
import com.aleinin.goty.properties.Properties
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import java.time.ZoneId
import java.time.ZonedDateTime


internal class DefaultPropertiesTest {
    @Test
    fun `Should convert DefaultProperties to Properties`() {
        val defaultProperties = DefaultProperties(
            title = "Hello",
            gotyQuestion = GotyQuestion(title = "GOTY", question = "?", rules = listOf("None!")),
            year = 2022,
            tiePoints = listOf(3, 2, 1),
            deadline = ZonedDateTime.of(2023, 1, 1, 0, 0, 0, 0, ZoneId.of("UTC")),
            hasGiveaway = true,
            defaultLocalTimeZone = ZoneId.of("Etc/GMT"),
            giveawayAmountUSD = 5
        )
        val expected = Properties(
            title = defaultProperties.title,
            gotyQuestion = defaultProperties.gotyQuestion,
            year = defaultProperties.year,
            tiePoints = defaultProperties.tiePoints,
            deadline = defaultProperties.deadline,
            hasGiveaway = defaultProperties.hasGiveaway,
            giveawayAmountUSD = defaultProperties.giveawayAmountUSD,
            defaultLocalTimeZone = defaultProperties.defaultLocalTimeZone
        )
        val actual = defaultProperties.toProperties()
        assertEquals(expected, actual)
    }
}
