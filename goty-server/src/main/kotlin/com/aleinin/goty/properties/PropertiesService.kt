package com.aleinin.goty.properties

import PropertiesUpdateRequest
import com.aleinin.goty.activeYear.ActiveYearProviderService
import com.aleinin.goty.configuration.DefaultProperties
import com.aleinin.goty.configuration.toProperties
import org.springframework.stereotype.Service
import org.springframework.validation.annotation.Validated
import java.time.ZoneId
import java.util.Optional

fun PropertiesDocument.toProperties(): Properties {
    return Properties(
        year = year,
        title = title,
        gotyQuestion = gotyQuestion,
        tiePoints = tiePoints,
        giveawayAmountUSD = giveawayAmountUSD,
        hasGiveaway = hasGiveaway,
        deadline = deadline.atZone(zoneId),
        defaultLocalTimeZone = defaultLocalTimeZone,
    )
}

fun Properties.toPropertiesDocument(): PropertiesDocument {
    return PropertiesDocument(
        year = year,
        title = title,
        gotyQuestion = gotyQuestion,
        tiePoints = tiePoints,
        giveawayAmountUSD = giveawayAmountUSD,
        hasGiveaway = hasGiveaway,
        deadline = deadline.toInstant(),
        zoneId = deadline.zone,
        defaultLocalTimeZone = defaultLocalTimeZone,
    )
}

@Service
class PropertiesService(
    private val propertiesDocumentRepository: PropertiesDocumentRepository,
    private val templateService: TemplateService,
    private val activeYearService: ActiveYearProviderService,
    @Validated private val defaultProperties: DefaultProperties
) {
    fun getAllPropertiesResponse(localTimeZone: ZoneId?): List<PropertiesResponse> {
        return propertiesDocumentRepository.findAll()
            .map { it.toProperties() }
            .map { toResponse(it, localTimeZone) }
    }

    fun getProperties(year: Int): Optional<Properties> {
        return propertiesDocumentRepository.findByYear(year)
            .map { it.toProperties() }
    }

    fun getPropertiesResponse(year: Int, localTimeZone: ZoneId?): Optional<PropertiesResponse> {
        return getProperties(year)
            .map { toResponse(it, localTimeZone) }
    }

    fun getActiveYearProperties(): Properties {
        return propertiesDocumentRepository.findByYear(activeYearService.getActiveYear())
            .map { it.toProperties() }
            .orElseGet(defaultProperties::toProperties)
    }

    fun getActiveYearPropertiesResponse(localTimeZone: ZoneId?): PropertiesResponse {
        return toResponse(getActiveYearProperties(), localTimeZone)
    }

    fun getTiePoints(year: Int): List<Int> {
        return propertiesDocumentRepository.findByYear(year)
            .map { it.tiePoints }
            .orElseGet { defaultProperties.tiePoints }
    }

    fun saveProperties(properties: Properties, localTimeZone: ZoneId?): PropertiesResponse {
        val existing = propertiesDocumentRepository.findByYear(properties.year)
        if (existing.isPresent) {
            throw PropertiesConflictException(properties.year)
        }
        return toResponse(propertiesDocumentRepository.save(properties.toPropertiesDocument()).toProperties(), localTimeZone)
    }

    fun replaceProperties(year: Int, request: PropertiesUpdateRequest, localTimeZone: ZoneId?): PropertiesResponse {
        return propertiesDocumentRepository.findByYear(year)
            .map { propertiesDocumentRepository.save(
                PropertiesDocument(
                    year = year,
                    title = request.title,
                    gotyQuestion = request.gotyQuestion,
                    tiePoints = request.tiePoints,
                    giveawayAmountUSD = request.giveawayAmountUSD,
                    hasGiveaway = request.hasGiveaway,
                    deadline = request.deadline.toInstant(),
                    zoneId = request.deadline.zone,
                    defaultLocalTimeZone = request.defaultLocalTimeZone,
                )
            ) }
            .map { toResponse(it.toProperties(), localTimeZone) }
            .orElseThrow { YearNotFoundException(year) }
    }

    fun deleteProperties(year: Int) {
        val activeYear = activeYearService.getActiveYear()
        if (year == activeYear) {
            throw CannotDeleteActiveYearException()
        }
        propertiesDocumentRepository.findByYear(year)
            .map { propertiesDocumentRepository.delete(it) }
            .orElseThrow { YearNotFoundException(year) }
    }

    private fun toResponse(properties: Properties, localTimeZone: ZoneId?): PropertiesResponse {
        return PropertiesResponse(
            title = templateService.toResolvedTemplate(properties.title, properties, localTimeZone),
            year = properties.year,
            gotyQuestion = templateService.toGotyQuestionResponse(properties.gotyQuestion, properties, localTimeZone),
            tiePoints = properties.tiePoints,
            giveawayAmountUSD = properties.giveawayAmountUSD,
            hasGiveaway = properties.hasGiveaway,
        )
    }

}