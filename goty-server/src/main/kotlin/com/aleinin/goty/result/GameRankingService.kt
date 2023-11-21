package com.aleinin.goty.result

import com.aleinin.goty.submission.GameSubmission
import org.springframework.stereotype.Component

@Component
class GameRankingService {

    fun rank(games: List<GameSubmission>) =
        games
            .groupingBy { it.id }
            .fold(
                { id, first -> RankedGameResult(id = id, title = first.title) },
                { _, rankedGameResult, _ -> rankedGameResult.copy(votes = rankedGameResult.votes + 1) },
            )
            .map { it.value }
            .groupBy { it.votes }
            .toSortedMap(reverseOrder())
            .asSequence()
            .flatMapIndexed { rank, (_, group) -> group.map { it.copy(rank = rank) } }
            .toList()
}
