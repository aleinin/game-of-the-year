package com.aleinin.goty.elasticsearch

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.boot.context.properties.ConstructorBinding

@ConstructorBinding
@ConfigurationProperties("goty.elasticsearch")
data class ElasticsearchProperties(val hostAndPort: String)
