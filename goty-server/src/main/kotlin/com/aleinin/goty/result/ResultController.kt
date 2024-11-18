package com.aleinin.goty.result

import com.aleinin.goty.properties.PropertiesService
import com.aleinin.goty.submission.SubmissionService
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RestController

@CrossOrigin
@RestController
class ResultController(
        private val submissionService: SubmissionService,
        private val resultService: ResultService,
        private val propertiesService: PropertiesService
) {

    @GetMapping("/results")
    fun getResults(): ResultResponse {
        val activeYear = propertiesService.getActiveYear()
        return submissionService.getSubmissionsForYear(activeYear).let { resultService.calculate(it, activeYear) }
    }

    @GetMapping("/results/{year}")
    fun getResultsForYear(@PathVariable year: Int): ResultResponse =
        submissionService.getSubmissionsForYear(year).let { resultService.calculate(it, year) }
}
