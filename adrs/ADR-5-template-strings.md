## Date: 11/25/2023

## Problem

Text in the frontend is currently hardcoded, which requires code changes for small changes to questions

This also limits the usefulness to other people in the (rare) chacne someone else wanted to use this app

## Decision

The web page title, goty question title, goty question, and goty rules will be moved to the backend via `Properties`

In order to support variables in the strings there will be a small templating system like shown:

template: "It is ${year}"

which, given properties.year was `2023`, would translate to:

text: "It is 2023"

## Time zones
One challenge is showing the users the deadline in their local time. Whenever a user calls GET /properties/ they can pass in a queryParam `localTimeZone`

`localTimeZone` is a `zoneId` corresponding to a [tz identifier](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)

For example, GET /properties?localTimeZone=America/Chicago would return the formatted date in Chicago time (CST or CDT)

If no localTimeZone is provided, the user can also provide a defaultLocalTimeZone in their `Properties` that will be used instead

if no localTimeZone and no defaultLocalTimeZone exist, then UTC will be used.

## ResolvedTemplate
After translation, text is stored in a `ResolvedTemplate` object which contains the original template string `template` and the translated text `text`

example:
```json
{
  "template": "It is ${year}",
  "text": "It is 2023"
}
```

Resolved templates will be part of a `PropertiesResponse` which is returned when either GETing or PUTing the properties

## Limitations
* Only a small amount of tokens will be supported at first
  * ${year} -> properties.year
  * ${maxGames} -> properties.tiePoints.size
  * ${deadline} -> properties.deadline in "MM:DD:YYYY hh:MM AM/PM" format according to localTimeZone, or defaultLocalTimeZone, or UTC
* No escape support for now (although i'm not sure why you'd need to write ${year} as plaintext)