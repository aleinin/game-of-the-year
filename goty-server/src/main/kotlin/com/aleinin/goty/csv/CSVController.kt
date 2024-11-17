package com.aleinin.goty.csv

import com.aleinin.goty.activeYear.ActiveYearProviderService
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.server.ResponseStatusException
import java.time.ZoneId

@CrossOrigin
@RestController
class CSVController(
    private val csvService: CSVService,
    private val activeYearService: ActiveYearProviderService
) {
    @GetMapping(value = ["/csv"], produces = ["text/csv"])
    fun getExport(
        @RequestParam(required = false) localTimeZone: ZoneId?,
        @RequestParam(required = false) year: Int?
    ) = try {
        csvService.dumpToCSV(year ?: activeYearService.getActiveYear(), localTimeZone)
    } catch (e: NoResultsForYearException) {
        throw ResponseStatusException(HttpStatus.NOT_FOUND, e.message)
    }
}