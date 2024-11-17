package com.aleinin.goty.properties

class PropertiesConflictException(year: Int) : RuntimeException("Properties for year $year already exist")