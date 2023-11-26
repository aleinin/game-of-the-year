package com.aleinin.goty.properties

data class GotyQuestionResponse(
    val title: ResolvedTemplate,
    val question: ResolvedTemplate,
    val rules: List<ResolvedTemplate>
)
