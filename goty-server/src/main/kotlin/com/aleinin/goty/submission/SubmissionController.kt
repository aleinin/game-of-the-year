package com.aleinin.goty.submission

import com.aleinin.goty.properties.Properties
import org.springframework.http.HttpStatus
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import org.springframework.web.server.ResponseStatusException
import java.util.UUID

@CrossOrigin
@RestController
class SubmissionController(
    properties: Properties,
    private val submissionService: SubmissionService,
) {

    private val deadlineMessage = "Submission deadline of ${properties.deadline} has been met."
    private val tooManyGamesOfTheYearMessage =
        "Too many games of the year. The maximum allowed is ${properties.tiePoints.size}."
    private val overrideRequiredMessage =
        "Submission deadline of ${properties.deadline} has not been met. You must override to delete all submissions."

    @GetMapping("/submissions")
    fun getSubmissions(): List<Submission> = submissionService.getAllSubmissions()

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/submissions/secret")
    fun getSecretSubmissions(): List<SecretSubmission> = submissionService.getAllSecretSubmissions()

    @PostMapping("/submissions")
    fun addSubmission(@RequestBody submissionCreationRequest: SubmissionCreationRequest) =
        try {
            submissionService.saveSubmission(submissionCreationRequest)
        } catch (e: AfterDeadlineException) {
            throw ResponseStatusException(HttpStatus.FORBIDDEN, deadlineMessage)
        } catch (e: TooManyGamesException) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, tooManyGamesOfTheYearMessage)
        }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/submissions")
    fun deleteAllSubmissions(@RequestParam(defaultValue = "false") override: Boolean): Unit =
        try {
            submissionService.deleteAllSubmissions(override)
        } catch (e: OverrideRequiredException) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, overrideRequiredMessage)
        }


    @GetMapping("/submissions/{id}")
    fun getSubmission(@PathVariable id: UUID): Submission =
        submissionService.getSubmission(id).orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND) }

    @PutMapping("/submissions/{id}")
    fun updateSubmission(@PathVariable id: UUID, @RequestBody submissionUpdateRequest: SubmissionUpdateRequest): Submission =
        try {
            submissionService.updateSubmission(id, submissionUpdateRequest)
                .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND) }
        } catch (e: AfterDeadlineException) {
            throw ResponseStatusException(HttpStatus.FORBIDDEN, deadlineMessage)
        } catch (e: TooManyGamesException) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, tooManyGamesOfTheYearMessage)
        }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/submissions/{id}")
    fun deleteSubmission(@PathVariable id: UUID): Unit =
        submissionService.deleteSubmission(id)
            .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND) }
}
