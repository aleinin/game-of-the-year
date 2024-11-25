package com.aleinin.goty.csv

import com.aleinin.goty.properties.PropertiesService
import com.aleinin.goty.result.ResultResponse
import com.aleinin.goty.result.ResultService
import com.aleinin.goty.submission.Submission
import com.aleinin.goty.submission.SubmissionArchiveService
import com.aleinin.goty.submission.SubmissionService
import org.apache.commons.csv.CSVFormat
import org.apache.commons.csv.CSVPrinter
import org.springframework.stereotype.Service
import java.io.StringWriter
import java.time.Instant
import java.time.ZoneId
import kotlin.jvm.optionals.getOrElse

fun CSVPrinter.printSection(header: String, columnHeaders: Array<String>?, rows: List<Array<Any>>) {
    this.printRecord()
    this.printRecord(header)
    if (columnHeaders != null) {
        this.printRecord(*columnHeaders)
    }
    if (rows.isEmpty()) {
        this.printRecord("No results")
    } else {
        rows.forEach { this.printRecord(*it) }
    }
}

@Service
class CSVService(
    private val resultsService: ResultService,
    private val propertiesService: PropertiesService,
    private val submissionArchiveService: SubmissionArchiveService
) {
    companion object {
        private const val YEAR_LABEL = "Year"
        private const val RESPONDENTS_HEADER = "Respondents"
        private const val GOTY_HEADER = "Games of the Year"
        private val gotyColumns = arrayOf("Rank", "Title", "Votes", "Points")
        private const val BEST_OLD_GAME_HEADER = "Best Old Game"
        private const val MOST_ANTICIPATED_HEADER = "Most Anticipated"
        private const val MOST_DISAPPOINTING_HEADER = "Most Disappointing"
        private val gameColumns = arrayOf("Rank", "Title", "Votes")
        private const val GIVEAWAY_ENTRIES_HEADER = "Giveaway Entries"
        private const val SUBMISSIONS_HEADER = "Submissions"
        private val staticSubmissionColumns = arrayOf("ID", "Entered on", "Updated on", "Name", "Best Old Game", "Most Anticipated", "Entered Giveaway")
    }

    fun getActiveYearCSV(localTimeZone: ZoneId?): String {
        val year = propertiesService.getActiveYear()
        return dumpToCSV(year, localTimeZone)
    }

    fun getYearCSV(year: String, localTimeZone: ZoneId?): String {
        return dumpToCSV(year, localTimeZone)
    }

    private fun dumpToCSV(year: String, localTimeZone: ZoneId?): String {
        val properties = propertiesService.getPropertiesResponse(year, localTimeZone).getOrElse { throw NoResultsForYearException() }
        val submissions = submissionArchiveService.getAllSubmissionsForYear(year)
        val results = resultsService.getResultsForYear(year)
        val stringWriter = StringWriter()
        val csvPrinter = CSVPrinter(stringWriter, CSVFormat.DEFAULT)
        printYear(csvPrinter, year)
        printSummary(csvPrinter, results)
        printSubmissions(csvPrinter, submissions, properties.tiePoints)
        return stringWriter.toString()
    }

    private fun printYear(csvPrinter: CSVPrinter, year: String) {
        csvPrinter.printRecord(YEAR_LABEL, year)
    }

    private fun printSummary(csvPrinter: CSVPrinter, results: ResultResponse) {
        csvPrinter.printSection(RESPONDENTS_HEADER, null, results.participants.map { arrayOf(it) })
        csvPrinter.printSection(GOTY_HEADER, gotyColumns, results.gamesOfTheYear.map {arrayOf(it.rank + 1, it.title, it.votes, it.points)})
        csvPrinter.printSection(BEST_OLD_GAME_HEADER, gameColumns, results.bestOldGame.map {arrayOf(it.rank + 1, it.title, it.votes)})
        csvPrinter.printSection(MOST_ANTICIPATED_HEADER, gameColumns, results.mostAnticipated.map {arrayOf(it.rank + 1, it.title, it.votes)})
        csvPrinter.printSection(MOST_DISAPPOINTING_HEADER, gameColumns, results.mostDisappointing.map {arrayOf(it.rank + 1, it.title, it.votes)})
        csvPrinter.printSection(GIVEAWAY_ENTRIES_HEADER, null, results.giveawayParticipants.map { arrayOf(it) })
    }

    private fun printSubmissions(csvPrinter: CSVPrinter, submissions: List<Submission>, tiePoints: List<Int>) {
        val columns = staticSubmissionColumns.plus(getTiePointHeaders(tiePoints))
        val submissionRows: List<Array<Any>> = submissions.map { arrayOf(
                it.id,
                Instant.ofEpochMilli(it.enteredOn),
                Instant.ofEpochMilli(it.updatedOn),
                it.name,
                it.bestOldGame?.title ?: "",
                it.mostAnticipated?.title ?: "",
                if (it.enteredGiveaway) "Yes" else "No",
                *it.gamesOfTheYear.map { game -> game.title }.toTypedArray()
        ) }
        csvPrinter.printSection(SUBMISSIONS_HEADER, columns, submissionRows)
    }

    private fun getTiePointHeaders(tiePoints: List<Int>): List<String> = List(tiePoints.size) { index -> indexToOrdinal(index)}

    private fun indexToOrdinal(index: Int): String {
        val number = index + 1
        val mod10 = number % 10
        val mod100 = number % 100
        if (mod100 == 11 || mod100 == 12 || mod100 == 13) {
            return "${number}th"
        }
        if (mod10 == 1) {
            return "${number}st"
        }
        if (mod10 == 2) {
            return "${number}nd"
        }
        if (mod10 == 3) {
            return "${number}rd"
        }
        return "${number}th"
    }
}