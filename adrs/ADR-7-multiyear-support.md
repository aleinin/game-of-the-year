## Date: 12/2/2023

## Problem
* GOTY is only in the context of a single year despite being a yearly occurrence.
* DB must be cleared to start a new year

## Decision 
re-architecture backend to support multiple years by associating submission year with a `Submission` document

## Model Changes

### SecretSubmission and Submission

#### New Field:
`year: Int`

#### Rationale: 
By adding the submission year to `Submission` and `SecretSubmission` the secretSubmission table can contain submissions from many years.

When the backend needs to grab a particular year the year on the document can be used.

### ResultsResponse
#### New Field:
`year: Int`

#### Rationale:
To describe what year the results are for

## API Changes

Most APIs now include an optional year query param to specify what year data to get

### CSV Controller /csv
Old behavior: Export all results to csv

New Behavior: Export results for provided year to csv. If no year is provided `properties.year` will be used.

### ResultsController /results
Old behavior: Calculate results for all current submissions

New Behavior: Calculate results for provided year. If no year is provided `properties.year` will be used.

### SubmissionsController
* GET /submissions
  * Old: Get all submissions
  * New: Get submissions for provided year. if no year is provided `properties.year` will be used.
* GET /submissions/{id}
  * Old: Get submission by id
  * New: Get submission by id and provided year. If no year is provided `properties.year` will be used
  * Rationale: This endpoint is used primarily by the frontend for editing a user's submission. By also selecting by year we can return a 404 when a user attempts to retrieve their old submission from a previous year.
* GET /submissions/secret (Admin only)
  * Old: Get all secret submissions
  * New: Get secret submissions for provided year. if no is provided **all** secret submissions will be returned.
  * Rationale: As this is an admin only endpoint, it breaks from the standard by retrieving all instead of current year when not providing a year. This is simply for admin ease of use.
* GET /submissions/years (new endpoint)
  * Return all distinct years that submissions exist for. Will always return `properties.year` as one of the years.
  * Rationale: Mostly for the benefit of the frontend. When viewing results the `properties.year` should always be shown, even if there isnt any results for it yet.
* POST /submission
  * Now stores a new submission with the `properties.year` added to the stored document
* PUT /submission/{id}
  * Old: Update a submission by UUID. Reject updates after `properties.deadline`
  * New: Update a submission by UUID. Reject updates after `properties.deadline`. Also reject attempting to update a year other than `properties.year`
  * Rationale: Without the additional rejection criteria, someone could update a previous year submission if a GOTY vote was ongoing.
* DELETE /submissions
    * Endpoint removed
    * Rationale: Unlikely to need to delete all endpoints now that many years can be stored. Endpoint poses more danger (from accidental admin usage) than use.


## Limitations: 
* Year currently is an Int which limits possibilities. We had a Game of the Decade 2010s in the past which would be hard to store. I'd like this to be a String in the future for that reason.