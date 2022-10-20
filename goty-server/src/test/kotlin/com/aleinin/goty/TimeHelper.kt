package com.aleinin.goty

import java.time.ZonedDateTime

class TimeHelper {
    companion object {
        fun tomorrow(): ZonedDateTime = ZonedDateTime.now().plusDays(1)
    }
}