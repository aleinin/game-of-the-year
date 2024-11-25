package com.aleinin.goty.submission

import com.aleinin.goty.properties.Properties
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
    private val uuidService: UUIDService
) {

    fun getAllSubmissions(): List<Submission> = submissionRepository.findSubmissionsByYear(propertiesService.getActiveYear())

    fun getAllSecretSubmissions(): List<SecretSubmission> =
        secretSubmissionRepository.findByYear(propertiesService.getActiveYear())

    fun getSubmission(id: UUID): Optional<Submission> = submissionRepository.findSubmissionByIdAndYear(id, propertiesService.getActiveYear())

    fun createSubmission(submissionCreationRequest: SubmissionCreationRequest): SecretSubmission =
        validateCreateSubmission(submissionCreationRequest.gamesOfTheYear) {
            secretSubmissionRepository.save(
                SecretSubmission(
                    id = uuidService.randomID(),
                    secret = uuidService.randomSecret(),
                    name = submissionCreationRequest.name,
                    year = propertiesService.getActiveYear(),
                    gamesOfTheYear = submissionCreationRequest.gamesOfTheYear,
                    mostAnticipated = submissionCreationRequest.mostAnticipated,
                    mostDisappointing =  submissionCreationRequest.mostDisappointing,
                    bestOldGame = submissionCreationRequest.bestOldGame,
                    enteredGiveaway = submissionCreationRequest.enteredGiveaway,
                    enteredOn = clock.millis(),
                    updatedOn = clock.millis(),
                )
            )
        }
    fun updateSubmission(id: UUID, submissionUpdateRequest: SubmissionUpdateRequest): Optional<Submission> =
            validateUpdateSubmission(secretSubmissionRepository.findByIdAndYear(id, propertiesService.getActiveYear()), submissionUpdateRequest)
                .map {
                    it.copy(
                            name = submissionUpdateRequest.name,
                            gamesOfTheYear = submissionUpdateRequest.gamesOfTheYear,
                            mostAnticipated = submissionUpdateRequest.mostAnticipated,
                            mostDisappointing =  submissionUpdateRequest.mostDisappointing,
                            bestOldGame = submissionUpdateRequest.bestOldGame,
                            enteredGiveaway = submissionUpdateRequest.enteredGiveaway,
                            updatedOn = clock.millis(),
                    )
                }
                .map { secretSubmissionRepository.save(it) }
                .map { it.toSubmission() }

    fun deleteSubmission(id: UUID): Optional<Unit> =
        submissionRepository.findSubmissionByIdAndYear(id, propertiesService.getActiveYear())
            .map { submissionRepository.deleteSubmissionById(id) }

    private fun validateCreateSubmission(gamesOfTheYear: List<RankedGameSubmission>, perform: () -> SecretSubmission): SecretSubmission {
        val properties = propertiesService.getActiveYearProperties()
        validateDeadlineAndGames(properties, gamesOfTheYear)
        return perform()
    }

    private fun validateUpdateSubmission(
            optionalSecretSubmission: Optional<SecretSubmission>,
            request: SubmissionUpdateRequest,
    ): Optional<SecretSubmission> {
        val properties = propertiesService.getActiveYearProperties()
        validateDeadlineAndGames(properties, request.gamesOfTheYear)
        if (optionalSecretSubmission.isPresent) {
            val secretSubmission = optionalSecretSubmission.get()
            if (secretSubmission.secret != request.secret) {
                throw IncorrectSecretException("Incorrect secret.")
            }
        }
        return optionalSecretSubmission
    }

    private fun validateDeadlineAndGames(properties: Properties, gamesOfTheYear: List<RankedGameSubmission>) {
        if (afterDeadline(properties.deadline)) {
            throw AfterDeadlineException("Submission deadline of ${properties.deadline} has been met.")
        } else if (tooManyGamesOfTheYear(gamesOfTheYear, properties.tiePoints)) {
            throw TooManyGamesException("Too many games of the year. The maximum allowed is ${properties.tiePoints.size}.")
        }
    }

    private fun afterDeadline(deadline: ZonedDateTime) =
        !clock.instant().atZone(deadline.zone).isBefore(deadline)

    private fun tooManyGamesOfTheYear(gamesOfTheYear: List<RankedGameSubmission>, tiePoints: List<Int>) =
        gamesOfTheYear.size > tiePoints.size
}
