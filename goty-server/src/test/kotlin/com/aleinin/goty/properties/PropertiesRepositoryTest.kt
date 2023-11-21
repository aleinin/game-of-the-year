package com.aleinin.goty.properties

import com.aleinin.goty.thisYear
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.Mockito
import org.mockito.junit.jupiter.MockitoExtension
import org.mockito.kotlin.whenever
import java.time.ZoneId
import java.time.ZonedDateTime
import java.time.temporal.ChronoUnit
import java.util.Optional

@ExtendWith(MockitoExtension::class)
internal class PropertiesRepositoryTest {
    @Mock
    lateinit var propertiesDocumentRepository: PropertiesDocumentRepository

    @InjectMocks
    lateinit var propertiesRepository: PropertiesRepository

    private val propertiesId = PropertiesRepository.PROPERTIES_ID

    private val deadline = ZonedDateTime.now().plusSeconds(3600).truncatedTo(ChronoUnit.SECONDS)

    @Test
    fun `Should get the Properties`() {
        val mockDocument = PropertiesDocument(
            id = propertiesId,
            gotyYear = deadline.year,
            tiePoints = listOf(3, 2, 1),
            deadline = deadline.toInstant(),
            zoneId = ZoneId.systemDefault(),
            hasGiveaway = true,
            giveawayAmountUSD = 25
        )
        whenever(propertiesDocumentRepository.findById(propertiesId)).thenReturn(Optional.of(mockDocument))
        val expected = Optional.of(
            Properties(
                gotyYear = deadline.year,
                tiePoints = listOf(3, 2, 1),
                deadline = deadline,
                hasGiveaway = true,
                giveawayAmountUSD = 25
            )
        )
        val actual = propertiesRepository.findProperties()
        assertEquals(expected, actual)
    }

    @Test
    fun `Should store Properties`() {
        val expected = Properties(
            gotyYear = thisYear(),
            tiePoints = listOf(3, 2, 1),
            deadline = deadline,
            hasGiveaway = true,
            giveawayAmountUSD = 25
        )
        val expectedDocument = PropertiesDocument(
            id = propertiesId,
            gotyYear = thisYear(),
            tiePoints = listOf(3, 2, 1),
            deadline = deadline.toInstant(),
            zoneId = ZoneId.systemDefault(),
            hasGiveaway = true,
            giveawayAmountUSD = 25
        )
        whenever(propertiesDocumentRepository.save(Mockito.any(PropertiesDocument::class.java))).thenReturn(expectedDocument)
        val actual = propertiesRepository.replaceProperties(expected)
        Mockito.verify(propertiesDocumentRepository, Mockito.times(1)).save(expectedDocument)
        assertEquals(expected, actual)
    }
}
