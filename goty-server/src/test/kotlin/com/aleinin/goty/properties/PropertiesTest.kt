package com.aleinin.goty.properties

import com.aleinin.goty.tomorrow
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.Test
import java.time.ZonedDateTime

internal class PropertiesTest {
    @Test
    fun `Should not allow empty lists for tiePoints`() {
        assertThrows(IllegalArgumentException::class.java) {
            Properties(
                tiePoints = listOf(),
                hasGiveaway = false,
                giveawayAmountUSD = 0,
                deadline = tomorrow()
            )
        }
    }

    @Test
    fun `Should not allow tiePoints in a non-descending order`() {
        assertThrows(IllegalArgumentException::class.java) {
            Properties(
                tiePoints = listOf(3, 1, 2),
                hasGiveaway = false,
                giveawayAmountUSD = 0,
                deadline = tomorrow()
            )
        }
    }

    @Test
    fun `Should not allow negative giveAwayAmountUSD`() {
        assertThrows(IllegalArgumentException::class.java) {
            Properties(
                tiePoints = listOf(3, 2, 1),
                hasGiveaway = false,
                giveawayAmountUSD = -1,
                deadline = tomorrow()
            )
        }
    }

    @Test
    fun `Should not allow deadlines in the past`() {
        assertThrows(IllegalArgumentException::class.java) {
            Properties(
                tiePoints = listOf(3, 2, 1),
                hasGiveaway = false,
                giveawayAmountUSD = -1,
                deadline = ZonedDateTime.now()
            )
        }
    }

    @Test
    fun `Should accept valid props`() {
        val actual = Properties(
            tiePoints = listOf(3, 2, 1),
            hasGiveaway = false,
            giveawayAmountUSD = 0,
            deadline = tomorrow()
        )
        assertNotNull(actual)
    }
}