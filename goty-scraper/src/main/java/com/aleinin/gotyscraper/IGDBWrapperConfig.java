package com.aleinin.gotyscraper;

import com.api.igdb.request.IGDBWrapper;
import com.api.igdb.request.TwitchAuthenticator;
import com.google.common.base.Preconditions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
class IGDBWrapperConfig {

    @Bean
    IGDBWrapper igdbClient(@Value("${TWITCH_CLIENT_ID}") String clientId,
                           @Value("${TWITCH_CLIENT_SECRET}") String clientSecret) {
        Preconditions.checkNotNull(clientId);
        Preconditions.checkNotNull(clientSecret);
        var twitchAuthenticator = TwitchAuthenticator.INSTANCE;
        var igdbClient = IGDBWrapper.INSTANCE;
        var accessToken = twitchAuthenticator
                .requestTwitchToken(clientId, clientSecret)
                .getAccess_token();
        igdbClient.setCredentials(clientId, accessToken);
        return igdbClient;
    }
}
