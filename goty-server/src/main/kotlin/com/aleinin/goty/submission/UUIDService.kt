package com.aleinin.goty.submission

import org.springframework.stereotype.Service
import java.util.UUID


@Service
class UUIDService {
    fun randomID() = UUID.randomUUID()

    fun randomSecret() = UUID.randomUUID()
}