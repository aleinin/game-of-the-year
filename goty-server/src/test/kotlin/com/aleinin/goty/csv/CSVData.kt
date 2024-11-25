package com.aleinin.goty.csv

import org.junit.jupiter.api.Assertions.assertEquals

class CSVData {
    companion object {
        fun assertEqualNormalizeLineEnds(a: String, b: String) {
            assertEquals(
                    a.replace("\r\n", "\n").replace("\r", "\n"),
                    b.replace("\r\n", "\n").replace("\r", "\n")
            )
        }

        fun emptyCSV(year: Int) = """
            Year,$year
            
            Respondents
            No results
            
            Games of the Year
            Rank,Title,Votes,Points
            No results
            
            Best Old Game
            Rank,Title,Votes
            No results
            
            Most Anticipated
            Rank,Title,Votes
            No results
            
            Most Disappointing
            Rank,Title,Votes
            No results
            
            Giveaway Entries
            No results
            
            Submissions
            ID,Entered on,Updated on,Name,Best Old Game,Most Anticipated,Entered Giveaway,1st
            No results
            
            """.trimIndent()

        fun fullCSV(year: Int) = """
            Year,$year
            
            Respondents
            Maxi Max
            Lazy Luna
            Average Andy
            Ty Tie-Breaker
            
            Games of the Year
            Rank,Title,Votes,Points
            1,Call of Duty Modern Warfare II,2,30
            2,Clicker Pro,2,28
            3,PlateUp!,2,26
            4,Stray,2,20
            5,Overwatch 2,2,19
            6,Bayonetta 3,2,16
            7,Elden Ring,2,15
            8,OlliOlli World,1,7
            9,Tiny Tina's Wonderland,1,6
            
            Best Old Game
            Rank,Title,Votes
            1,Nostalgia,2
            2,Elder Scrolls V: Skyrim,1
            
            Most Anticipated
            Rank,Title,Votes
            1,Cant wait,2
            2,Call of Duty XIX,1
            
            Most Disappointing
            Rank,Title,Votes
            1,Over-hyped,2
            2,Buggy,1
            
            Giveaway Entries
            Maxi Max
            Average Andy
            
            Submissions
            ID,Entered on,Updated on,Name,Best Old Game,Most Anticipated,Entered Giveaway,1st,2nd,3rd,4th,5th,6th,7th,8th,9th,10th
            f11186fe-3cfb-44cb-a429-67005ab60584,1970-01-01T00:00:00Z,1970-01-01T00:00:00Z,Maxi Max,Nostalgia,Cant wait,Yes,Call of Duty Modern Warfare II,Stray,Bayonetta 3,OlliOlli World,Tiny Tina's Wonderland
            98a8332d-1f2c-47ed-a9a0-fd2a36467d8f,1970-01-01T00:00:00Z,1970-01-01T00:00:00Z,Lazy Luna,,,No,Clicker Pro
            a8665bae-d4c0-4349-99e4-f054649903e8,1970-01-01T00:00:00Z,1970-01-01T00:00:00Z,Average Andy,Elder Scrolls V: Skyrim,Call of Duty XIX,Yes,PlateUp!,Overwatch 2,Elden Ring
            0ffefab3-2dc5-4218-9a6a-b06287934d08,1970-01-01T00:00:00Z,1970-01-01T00:00:00Z,Ty Tie-Breaker,Nostalgia,Cant wait,No,Call of Duty Modern Warfare II,Clicker Pro,PlateUp!,Stray,Overwatch 2,Bayonetta 3,Elden Ring
            
        """.trimIndent()
    }
}