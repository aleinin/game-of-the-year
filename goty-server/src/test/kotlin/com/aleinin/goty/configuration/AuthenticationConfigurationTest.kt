package com.aleinin.goty.configuration

import org.junit.jupiter.api.Assertions.assertFalse
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.junit.jupiter.MockitoExtension
import org.mockito.kotlin.whenever
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

    val adminUsername = "adminUsername"
    val adminPassword = "adminPassword"

    @BeforeEach
    fun setup() {
        whenever(adminCredentials.username).thenReturn(adminUsername)
        whenever(adminCredentials.password).thenReturn(adminPassword)
    }

    @Test
    fun `Should add ROLE_ADMIN if the admin credentials are provided`() {
        whenever(authentication.name).thenReturn(adminUsername)
        whenever(authentication.credentials).thenReturn(adminPassword)
        val actualAuthorities = authenticationConfiguration.authenticate(authentication).authorities
        assertTrue(actualAuthorities.contains(adminAuthority))
    }

    @Test
    fun `Should not add ROLE_ADMIN if incorrect credentials are provided`() {
        whenever(authentication.name).thenReturn(adminUsername)
        whenever(authentication.credentials).thenReturn("incorrect")
        val actualAuthorities = authenticationConfiguration.authenticate(authentication).authorities
        assertFalse(actualAuthorities.contains(adminAuthority))
    }
}