package com.aleinin.goty.activeYear

import com.aleinin.goty.properties.PropertiesService
import org.springframework.stereotype.Service

@Service
class ActiveYearUpdaterService(
    private val activeYearUpdaterRepository: ActiveYearUpdaterRepository,
    private val propertiesService: PropertiesService
) {

    fun setActiveYear(newActiveYear: Int) = propertiesService.getProperties(newActiveYear)
        .map { activeYearUpdaterRepository.save(
            ActiveYearDocument(
                id = ACTIVE_YEAR_ID,
                year = newActiveYear,
            )
        ).year }
        .orElseThrow{ InvalidYearException(newActiveYear) }
}