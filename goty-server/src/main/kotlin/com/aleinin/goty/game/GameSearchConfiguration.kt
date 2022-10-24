package com.aleinin.goty.game

import com.api.igdb.request.IGDBWrapper
import com.api.igdb.request.IGDBWrapper.setCredentials
import com.api.igdb.request.TwitchAuthenticator.requestTwitchToken
import org.slf4j.LoggerFactory
import org.springframework.context.ApplicationListener
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Profile
import org.springframework.context.event.ContextRefreshedEvent
import javax.validation.Valid

@Configuration
@Profile("!igdb")
class DefaultUnconfiguredSearchConfiguration {

    private companion object {
        private val logger = LoggerFactory.getLogger(DefaultUnconfiguredSearchConfiguration::class.java)
    }

    @Bean
    fun warnUnconfiguredGameSearch() = ApplicationListener<ContextRefreshedEvent> {
        logger.warn("Game search is not configured. Consider activating the 'igdb' profile.")
    }

    @Bean
    fun defaultUnconfiguredSearchClient() = object : GameSearchClient {
        override fun findGames(title: String, year: Int?, mainGame: Boolean, limit: Int) =
            throw IllegalStateException("Game search is not configured. The 'igdb' profile must be active.")
    }
}

@Configuration
@Profile("igdb")
class IGDBSearchConfiguration {

    @Bean
    fun igdbWrapper(@Valid properties: IGDBProperties): IGDBWrapper {
        val twitchToken = requestTwitchToken(properties.twitchClientId!!, properties.twitchClientSecret!!)
        setCredentials(properties.twitchClientId!!, twitchToken!!.access_token)
        return IGDBWrapper
    }
}
