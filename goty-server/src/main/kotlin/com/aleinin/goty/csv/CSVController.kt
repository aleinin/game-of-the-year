package com.aleinin.goty.csv

import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@CrossOrigin
@RestController
class CSVController(
    private val csvService: CSVService
) {
    @GetMapping(value = ["/csv"], produces = ["text/csv"])
    fun getExport() = csvService.dumpToCSV()
}