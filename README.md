# Game of the Year

## About

The Midnight Watchmen discord runs a yearly game of the year vote. For the first few years it was run using a combination of Google Forms and Google Sheets. As of 2020 we transitioned to using this game-of-the-year app to handle both the client side submission, server side handling, and storing of game of the year submissions

The app was built to be easily customizable and reusable year to year while still including date-sensitive features like submission deadlines and result showcases.

## Features

- Submissions
  - IGDB backed game selections using real IGDB data rather than arbitary text submisisons
  - Submission confirmation
  - Submission editing
  - Submission recovery (new browser, different computer, etc)
  - Submission deadlines
  - Reorderable Top 10 games of the year (current year games only)
  - Most Anticipated (any year) & Best Old Game (any year)
  - Giveaway entry (optional & amount customizable)
- Results
  - View all individual submissions
  - View summary of submissions
- Home Page
  - Allows submission, editing, or viewing of results depending on contest status and user's submission status

## Tech Stack

- Frontend:
  - React 17
  - Styled Components
  - Redux
  - Typescript 4.4
  - Axios
  - PrimeReact
  - Jest
  - Prettier
- Backend:
  - SpringBoot 2.7
  - Kotlin
  - Gradle
  - MongoDB
  - Jackson
- Other technologies & data sources:
  - Docker
  - IGDB

## Configuration

game-of-the-year's depends on a few different configurables. The majority of this is stored in the backend. The default values can be found [here](https://github.com/aleinin/game-of-the-year/blob/main/goty-server/src/main/resources/application.yml). These default values can be overwritten using the PropertiesService.

An example request:

```bash
curl --location --request PUT 'http://localhost:8080/properties' \
--header 'Content-Type: application/json' \
--data-raw '{
    "tiePoints": [
        14,
        13,
        11,
        7,
        6,
        5,
        4,
        3,
        2,
        1
    ],
    "deadline": "2023-01-01T00:00:00-05:00",
    "hasGiveaway": true,
    "giveawayAmountUSD": 25
}'
```

In addition to the backend properties, a baseUrl (default http://localhost:8080) needs to be set in the [client's public constants.json](https://github.com/aleinin/game-of-the-year/blob/main/goty-client/public/constants.json)

Example:

```json
{
  "baseUrl": "https://google.com"
}
```

# Developer Resources

## Getting Started

### Frontend:

Ensure the baseUrl is set as desired describe above in the Configuration section. Start the app locally with:

```
npm i
npm run start
```

### Backend:

For the goty-server to stand up a couple of things need to be configured

#### IGDB

The following environmental variables need to be set with an IGDB clientId and clientSecret respectively

- GOTY_IGDB_TWITCH_CLIENT_ID
- GOTY_IGDB_TWITCH_CLIENT_SECRET

If you don't have IGDB API credentials check out [Account Creation](https://api-docs.igdb.com/#about) on IGDB's docs page

#### Mongo

To run goty-server without using docker compose up goty-server requires a mongo service running on the default mongo port 27017.

By default, the host "mongo" is used. To correctly point "mongo" to the locally running mongo service a DNS record will need to be added to the hosts file

```
# Example hosts record
127.0.0.1 mongo
```
