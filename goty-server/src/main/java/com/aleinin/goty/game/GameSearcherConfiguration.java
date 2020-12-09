package com.aleinin.goty.game;

import com.google.common.collect.ImmutableCollection;
import lombok.extern.slf4j.Slf4j;
import org.apache.lucene.document.*;
import org.apache.lucene.index.DirectoryReader;
import org.apache.lucene.index.IndexWriter;
import org.apache.lucene.index.IndexWriterConfig;
import org.apache.lucene.search.IndexSearcher;
import org.apache.lucene.store.ByteBuffersDirectory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;
import java.util.Set;

import static com.google.common.collect.ImmutableSet.toImmutableSet;

@Slf4j
@Configuration
class GameSearcherConfiguration {

    @Bean
    IndexSearcher gameSearcher(GameLoader gameLoader) throws IOException {
        var games = gameLoader.fromFile();
        var gameDocuments = parseGameDocuments(games.values());
        var indexWriterConfig = new IndexWriterConfig();
        try (var directory = new ByteBuffersDirectory();
             var indexWriter = new IndexWriter(directory, indexWriterConfig)) {
            indexWriter.addDocuments(gameDocuments);
            indexWriter.close();
            var indexReader = DirectoryReader.open(directory);
            return new IndexSearcher(indexReader);
        }
    }

    private Set<Document> parseGameDocuments(ImmutableCollection<Game> games) {
        return games
                .stream()
                .map(this::toDocument)
                .collect(toImmutableSet());
    }

    private Document toDocument(Game game) {
        var document = new Document();
        document.add(new StoredField("id", game.getId()));
        game.getAliases().forEach(alias -> document.add(new TextField("aliases", alias, Field.Store.YES)));
        return document;
    }
}
