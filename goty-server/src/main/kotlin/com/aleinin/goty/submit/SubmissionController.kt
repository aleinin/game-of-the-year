package com.aleinin.goty.submit

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.server.ResponseStatusException
import java.time.Clock
import java.util.UUID

@CrossOrigin
@RestController
class SubmissionController(
    private val submissionProperties: SubmissionProperties,
    private val submissionRepository: SubmissionRepository,
    private val clock: Clock
) {

    private val deadlineMessage = "Submission deadline of ${submissionProperties.deadline} has been met."

    @GetMapping("/submissions")
    fun getSubmissions() = submissionRepository.findAll()

    @PostMapping("/submissions")
    fun addSubmission(@RequestBody submissionRequest: SubmissionRequest) =
        beforeCutoff {
            submissionRepository.insert(
                Submission(
                    id = UUID.randomUUID(),
                    name = submissionRequest.name,
                    gamesOfTheYear = submissionRequest.gamesOfTheYear,
                    mostAnticipated = submissionRequest.mostAnticipated,
                    bestOldGame = submissionRequest.bestOldGame,
                    enteredGiveaway = submissionRequest.enteredGiveaway,
                    enteredOn = clock.millis(),
                    updatedOn = clock.millis(),
                )
            )
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
                    it.copy(
                        name = submissionRequest.name,
                        gamesOfTheYear = submissionRequest.gamesOfTheYear,
                        mostAnticipated = submissionRequest.mostAnticipated,
                        bestOldGame = submissionRequest.bestOldGame,
                        enteredGiveaway = submissionRequest.enteredGiveaway,
                        updatedOn = clock.millis(),
                    )
                }
                .map { submissionRepository.save(it) }
                .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND) }
        }

    private fun beforeCutoff(perform: () -> Submission) =
        if (beforeCutoff()) perform() else throw ResponseStatusException(HttpStatus.FORBIDDEN, deadlineMessage)

    private fun beforeCutoff() =
        clock.instant().atZone(submissionProperties.deadline.zone).isBefore(submissionProperties.deadline)
}
