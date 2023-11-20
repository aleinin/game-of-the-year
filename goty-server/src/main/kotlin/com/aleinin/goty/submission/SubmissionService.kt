package com.aleinin.goty.submission

import com.aleinin.goty.properties.Properties
import org.springframework.stereotype.Service
import java.time.Clock
import java.util.*

@Service
class SubmissionService(
    private val submissionRepository: SubmissionRepository,
    private val secretSubmissionRepository: SecretSubmissionRepository,
    private val clock: Clock,
    private val properties: Properties,
) {

    fun getAllSubmissions(): List<Submission> = submissionRepository.findAllSubmissions()

    fun getSubmission(id: UUID): Optional<Submission> = submissionRepository.findSubmissionById(id)

    fun saveSubmission(submissionRequest: SubmissionRequest): SecretSubmission =
        if (afterDeadline()) {
            throw AfterDeadlineException()
        } else if (tooManyGamesOfTheYear(submissionRequest.gamesOfTheYear)) {
            throw TooManyGamesException()
        } else {
            secretSubmissionRepository.save(
                SecretSubmission(
                    id = UUID.randomUUID(),
                    secret = UUID.randomUUID(),
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

    fun updateSubmission(id: UUID, submissionUpdateRequest: SubmissionUpdateRequest): Optional<Submission> =
        if (afterDeadline()) {
            throw AfterDeadlineException()
        } else if (tooManyGamesOfTheYear(submissionUpdateRequest.gamesOfTheYear)) {
            throw TooManyGamesException()
        } else {
            secretSubmissionRepository
                .findById(id)
                .filter { it.secret == submissionUpdateRequest.secret }
                .map {
                    it.copy(
                        name = submissionUpdateRequest.name,
                        gamesOfTheYear = submissionUpdateRequest.gamesOfTheYear,
                        mostAnticipated = submissionUpdateRequest.mostAnticipated,
                        bestOldGame = submissionUpdateRequest.bestOldGame,
                        enteredGiveaway = submissionUpdateRequest.enteredGiveaway,
                        updatedOn = clock.millis(),
                    )
                }
                .map { secretSubmissionRepository.save(it) }
                .map { it.toSubmission() }
        }

    fun deleteAllSubmissions(override: Boolean) =
        if (afterDeadline() || override) {
            submissionRepository.deleteAllSubmissions()
        } else {
            throw OverrideRequiredException()
        }

    fun deleteSubmission(id: UUID): Optional<Unit> =
        submissionRepository.findSubmissionById(id)
            .map { submissionRepository.deleteSubmissionById(id) }

    private fun afterDeadline() =
        !clock.instant().atZone(properties.deadline.zone).isBefore(properties.deadline)

    private fun tooManyGamesOfTheYear(gamesOfTheYear: List<RankedGameSubmission>) =
        gamesOfTheYear.size > properties.tiePoints.size
}