package com.aleinin.goty.result

import com.aleinin.goty.properties.PropertiesService
import com.aleinin.goty.submission.Submission
import com.aleinin.goty.submission.SubmissionArchiveService
import com.aleinin.goty.submission.SubmissionService
import org.springframework.stereotype.Component

@Component
class ResultService(
    private val gameRankingService: GameRankingService,
    private val gameScoringService: GameScoringService,
    private val propertiesService: PropertiesService,
    private val submissionService: SubmissionService,
    private val submissionArchiveService: SubmissionArchiveService
) {
    fun getResultsForActiveYear(): ResultResponse = calculate(submissionService.getAllSubmissions(), propertiesService.getActiveYear())

    fun getResultsForYear(year: Int): ResultResponse = calculate(submissionArchiveService.getAllSubmissionsForYear(year), year)

    fun getResultsYears(): List<Int> = submissionArchiveService.getSubmissionYears()

    private fun calculate(submissions: List<Submission>, year: Int): ResultResponse {
        val tiePoints = propertiesService.getTiePoints(year)
        return ResultResponse(
            year = year,
            gamesOfTheYear = gameScoringService.score(submissions.flatMap { it.gamesOfTheYear }, tiePoints),
            mostAnticipated = gameRankingService.rank(submissions.mapNotNull { it.mostAnticipated }),
            mostDisappointing = gameRankingService.rank(submissions.mapNotNull { it.mostDisappointing }),
            bestOldGame = gameRankingService.rank(submissions.mapNotNull { it.bestOldGame }),
            participants = submissions.map { it.name },
            giveawayParticipants = submissions.filter { it.enteredGiveaway }.map { it.name },
        )
    }
}
