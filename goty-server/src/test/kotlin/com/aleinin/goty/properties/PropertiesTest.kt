package com.aleinin.goty.properties

import com.aleinin.goty.UTC
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.Test
import java.time.ZonedDateTime

internal class PropertiesTest {
    private val testTime = ZonedDateTime.of(2023, 11, 24, 0, 0, 0, 0, UTC)
    @Test
    fun `Should not allow empty lists for tiePoints`() {
        assertThrows(IllegalArgumentException::class.java) {
            Properties(
                title = "",
                year = 2023,
                gotyQuestion = GotyQuestion("", "", emptyList()),
                tiePoints = emptyList(),
                hasGiveaway = false,
                giveawayAmountUSD = 0,
                deadline = testTime,
                defaultLocalTimeZone = null
            )
        }
    }

    @Test
    fun `Should not allow tiePoints in a non-descending order`() {
        assertThrows(IllegalArgumentException::class.java) {
            Properties(
                title = "",
                year = 2023,
                gotyQuestion = GotyQuestion("", "", emptyList()),
                tiePoints = listOf(3, 1, 2),
                hasGiveaway = false,
                giveawayAmountUSD = 0,
                deadline = testTime,
                defaultLocalTimeZone = null
            )
        }
    }

    @Test
    fun `Should accept valid props`() {
        val actual = Properties(
            title =  "",
            gotyQuestion = GotyQuestion("", "", emptyList()),
            year = 2023,
            tiePoints = listOf(3, 2, 1),
            hasGiveaway = false,
            giveawayAmountUSD = 0,
            defaultLocalTimeZone = null,
            deadline = testTime
        )
        assertNotNull(actual)
    }
}
