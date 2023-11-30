package com.aleinin.goty.csv

import com.aleinin.goty.properties.Properties
import com.aleinin.goty.properties.PropertiesService
import com.aleinin.goty.result.ResultService
import com.aleinin.goty.submission.Submission
import com.aleinin.goty.submission.SubmissionService
import org.apache.commons.csv.CSVFormat
import org.apache.commons.csv.CSVPrinter
import org.springframework.stereotype.Service
import java.io.StringWriter
import java.time.Instant

fun CSVPrinter.printSection(header: String, columnHeaders: Array<String>?, rows: List<Array<Any>>, newLine: Boolean = true) {
    if (newLine) {
        this.printRecord()
    }
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
    private val submissionService: SubmissionService,
    private val resultsService: ResultService,
    private val propertiesService: PropertiesService
) {
    companion object {
        private const val RESPONDENTS_HEADER = "Respondents"
        private const val GOTY_HEADER = "Games of the Year"
        private val gotyColumns = arrayOf("Rank", "Title", "Votes", "Points")
        private const val BEST_OLD_GAME_HEADER = "Best Old Game"
        private const val MOST_ANTICIPATED_HEADER = "Most Anticipated"
        private val gameColumns = arrayOf("Rank", "Title", "Votes")
        private const val GIVEAWAY_ENTRIES_HEADER = "Giveaway Entries"
        private const val SUBMISSIONS_HEADER = "Submissions"
        private const val PROPERTIES_HEADER = "Properties"
        private val staticSubmissionColumns = arrayOf("ID", "Entered on", "Updated on", "Name", "Best Old Game", "Most Anticipated", "Entered Giveaway")
        private val propertiesColumns = arrayOf("title", "year", "gotyQuestionTitle", "gotyQuestionQuestion", "gotyQuestionRules", "tiePoints", "deadline", "hasGiveaway", "giveawayAmountUSD", "defaultLocalTimeZone")
    }

    fun dumpToCSV(): String {
        val properties = propertiesService.getProperties()
        val submissions = submissionService.getAllSubmissions()
        val stringWriter = StringWriter()
        val csvPrinter = CSVPrinter(stringWriter, CSVFormat.DEFAULT)
        printSummary(csvPrinter, submissions)
        printSubmissions(csvPrinter, submissions, properties)
        printProperties(csvPrinter, properties)
        return stringWriter.toString()
    }

    private fun printSummary(csvPrinter: CSVPrinter, submissions: List<Submission>) {
        val results = resultsService.calculate(submissions)
        csvPrinter.printSection(RESPONDENTS_HEADER, null, results.participants.map { arrayOf(it) }, false)
        csvPrinter.printSection(GOTY_HEADER, gotyColumns, results.gamesOfTheYear.map {arrayOf(it.rank + 1, it.title, it.votes, it.points)})
        csvPrinter.printSection(BEST_OLD_GAME_HEADER, gameColumns, results.bestOldGame.map {arrayOf(it.rank + 1, it.title, it.votes)})
        csvPrinter.printSection(MOST_ANTICIPATED_HEADER, gameColumns, results.mostAnticipated.map {arrayOf(it.rank + 1, it.title, it.votes)})
        csvPrinter.printSection(GIVEAWAY_ENTRIES_HEADER, null, results.giveawayParticipants.map { arrayOf(it) })
    }

    private fun printSubmissions(csvPrinter: CSVPrinter, submissions: List<Submission>, properties: Properties) {
        val columns = staticSubmissionColumns.plus(getTiePointHeaders(properties.tiePoints))
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

    private fun printProperties(csvPrinter: CSVPrinter, properties: Properties) {
        csvPrinter.printSection(PROPERTIES_HEADER, propertiesColumns, listOf(arrayOf(
                properties.title,
                properties.year,
                properties.gotyQuestion.title,
                properties.gotyQuestion.question,
                properties.gotyQuestion.rules,
                properties.tiePoints,
                properties.deadline,
                properties.hasGiveaway,
                properties.giveawayAmountUSD,
                properties.defaultLocalTimeZone ?: "None"
        )))
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