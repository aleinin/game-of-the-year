package com.aleinin.goty.submit

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import org.springframework.web.server.ResponseStatusException
import java.time.Instant
import java.util.*

@CrossOrigin
@RestController
class SubmissionController(
    private val submissionProperties: SubmissionProperties,
    private val submissionRepository: SubmissionRepository,
) {

    private val deadlineMessage = "Submission deadline of ${submissionProperties.deadline} has been met."

    @GetMapping("/submissions")
    fun getSubmissions() = submissionRepository.findAll()

    @PostMapping("/submissions")
    fun insertSubmission(@RequestBody submissionRequest: SubmissionRequest) =
        beforeCutoff {
            submissionRepository.insert(submissionRequest.copy(
                id = UUID.randomUUID(),
                enteredOn = System.currentTimeMillis(),
                updatedOn = System.currentTimeMillis(),
            ))
        }

    @GetMapping("/submissions/{id}")
    fun getSubmission(@PathVariable id: UUID) =
        submissionRepository.findById(id).orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND) }!!

    @PutMapping("/submissions/{id}")
    fun updateSubmission(@PathVariable id: UUID, @RequestBody submissionRequest: SubmissionRequest) =
        beforeCutoff {
            submissionRepository
                .findById(id)
                .map {
                    submissionRequest.copy(
                        id = id,
                        enteredOn = it.enteredOn,
                        updatedOn = System.currentTimeMillis(),
                    )
                }
                .map { submissionRepository.save(it) }
                .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND) }
        }

    private fun beforeCutoff(perform: () -> SubmissionRequest) =
        if (beforeCutoff()) perform.invoke() else throw ResponseStatusException(HttpStatus.FORBIDDEN, deadlineMessage)

    private fun beforeCutoff() =
        Instant.now().atZone(submissionProperties.deadline.zone).isBefore(submissionProperties.deadline)
}
