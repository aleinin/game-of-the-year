package com.aleinin.goty.submit

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import org.springframework.web.server.ResponseStatusException
import java.util.*

@RestController
class GameOfTheYearController(val gameOfTheYearRepository: GameOfTheYearRepository) {

    @GetMapping("/submissions/{id}")
    fun getSubmission(@PathVariable id: UUID) =
        gameOfTheYearRepository.findById(id).orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND) }!!

    @PutMapping("/submissions/{id}")
    fun updateSubmission(@PathVariable id: UUID, @RequestBody gameOfTheYearSubmission: GameOfTheYearSubmission) =
        gameOfTheYearRepository.save(gameOfTheYearSubmission.copy(id = id))

    @PostMapping("/submissions")
    fun insertSubmission(@RequestBody gameOfTheYearSubmission: GameOfTheYearSubmission) =
            gameOfTheYearRepository.insert(gameOfTheYearSubmission.copy(id = UUID.randomUUID()))
}
