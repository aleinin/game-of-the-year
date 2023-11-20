package com.aleinin.goty.result

import com.aleinin.goty.submission.RankedGameSubmission
import org.springframework.stereotype.Component

@Component
class GameScoringService(private val pointsService: PointsService) {

    fun score(games: List<RankedGameSubmission>) =
        games
            .groupingBy { it.id }
            .fold(
                { id, first -> ScoredGameResult(id = id, title = first.title) },
                { _, scoredGameResult, rankedGameSubmission ->
                    scoredGameResult.copy(
                        points = scoredGameResult.points + pointsService.calculatePoints(rankedGameSubmission.rank),
                        votes = scoredGameResult.votes + 1,
                    )
                },
            )
            .map { it.value }
            .groupBy { ScoreKey(it.votes, it.points) }
            .toSortedMap()
            .asSequence()
            .flatMapIndexed { rank, (_, group) -> group.map { it.copy(rank = rank) } }
            .toList()

    private data class ScoreKey(val votes: Int, val points: Int) : Comparable<ScoreKey> {

        override fun compareTo(other: ScoreKey) =
            if (other.votes == votes) other.points - points else other.votes - votes
    }
}
