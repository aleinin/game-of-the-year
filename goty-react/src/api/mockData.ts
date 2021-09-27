import { Game } from "../models/game"
import { Submission } from "../models/submission"

export const mockGamesSearchResult: Game[] = [
  { id: "1", title: "Sierra" },
  { id: "2", title: "Eric" },
  { id: "3", title: "Kristina" },
  { id: "4", title: "Andrew" },
  { id: "5", title: "Patrick" },
  { id: "6", title: "Ashleigh" },
  { id: "7", title: "Bryce" },
  { id: "8", title: "Emmett" },
  { id: "9", title: "Prairie" },
  { id: "10", title: "Alex" },
  { id: "11", title: "Cody" },
  { id: "12", title: "Aric" },
]

export const theSubmission: Submission = {
  submissionUUID: "253956d5-9768-4056-b946-9d27e4e04d78",
  name: "Kherven",
  gamesOfTheYear: [
    { id: "8", title: "Emmett" },
    { id: "9", title: "Prairie" },
    { id: "10", title: "Alex" },
    { id: "11", title: "Cody" },
    { id: "12", title: "Aric" },
  ],
  bestOldGame: { id: "447", title: "SMITE" },
  mostAnticipated: { id: "225", title: "Battlefield 2048" },
  enteredGiveaway: true,
}

export const allSubmissions: Submission[] = [
  {
    submissionUUID: "253956d5-9768-4056-b946-9d27e4e04d78",
    name: "Kherven",
    gamesOfTheYear: [
      { id: "4", title: "Andrew" },
      { id: "5", title: "Patrick" },
      { id: "6", title: "Ashleigh" },
    ],
    bestOldGame: { id: "447", title: "SMITE" },
    mostAnticipated: { id: "225", title: "Battlefield 2048" },
    enteredGiveaway: true,
  },
  {
    submissionUUID: "de7a00a4-1f3b-11ec-9621-0242ac130002",
    name: "Sierra",
    gamesOfTheYear: [
      { id: "8", title: "Emmett" },
      { id: "9", title: "Prairie" },
      { id: "10", title: "Alex" },
      { id: "11", title: "Cody" },
      { id: "12", title: "Aric" },
    ],
    bestOldGame: { id: "221", title: "Animal Crossing" },
    mostAnticipated: { id: "777", title: "Java" },
    enteredGiveaway: false,
  },
  {
    submissionUUID: "da94c4ba-1f3b-11ec-9621-0242ac130002",
    name: "Eric",
    gamesOfTheYear: [
      { id: "1", title: "Sierra" },
      { id: "2", title: "Eric" },
      { id: "3", title: "Kristina" },
      { id: "4", title: "Andrew" },
      { id: "5", title: "Patrick" },
      { id: "6", title: "Ashleigh" },
      { id: "7", title: "Bryce" },
      { id: "8", title: "Emmett" },
      { id: "9", title: "Prairie" },
    ],
    bestOldGame: { id: "876", title: "KOTOR" },
    mostAnticipated: { id: "176`", title: "Veracode" },
    enteredGiveaway: true,
  },
]
