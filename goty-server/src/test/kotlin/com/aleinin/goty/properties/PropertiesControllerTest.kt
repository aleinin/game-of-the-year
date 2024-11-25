package com.aleinin.goty.properties

import PropertiesUpdateRequest
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
    private lateinit var templateService: TemplateService

    @Autowired
    lateinit var mockMvc: MockMvc

    @MockBean
    lateinit var propertiesRepository: PropertiesRepository

    @MockBean
    lateinit var activeYearRepository: ActiveYearRepository

    @Autowired
    lateinit var defaultProperties: DefaultProperties

    @Autowired
    lateinit var objectMapper: ObjectMapper

    @Captor
    lateinit var documentCaptor: ArgumentCaptor<PropertiesDocument>

    private val deadline = ZonedDateTime.of(2023, 11, 24, 0, 0, 0, 0, UTC).truncatedTo(ChronoUnit.SECONDS)

    private val mockPropertiesDocument = PropertiesDocument(
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

    private val basicUpdateRequest = PropertiesUpdateRequest(
        title = basicRequest.title,
        gotyQuestion = basicRequest.gotyQuestion,
        tiePoints = basicRequest.tiePoints,
        deadline = basicRequest.deadline,
        hasGiveaway = basicRequest.hasGiveaway,
        giveawayAmountUSD = basicRequest.giveawayAmountUSD,
        defaultLocalTimeZone = basicRequest.defaultLocalTimeZone
    )

    @Test
    fun `Should get properties response from database if available`() {
        val year = mockPropertiesDocument.year
        whenever(propertiesRepository.findByYear(year)).thenReturn(Optional.of(mockPropertiesDocument))
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
        mockMvc.perform(get("/properties/$year"))
            .andExpect(status().isOk)
            .andExpect(content().json(expectedJsonContent, true))
    }

    @Test
    fun `Should get the default properties if none are stored`() {
        whenever(propertiesRepository.findById(any())).thenReturn(Optional.empty())
        val default = defaultProperties.toProperties()
        val expected = PropertiesResponse(
            title = templateService.toResolvedTemplate(default.title, default, null),
            year = default.year,
            gotyQuestion = GotyQuestionResponse(
                templateService.toResolvedTemplate(default.gotyQuestion.title, default, null),
                ResolvedTemplate(default.gotyQuestion.question, "What are your favorite game(s) of ${defaultProperties.year}?"),
                defaultProperties.gotyQuestion.rules.map {
                    templateService.toResolvedTemplate(it, default, null)
                }
            ),
            tiePoints = default.tiePoints,
            deadline = default.deadline,
            hasGiveaway = default.hasGiveaway,
            giveawayAmountUSD = default.giveawayAmountUSD,
            defaultLocalTimeZone = default.defaultLocalTimeZone
        )
        val expectedJsonContent = objectMapper.writeValueAsString(expected)
        mockMvc.perform(get("/properties/active"))
            .andExpect(status().isOk)
            .andExpect(content().json(expectedJsonContent, true))
    }

    @Test
    @WithMockUser(roles = ["ADMIN"])
    fun `Should replace the properties`() {
        val expectedDocument = PropertiesDocument(
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
        val requestAsJsonString = objectMapper.writeValueAsString(basicUpdateRequest)
        val responseAsJsonString = objectMapper.writeValueAsString(expectedResponse)
        whenever(propertiesRepository.findByYear(expectedDocument.year)).thenReturn(Optional.of(mockPropertiesDocument))
        whenever(propertiesRepository.save(Mockito.any(PropertiesDocument::class.java))).thenReturn(expectedDocument)
        mockMvc.perform(put("/properties/${expectedDocument.year}")
            .contentType(MediaType.APPLICATION_JSON)
            .content(requestAsJsonString))
            .andExpect(status().isOk)
            .andExpect(content().json(responseAsJsonString, true))
        verify(propertiesRepository, times(1)).save(capture(documentCaptor))
        val actualDocument = documentCaptor.firstValue
        assertEquals(expectedDocument, actualDocument)
    }

    @Test
    fun `Should require authentication to replace properties`() {
        val requestAsJsonString = objectMapper.writeValueAsString(basicUpdateRequest)
        mockMvc.perform(put("/properties/2024")
            .contentType(MediaType.APPLICATION_JSON)
            .content(requestAsJsonString))
            .andExpect(status().isUnauthorized)
    }

    @Test
    @WithMockUser(roles = ["USER"])
    fun `Should only allow admins to replace properties`() {
        val requestAsJsonString = objectMapper.writeValueAsString(basicUpdateRequest)
        mockMvc.perform(put("/properties/2024")
            .contentType(MediaType.APPLICATION_JSON)
            .content(requestAsJsonString))
            .andExpect(status().isForbidden)
    }
}
