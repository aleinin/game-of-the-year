package com.aleinin.goty.activeYear

import com.aleinin.goty.configuration.DefaultActiveYear
import org.springframework.stereotype.Service
import org.springframework.validation.annotation.Validated

@Service
class ActiveYearProviderService(
    private val activeYearProviderRepository: ActiveYearProviderRepository,
    @Validated private val defaultActiveYear: DefaultActiveYear
) {

    fun getActiveYear(): Int = activeYearProviderRepository.findById(ACTIVE_YEAR_ID)
        .map { it.year }
        .orElseGet { defaultActiveYear.year }
}