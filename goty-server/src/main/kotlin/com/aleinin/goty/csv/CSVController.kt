package com.aleinin.goty.csv

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.server.ResponseStatusException
import java.time.ZoneId

@CrossOrigin
@RestController
class CSVController(
    private val csvService: CSVService,
) {
    @GetMapping(value = ["/csv"], produces = ["text/csv"])
    fun getActiveYearExport(
        @RequestParam(required = false) localTimeZone: ZoneId?,
    ) = try {
        csvService.getActiveYearCSV(localTimeZone)
    } catch (e: NoResultsForYearException) {
        throw ResponseStatusException(HttpStatus.NOT_FOUND, e.message)
    }

    @GetMapping(value = ["/csv/{year}"], produces = ["text/csv"])
    fun getExportForYear(
        @PathVariable year: String,
        @RequestParam(required = false) localTimeZone: ZoneId?,
    ) = try {
        csvService.getYearCSV(year, localTimeZone)
    } catch (e: NoResultsForYearException) {
        throw ResponseStatusException(HttpStatus.NOT_FOUND, e.message)
    }
}