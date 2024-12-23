package com.aleinin.goty.submission

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
import java.util.UUID

@CrossOrigin
@RestController
class SubmissionController(
        private val submissionService: SubmissionService,
) {
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/submissions/secret")
    fun getSecretSubmissions(): List<SecretSubmission> = submissionService.getAllSecretSubmissions()


    @GetMapping("/submissions")
    fun getSubmissions(@RequestParam(required = false) year: String?): List<Submission> = submissionService.getAllSubmissions()

    @PostMapping("/submissions")
    fun createSubmission(@RequestBody submissionCreationRequest: SubmissionCreationRequest) =
            try {
                submissionService.createSubmission(submissionCreationRequest)
            } catch (e: AfterDeadlineException) {
                throw ResponseStatusException(HttpStatus.FORBIDDEN, e.message)
            } catch (e: TooManyGamesException) {
                throw ResponseStatusException(HttpStatus.BAD_REQUEST, e.message)
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
                throw ResponseStatusException(HttpStatus.FORBIDDEN, e.message)
            } catch (e: TooManyGamesException) {
                throw ResponseStatusException(HttpStatus.BAD_REQUEST, e.message)
            } catch (e: IncorrectSecretException) {
                throw ResponseStatusException(HttpStatus.FORBIDDEN, e.message)
            }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/submissions/{id}")
    fun deleteSubmission(@PathVariable id: UUID): Unit =
            submissionService.deleteSubmission(id)
                    .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND) }
}
