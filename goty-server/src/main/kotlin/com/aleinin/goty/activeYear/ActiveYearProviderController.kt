package com.aleinin.goty.activeYear

import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@CrossOrigin
@RestController
class ActiveYearProviderController(private val activeYearProviderService: ActiveYearProviderService) {
    @GetMapping("/active-year")
    fun getActiveYear() = activeYearProviderService.getActiveYear()
}