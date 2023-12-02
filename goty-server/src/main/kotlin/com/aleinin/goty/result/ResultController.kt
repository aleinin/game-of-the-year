package com.aleinin.goty.result

import com.aleinin.goty.properties.PropertiesService
import com.aleinin.goty.submission.SubmissionService
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@CrossOrigin
@RestController
class ResultController(
        private val submissionService: SubmissionService,
        private val resultService: ResultService,
        private val propertiesService: PropertiesService
) {

    @GetMapping("/results")
    fun getResults(@RequestParam(required = false) year: Int?): ResultResponse {
        val submissionYear = year ?: propertiesService.getThisYear()
        return submissionService.getSubmissionsForYear(submissionYear).let { resultService.calculate(it, year ?: submissionYear) }
    }
}
