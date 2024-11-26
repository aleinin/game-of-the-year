package com.aleinin.goty.submission

import com.aleinin.goty.properties.PropertiesService
import com.aleinin.goty.properties.YearNotFoundException
import org.springframework.stereotype.Service
import java.time.Clock
import java.util.Optional
import java.util.UUID

@Service
class SubmissionArchiveService(
    private val submissionRepository: SubmissionRepository,
    private val secretSubmissionRepository: SecretSubmissionRepository,
    private val propertiesService: PropertiesService,
    private val clock: Clock,
    private val uuidService: UUIDService
) {
    fun getSubmissionYears(): List<String> {
        val distinctYears = submissionRepository.findSubmissionYears()
        val thisYear = propertiesService.getActiveYear()
        val years = if (distinctYears.contains(thisYear)) distinctYears else distinctYears.plus(thisYear)
        return years.sortedDescending()
    }

    fun getAllSecretSubmissionsForYear(year: String): List<SecretSubmission> = secretSubmissionRepository.findByYear(year)

    fun getAllSubmissionsForYear(year: String): List<Submission> = submissionRepository.findSubmissionsByYear(year)

    fun createSubmissionForYear(year: String, submissionCreationRequest: SubmissionCreationRequest): SecretSubmission =
        validateArchiveCreateSubmission(year, submissionCreationRequest.gamesOfTheYear) {
            secretSubmissionRepository.save(
                SecretSubmission(
                    id = uuidService.randomID(),
                    secret = uuidService.randomSecret(),
                    name = submissionCreationRequest.name,
                    year = year,
                    gamesOfTheYear = submissionCreationRequest.gamesOfTheYear,
                    mostAnticipated = submissionCreationRequest.mostAnticipated,
                    mostDisappointing = submissionCreationRequest.mostDisappointing,
                    bestOldGame = submissionCreationRequest.bestOldGame,
                    enteredGiveaway = submissionCreationRequest.enteredGiveaway,
                    enteredOn = clock.millis(),
                    updatedOn = clock.millis(),
                )
            )
        }

    fun getSubmissionForYearById(year: String, id: UUID): Optional<Submission> =
        submissionRepository.findSubmissionByIdAndYear(id, year)

    fun updateSubmissionForYearById(year: String, id: UUID, submissionUpdateRequest: SubmissionUpdateRequest): Optional<Submission> =
        validateArchiveUpdateSubmission(year, secretSubmissionRepository.findById(id), submissionUpdateRequest)
            .map {
                it.copy(
                    name = submissionUpdateRequest.name,
                    gamesOfTheYear = submissionUpdateRequest.gamesOfTheYear,
                    mostAnticipated = submissionUpdateRequest.mostAnticipated,
                    mostDisappointing = submissionUpdateRequest.mostDisappointing,
                    bestOldGame = submissionUpdateRequest.bestOldGame,
                    enteredGiveaway = submissionUpdateRequest.enteredGiveaway,
                    updatedOn = clock.millis(),
                )
            }
            .map { secretSubmissionRepository.save(it) }
            .map { it.toSubmission() }

    fun deleteSubmissionForYearById(year: String, id: UUID): Optional<Unit> = secretSubmissionRepository.findByIdAndYear(id, year)
        .map { secretSubmissionRepository.deleteById(it.id) }

    private fun validateArchiveCreateSubmission(year: String, gamesOfTheYear: List<RankedGameSubmission>, perform: () -> SecretSubmission): SecretSubmission {
        val properties = propertiesService.getProperties(year).orElseThrow { YearNotFoundException(year) }
        validateGames(properties.tiePoints, gamesOfTheYear)
        return perform()
    }

    private fun validateArchiveUpdateSubmission(
        year: String,
        optionalSecretSubmission: Optional<SecretSubmission>,
        request: SubmissionUpdateRequest,
    ): Optional<SecretSubmission> {
        val properties = propertiesService.getProperties(year).orElseThrow { YearNotFoundException(year) }
        validateGames(properties.tiePoints, request.gamesOfTheYear)
        if (optionalSecretSubmission.isPresent) {
            val secretSubmission = optionalSecretSubmission.get()
            if (secretSubmission.secret != request.secret) {
                throw IncorrectSecretException("Incorrect secret.")
            }
        }
        return optionalSecretSubmission
    }

    private fun validateGames(tiePoints: List<Int>, gamesOfTheYear: List<RankedGameSubmission>) {
        if (gamesOfTheYear.size > tiePoints.size) {
            throw TooManyGamesException("Too many games of the year. The maximum allowed is ${tiePoints.size}.")
        }
    }
}