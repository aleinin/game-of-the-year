package com.aleinin.goty.submit

import com.aleinin.goty.properties.Properties
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
    private val properties: Properties,
    private val submissionRepository: SubmissionRepository,
    private val clock: Clock
) {

    private val deadlineMessage = "Submission deadline of ${properties.deadline} has been met."
    private val tooManyGamesOfTheYearMessage = "Too many games of the year. The maximum allowed is ${properties.tiePoints.size}"

    @GetMapping("/submissions")
    fun getSubmissions(): List<Submission> = submissionRepository.findAll()

    @PostMapping("/submissions")
    fun addSubmission(@RequestBody submissionRequest: SubmissionRequest) =
        validate(submissionRequest) {
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
        validate(submissionRequest) {
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

    private fun validate(request: SubmissionRequest, perform: () -> Submission) =
        if (afterCutoff()) {
            throw ResponseStatusException(HttpStatus.FORBIDDEN, deadlineMessage)
        } else if (tooManyGamesOfTheYear(request)) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, tooManyGamesOfTheYearMessage)
        } else {
            perform()
        }

    private fun afterCutoff() =
        !clock.instant().atZone(properties.deadline.zone).isBefore(properties.deadline)

    private fun tooManyGamesOfTheYear(submissionRequest: SubmissionRequest) =
        submissionRequest.gamesOfTheYear.size > properties.tiePoints.size
}
