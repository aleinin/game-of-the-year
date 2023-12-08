package com.aleinin.goty.csv

import com.aleinin.goty.properties.PropertiesService
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@CrossOrigin
@RestController
class CSVController(
    private val csvService: CSVService,
    private val propertiesService: PropertiesService
) {
    @GetMapping(value = ["/csv"], produces = ["text/csv"])
    fun getExport(@RequestParam(required = false) year: Int?) = csvService.dumpToCSV(year ?: propertiesService.getThisYear())
}