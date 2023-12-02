package com.aleinin.goty.properties

import com.aleinin.goty.configuration.DefaultProperties
import com.aleinin.goty.configuration.toProperties
import org.springframework.stereotype.Service
import org.springframework.validation.annotation.Validated
import java.time.ZoneId

@Service
class PropertiesService(
    private val propertiesRepository: PropertiesRepository,
    private val templateService: TemplateService,
    @Validated private val defaultProperties: DefaultProperties
) {

    fun getProperties(): Properties = propertiesRepository.findProperties()
        .orElseGet {defaultProperties.toProperties() }

    fun getThisYear(): Int =
            // todo test
            getProperties().year

    fun getPropertiesResponse(localTimeZone: ZoneId?): PropertiesResponse = toResponse(getProperties(), localTimeZone)

    fun replaceProperties(request: Properties, localTimeZone: ZoneId?): PropertiesResponse {
        return toResponse(propertiesRepository.replaceProperties(request), localTimeZone)
    }

    fun toResponse(properties: Properties, localTimeZone: ZoneId?): PropertiesResponse {
        return PropertiesResponse(
            title = templateService.toResolvedTemplate(properties.title, properties, localTimeZone),
            year = properties.year,
            gotyQuestion = templateService.toGotyQuestionResponse(properties.gotyQuestion, properties, localTimeZone),
            tiePoints = properties.tiePoints,
            deadline = properties.deadline,
            giveawayAmountUSD = properties.giveawayAmountUSD,
            hasGiveaway = properties.hasGiveaway,
            defaultLocalTimeZone = properties.defaultLocalTimeZone
        )
    }

}