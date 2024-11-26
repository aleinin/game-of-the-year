package com.aleinin.goty.properties

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

class YearRangeTest {
    @Test
    fun `returns empty string for null input`() {
        val result = getYearRange(null)
        assertEquals("", result, "Expected empty string for null input")
    }

    @Test
    fun `returns empty string for empty list`() {
        val result = getYearRange(emptyList())
        assertEquals("", result, "Expected empty string for empty input")
    }

    @Test
    fun `returns single year for list with one year`() {
        val result = getYearRange(listOf(2015))
        assertEquals("2015", result, "Expected single year as output")
    }

    @Test
    fun `returns single range for consecutive years`() {
        val result = getYearRange(listOf(2010, 2011, 2012))
        assertEquals("2010-2012", result, "Expected a single range for consecutive years")
    }

    @Test
    fun `returns comma-separated years for non-consecutive years`() {
        val result = getYearRange(listOf(2010, 2012, 2014))
        assertEquals("2010, 2012, or 2014", result, "Expected comma-separated years for non-consecutive years")
    }

    @Test
    fun `returns mix of ranges and individual years`() {
        val result = getYearRange(listOf(2010, 2011, 2013, 2014, 2015, 2019))
        assertEquals("2010-2011, 2013-2015, or 2019", result, "Expected mix of ranges and individual years")
    }

    @Test
    fun `handles unsorted input gracefully`() {
        val result = getYearRange(listOf(2015, 2013, 2014, 2012))
        assertEquals("2012-2015", result, "Expected correctly sorted and summarized range for unsorted input")
    }

    @Test
    fun `handles large ranges`() {
        val result = getYearRange((1990..2020).toList())
        assertEquals("1990-2020", result, "Expected a single range for a large set of consecutive years")
    }

    @Test
    fun `handles complex mixed cases`() {
        val result = getYearRange(listOf(1980, 1981, 1985, 1990, 1991, 1992, 1999))
        assertEquals("1980-1981, 1985, 1990-1992, or 1999", result, "Expected mix of ranges and individual years")
    }
}