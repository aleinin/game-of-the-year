package com.aleinin.goty.submit

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import org.springframework.web.server.ResponseStatusException
import java.time.Instant
import java.util.*

@RestController
class SubmissionController(
    val submissionProperties: SubmissionProperties,
    val submissionRepository: SubmissionRepository,
) {

    @GetMapping("/submissions/{id}")
    fun getSubmission(@PathVariable id: UUID) =
        submissionRepository.findById(id).orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND) }!!

    @PutMapping("/submissions/{id}")
    fun updateSubmission(@PathVariable id: UUID, @RequestBody submissionRequest: SubmissionRequest) =
        beforeCutoff { submissionRepository.save(submissionRequest.copy(id = id)) }

    @PostMapping("/submissions")
    fun insertSubmission(@RequestBody submissionRequest: SubmissionRequest) =
        beforeCutoff { submissionRepository.insert(submissionRequest.copy(id = UUID.randomUUID())) }

    private fun beforeCutoff(perform: () -> SubmissionRequest) =
        if (beforeCutoff()) perform.invoke() else throw ResponseStatusException(HttpStatus.FORBIDDEN)

    private fun beforeCutoff() =
        Instant.now().atZone(submissionProperties.deadline.zone).isBefore(submissionProperties.deadline)
}
