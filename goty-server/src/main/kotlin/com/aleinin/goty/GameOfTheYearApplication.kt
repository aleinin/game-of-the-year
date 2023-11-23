package com.aleinin.goty

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.context.properties.ConfigurationPropertiesScan
import org.springframework.boot.runApplication

@SpringBootApplication
@ConfigurationPropertiesScan
open class GameOfTheYearApplication

fun main(args: Array<String>) {
    runApplication<GameOfTheYearApplication>(*args)
}
