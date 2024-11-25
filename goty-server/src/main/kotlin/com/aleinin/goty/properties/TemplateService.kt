package com.aleinin.goty.properties

import org.apache.commons.text.StringSubstitutor
import org.springframework.stereotype.Service
import java.time.ZoneId
import java.time.ZonedDateTime
import java.time.format.DateTimeFormatter

@Service
class TemplateService {
    private val formatter = DateTimeFormatter.ofPattern("MM/dd/yyyy hh:mm a")

    fun toGotyQuestionResponse(gotyQuestion: GotyQuestion, properties: Properties, localTimeZone: ZoneId?): GotyQuestionResponse {
        val substitutor = getStringSubstitutor(properties, localTimeZone)
        return GotyQuestionResponse(
            title = ResolvedTemplate(gotyQuestion.title, substitutor.replace(gotyQuestion.title)),
            question = ResolvedTemplate(gotyQuestion.question, substitutor.replace(gotyQuestion.question)),
            rules = gotyQuestion.rules.map { ResolvedTemplate(it, substitutor.replace(it)) }
        )
    }

    fun toResolvedTemplate(templateString: String, properties: Properties, localTimeZone: ZoneId?) =
        ResolvedTemplate(templateString, getStringSubstitutor(properties, localTimeZone).replace(templateString))

    private fun getStringSubstitutor(properties: Properties, localTimeZone: ZoneId?): StringSubstitutor {
        val valueMap = mapOf(
            "year" to properties.year,
            "deadline" to getDeadlineAtTimeZone(properties.deadline, localTimeZone ?: properties.defaultLocalTimeZone),
            "maxGames"  to properties.tiePoints.size
        )
        return StringSubstitutor(valueMap)
    }

    private fun getDeadlineAtTimeZone(deadline: ZonedDateTime, localTimeZone: ZoneId?): String {
        val timeZone = localTimeZone ?: ZoneId.of("UTC")
        return deadline.withZoneSameInstant(timeZone).format(formatter)
    }
}