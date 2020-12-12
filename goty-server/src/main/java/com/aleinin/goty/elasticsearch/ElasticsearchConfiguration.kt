package com.aleinin.goty.elasticsearch

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.data.elasticsearch.client.ClientConfiguration
import org.springframework.data.elasticsearch.client.RestClients

@Configuration
class ElasticsearchConfiguration(private val elasticsearchProperties: ElasticsearchProperties) {

    @Bean fun elasticsearchClient() =
        RestClients.create(ClientConfiguration.create(elasticsearchProperties.hostAndPort)).rest()
}
