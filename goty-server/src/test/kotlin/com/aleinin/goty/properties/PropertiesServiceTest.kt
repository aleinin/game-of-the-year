package com.aleinin.goty.properties

import com.aleinin.goty.EasternTime
import com.aleinin.goty.UTC
import com.aleinin.goty.configuration.DefaultProperties
import com.aleinin.goty.configuration.toProperties
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.ArgumentMatchers.anyString
import org.mockito.Mock
import org.mockito.junit.jupiter.MockitoExtension
import org.mockito.kotlin.any
import org.mockito.kotlin.whenever
import java.time.ZonedDateTime
import java.util.Optional

@ExtendWith(MockitoExtension::class)
internal class PropertiesServiceTest {
    @Mock
    lateinit var propertiesRepository: PropertiesRepository

    @Mock
    lateinit var templateService: TemplateService

    lateinit var propertiesService: PropertiesService

    private val defaultProperties = DefaultProperties(
        title = "Default Title",
        gotyQuestion = GotyQuestion(title = "Default tile", question = "Defautl question", rules = listOf("Default rules")),
        year = 2023,
        tiePoints = listOf(9, 8, 7),
        deadline = ZonedDateTime.of(2024, 1, 1, 0, 0, 0, 0, UTC),
        defaultLocalTimeZone = EasternTime,
        hasGiveaway = true,
        giveawayAmountUSD = 25
    )

    private val deadline = ZonedDateTime.of(2088, 1, 1, 0, 0, 0, 0, UTC)

    @BeforeEach
    fun setup() {
        propertiesService = PropertiesService(propertiesRepository, templateService,  defaultProperties)
    }

    private fun setupTemplateMock() {
        whenever(templateService.toResolvedTemplate(anyString(), any(), any())).thenAnswer { ResolvedTemplate(it.getArgument(0), it.getArgument(0))}
        whenever(templateService.toGotyQuestionResponse(any(), any(), any())).thenAnswer {
            GotyQuestionResponse(
                title = ResolvedTemplate(it.getArgument<GotyQuestion>(0).title, it.getArgument<GotyQuestion>(0).title),
                question = ResolvedTemplate(it.getArgument<GotyQuestion>(0).question, it.getArgument<GotyQuestion>(0).question),
                rules = it.getArgument<GotyQuestion>(0).rules.map {rule -> ResolvedTemplate(rule, rule) })
        }
    }

    @Test
    fun `Should return the stored configuration`() {
        val expectedProperties = Properties(
            title = "Game of the Year",
            year = 2023,
            gotyQuestion = GotyQuestion(title = "Title", question="Question", rules= listOf("Rules")),
            tiePoints = listOf(3, 2, 1),
            deadline = deadline,
            hasGiveaway = false,
            defaultLocalTimeZone = UTC,
            giveawayAmountUSD = 0
        )
        whenever(propertiesRepository.findProperties()).thenReturn(Optional.of(expectedProperties))
        val actualConfig = propertiesService.getProperties()
        assertEquals(expectedProperties, actualConfig)
    }

    @Test
    fun `Should return current properties year`() {
        val expectedYear = 2005
        val properties = Properties(
                title = "Game of the Year",
                year = expectedYear,
                gotyQuestion = GotyQuestion(title = "Title", question="Question", rules= listOf("Rules")),
                tiePoints = listOf(3, 2, 1),
                deadline = deadline,
                hasGiveaway = false,
                defaultLocalTimeZone = UTC,
                giveawayAmountUSD = 0
        )
        whenever(propertiesRepository.findProperties()).thenReturn(Optional.of(properties))
        val actualYear = propertiesService.getThisYear()
        assertEquals(expectedYear, actualYear)

    }

    @Test
    fun `Should load the default values if there is no stored configuration`() {
        whenever(propertiesRepository.findProperties()).thenReturn(Optional.empty())
        val actual = propertiesService.getProperties()
        assertEquals(defaultProperties.toProperties(), actual)
    }

    @Test
    fun `Should return the stored configuration response`() {
        setupTemplateMock()
        val storedProperties = Properties(
                title = "Game of the Year",
                year = 2023,
                gotyQuestion = GotyQuestion(title = "Title", question="Question", rules= listOf("Rules")),
                tiePoints = listOf(3, 2, 1),
                deadline = deadline,
                hasGiveaway = false,
                defaultLocalTimeZone = UTC,
                giveawayAmountUSD = 0
        )
        val expectedResponse = PropertiesResponse(
            title = ResolvedTemplate(storedProperties.title, storedProperties.title),
            year = storedProperties.year,
            gotyQuestion = GotyQuestionResponse(
                ResolvedTemplate(storedProperties.gotyQuestion.title, storedProperties.gotyQuestion.title),
                ResolvedTemplate(storedProperties.gotyQuestion.question, storedProperties.gotyQuestion.question),
                storedProperties.gotyQuestion.rules.map { ResolvedTemplate(it, it) }
            ),
            tiePoints = storedProperties.tiePoints,
            deadline = storedProperties.deadline,
            hasGiveaway = storedProperties.hasGiveaway,
            defaultLocalTimeZone = storedProperties.defaultLocalTimeZone,
            giveawayAmountUSD = storedProperties.giveawayAmountUSD
        )
        whenever(propertiesRepository.findProperties()).thenReturn(Optional.of(storedProperties))
        val actualResponse = propertiesService.getPropertiesResponse(UTC)
        assertEquals(expectedResponse, actualResponse)
    }

    @Test
    fun `Should return the default properties as response if none stored`() {
        setupTemplateMock()
        whenever(propertiesRepository.findProperties()).thenReturn(Optional.empty())
        val actual = propertiesService.getPropertiesResponse(EasternTime)
        val expected = PropertiesResponse(
            title = ResolvedTemplate(defaultProperties.title, defaultProperties.title),
            year = defaultProperties.year,
            gotyQuestion = GotyQuestionResponse(
                    ResolvedTemplate(defaultProperties.gotyQuestion.title, defaultProperties.gotyQuestion.title),
                    ResolvedTemplate(defaultProperties.gotyQuestion.question, defaultProperties.gotyQuestion.question),
                    defaultProperties.gotyQuestion.rules.map { ResolvedTemplate(it, it) }
            ),
            tiePoints = defaultProperties.tiePoints,
            deadline = defaultProperties.deadline,
            hasGiveaway = defaultProperties.hasGiveaway,
            defaultLocalTimeZone = defaultProperties.defaultLocalTimeZone,
            giveawayAmountUSD = defaultProperties.giveawayAmountUSD
        )
        assertEquals(expected, actual)
    }

    @Test
    fun `Should accept a new configuration`() {
        setupTemplateMock()
        val request = Properties(
            title = "new title",
            gotyQuestion = GotyQuestion(title = "new goty title", question = "new goty question", rules = listOf("new goty rules")),
            year = 2077,
            tiePoints = listOf(6, 5, 4),
            deadline = deadline,
            hasGiveaway = false,
            defaultLocalTimeZone = null,
            giveawayAmountUSD = 0
        )
        val expectedResponse = PropertiesResponse(
            title = ResolvedTemplate("new title", "new title"),
            gotyQuestion = GotyQuestionResponse(
                title = ResolvedTemplate("new goty title", "new goty title"),
                question = ResolvedTemplate("new goty question", "new goty question"),
                rules = listOf(ResolvedTemplate("new goty rules", "new goty rules"))
            ),
            year = 2077,
            tiePoints = listOf(6, 5, 4),
            deadline = deadline,
            hasGiveaway = false,
            defaultLocalTimeZone = null,
            giveawayAmountUSD = 0
        )
        whenever(propertiesRepository.replaceProperties(any())).thenReturn(request)
        val actualResponse = propertiesService.replaceProperties(request, EasternTime)
        assertEquals(expectedResponse, actualResponse)
    }
}
