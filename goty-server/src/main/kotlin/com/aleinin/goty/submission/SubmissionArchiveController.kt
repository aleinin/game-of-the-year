package com.aleinin.goty.submission

import com.aleinin.goty.properties.YearNotFoundException
import org.springframework.http.HttpStatus
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.server.ResponseStatusException
import java.util.UUID

@CrossOrigin
@RestController
class SubmissionArchiveController(
    private val submissionArchiveService: SubmissionArchiveService,
) {

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/submissions/archive/{year}/secret")
    fun getSecretSubmissions(@PathVariable year: String): List<SecretSubmission> = submissionArchiveService.getAllSecretSubmissionsForYear(year)


    @GetMapping("/submissions/archive/{year}")
    fun getSubmissions(@PathVariable year: String): List<Submission> = submissionArchiveService.getAllSubmissionsForYear(year)

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/submissions/archive/{year}")
    fun addSubmission(@PathVariable year: String, @RequestBody submissionCreationRequest: SubmissionCreationRequest) =
        try {
            submissionArchiveService.createSubmissionForYear(year, submissionCreationRequest)
        } catch (e: YearNotFoundException) {
            throw ResponseStatusException(HttpStatus.NOT_FOUND, e.message)
        } catch (e: TooManyGamesException) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, e.message)
        }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/submissions/archive/batch")
    fun addSubmissionsBatch(@RequestBody submissions: List<SubmissionBatchCreationRequest>) = submissionArchiveService.createSubmissionsBatch(submissions)

    @GetMapping("/submissions/archive/{year}/{id}")
    fun getSubmission(@PathVariable year: String, @PathVariable id: UUID): Submission =
        submissionArchiveService.getSubmissionForYearById(year, id).orElseThrow { ResponseStatusException(
            HttpStatus.NOT_FOUND) }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("/submissions/archive/{year}/{id}")
    fun updateSubmission(@PathVariable year: String, @PathVariable id: UUID, @RequestBody submissionUpdateRequest: SubmissionUpdateRequest): Submission =
        try {
            submissionArchiveService.updateSubmissionForYearById(year, id, submissionUpdateRequest)
                .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND) }
        } catch (e: YearNotFoundException) {
            throw ResponseStatusException(HttpStatus.NOT_FOUND, e.message)
        } catch (e: TooManyGamesException) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, e.message)
        } catch (e: IncorrectSecretException) {
            throw ResponseStatusException(HttpStatus.FORBIDDEN, e.message)
        }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/submissions/archive/{year}/{id}")
    fun deleteSubmission(@PathVariable year: String, @PathVariable id: UUID): Unit =
        submissionArchiveService.deleteSubmissionForYearById(year, id)
            .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND) }
}