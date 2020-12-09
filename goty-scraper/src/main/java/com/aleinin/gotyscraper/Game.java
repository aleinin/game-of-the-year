package com.aleinin.gotyscraper;


import lombok.Builder;
import lombok.Value;

import java.util.List;

@Value
@Builder
class Game {

    int id;
    List<String> aliases;
    GameCover cover;
    int follows;
    String primaryTitle;
    Long release;

    @Value
    @Builder
    static class GameCover {

        String id;
        Integer height;
        Integer width;
    }
}

