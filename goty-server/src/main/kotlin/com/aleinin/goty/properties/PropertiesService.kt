package com.aleinin.goty.properties

import com.aleinin.goty.configuration.DefaultProperties
import com.aleinin.goty.configuration.toProperties
import org.springframework.stereotype.Service
import org.springframework.validation.annotation.Validated

@Service
class PropertiesService(
    private val propertiesRepository: PropertiesRepository,
    @Validated private val defaultProperties: DefaultProperties
) {

    fun getProperties(): Properties = propertiesRepository
        .findProperties()
        .orElseGet { defaultProperties.toProperties() }

    fun replaceProperties(request: Properties): Properties {
        return propertiesRepository.replaceProperties(request)
    }

}