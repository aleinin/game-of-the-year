package com.aleinin.goty.result

import com.aleinin.goty.submit.GameSubmission
import com.aleinin.goty.submit.RankedGameSubmission
import com.aleinin.goty.submit.Submission
import org.springframework.stereotype.Component
import java.util.SortedMap

@Component
class ResultService(private val pointsService: PointsService) {

    fun calculate(submissions: List<Submission>) =
        ResultResponse(
            gamesOfTheYear = score(submissions.flatMap { it.gamesOfTheYear }),
            mostAnticipated = rank(submissions.mapNotNull { it.mostAnticipated }),
            bestOldGame = rank(submissions.mapNotNull { it.bestOldGame }),
            participants = submissions.filter { it.enteredGiveaway }.map { it.name },
        )

    private fun rank(games: List<GameSubmission>, limit: Int = 1) =
        games
            .groupingBy { it.id }
            .fold(RankedGameResult()) { gameResult, gameSubmission ->
                gameResult.copy(
                    id = gameSubmission.id,
                    title = gameSubmission.title,
                    votes = gameResult.votes + 1,
                )
            }
            .map { it.value }
            .groupBy { it.votes }
            .toSortedMap(reverseOrder())
            .takeMinValues(limit)
            .map { pair -> pair.second.copy(rank = pair.first) }

    private fun score(games: List<RankedGameSubmission>, limit: Int = 10) =
        games
            .groupingBy { it.id }
            .fold(ScoredGameResult()) { rankedGameResult, rankedGameSubmission ->
                rankedGameResult.copy(
                    id = rankedGameSubmission.id,
                    title = rankedGameSubmission.title,
                    points = rankedGameResult.points + pointsService.calculatePoints(rankedGameSubmission.rank),
                    votes = rankedGameResult.votes + 1,
                )
            }
            .map { it.value }
            .groupBy { Pair(it.votes, it.points) }
            .toSortedMap(this::sortByVotesThenPoints)
            .takeMinValues(limit)
            .map { pair -> pair.second.copy(rank = pair.first) }

    private fun sortByVotesThenPoints(a: Pair<Int, Int>, b: Pair<Int, Int>) =
        if (a.first == b.first) b.second - a.second else b.first - a.first

    private final tailrec fun <T> SortedMap<*, List<T>>.takeMinValues(
        min: Int,
        toLimit: List<Map.Entry<*, List<T>>> = this.entries.toList(),
        limitedList: List<Pair<Int, T>> = emptyList(),
        index: Int = 0,
    ): List<Pair<Int, T>> =
        if (index >= toLimit.size || limitedList.size >= min) {
            limitedList
        } else {
            takeMinValues(min, toLimit, limitedList.plus(toLimit[index].value.map { Pair(index, it) }), index + 1)
        }
}
