package com.aleinin.goty.result

import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RestController

@CrossOrigin
@RestController
class ResultController(
        private val resultService: ResultService,
) {
    @GetMapping("/results/years")
    fun getResultsYears(): List<Int> = resultService.getResultsYears()

    @GetMapping("/results")
    fun getResults(): ResultResponse = resultService.getResultsForActiveYear()

    @GetMapping("/results/{year}")
    fun getResultsForYear(@PathVariable year: Int): ResultResponse = resultService.getResultsForYear(year)
}
