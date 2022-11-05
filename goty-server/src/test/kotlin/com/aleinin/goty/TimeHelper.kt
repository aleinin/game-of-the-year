package com.aleinin.goty

import java.time.ZonedDateTime

fun tomorrow(): ZonedDateTime = ZonedDateTime.now().plusDays(1)
