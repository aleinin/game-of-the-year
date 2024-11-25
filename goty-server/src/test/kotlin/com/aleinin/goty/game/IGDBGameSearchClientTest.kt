package com.aleinin.goty.game

import com.aleinin.goty.configuration.ApplicationConfiguration
import com.api.igdb.request.IGDBWrapper
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.ArgumentCaptor
import org.mockito.Captor
import org.mockito.Mock
import org.mockito.junit.jupiter.MockitoExtension
import org.mockito.kotlin.any
import org.mockito.kotlin.capture
import org.mockito.kotlin.firstValue
import org.mockito.kotlin.times
import org.mockito.kotlin.verify
import org.mockito.kotlin.whenever

@ExtendWith(MockitoExtension::class)
internal class IGDBGameSearchClientTest {
    @Mock
    lateinit var igdbWrapper: IGDBWrapper

    @Captor
    lateinit var queryCaptor: ArgumentCaptor<String>

    private lateinit var client: IGDBGameSearchClient

    private val mockApiResponse = """
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
    private val expectedReturn = listOf(
        GameSearchResponse("123", "A Game"),
        GameSearchResponse("321", "Another Game")
    )
    @BeforeEach
    fun setup() {
        client = IGDBGameSearchClient(igdbWrapper, ApplicationConfiguration().objectMapper())
    }

    @Test
    fun `Should find main games by single year`() {
        val expectedWhereClause = "w (release_dates.y = 2050) & category = 0;"
        runTest("my game!", listOf(2050), true, 7, expectedWhereClause)
    }

    @Test
    fun `Should find main games by multiple years`() {
        val expectedWhereClause = "w (release_dates.y = 2050 | release_dates.y = 2051 | release_dates.y = 2052) & category = 0;"
        runTest("my game!", listOf(2050, 2051, 2052), true, 7, expectedWhereClause)
    }

    @Test
    fun `Should find games by single year`() {
        val expectedWhereClause = "w (release_dates.y = 2050);"
        runTest("my game!", listOf(2050), false, 7, expectedWhereClause)
    }

    @Test
    fun `Should find games by multiple years`() {
        val expectedWhereClause = "w (release_dates.y = 2050 | release_dates.y = 2051 | release_dates.y = 2052);"
        runTest("my game!", listOf(2050, 2051, 2052), false, 7, expectedWhereClause)
    }

    @Test
    fun `Should find main games`() {
        val expectedWhereClause = "w category = 0;"
        runTest("quick clicks", null, true, 1, expectedWhereClause)
    }

    @Test
    fun `Should find games`() {
        val expectedWhereClause = ""
        runTest("finality", null, false, 6, expectedWhereClause)
    }

    private fun runTest(searchTitle: String, year: List<Int>?, mainGame: Boolean, limit: Int, expectedClause: String) {
        whenever(igdbWrapper.apiJsonRequest(any(), any())).thenReturn(mockApiResponse)
        val expectedQuery = buildExpectedQuery(searchTitle, limit, expectedClause)
        val actualReturn = client.findGames(searchTitle, year, mainGame, limit)
        verify(igdbWrapper, times(1)).apiJsonRequest(any(), capture(queryCaptor))
        assertEquals(expectedReturn, actualReturn)
        assertEquals(expectedQuery, queryCaptor.firstValue)
    }

    private fun buildExpectedQuery(title: String, limit: Int, whereClause: String) = """
        search "$title";f id, name;l $limit;$whereClause
    """.trimIndent()
}
