package com.aleinin.goty.submit

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.boot.context.properties.ConstructorBinding
import org.springframework.format.annotation.DateTimeFormat
import java.time.ZonedDateTime

@ConstructorBinding
@ConfigurationProperties("goty.submission")
data class SubmissionProperties(@DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) val deadline: ZonedDateTime)
