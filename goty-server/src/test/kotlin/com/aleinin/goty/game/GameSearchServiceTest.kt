package com.aleinin.goty.game

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.junit.jupiter.MockitoExtension
import org.mockito.kotlin.whenever

@ExtendWith(MockitoExtension::class)
internal class GameSearchServiceTest {
    @Mock
    lateinit var gameSearchClient: GameSearchClient

    @InjectMocks
    lateinit var gameSearchService: GameSearchService

    @Test
    fun `Should return a GameSearchResponse from a GameSearchRequest`() {
        val request = GameSearchRequest(
            title = "MyGame",
            limit = 10,
            years = listOf(2077),
            mainGame = false
        )
        val expectedResponse = listOf(
            GameSearchResponse(
                id = "id1",
                title = "MyGame"
            ),
            GameSearchResponse(
                id = "id2",
                title = "MyGame 2: Electric Boogaloo"
            )
        )
        whenever(gameSearchClient.findGames(request.title, request.years, request.mainGame, request.limit))
            .thenReturn(expectedResponse)
        val actualResponse = gameSearchService.search(request)
        assertEquals(expectedResponse, actualResponse)
    }
}
