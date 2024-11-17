package com.aleinin.goty.activeYear

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.server.ResponseStatusException

@CrossOrigin
@RestController
class ActiveYearUpdaterController(
    private val activeYearUpdaterService: ActiveYearUpdaterService
) {
    @PutMapping("/active-year/{activeYear}")
    fun putActiveYear(@PathVariable activeYear: Int) = try {
        activeYearUpdaterService.setActiveYear(activeYear)
    } catch (e: InvalidYearException) {
        throw ResponseStatusException(HttpStatus.BAD_REQUEST, e.message)
    }
}