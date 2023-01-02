package com.aleinin.goty.submit

import com.aleinin.goty.properties.Properties
import org.springframework.http.HttpStatus
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestParam
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
    private val tooManyGamesOfTheYearMessage =
        "Too many games of the year. The maximum allowed is ${properties.tiePoints.size}."
    private val overrideRequiredMessage =
        "Submission deadline of ${properties.deadline} has not been met. You must override to delete all submissions."

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

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/submissions")
    fun deleteAllSubmissions(@RequestParam(defaultValue = "false") override: Boolean): Unit =
        validateDeletions(override) { submissionRepository.deleteAll() }

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

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/submissions/{id}")
    fun deleteSubmission(@PathVariable id: UUID): Unit =
        submissionRepository.findById(id)
            .map { submissionRepository.delete(it) }
            .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND) }

    private fun validate(request: SubmissionRequest, perform: () -> Submission) =
        if (afterCutoff()) {
            throw ResponseStatusException(HttpStatus.FORBIDDEN, deadlineMessage)
        } else if (tooManyGamesOfTheYear(request)) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, tooManyGamesOfTheYearMessage)
        } else {
            perform()
        }

    private fun validateDeletions(override: Boolean, perform: () -> Unit) =
        if (afterCutoff() || override) {
            perform()
        } else {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, overrideRequiredMessage)
        }

    private fun afterCutoff() =
        !clock.instant().atZone(properties.deadline.zone).isBefore(properties.deadline)

    private fun tooManyGamesOfTheYear(submissionRequest: SubmissionRequest) =
        submissionRequest.gamesOfTheYear.size > properties.tiePoints.size
}
