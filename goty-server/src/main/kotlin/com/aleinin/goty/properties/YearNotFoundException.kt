package com.aleinin.goty.properties

class YearNotFoundException(year: Int) : RuntimeException("Properties for year $year not found")