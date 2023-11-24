package com.aleinin.goty.result

import com.aleinin.goty.properties.PropertiesService
import org.springframework.stereotype.Component

@Component
class PointsService(private val propertiesService: PropertiesService) {

    fun calculatePoints(rank: Int): Int =
        propertiesService.getProperties().tiePoints.getOrNull(rank) ?: 0
}
