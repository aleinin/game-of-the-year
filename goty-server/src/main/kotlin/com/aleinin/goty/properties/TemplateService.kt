package com.aleinin.goty.properties

import org.springframework.stereotype.Service
import java.time.ZoneId
import java.time.format.DateTimeFormatter

@Service
class TemplateService {
    private val formatter = DateTimeFormatter.ofPattern("MM/dd/yyyy hh:mm a")

    val tokenMap = mapOf(
        "\${year}" to { properties: Properties, _: ZoneId? -> properties.year.toString() },
        "\${deadline}" to { properties: Properties, localTimeZone: ZoneId? -> getDeadlineAtTimeZone(properties, localTimeZone) },
        "\${maxGames}" to { properties: Properties, _: ZoneId? -> properties.tiePoints.size.toString() }
    )
    fun toGotyQuestionResponse(gotyQuestion: GotyQuestion, properties: Properties, localTimeZone: ZoneId?) = GotyQuestionResponse(
        title = toResolvedTemplate(gotyQuestion.title, properties, localTimeZone),
        question = toResolvedTemplate(gotyQuestion.question, properties, localTimeZone),
        rules = gotyQuestion.rules.map { toResolvedTemplate(it, properties, localTimeZone) }
    )

    fun toResolvedTemplate(templateString: String, properties: Properties, localTimeZone: ZoneId?): ResolvedTemplate {
        var text = templateString
        tokenMap.forEach { (token, translationFn) ->
            text = text.replace(token, translationFn(properties, localTimeZone))
        }
        return ResolvedTemplate(template = templateString, text = text)
    }

    private fun getDeadlineAtTimeZone(properties: Properties, localTimeZone: ZoneId?): String {
        val timeZone =
            if (localTimeZone != null) {
                localTimeZone
            } else if (properties.defaultLocalTimeZone != null) {
                properties.defaultLocalTimeZone
            } else {
                ZoneId.of("UTC")
            }
        return properties.deadline.withZoneSameInstant(timeZone).format(formatter)
    }
}