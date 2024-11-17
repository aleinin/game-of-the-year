package com.aleinin.goty.properties

import PropertiesUpdateRequest
import org.springframework.http.HttpStatus
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.server.ResponseStatusException
import java.time.ZoneId

@CrossOrigin
@RestController
class PropertiesController(
    private val propertiesService: PropertiesService
) {

    @GetMapping("/properties")
    fun getAllProperties(
        @RequestParam(required = false) localTimeZone: ZoneId?
    ) = propertiesService.getAllPropertiesResponse(localTimeZone)

    @GetMapping("/properties/active")
    fun getActiveProperties(
        @RequestParam(required = false) localTimeZone: ZoneId?
    ) = propertiesService.getActiveYearPropertiesResponse(localTimeZone)

    @GetMapping("/properties/{year}")
    fun getPropertiesForYear(
        @PathVariable year: Int,
        @RequestParam(required = false) localTimeZone: ZoneId?,
    ) = propertiesService.getPropertiesResponse(year, localTimeZone)
        .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND) }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("/properties/{year}")
    fun putProperties(
        @PathVariable year: Int,
        @RequestParam(required = false) localTimeZone: ZoneId?,
        @RequestBody request: PropertiesUpdateRequest
    ) = try {
        propertiesService.replaceProperties(year, request, localTimeZone)
    } catch (e: YearNotFoundException) {
        throw ResponseStatusException(HttpStatus.NOT_FOUND, e.message)
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/properties")
    fun postProperties(
        @RequestParam(required = false) localTimeZone: ZoneId?,
        @RequestBody request: Properties
    ) = try {
        propertiesService.saveProperties(request, localTimeZone)
    } catch (e: PropertiesConflictException) {
        throw ResponseStatusException(HttpStatus.CONFLICT, e.message)
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/properties/{year}")
    fun deleteProperties(
        @PathVariable year: Int
    ) = try {
        propertiesService.deleteProperties(year)
    } catch (e: YearNotFoundException) {
        throw ResponseStatusException(HttpStatus.NOT_FOUND, e.message)
    } catch (e: CannotDeleteActiveYearException) {
        throw ResponseStatusException(HttpStatus.BAD_REQUEST, e.message)
    }
}
