package com.aleinin.goty.result

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

internal class PointsServiceTest {
    private val pointService = PointsService()

    @Test
    fun `Should handle valid ranks`() {
        val validRanks = (0..9 ).toList()
        val expected = listOf(15, 13, 11, 7, 6, 5, 4, 3, 2, 1)
        val actual = validRanks.map { pointService.calculatePoints(it) }
        assertEquals(expected, actual)
    }

    @Test
    fun `Should handle invalid ranks`() {
        val invalidRanks = listOf(-1, 10)
        val expected = listOf(0, 0)
        val actual = invalidRanks.map { pointService.calculatePoints(it) }
        assertEquals(expected, actual)
    }
}