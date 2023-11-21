package com.aleinin.goty.submission

import java.util.UUID

fun SecretSubmission.toSubmission() = Submission(
    id = this.id,
    name = this.name,
    gamesOfTheYear = this.gamesOfTheYear,
    mostAnticipated = this.mostAnticipated,
    bestOldGame = this.bestOldGame,
    enteredGiveaway = this.enteredGiveaway,
    enteredOn = this.enteredOn,
    updatedOn = this.updatedOn
)

data class SecretSubmission(
    val id: UUID,
    val secret: UUID,
    val name: String,
    val gamesOfTheYear: List<RankedGameSubmission>,
    val mostAnticipated: GameSubmission?,
    val bestOldGame: GameSubmission?,
    val enteredGiveaway: Boolean,
    val enteredOn: Long,
    val updatedOn: Long,
)
