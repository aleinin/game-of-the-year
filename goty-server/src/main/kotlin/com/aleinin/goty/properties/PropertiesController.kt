package com.aleinin.goty.properties

import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController


@CrossOrigin
@RestController
class PropertiesController(
    private val propertiesService: PropertiesService
) {

    @GetMapping("/properties")
    fun getProperties() = propertiesService.getProperties()

    @PutMapping("/properties")
    fun putProperties(@RequestBody request: Properties) = propertiesService.replaceProperties(request)
}
