package com.aleinin.goty.properties

import com.aleinin.goty.TimeHelper.Companion.tomorrow
import com.aleinin.goty.configuration.DefaultProperties
import com.aleinin.goty.configuration.toProperties
import com.fasterxml.jackson.databind.ObjectMapper
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.ArgumentCaptor
import org.mockito.Captor
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.Mockito
import org.mockito.kotlin.any
import org.mockito.kotlin.capture
import org.mockito.kotlin.firstValue
import org.mockito.kotlin.times
import org.mockito.kotlin.verify
import org.mockito.kotlin.whenever
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.content
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import org.springframework.test.web.servlet.setup.MockMvcBuilders
import java.time.Instant
import java.time.ZoneId
import java.time.temporal.ChronoUnit
import java.util.Date
import java.util.Optional

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
internal class PropertiesControllerTest {
    lateinit var mockMvc: MockMvc

    @Mock
    lateinit var propertiesDocumentRepository: PropertiesDocumentRepository

    @InjectMocks
    lateinit var propertiesRepository: PropertiesRepository

    @Autowired
    lateinit var defaultProperties: DefaultProperties

    @Autowired
    lateinit var objectMapper: ObjectMapper

    @Captor
    lateinit var documentCaptor: ArgumentCaptor<PropertiesDocument>

    private val oneDayInSeconds = (24 * 60 * 60).toLong()

    private val mockPropertiesDocument = PropertiesDocument(
        id = "id",
        tiePoints = listOf(3, 2, 1),
        deadlineDate = Date.from(Instant.now().plusSeconds(oneDayInSeconds)),
        zoneId = ZoneId.systemDefault(),
        hasGiveaway = true,
        giveawayAmountUSD = 0
    )

    @BeforeEach
    fun setup() {
        val propertiesService = PropertiesService(propertiesRepository, defaultProperties)
        mockMvc = MockMvcBuilders.standaloneSetup(PropertiesController(propertiesService)).build()
    }

    @Test
    fun `Should get stored properties if available`() {
        whenever(propertiesDocumentRepository.findById(any())).thenReturn(Optional.of(mockPropertiesDocument))
        val expected = Properties(
            tiePoints = mockPropertiesDocument.tiePoints,
            deadline = mockPropertiesDocument.deadlineDate.toInstant().atZone(mockPropertiesDocument.zoneId),
            hasGiveaway = mockPropertiesDocument.hasGiveaway,
            giveawayAmountUSD = mockPropertiesDocument.giveawayAmountUSD
        )
        val expectedJsonContent = objectMapper.writeValueAsString(expected)
        mockMvc.perform(get("/properties"))
            .andExpect(status().isOk)
            .andExpect(content().json(expectedJsonContent, true))
    }

    @Test
    fun `Should get the default properties if none are stored`() {
        whenever(propertiesDocumentRepository.findById(any())).thenReturn(Optional.empty())
        val expected = defaultProperties.toProperties()
        val expectedJsonContent = objectMapper.writeValueAsString(expected)
        mockMvc.perform(get("/properties"))
            .andExpect(status().isOk)
            .andExpect(content().json(expectedJsonContent, true))
    }

    @Test
    fun `Should replace the properties`() {
        val request = Properties(
            tiePoints = listOf(15, 13, 11),
            deadline = tomorrow().truncatedTo(ChronoUnit.SECONDS),
            hasGiveaway = false,
            giveawayAmountUSD = 15
        )
        val expectedDocument = PropertiesDocument(
            id = PropertiesRepository.PROPERTIES_ID,
            tiePoints = request.tiePoints,
            deadlineDate = Date.from(request.deadline.toInstant()),
            zoneId = request.deadline.offset,
            hasGiveaway = request.hasGiveaway,
            giveawayAmountUSD = request.giveawayAmountUSD
        )
        val requestAsJsonString = objectMapper.writeValueAsString(request)
        whenever(propertiesDocumentRepository.save(Mockito.any(PropertiesDocument::class.java))).thenReturn(expectedDocument)
        mockMvc.perform(put("/properties")
            .contentType(MediaType.APPLICATION_JSON)
            .content(requestAsJsonString))
            .andExpect(status().isOk)
            .andExpect(content().json(requestAsJsonString, true))
        verify(propertiesDocumentRepository, times(1)).save(capture(documentCaptor))
        val actualDocument = documentCaptor.firstValue
        assertEquals(expectedDocument, actualDocument)
    }
}