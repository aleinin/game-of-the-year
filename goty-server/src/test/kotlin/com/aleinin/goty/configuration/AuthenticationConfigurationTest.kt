package com.aleinin.goty.configuration

import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.junit.jupiter.MockitoExtension
import org.mockito.kotlin.whenever
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.security.core.Authentication
import org.springframework.security.core.authority.SimpleGrantedAuthority

@ExtendWith(MockitoExtension::class)
internal class AuthenticationConfigurationTest {
    @Mock
    lateinit var adminCredentials: AdminCredentials

    @Mock
    lateinit var authentication: Authentication

    @InjectMocks
    lateinit var authenticationConfiguration: AuthenticationConfiguration

    val adminAuthority = SimpleGrantedAuthority("ROLE_ADMIN")

    val adminKey = "adminKey"

    @BeforeEach
    fun setup() {
        whenever(adminCredentials.apiKey).thenReturn(adminKey)
    }

    @Test
    fun `Should add ROLE_ADMIN if the admin credentials are provided`() {
        whenever(authentication.credentials).thenReturn(adminKey)
        val actualAuthorities = authenticationConfiguration.authenticate(authentication).authorities
        assertTrue(actualAuthorities.contains(adminAuthority))
    }

    @Test
    fun `Should not add ROLE_ADMIN if incorrect credentials are provided`() {
        whenever(authentication.credentials).thenReturn("incorrect")
        assertThrows<BadCredentialsException> {
            authenticationConfiguration.authenticate(authentication)
        }
    }
}
