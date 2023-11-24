package com.aleinin.goty.submission

import com.aleinin.goty.properties.PropertiesService
import org.springframework.stereotype.Service
import java.time.Clock
import java.time.ZonedDateTime
import java.util.Optional
import java.util.UUID

@Service
class SubmissionService(
    private val submissionRepository: SubmissionRepository,
    private val secretSubmissionRepository: SecretSubmissionRepository,
    private val propertiesService: PropertiesService,
    private val clock: Clock,
) {

    fun getAllSubmissions(): List<Submission> = submissionRepository.findAllSubmissions()

    fun getAllSecretSubmissions(): List<SecretSubmission> = secretSubmissionRepository.findAll()

    fun getSubmission(id: UUID): Optional<Submission> = submissionRepository.findSubmissionById(id)

    fun saveSubmission(submissionCreationRequest: SubmissionCreationRequest): SecretSubmission =
        validateAddUpdate(submissionCreationRequest.gamesOfTheYear) {
            secretSubmissionRepository.save(
                SecretSubmission(
                    id = UUID.randomUUID(),
                    secret = UUID.randomUUID(),
                    name = submissionCreationRequest.name,
                    gamesOfTheYear = submissionCreationRequest.gamesOfTheYear,
                    mostAnticipated = submissionCreationRequest.mostAnticipated,
                    bestOldGame = submissionCreationRequest.bestOldGame,
                    enteredGiveaway = submissionCreationRequest.enteredGiveaway,
                    enteredOn = clock.millis(),
                    updatedOn = clock.millis(),
                )
            )
        }

    fun updateSubmission(id: UUID, submissionUpdateRequest: SubmissionUpdateRequest): Optional<Submission> =
        validateAddUpdate(submissionUpdateRequest.gamesOfTheYear) {
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
        validateDeleteAll(override) {
            submissionRepository.deleteAllSubmissions()
        }

    fun deleteSubmission(id: UUID): Optional<Unit> =
        submissionRepository.findSubmissionById(id)
            .map { submissionRepository.deleteSubmissionById(id) }

    private fun <T> validateAddUpdate(gamesOfTheYear: List<RankedGameSubmission>, perform: () -> T): T {
        val properties = propertiesService.getProperties()
        if (afterDeadline(properties.deadline)) {
            throw AfterDeadlineException("Submission deadline of ${properties.deadline} has been met.")
        } else if (tooManyGamesOfTheYear(gamesOfTheYear, properties.tiePoints)) {
            throw TooManyGamesException("Too many games of the year. The maximum allowed is ${properties.tiePoints.size}.")
        } else {
            return perform()
        }
    }

    private fun validateDeleteAll(override: Boolean, perform: () -> Unit) {
        val properties = propertiesService.getProperties()
        if (!override && !afterDeadline(properties.deadline)) {
            throw OverrideRequiredException("Submission deadline of ${properties.deadline} has not been met. You must override to delete all submissions.")
        } else {
            return perform()
        }
    }

    private fun afterDeadline(deadline: ZonedDateTime) =
        !clock.instant().atZone(deadline.zone).isBefore(deadline)

    private fun tooManyGamesOfTheYear(gamesOfTheYear: List<RankedGameSubmission>, tiePoints: List<Int>) =
        gamesOfTheYear.size > tiePoints.size
}
