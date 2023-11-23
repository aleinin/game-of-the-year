package com.aleinin.goty.result

import com.aleinin.goty.properties.Properties
import com.aleinin.goty.properties.PropertiesService
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.junit.jupiter.MockitoExtension
import org.mockito.kotlin.whenever

@ExtendWith(MockitoExtension::class)
internal class PointsServiceTest {
    @Mock
    lateinit var properties: Properties

    @Mock
    lateinit var propertiesService: PropertiesService

    @InjectMocks
    lateinit var pointService: PointsService

    private val mockTiePoints = listOf(25, 20, 15, 10, 5)

    @BeforeEach
    fun setup() {
        whenever(propertiesService.getProperties()).thenReturn(properties)
        whenever(properties.tiePoints).thenReturn(mockTiePoints)
    }

    @Test
    fun `Should handle valid ranks`() {
        val validRanks = listOf(3, 0, 2, 1, 4)
        val expected = listOf(10, 25, 15, 20, 5)
        val actual = validRanks.map { pointService.calculatePoints(it) }
        assertEquals(expected, actual)
    }

    @Test
    fun `Should handle invalid ranks`() {
        val validRanks = mockTiePoints.indices
        val invalidRanks = listOf(validRanks.first - 1, validRanks.last + 1)
        val expected = listOf(0, 0)
        val actual = invalidRanks.map { pointService.calculatePoints(it) }
        assertEquals(expected, actual)
    }
}
