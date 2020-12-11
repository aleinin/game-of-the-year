package com.aleinin.goty;

import lombok.Value;
import lombok.With;
import org.springframework.data.annotation.Id;

import java.util.List;
import java.util.UUID;

@Value
public class GameOfTheYearSubmission {

    @Id
    @With
    UUID id;
    String name;
    List<RankedGameSubmission> gameSubmissions;
    GameSubmission mostAnticipated;
    GameSubmission bestOldGame;

    @Value
    public static class GameSubmission {

        String id;
        String title;
    }

    @Value
    public static class RankedGameSubmission {

        String id;
        String title;
        int rank;
    }
}
