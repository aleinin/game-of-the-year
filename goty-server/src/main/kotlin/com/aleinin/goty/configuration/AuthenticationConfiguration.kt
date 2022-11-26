package com.aleinin.goty.configuration

import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.Authentication
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.stereotype.Service
import org.springframework.validation.annotation.Validated


@Service
class AuthenticationConfiguration(@Validated private val adminCredentials: AdminCredentials): AuthenticationManager {
    override fun authenticate(authentication: Authentication?): Authentication {
        val username: String? = authentication?.name
        val password: String = authentication?.credentials.toString()
        val grantedAuths: MutableList<GrantedAuthority> = ArrayList()
        if (username == adminCredentials.username && password == adminCredentials.password) {
            grantedAuths.add(SimpleGrantedAuthority("ROLE_ADMIN"))
        }
        return UsernamePasswordAuthenticationToken(username, password, grantedAuths)
    }

}