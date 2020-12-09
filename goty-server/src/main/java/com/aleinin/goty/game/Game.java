package com.aleinin.goty.game;


import lombok.Builder;
import lombok.Value;

import java.util.List;

@Value
@Builder
public class Game {

    String id;
    List<String> aliases;
    GameCover cover;
    int follows;
    String primaryTitle;
    Long release;

    @Value
    @Builder
    public static class GameCover {

        String id;
        Integer height;
        Integer width;
    }
}

