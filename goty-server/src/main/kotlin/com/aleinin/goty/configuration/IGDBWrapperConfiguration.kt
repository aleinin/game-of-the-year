package com.aleinin.goty.configuration

import com.api.igdb.request.IGDBWrapper
import com.api.igdb.request.TwitchAuthenticator
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import java.util.*

@Configuration
internal class IGDBWrapperConfiguration {
    @Bean
    fun igdbWrapper(@Value("\${TWITCH_CLIENT_ID}") clientId: String,
                    @Value("\${TWITCH_CLIENT_SECRET}") clientSecret: String): IGDBWrapper {
        Objects.requireNonNull(clientId)
        Objects.requireNonNull(clientSecret)
        val twitchAuthenticator = TwitchAuthenticator
        val igdbClient = IGDBWrapper
        val twitchToken = twitchAuthenticator.requestTwitchToken(clientId, clientSecret)
        val accessToken = Objects.requireNonNull(twitchToken)!!.access_token
        igdbClient.setCredentials(clientId, accessToken)
        return igdbClient
    }
}