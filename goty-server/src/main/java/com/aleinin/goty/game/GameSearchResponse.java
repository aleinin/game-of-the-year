package com.aleinin.goty.game;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class GameSearchResponse {

    String id;
    String name;
}
