package com.aleinin.goty;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface GameOfTheYearRepository extends MongoRepository<GameOfTheYearSubmission, String> {

}
