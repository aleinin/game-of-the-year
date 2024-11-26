package com.aleinin.goty.properties

/**
 * Returns a human-readable string representing a range of years.
 *
 * @param years The list of years to summarize.
 * @return A human-readable string representing the range of years.
 */
fun getYearRange(years: List<Int>?): String {
    if (years.isNullOrEmpty()) {
        return ""
    }

    val sortedYears = years.sorted()
    val summarizedYears = mutableListOf<String>()
    var start = sortedYears[0]
    var end = sortedYears[0]

    for (i in 1 until sortedYears.size) {
        if (sortedYears[i] == end + 1) {
            end = sortedYears[i]
        } else {
            summarizedYears.add(if (start == end) "$start" else "$start-$end")
            start = sortedYears[i]
            end = sortedYears[i]
        }
    }

    summarizedYears.add(if (start == end) "$start" else "$start-$end")

    return when (summarizedYears.size) {
        1 -> summarizedYears[0]
        2 -> "${summarizedYears[0]} or ${summarizedYears[1]}"
        else -> {
            val last = summarizedYears.removeAt(summarizedYears.size - 1)
            "${summarizedYears.joinToString(", ")}, or $last"
        }
    }
}