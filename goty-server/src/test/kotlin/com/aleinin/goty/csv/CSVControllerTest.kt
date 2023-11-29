package com.aleinin.goty.csv

import com.aleinin.goty.SubmissionDataHelper
import com.aleinin.goty.csv.CSVData.Companion.assertEqualNormalizeLineEnds
import com.aleinin.goty.properties.GotyQuestion
import com.aleinin.goty.properties.Properties
import com.aleinin.goty.properties.PropertiesService
import com.aleinin.goty.submission.SecretSubmissionRepository
import org.junit.jupiter.api.Test
import org.mockito.kotlin.whenever
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import java.time.ZoneId
import java.time.ZonedDateTime
import java.util.UUID

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@EnableConfigurationProperties
class CSVControllerTest {
    @Autowired
    lateinit var mockMvc: MockMvc

    @MockBean
    lateinit var propertiesService: PropertiesService

    @MockBean
    lateinit var secretSubmissionRepository: SecretSubmissionRepository

    @Test
    fun `Should get CSV`() {
        val expectedProperties = Properties(
                title = "my cool title",
                year = 2023,
                gotyQuestion = GotyQuestion("hello", "world", listOf("rule1", "rule2", "rule3")),
                tiePoints = listOf(15, 13, 11, 7, 6, 5, 4, 3, 2, 1),
                deadline = ZonedDateTime.of(2000, 1, 1, 12, 12, 12, 0, ZoneId.of("Etc/GMT")),
                defaultLocalTimeZone = ZoneId.of("America/Chicago"),
                giveawayAmountUSD = 999,
                hasGiveaway = true
        )
        whenever(propertiesService.getProperties()).thenReturn(expectedProperties)
        val expectedUUIDs = listOf(
                UUID.fromString("f11186fe-3cfb-44cb-a429-67005ab60584"),
                UUID.fromString("98a8332d-1f2c-47ed-a9a0-fd2a36467d8f"),
                UUID.fromString("a8665bae-d4c0-4349-99e4-f054649903e8"),
                UUID.fromString("0ffefab3-2dc5-4218-9a6a-b06287934d08"),
        )
        val secretSubmissions = SubmissionDataHelper.secret(SubmissionDataHelper.everything()
                .mapIndexed() { index, submission ->  submission.copy(id=expectedUUIDs[index])}
        )
        whenever(secretSubmissionRepository.findAll()).thenReturn(secretSubmissions)
        val expected = CSVData.FULL_CSV
        val actions = mockMvc.perform(MockMvcRequestBuilders.get("/csv").contentType("text/csv"))
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(MockMvcResultMatchers.header().stringValues("Content-Type", "text/csv;charset=UTF-8"))
                .andReturn()
        assertEqualNormalizeLineEnds(expected, actions.response.contentAsString)
    }
}