# Game of the Year

## About

The Midnight Watchmen discord runs a yearly game of the year vote. For the first few years it was run using a combination of Google Forms and Google Sheets. As of 2020 we transitioned to using this game-of-the-year app to handle both the client side submission, server side handling, and storing of game of the year submissions

The app was built to be easily customizable and reusable year-to-year while still including date-sensitive features like submission deadlines and result showcases.

## Features

- Submissions
  - IGDB backed game selections using real IGDB data rather than arbitrary text submissions
  - Submission confirmation
  - Submission editing
  - Submission recovery (new browser, different computer, etc)
  - Submission deadlines
  - Reorder-able Top 10 games of the year (current year games only)
  - Most Anticipated (any year) & Best Old Game (any year)
  - Giveaway entry (optional & amount customizable)
- Results
  - View all individual submissions
  - View summary of submissions
- Home Page
  - Allows submission, editing, or viewing of results depending on contest status and user's submission status
- Properties
  - Allows configuration of various aspects of the vote including variable support for text
## Tech Stack

- Frontend:
  - React 18
  - Redux
  - Typescript
  - Jest
  - Prettier
  - ESLint
  - Vite
  - CSS Modules
- Backend:
  - Java 21
  - SpringBoot 3
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

Text properties support the following variables in `${VARIABLE_NAME}` format

| Variable | Resolves to                                                                                                                   | Additional Info                                                                                                      |
|----------|-------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------|
| year     | properties.year                                                                                                               |                                                                                                                      |
| deadline | properties.deadline in "MM:DD:YYYY hh:MM AM/PM" format according to localTimeZone, or properties.defaultLocalTimeZone, or UTC | localTimeZone is supplied as a queryParam to the PropertiesController. ex: /properties?localTimeZone=America/Chicago |
| maxGames | properties.tiePoints.size                                                                                                     |                                                                                                                      |

```bash
curl --location --request PUT 'http://localhost:8080/properties?localTimeZone=America/Chicago' \
--header 'Authorization: Basic PASSWORD' \
--header 'Content-Type: application/json' \
--data-raw '{
    "title": "The Midnight Watchmen'\''s\nTop Games of the Year ${year}",
    "year": 2023,
    "gotyQuestion": {
        "title": "Games of the Year",
        "question": "What are your favorite game(s) of ${year}?",
        "rules": [
            "Voting closes ${deadline}.",
            "May nominate any amount of games up to ${maxGames}."
        ]
    },
    "tiePoints": [
        15,
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
    "deadline": "2024-01-01T00:00:00-05:00",
    "hasGiveaway": true,
    "giveawayAmountUSD": 25,
    "defaultLocalTimeZone": "America/New_York"
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

The following environmental variables need to be set with admin credentials for protected endpoints

- GOTY_ADMIN_USERNAME
- GOTY_ADMIN_PASSWORD

Credentials are provided with basic auth to protected endpoints

#### Mongo

To run goty-server without using docker compose up goty-server requires a mongo service running on the default mongo port 27017.

By default, the host "mongo" is used. To correctly point "mongo" to the locally running mongo service a DNS record will need to be added to the hosts file

```
# Example hosts record
127.0.0.1 mongo
```
