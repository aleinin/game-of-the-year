package com.aleinin.goty.csv

import com.aleinin.goty.SubmissionDataHelper
import com.aleinin.goty.configuration.DefaultProperties
import com.aleinin.goty.csv.CSVData.Companion.assertEqualNormalizeLineEnds
import com.aleinin.goty.properties.ActiveYearDocument
import com.aleinin.goty.properties.ActiveYearRepository
import com.aleinin.goty.properties.GotyQuestion
import com.aleinin.goty.properties.PropertiesDocument
import com.aleinin.goty.properties.PropertiesRepository
import com.aleinin.goty.properties.PropertiesService
import com.aleinin.goty.submission.SecretSubmissionRepository
import org.junit.jupiter.api.Test
import org.mockito.kotlin.eq
import org.mockito.kotlin.whenever
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import java.util.Optional
import java.util.UUID

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@EnableConfigurationProperties
class CSVControllerTest {
    @Autowired
    lateinit var mockMvc: MockMvc

    @Autowired lateinit var defaultProperties: DefaultProperties

    @MockBean
    lateinit var propertiesRepository: PropertiesRepository

    @MockBean
    lateinit var activeYearRepository: ActiveYearRepository

    @MockBean
    lateinit var secretSubmissionRepository: SecretSubmissionRepository

    @Test
    fun `Should get CSV`() {
        val expectedYear = defaultProperties.year
        whenever(activeYearRepository.findById(PropertiesService.ACTIVE_YEAR_ID)).thenReturn(Optional.of(
            ActiveYearDocument(PropertiesService.ACTIVE_YEAR_ID, expectedYear)
        ))
        whenever(propertiesRepository.findByYear(expectedYear)).thenReturn(Optional.of(PropertiesDocument(
                year = expectedYear,
                title = "My Title",
                gotyQuestion = GotyQuestion(
                        question = "What is your game of the year?",
                        title = "Game of the Year",
                        rules = emptyList()
                ),
                tiePoints = listOf(15, 13, 11, 7, 6, 5, 4, 3, 2, 1),
                giveawayAmountUSD = 100,
                hasGiveaway = true,
                deadline = defaultProperties.deadline.toInstant(),
                zoneId = defaultProperties.deadline.zone,
                defaultLocalTimeZone = defaultProperties.defaultLocalTimeZone
        )))
        val expectedUUIDs = listOf(
                UUID.fromString("f11186fe-3cfb-44cb-a429-67005ab60584"),
                UUID.fromString("98a8332d-1f2c-47ed-a9a0-fd2a36467d8f"),
                UUID.fromString("a8665bae-d4c0-4349-99e4-f054649903e8"),
                UUID.fromString("0ffefab3-2dc5-4218-9a6a-b06287934d08"),
        )
        val secretSubmissions = SubmissionDataHelper.secret(SubmissionDataHelper.everything(expectedYear)
                .mapIndexed() { index, submission ->  submission.copy(
                    id=expectedUUIDs[index],
                    updatedOn=0,
                    enteredOn=0
                )}
        )
        whenever(secretSubmissionRepository.findByYear(eq(expectedYear))).thenReturn(secretSubmissions)
        val expected = CSVData.fullCSV(expectedYear)
        val actions = mockMvc.perform(MockMvcRequestBuilders.get("/csv").contentType("text/csv"))
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(MockMvcResultMatchers.header().stringValues("Content-Type", "text/csv;charset=UTF-8"))
                .andReturn()
        assertEqualNormalizeLineEnds(expected, actions.response.contentAsString)
    }
}