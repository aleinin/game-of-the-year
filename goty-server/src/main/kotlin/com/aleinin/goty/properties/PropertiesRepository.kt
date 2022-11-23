package com.aleinin.goty.properties

import org.springframework.stereotype.Repository
import java.util.Optional

fun Properties.toDocument() = PropertiesDocument(
    id = PropertiesRepository.PROPERTIES_ID,
    gotyYear = this.gotyYear,
    tiePoints = this.tiePoints,
    deadline = this.deadline.toInstant(),
    zoneId = this.deadline.zone,
    hasGiveaway = this.hasGiveaway,
    giveawayAmountUSD = this.giveawayAmountUSD
)

fun PropertiesDocument.toProperties() = Properties(
    gotyYear = this.gotyYear,
    tiePoints = this.tiePoints,
    deadline = this.deadline.atZone(this.zoneId),
    hasGiveaway = this.hasGiveaway,
    giveawayAmountUSD = this.giveawayAmountUSD
)

@Repository
class PropertiesRepository(private val repository: PropertiesDocumentRepository) {
    companion object {
        const val PROPERTIES_ID = "properties"
    }

    fun findProperties(): Optional<Properties> = repository.findById(PROPERTIES_ID).map { it.toProperties() }

    fun replaceProperties(properties: Properties) =
        repository.save(properties.toDocument()).toProperties()
}
