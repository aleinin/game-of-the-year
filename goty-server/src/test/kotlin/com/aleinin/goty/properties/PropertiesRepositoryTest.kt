package com.aleinin.goty.properties

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.Mockito
import org.mockito.junit.jupiter.MockitoExtension
import org.mockito.kotlin.whenever
import java.time.Instant
import java.time.ZoneId
import java.time.ZonedDateTime
import java.time.temporal.ChronoUnit
import java.util.Date
import java.util.Optional

@ExtendWith(MockitoExtension::class)
internal class PropertiesRepositoryTest {
    @Mock
    lateinit var propertiesDocumentRepository: PropertiesDocumentRepository

    @InjectMocks
    lateinit var propertiesRepository: PropertiesRepository

    private val propertiesId = PropertiesRepository.PROPERTIES_ID

    @Test
    fun `Should get the Properties`() {
        val (deadline, deadlineDate) = generateTimes()
        val mockDocument = PropertiesDocument(
            id = propertiesId,
            tiePoints = listOf(3, 2, 1),
            deadlineDate = deadlineDate,
            zoneId = ZoneId.systemDefault(),
            hasGiveaway = true,
            giveawayAmountUSD = 25
        )
        whenever(propertiesDocumentRepository.findById(propertiesId)).thenReturn(Optional.of(mockDocument))
        val expected = Optional.of(
            Properties(
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
        val (deadline, deadlineDate) = generateTimes()
        val expected = Properties(
            tiePoints = listOf(3, 2, 1),
            deadline = deadline,
            hasGiveaway = true,
            giveawayAmountUSD = 25
        )
        val expectedDocument = PropertiesDocument(
            id = propertiesId,
            tiePoints = listOf(3, 2, 1),
            deadlineDate = deadlineDate,
            zoneId = ZoneId.systemDefault(),
            hasGiveaway = true,
            giveawayAmountUSD = 25
        )
        whenever(propertiesDocumentRepository.save(Mockito.any(PropertiesDocument::class.java))).thenReturn(expectedDocument)
        val actual = propertiesRepository.replaceProperties(expected)
        Mockito.verify(propertiesDocumentRepository, Mockito.times(1)).save(expectedDocument)
        assertEquals(expected, actual)
    }

    private fun generateTimes(): Pair<ZonedDateTime, Date> {
        val time = Instant.now().plusSeconds(3600).truncatedTo(ChronoUnit.SECONDS)
        return Pair(time.atZone(ZoneId.systemDefault()), Date.from(time))
    }
}