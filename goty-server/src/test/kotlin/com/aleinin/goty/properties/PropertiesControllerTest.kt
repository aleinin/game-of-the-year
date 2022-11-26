package com.aleinin.goty.properties

import com.aleinin.goty.configuration.DefaultProperties
import com.aleinin.goty.configuration.toProperties
import com.aleinin.goty.thisYear
import com.aleinin.goty.tomorrow
import com.fasterxml.jackson.databind.ObjectMapper
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.mockito.ArgumentCaptor
import org.mockito.Captor
import org.mockito.Mockito
import org.mockito.kotlin.any
import org.mockito.kotlin.capture
import org.mockito.kotlin.firstValue
import org.mockito.kotlin.times
import org.mockito.kotlin.verify
import org.mockito.kotlin.whenever
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.http.MediaType
import org.springframework.security.test.context.support.WithMockUser
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.content
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import java.time.ZoneId
import java.time.temporal.ChronoUnit
import java.util.Optional

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
internal class PropertiesControllerTest {

    @Autowired
    lateinit var mockMvc: MockMvc

    @MockBean
    lateinit var propertiesDocumentRepository: PropertiesDocumentRepository

    @Autowired
    lateinit var defaultProperties: DefaultProperties

    @Autowired
    lateinit var objectMapper: ObjectMapper

    @Captor
    lateinit var documentCaptor: ArgumentCaptor<PropertiesDocument>

    private val mockPropertiesDocument = PropertiesDocument(
        id = "id",
        gotyYear = thisYear(),
        tiePoints = listOf(3, 2, 1),
        deadline = tomorrow().toInstant(),
        zoneId = ZoneId.systemDefault(),
        hasGiveaway = true,
        giveawayAmountUSD = 0
    )

    private val basicRequest = Properties(
        gotyYear = thisYear(),
        tiePoints = listOf(15, 13, 11),
        deadline = tomorrow().truncatedTo(ChronoUnit.SECONDS),
        hasGiveaway = false,
        giveawayAmountUSD = 15
    )

    @Test
    fun `Should get stored properties if available`() {
        whenever(propertiesDocumentRepository.findById(any())).thenReturn(Optional.of(mockPropertiesDocument))
        val expected = Properties(
            gotyYear = mockPropertiesDocument.gotyYear,
            tiePoints = mockPropertiesDocument.tiePoints,
            deadline = mockPropertiesDocument.deadline.atZone(mockPropertiesDocument.zoneId),
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
    @WithMockUser(roles = ["ADMIN"])
    fun `Should replace the properties`() {
        val expectedDocument = PropertiesDocument(
            id = PropertiesRepository.PROPERTIES_ID,
            gotyYear = basicRequest.gotyYear,
            tiePoints = basicRequest.tiePoints,
            deadline = basicRequest.deadline.toInstant(),
            zoneId = basicRequest.deadline.zone,
            hasGiveaway = basicRequest.hasGiveaway,
            giveawayAmountUSD = basicRequest.giveawayAmountUSD
        )
        val requestAsJsonString = objectMapper.writeValueAsString(basicRequest)
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

    @Test
    fun `Should require authentication to replace properties`() {
        val requestAsJsonString = objectMapper.writeValueAsString(basicRequest)
        mockMvc.perform(put("/properties")
            .contentType(MediaType.APPLICATION_JSON)
            .content(requestAsJsonString))
            .andExpect(status().isUnauthorized)
    }

    @Test
    @WithMockUser(roles = ["USER"])
    fun `Should only allow admins to replace properties`() {
        val requestAsJsonString = objectMapper.writeValueAsString(basicRequest)
        mockMvc.perform(put("/properties")
            .contentType(MediaType.APPLICATION_JSON)
            .content(requestAsJsonString))
            .andExpect(status().isForbidden)
    }
}