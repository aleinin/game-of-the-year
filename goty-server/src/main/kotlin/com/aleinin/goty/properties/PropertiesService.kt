package com.aleinin.goty.properties

import PropertiesUpdateRequest
import com.aleinin.goty.configuration.DefaultProperties
import com.aleinin.goty.configuration.toProperties
import org.springframework.stereotype.Service
import org.springframework.validation.annotation.Validated
import java.time.ZoneId
import java.util.Optional

fun PropertiesDocument.toProperties(): Properties {
    return Properties(
        year = year,
        searchYears = searchYears,
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
        searchYears = searchYears,
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
    private val propertiesRepository: PropertiesRepository,
    private val templateService: TemplateService,
    private val activeYearRepository: ActiveYearRepository,
    @Validated private val defaultProperties: DefaultProperties
) {
    companion object {
        const val ACTIVE_YEAR_ID = "activeYear"
    }

    fun getActiveYear(): String = activeYearRepository.findById(ACTIVE_YEAR_ID)
        .map { it.year }
        .orElseGet { defaultProperties.year }

    fun setActiveYear(newActiveYear: String) = getProperties(newActiveYear)
        .map { activeYearRepository.save(
            ActiveYearDocument(
                id = ACTIVE_YEAR_ID,
                year = newActiveYear,
            )
        ).year }
        .orElseThrow{ InvalidYearException(newActiveYear) }

    fun deleteActiveYear() {
        activeYearRepository.deleteById(ACTIVE_YEAR_ID)
    }

    fun getAllPropertiesResponse(localTimeZone: ZoneId?): List<PropertiesResponse> {
        return propertiesRepository.findAll()
            .map { it.toProperties() }
            .map { toResponse(it, localTimeZone) }
    }

    fun getProperties(year: String): Optional<Properties> {
        return propertiesRepository.findByYear(year)
            .map { it.toProperties() }
    }

    fun getPropertiesResponse(year: String, localTimeZone: ZoneId?): Optional<PropertiesResponse> {
        return getProperties(year)
            .map { toResponse(it, localTimeZone) }
    }

    fun getActiveYearProperties(): Properties {
        return propertiesRepository.findByYear(getActiveYear())
            .map { it.toProperties() }
            .orElseGet(defaultProperties::toProperties)
    }

    fun getActiveYearPropertiesResponse(localTimeZone: ZoneId?): PropertiesResponse {
        return toResponse(getActiveYearProperties(), localTimeZone)
    }

    fun getTiePoints(year: String): List<Int> {
        return propertiesRepository.findByYear(year)
            .map { it.tiePoints }
            .orElseGet { defaultProperties.tiePoints }
    }

    fun saveProperties(properties: Properties, localTimeZone: ZoneId?): PropertiesResponse {
        val existing = propertiesRepository.findByYear(properties.year)
        if (existing.isPresent) {
            throw PropertiesConflictException(properties.year)
        }
        return toResponse(propertiesRepository.save(properties.toPropertiesDocument()).toProperties(), localTimeZone)
    }

    fun saveBatchProperties(properties: List<Properties>, localTimeZone: ZoneId?): PropertiesBatchResponse {
        val existingYears = propertiesRepository.findAll().map { it.year }
        val created = mutableListOf<PropertiesResponse>()
        val failedBatches = mutableListOf<PropertiesBatchFailure>()
        for (property in properties) {
            if (property.year in existingYears) {
                failedBatches.add(PropertiesBatchFailure("Properties for year '${property.year}' already exists", property))
            } else {
                try {
                    propertiesRepository.save(property.toPropertiesDocument())
                    created.add(toResponse(property, localTimeZone))
                } catch (e: Exception) {
                    failedBatches.add(PropertiesBatchFailure(e.message ?: "Unknown error", property))
                }
            }
        }
        return PropertiesBatchResponse(created, failedBatches)
    }

    fun replaceProperties(year: String, request: PropertiesUpdateRequest, localTimeZone: ZoneId?): PropertiesResponse {
        return propertiesRepository.findByYear(year)
            .map { propertiesRepository.save(
                PropertiesDocument(
                    year = year,
                    searchYears = request.searchYears,
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

    fun deleteProperties(year: String) {
        val activeYear = getActiveYear()
        if (year == activeYear) {
            throw CannotDeleteActiveYearException()
        }
        propertiesRepository.findByYear(year)
            .map { propertiesRepository.delete(it) }
            .orElseThrow { YearNotFoundException(year) }
    }

    private fun toResponse(properties: Properties, localTimeZone: ZoneId?): PropertiesResponse {
        return PropertiesResponse(
            title = templateService.toResolvedTemplate(properties.title, properties, localTimeZone),
            year = properties.year,
            searchYears = properties.searchYears,
            gotyQuestion = templateService.toGotyQuestionResponse(properties.gotyQuestion, properties, localTimeZone),
            tiePoints = properties.tiePoints,
            deadline = properties.deadline,
            giveawayAmountUSD = properties.giveawayAmountUSD,
            hasGiveaway = properties.hasGiveaway,
            defaultLocalTimeZone = properties.defaultLocalTimeZone,
        )
    }

}