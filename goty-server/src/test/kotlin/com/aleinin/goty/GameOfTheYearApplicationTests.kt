package com.aleinin.goty

import com.aleinin.goty.game.GameSearchClient
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.mock.mockito.MockBean

@MockBean(GameSearchClient::class)
@SpringBootTest
class GameOfTheYearApplicationTests {

    @Test
    fun contextLoads() { }
}
