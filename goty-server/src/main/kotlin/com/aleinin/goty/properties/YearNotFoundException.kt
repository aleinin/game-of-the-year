package com.aleinin.goty.properties

class YearNotFoundException(year: String) : RuntimeException("Properties for year $year not found")