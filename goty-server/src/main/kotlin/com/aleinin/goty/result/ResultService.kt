package com.aleinin.goty.result

import com.aleinin.goty.submission.Submission
import org.springframework.stereotype.Component

@Component
class ResultService(
    private val gameRankingService: GameRankingService,
    private val gameScoringService: GameScoringService,
) {

    fun calculate(submissions: List<Submission>) =
        ResultResponse(
            gamesOfTheYear = gameScoringService.score(submissions.flatMap { it.gamesOfTheYear }),
            mostAnticipated = gameRankingService.rank(submissions.mapNotNull { it.mostAnticipated }),
            bestOldGame = gameRankingService.rank(submissions.mapNotNull { it.bestOldGame }),
            participants = submissions.map { it.name },
            giveawayParticipants = submissions.filter { it.enteredGiveaway }.map { it.name },
        )
}
