package com.aleinin.goty.configuration

import com.aleinin.goty.TimeHelper.Companion.tomorrow
import com.aleinin.goty.properties.Properties
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test


internal class DefaultPropertiesTest {
    @Test
    fun `Should convert DefaultProperties to Properties`() {
        val defaultProperties = DefaultProperties(
            tiePoints = listOf(3, 2, 1),
            deadline = tomorrow(),
            hasGiveaway = true,
            giveawayAmountUSD = 5
        )
        val expected = Properties(
            tiePoints = defaultProperties.tiePoints,
            deadline = defaultProperties.deadline,
            defaultProperties.hasGiveaway,
            defaultProperties.giveawayAmountUSD
        )
        val actual = defaultProperties.toProperties()
        assertEquals(expected, actual)
    }
}