package com.aleinin.goty.properties

import org.springframework.stereotype.Repository
import java.time.ZoneId
import java.time.ZonedDateTime
import java.util.Date
import java.util.Optional

fun Properties.toDocument() = PropertiesDocument(
    id = PropertiesRepository.PROPERTIES_ID,
    tiePoints = this.tiePoints,
    deadlineDate = this.deadline.toDate(),
    zoneId = this.deadline.zone,
    hasGiveaway = this.hasGiveaway,
    giveawayAmountUSD = this.giveawayAmountUSD
)

fun ZonedDateTime.toDate() = Date.from(this.toInstant())

fun PropertiesDocument.toProperties() = Properties(
    tiePoints = this.tiePoints,
    deadline = this.deadlineDate.toZonedDateTime(this.zoneId),
    hasGiveaway = this.hasGiveaway,
    giveawayAmountUSD = this.giveawayAmountUSD
)

fun Date.toZonedDateTime(zoneId: ZoneId) = this.toInstant().atZone(zoneId)

@Repository
class PropertiesRepository(private val repository: PropertiesDocumentRepository) {
    companion object {
        const val PROPERTIES_ID = "properties"
    }

    fun findProperties(): Optional<Properties> = repository.findById(PROPERTIES_ID).map { it.toProperties() }

    fun replaceProperties(properties: Properties) =
        repository.save(properties.toDocument()).toProperties()
}


