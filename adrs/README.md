## What is an ADR?
Architectural Decision Record

https://en.wikipedia.org/wiki/Architectural_decision

## Why ADRs?

game-of-the-year is a project I've been working on in short bursts for many years. It first started as a google form back in 2016. 

It has since grown into an app. Generally it receives a couple weeks of development in November before it goes live for the year then it remains untouched.

With so much time passing, my philosophy often has changed as I've grown as a developer that year. This app has seen many changes

* The frontend used to be Angular (now React)
* The frontend used to use CRA, now it uses Vite
* The backend used to be Java, now its Kotlin.
* The backend used to harvest from IGDB and load into an Elasticsearch, now it queries IGDB directly.

All these decisions had a reason, but as the years go on I forget. So, going forward i'm going to attempt to write -why- I made a decision so when I come back the next year, i can remind myself. 
