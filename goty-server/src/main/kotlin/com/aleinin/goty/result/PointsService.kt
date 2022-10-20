package com.aleinin.goty.result

import com.aleinin.goty.properties.Properties
import org.springframework.stereotype.Component

@Component
class PointsService(private val properties: Properties) {

    fun calculatePoints(rank: Int): Int =
        properties.tiePoints.getOrNull(rank) ?: 0
}
