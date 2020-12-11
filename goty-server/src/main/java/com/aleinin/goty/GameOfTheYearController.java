package com.aleinin.goty;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/submit")
@RequiredArgsConstructor
class GameOfTheYearController {

    private final GameOfTheYearRepository gameOfTheYearRepository;

    @PostMapping
    GameOfTheYearSubmission submit(@RequestBody GameOfTheYearSubmission submission) {
        return gameOfTheYearRepository.save(submission.withId(UUID.randomUUID()));
    }
}
