package com.aleinin.goty.submission

import com.aleinin.goty.SubmissionDataHelper
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import java.util.UUID

class SecretSubmissionTest {
    @Test
    fun `Should convert SecretSubmissions to Submissions`() {
        val submission = SubmissionDataHelper.maximal()
        val secret = SecretSubmission(
            id = submission.id,
            secret = UUID.randomUUID(),
            name = submission.name,
            year = submission.year,
            gamesOfTheYear = submission.gamesOfTheYear,
            mostAnticipated = submission.mostAnticipated,
            bestOldGame = submission.bestOldGame,
            enteredGiveaway = submission.enteredGiveaway,
            enteredOn = submission.enteredOn,
            updatedOn = submission.updatedOn
        )
        val expected = Submission(
            id = submission.id,
            name = submission.name,
            year = submission.year,
            gamesOfTheYear = submission.gamesOfTheYear,
            mostAnticipated = submission.mostAnticipated,
            bestOldGame = submission.bestOldGame,
            enteredGiveaway = submission.enteredGiveaway,
            enteredOn = submission.enteredOn,
            updatedOn = submission.updatedOn
        )
        val actual = secret.toSubmission()
        assertEquals(expected, actual)
    }
}
