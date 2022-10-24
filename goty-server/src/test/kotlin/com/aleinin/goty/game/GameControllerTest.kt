package com.aleinin.goty.game

import com.api.igdb.request.IGDBWrapper
import com.fasterxml.jackson.databind.ObjectMapper
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mock
import org.mockito.kotlin.any
import org.mockito.kotlin.whenever
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.junit.jupiter.SpringExtension
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.content
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import org.springframework.test.web.servlet.setup.MockMvcBuilders.standaloneSetup

@ExtendWith(SpringExtension::class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
internal class GameControllerTest {

    lateinit var mockMvc: MockMvc

    @Mock
    lateinit var wrapper: IGDBWrapper

    @Autowired
    lateinit var objectMapper: ObjectMapper

    @BeforeEach
    fun setup() {
        val client = IGDBGameSearchClient(wrapper, objectMapper)
        val service = GameSearchService(client)
        mockMvc = standaloneSetup(GameController(service)).build()
    }

    @Test
    fun `Should return games`() {
        val mockAPIResponse = """
            [
                {
                    "id": 0,
                    "name": "a game"
                },
                {
                    "id": 1,
                    "name": "a game II"
                }
            ]
        """.trimIndent()
        val expected = listOf(
            GameSearchResponse("0", "a game"),
            GameSearchResponse("1", "a game II")
        )
        whenever(wrapper.apiJsonRequest(any(), any())).thenReturn(mockAPIResponse)
        mockMvc.perform(
            get("/games")
                .contentType("application/json")
                .param("title", "a game")
        )
            .andExpect(status().isOk)
            .andExpect(content().json(objectMapper.writeValueAsString(expected)))
    }

    @Test
    fun `Should handle empty results`() {
        val mockResultJson = "[]"
        val expectedJson = "[]"
        whenever(wrapper.apiJsonRequest(any(), any())).thenReturn(mockResultJson)
        mockMvc.perform(
            get("/games")
                .contentType("application/json")
                .param("title", "something that doesnt exist")
        )
            .andExpect(status().isOk)
            .andExpect(content().json(expectedJson))
    }
}

