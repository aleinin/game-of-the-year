package com.aleinin.goty.elasticsearch;

import org.elasticsearch.client.RestHighLevelClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.elasticsearch.client.ClientConfiguration;
import org.springframework.data.elasticsearch.client.RestClients;

@Configuration
class ElasticsearchConfiguration {

    @Bean
    RestHighLevelClient elasticsearchClient() {
        var clientConfiguration = ClientConfiguration.builder()
                .connectedTo("elasticsearch:9200")
                .build();
        return RestClients.create(clientConfiguration).rest();
    }
}
