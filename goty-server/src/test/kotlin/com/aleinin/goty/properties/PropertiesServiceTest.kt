package com.aleinin.goty.properties

import com.aleinin.goty.TimeHelper.Companion.tomorrow
import com.aleinin.goty.configuration.DefaultProperties
import com.aleinin.goty.configuration.toProperties
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mock
import org.mockito.junit.jupiter.MockitoExtension
import org.mockito.kotlin.whenever
import java.util.Optional

@ExtendWith(MockitoExtension::class)
internal class PropertiesServiceTest {
    @Mock
    lateinit var propertiesRepository: PropertiesRepository

    lateinit var propertiesService: PropertiesService

    private val defaultProperties = DefaultProperties(
        tiePoints = listOf(9, 8, 7),
        deadline = tomorrow(),
        hasGiveaway = false,
        giveawayAmountUSD = 0
    )

    @BeforeEach
    fun setUp() {
        propertiesService = PropertiesService(propertiesRepository, defaultProperties)
    }

    @Test
    fun `Should return the stored configuration`() {
        val expectedProperties = Properties(
            tiePoints = listOf(3, 2, 1),
            deadline = tomorrow(),
            hasGiveaway = false,
            giveawayAmountUSD = 0
        )
        whenever(propertiesRepository.findProperties()).thenReturn(Optional.of(expectedProperties))
        val actualConfig = propertiesService.getProperties()
        assertEquals(expectedProperties, actualConfig)
    }

    @Test
    fun `Should load the default values if there is no stored configuration`() {
        whenever(propertiesRepository.findProperties()).thenReturn(Optional.empty())
        val actual = propertiesService.getProperties()
        assertEquals(defaultProperties.toProperties(), actual)
    }

    @Test
    fun `Should accept a new configuration`() {
        val expectedConfig = Properties(
            tiePoints = listOf(6, 5, 4),
            deadline = tomorrow(),
            hasGiveaway = false,
            giveawayAmountUSD = 0
        )
        whenever(propertiesRepository.replaceProperties(expectedConfig)).thenReturn(expectedConfig)
        val actualConfig = propertiesService.replaceProperties(expectedConfig)
        assertEquals(expectedConfig, actualConfig)

    }
}