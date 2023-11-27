package com.aleinin.goty.properties

import org.junit.jupiter.api.Test
import java.time.ZoneId
import java.time.ZonedDateTime
import org.junit.jupiter.api.Assertions.assertEquals
import java.time.format.DateTimeFormatter

class TemplateServiceTest {
    private val deadline = ZonedDateTime.of(2078, 1, 1, 0, 0, 0, 0, ZoneId.of("UTC"))

    private val templateService = TemplateService()

    @Test
    fun `should convert GotyQuestion to GotyQuestionResponse`() {
        val properties = Properties(
            title="",
            year = 2077,
            gotyQuestion = GotyQuestion("", "", emptyList()),
            tiePoints = listOf(9, 8, 7),
            deadline = deadline,
            hasGiveaway = true,
            defaultLocalTimeZone = null,
            giveawayAmountUSD = 0
        )
        val gotyQuestion = GotyQuestion(
            title = "Games of the Year",
            question = "What are your favorite game(s) of \${year}",
            rules = listOf("Can vote for \${maxGames} games", "Can vote until \${deadline}")
        )
        val localTimeZone = ZoneId.of("America/Denver")
        val expectedDate = properties.deadline.withZoneSameInstant(localTimeZone).format(DateTimeFormatter.ofPattern("MM/dd/yyyy hh:mm a"))
        val expected = GotyQuestionResponse(
            title = ResolvedTemplate(template = gotyQuestion.title, text = gotyQuestion.title),
            question = ResolvedTemplate(
                template = gotyQuestion.question,
                text = "What are your favorite game(s) of ${properties.year}"
            ),
            rules = listOf(
                ResolvedTemplate(template = "Can vote for \${maxGames} games", text = "Can vote for ${properties.tiePoints.size} games"),
                ResolvedTemplate(template = "Can vote until \${deadline}", text = "Can vote until $expectedDate")
            )
        )
        val actual = templateService.toGotyQuestionResponse(gotyQuestion, properties, localTimeZone)
        assertEquals(expected, actual)
    }

    @Test
    fun `should convert ${year} to properties year`() {
        val properties = Properties(
            title="",
            year = 2077,
            gotyQuestion = GotyQuestion("", "", emptyList()),
            tiePoints = listOf(9, 8, 7),
            deadline = deadline,
            hasGiveaway = true,
            defaultLocalTimeZone = null,
            giveawayAmountUSD = 0
        )
        val template = "It is \${year}"
        val expected = ResolvedTemplate(template = template, text = "It is ${properties.year}")
        val actual = templateService.toResolvedTemplate(template, properties, null)
        assertEquals(expected, actual)
    }

    @Test
    fun `should convert ${maxGame} to properties tiePoints size`() {
        val properties = Properties(
            title="",
            year = 2077,
            gotyQuestion = GotyQuestion("", "", emptyList()),
            tiePoints = listOf(9, 8, 7),
            deadline = deadline,
            hasGiveaway = true,
            defaultLocalTimeZone = null,
            giveawayAmountUSD = 0
        )
        val template = "You can nominate up to \${maxGames} games"
        val expected = ResolvedTemplate(template = template, text = "You can nominate up to ${properties.tiePoints.size} games")
        val actual = templateService.toResolvedTemplate(template, properties, null)
        assertEquals(expected, actual)
    }

    @Test
    fun `should convert ${deadline} to properties deadline in localTimeZone`() {
        val properties = Properties(
            title="",
            year = 2077,
            gotyQuestion = GotyQuestion("", "", emptyList()),
            tiePoints = listOf(9, 8, 7),
            deadline = deadline,
            hasGiveaway = true,
            defaultLocalTimeZone = null,
            giveawayAmountUSD = 0
        )
        val localTimeZone = ZoneId.of("America/Chicago")
        val template = "Deadline is at \${deadline}"
        val localTime = properties.deadline.withZoneSameInstant(localTimeZone).format(DateTimeFormatter.ofPattern("MM/dd/yyyy hh:mm a"))
        val expected = ResolvedTemplate(template = template, text = "Deadline is at $localTime")
        val actual = templateService.toResolvedTemplate(template, properties, localTimeZone)
        assertEquals(expected, actual)
    }

    @Test
    fun `should convert ${deadline} to properties deadline in defaultLocalTimeZone if localTimeZone null`() {
        val properties = Properties(
                title="",
                year = 2077,
                gotyQuestion = GotyQuestion("", "", emptyList()),
                tiePoints = listOf(9, 8, 7),
                deadline = deadline,
                hasGiveaway = true,
                defaultLocalTimeZone = ZoneId.of("America/Los_Angeles"),
                giveawayAmountUSD = 0
        )
        val template = "Deadline is at \${deadline}"
        val localTime = properties.deadline.withZoneSameInstant(properties.defaultLocalTimeZone).format(DateTimeFormatter.ofPattern("MM/dd/yyyy hh:mm a"))
        val expected = ResolvedTemplate(template = template, text = "Deadline is at $localTime")
        val actual = templateService.toResolvedTemplate(template, properties, null)
        assertEquals(expected, actual)
    }

    @Test
    fun `should convert ${deadline} to properties deadline in UTC if default and localTimeZone null`() {
        val properties = Properties(
                title="",
                year = 2077,
                gotyQuestion = GotyQuestion("", "", emptyList()),
                tiePoints = listOf(9, 8, 7),
                deadline = deadline,
                hasGiveaway = true,
                defaultLocalTimeZone = null,
                giveawayAmountUSD = 0
        )
        val template = "Deadline is at \${deadline}"
        val localTime = properties.deadline.withZoneSameInstant(ZoneId.of("Etc/GMT")).format(DateTimeFormatter.ofPattern("MM/dd/yyyy hh:mm a"))
        val expected = ResolvedTemplate(template = template, text = "Deadline is at $localTime")
        val actual = templateService.toResolvedTemplate(template, properties, null)
        assertEquals(expected, actual)
    }
}