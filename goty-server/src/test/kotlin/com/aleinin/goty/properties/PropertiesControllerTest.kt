package com.aleinin.goty.properties

import com.aleinin.goty.UTC
import com.aleinin.goty.configuration.DefaultProperties
import com.aleinin.goty.configuration.toProperties
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
import java.time.ZonedDateTime
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

    private val deadline = ZonedDateTime.of(2023, 11, 24, 0, 0, 0, 0, UTC).truncatedTo(ChronoUnit.SECONDS)


    private val mockPropertiesDocument = PropertiesDocument(
        id = "id",
        title = "goty",
        year = 2050,
        gotyQuestion = GotyQuestion("title", "question", emptyList()),
        tiePoints = listOf(3, 2, 1),
        deadline = deadline.toInstant(),
        zoneId = UTC,
        hasGiveaway = true,
        giveawayAmountUSD = 0,
        defaultLocalTimeZone = UTC
    )

    private val basicRequest = Properties(
        title = "goty",
        year = 2050,
        gotyQuestion = GotyQuestion("title", "question", emptyList()),
        tiePoints = listOf(15, 13, 11),
        deadline = deadline,
        hasGiveaway = false,
        giveawayAmountUSD = 15,
        defaultLocalTimeZone = UTC
    )

    @Test
    fun `Should get properties response from database if available`() {
        whenever(propertiesDocumentRepository.findById(any())).thenReturn(Optional.of(mockPropertiesDocument))
        val expected = PropertiesResponse(
            title = ResolvedTemplate(mockPropertiesDocument.title, mockPropertiesDocument.title),
            year = mockPropertiesDocument.year,
            gotyQuestion = GotyQuestionResponse(
                ResolvedTemplate(mockPropertiesDocument.gotyQuestion.title, mockPropertiesDocument.gotyQuestion.title),
                ResolvedTemplate(mockPropertiesDocument.gotyQuestion.question, mockPropertiesDocument.gotyQuestion.question),
                emptyList()
            ),
            tiePoints = mockPropertiesDocument.tiePoints,
            deadline = mockPropertiesDocument.deadline.atZone(mockPropertiesDocument.zoneId),
            hasGiveaway = mockPropertiesDocument.hasGiveaway,
            giveawayAmountUSD = mockPropertiesDocument.giveawayAmountUSD,
            defaultLocalTimeZone = mockPropertiesDocument.defaultLocalTimeZone
        )
        val expectedJsonContent = objectMapper.writeValueAsString(expected)
        mockMvc.perform(get("/properties"))
            .andExpect(status().isOk)
            .andExpect(content().json(expectedJsonContent, true))
    }

    @Test
    fun `Should get the default properties if none are stored`() {
        whenever(propertiesDocumentRepository.findById(any())).thenReturn(Optional.empty())
        val default = defaultProperties.toProperties()
        val rule = defaultProperties.gotyQuestion.rules[0]
        val expected = PropertiesResponse(
            title = ResolvedTemplate(default.title, default.title),
            year = default.year,
            gotyQuestion = GotyQuestionResponse(
                ResolvedTemplate(default.gotyQuestion.title, default.gotyQuestion.title),
                ResolvedTemplate(default.gotyQuestion.question, "What are your favorite game(s) of ${defaultProperties.year}?"),
                listOf(ResolvedTemplate(rule, rule))
            ),
            tiePoints = default.tiePoints,
            deadline = default.deadline,
            hasGiveaway = default.hasGiveaway,
            giveawayAmountUSD = default.giveawayAmountUSD,
            defaultLocalTimeZone = default.defaultLocalTimeZone
        )
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
            title = basicRequest.title,
            gotyQuestion = GotyQuestion(basicRequest.gotyQuestion.title, basicRequest.gotyQuestion.question, basicRequest.gotyQuestion.rules),
            year = basicRequest.year,
            tiePoints = basicRequest.tiePoints,
            deadline = basicRequest.deadline.toInstant(),
            zoneId = basicRequest.deadline.zone,
            hasGiveaway = basicRequest.hasGiveaway,
            giveawayAmountUSD = basicRequest.giveawayAmountUSD,
            defaultLocalTimeZone = basicRequest.defaultLocalTimeZone
        )
        val expectedResponse = PropertiesResponse(
            title = ResolvedTemplate(basicRequest.title, basicRequest.title),
            gotyQuestion = GotyQuestionResponse(
                ResolvedTemplate(basicRequest.gotyQuestion.title, basicRequest.gotyQuestion.title),
                ResolvedTemplate(basicRequest.gotyQuestion.question, basicRequest.gotyQuestion.question),
                emptyList()
            ),
            year = basicRequest.year,
            tiePoints = basicRequest.tiePoints,
            deadline = basicRequest.deadline,
            hasGiveaway = basicRequest.hasGiveaway,
            giveawayAmountUSD = basicRequest.giveawayAmountUSD,
            defaultLocalTimeZone = basicRequest.defaultLocalTimeZone
        )
        val requestAsJsonString = objectMapper.writeValueAsString(basicRequest)
        val responseAsJsonString = objectMapper.writeValueAsString(expectedResponse)
        whenever(propertiesDocumentRepository.save(Mockito.any(PropertiesDocument::class.java))).thenReturn(expectedDocument)
        mockMvc.perform(put("/properties")
            .contentType(MediaType.APPLICATION_JSON)
            .content(requestAsJsonString))
            .andExpect(status().isOk)
            .andExpect(content().json(responseAsJsonString, true))
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
