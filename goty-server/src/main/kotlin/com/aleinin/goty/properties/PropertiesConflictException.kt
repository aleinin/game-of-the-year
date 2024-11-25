package com.aleinin.goty.properties

class PropertiesConflictException(year: String) : RuntimeException("Properties for year $year already exist")