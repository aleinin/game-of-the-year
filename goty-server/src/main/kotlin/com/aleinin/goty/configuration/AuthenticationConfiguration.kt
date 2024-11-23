package com.aleinin.goty.configuration

import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.Authentication
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.stereotype.Service
import org.springframework.validation.annotation.Validated


@Service
class AuthenticationConfiguration(@Validated private val adminCredentials: AdminCredentials): AuthenticationManager {
    override fun authenticate(authentication: Authentication?): Authentication {
        val apiKeyValue: String = authentication?.credentials.toString()
        val grantedAuths: MutableList<GrantedAuthority> = ArrayList()
        if (apiKeyValue == adminCredentials.apiKey) {
            grantedAuths.add(SimpleGrantedAuthority("ROLE_ADMIN"))
        } else {
            throw BadCredentialsException("Invalid API key")
        }
        return UsernamePasswordAuthenticationToken("admin", apiKeyValue, grantedAuths)
    }

}