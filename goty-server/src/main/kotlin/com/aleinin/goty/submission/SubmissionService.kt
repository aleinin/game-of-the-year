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

    fun getSubmissionsForYear(year: Int): List<Submission> = submissionRepository.findSubmissionsByYear(year)

    fun getAllSecretSubmissions(year: Int?): List<SecretSubmission> =
        if (year != null) secretSubmissionRepository.findByYear(year)
        else secretSubmissionRepository.findAll()

    fun getSubmissionYears() = submissionRepository.findSubmissionYears()

    fun getSubmission(id: UUID): Optional<Submission> = submissionRepository.findSubmissionById(id)

    fun saveSubmission(submissionCreationRequest: SubmissionCreationRequest): SecretSubmission =
        validateAddSubmission(submissionCreationRequest.gamesOfTheYear) {
            secretSubmissionRepository.save(
                SecretSubmission(
                    id = uuidService.randomID(),
                    secret = uuidService.randomSecret(),
                    name = submissionCreationRequest.name,
                    year = propertiesService.getThisYear(),
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
            validateUpdateSubmission(secretSubmissionRepository.findById(id), submissionUpdateRequest)
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


    fun deleteSubmission(id: UUID): Optional<Unit> =
        submissionRepository.findSubmissionById(id)
            .map { submissionRepository.deleteSubmissionById(id) }

    private fun validateAddSubmission(gamesOfTheYear: List<RankedGameSubmission>, perform: () -> SecretSubmission): SecretSubmission {
        val properties = propertiesService.getProperties()
        validateDeadlineAndGames(properties, gamesOfTheYear)
        return perform()
    }

    private fun validateUpdateSubmission(
            optionalSecretSubmission: Optional<SecretSubmission>,
            request: SubmissionUpdateRequest,
    ): Optional<SecretSubmission> {
        val properties = propertiesService.getProperties()
        validateDeadlineAndGames(properties, request.gamesOfTheYear)
        if (optionalSecretSubmission.isPresent) {
            val secretSubmission = optionalSecretSubmission.get()
            if (secretSubmission.secret != request.secret) {
                throw IncorrectSecretException("Incorrect secret.")
            }
            if (secretSubmission.year != properties.year) {
                throw AfterDeadlineException("Submission year ${secretSubmission.year} has ended. Submission year ${properties.year} is in progress.")
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
