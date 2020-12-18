package com.aleinin.goty.result

import org.springframework.stereotype.Component

@Component
class PointsService {

    fun points(rank: Int) =
        when (rank) {
            0 -> 15
            1 -> 13
            2 -> 11
            3 -> 7
            4 -> 6
            5 -> 5
            6 -> 4
            7 -> 3
            8 -> 2
            9 -> 1
            else -> 0
        }
}
