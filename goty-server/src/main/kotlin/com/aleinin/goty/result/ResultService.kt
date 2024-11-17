package com.aleinin.goty.result

import com.aleinin.goty.properties.PropertiesService
import com.aleinin.goty.submission.Submission
import org.springframework.stereotype.Component

@Component
class ResultService(
    private val gameRankingService: GameRankingService,
    private val gameScoringService: GameScoringService,
    private val propertiesService: PropertiesService
) {

    fun calculate(submissions: List<Submission>, year: Int): ResultResponse {
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
