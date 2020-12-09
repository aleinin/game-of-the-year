package com.aleinin.goty.game;

import com.google.common.collect.ImmutableList;
import com.google.common.collect.ImmutableMap;
import lombok.extern.slf4j.Slf4j;
import org.apache.lucene.analysis.Analyzer;
import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.document.Document;
import org.apache.lucene.queryparser.classic.ParseException;
import org.apache.lucene.queryparser.classic.QueryParser;
import org.apache.lucene.search.IndexSearcher;
import org.apache.lucene.search.ScoreDoc;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;

import static com.google.common.collect.ImmutableList.toImmutableList;

@Slf4j
@Component
class GameService {

    private static final Analyzer analyzer = new StandardAnalyzer();

    private final IndexSearcher gameTitleSearcher;
    private final ImmutableMap<String, Game> games;

    GameService(IndexSearcher gameTitleSearcher,
                GameLoader gameLoader) {
        this.gameTitleSearcher = gameTitleSearcher;
        this.games = gameLoader.fromFile();
    }

    public List<Game> search(String game, int count) {
        try {
            var query = new QueryParser("aliases", analyzer).parse(game);
            return Arrays.stream(gameTitleSearcher.search(query, count).scoreDocs)
                    .map(scoredTitleDocument -> findTitleDocument(gameTitleSearcher, scoredTitleDocument))
                    .filter(Objects::nonNull)
                    .map(document -> games.get(document.get("id")))
                    .collect(toImmutableList());
        } catch (ParseException | IOException e) {
            log.error(e.getMessage(), e);
        }
        return ImmutableList.of();
    }

    private Document findTitleDocument(IndexSearcher searcher, ScoreDoc scoreDoc) {
        try {
            return searcher.doc(scoreDoc.doc);
        } catch (IOException e) {
            log.error(e.getMessage(), e);
        }

        return null;
    }
}
