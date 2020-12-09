package com.aleinin.goty.elasticsearch;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.elasticsearch.action.bulk.BulkRequest;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.common.xcontent.XContentType;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.stream.StreamSupport;

@Slf4j
//@Component
@RequiredArgsConstructor
class ElasticsearchLoaderRunner implements ApplicationRunner {

    private final RestHighLevelClient elasticsearchClient;
    private final ObjectMapper objectMapper;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        Files.list(Paths.get("./.games"))
                .map(Path::toFile)
                .forEach(this::loadElasticsearch);
        log.info("done!");
    }

    private void loadElasticsearch(File file) {
        try {
            var gamesTree = objectMapper.readTree(file);
            var bulkRequest = new BulkRequest();
            StreamSupport.stream(gamesTree.spliterator(), false)
                    .map(game -> new IndexRequest()
                            .index("games")
                            .id(game.get("id").asText())
                            .source(game.toString(), XContentType.JSON))
                    .forEach(bulkRequest::add);
            elasticsearchClient.bulk(bulkRequest, RequestOptions.DEFAULT);
        } catch (IOException e) {
            log.error(e.getMessage(), e);
        }
    }
}
