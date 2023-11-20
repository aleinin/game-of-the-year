package com.aleinin.goty.result

import com.aleinin.goty.submission.SubmissionRepository
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@CrossOrigin
@RestController
class ResultController(
    private val submissionRepository: SubmissionRepository,
    private val resultService: ResultService,
) {

    @GetMapping("/results")
    fun getResults() = submissionRepository.findAllSubmissions().let { resultService.calculate(it) }
}
