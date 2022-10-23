package com.aleinin.goty.game

import com.api.igdb.request.IGDBWrapper
import com.fasterxml.jackson.databind.ObjectMapper
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mock
import org.mockito.Mockito
import org.mockito.junit.jupiter.MockitoExtension
import org.mockito.kotlin.any

@ExtendWith(MockitoExtension::class)
internal class IGDBGameSearchClientTest {
    @Mock
    lateinit var igdbWrapper: IGDBWrapper

    lateinit var client: IGDBGameSearchClient

    @BeforeEach
    fun setup() {
        client = IGDBGameSearchClient(igdbWrapper, ObjectMapper())
    }

    @Test
    fun `Should find main games by year`() {
        runTest(2077, true)
    }

    @Test
    fun `Should find games by year`() {
        runTest(2077, false)
    }

    @Test
    fun `Should find main games`() {
        runTest(null, true)
    }

    @Test
    fun `Should find games`() {
        runTest(null, false)
    }

    private fun runTest(year: Int?, mainGame: Boolean) {
        val mockApiResponse = """
            [
                {
                    "id": 123,
                    "name": "A Game"
                },
                {
                    "id": 321,
                    "name": "Another Game"
                }
            ]
        """.trimIndent()
        Mockito.`when`(igdbWrapper.apiJsonRequest(any(), any())).thenReturn(mockApiResponse)
        val expected = listOf(
            GameSearchResponse("123", "A Game"),
            GameSearchResponse("321", "Another Game")
        )
        val actual = client.findGames("gameTitle", year, mainGame, 10)
        assertEquals(expected, actual)
    }
}