package com.aleinin.goty.submit

import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController
import java.util.*

@RestController
class GameOfTheYearController(val gameOfTheYearRepository: GameOfTheYearRepository) {

    @PostMapping("/submit")
    fun submit(@RequestBody gameOfTheYearSubmission: GameOfTheYearSubmission) =
            gameOfTheYearRepository.save(gameOfTheYearSubmission.copy(id = UUID.randomUUID()))
}
