## Date: 11/19/23

## Problem

Most of the submission endpoints are public including adding/editing submissions. (Deletions require credentials as only admins need to delete). This is intended.

This does pose a security problem where if one is familiar with the code its easy to get all submissions (`/submissions/`, grab the UUID, then edit someone else's submission. (`/submissions/{id}`)

## Constraints

* Can't add any additional barriers to the current process (no logins). Change needs to be invisible from the user's perspective

## Decision

Add a submission secret. Whenever a user submits a submission, the backend will return a secret with the initial response and never again.

The frontend will save this secret in localStorage (same as UUID) and the secret is provided with a `SubmissionUpdateRequest` and verified against the secret stored in the database when updating.

If the secret is wrong, the edit is rejected.

To summarize: 

| Endpoint                   | Old Request         | New Request                 | Old Response       | New Response             | Public? |
|----------------------------|---------------------|-----------------------------|--------------------|--------------------------|---------|
| GET `/submissions`         |                     |                             | `List<Submission>` | no change                | Yes     |
| GET `/submissions/secret`  |                     |                             |                    | `List<SecretSubmission>` | No      |
| POST `/submissions`        | `SubmissionRequest` | `SubmissionCreationRequest` | `Submission`       | `SecretSubmission`       | Yes     |
| DELETE `/submissions`      |                     |                             | `void`             | no change                | No      |
| GET `/submissions/{id}`    |                     |                             | `Submission`       | no change                | Yes     |
| PUT `/submissions/{id}`    | `SubmissionRequest` | `SubmissionUpdateRequest`   | `Submission`       | no change                | Yes     |
| DELETE `/submissions/{id}` |                     |                             | `void`             | no change                | No      |
|                            |                     |                             |                    |                          |         |

`SubmissionRequest` => `SubmissionCreationRequest`
```
    (no change, renamed only)
    name
    gamesOfTheYear,
    mostAnticipated,
    bestOldGame,
    enteredGiveaway
```

`SubmissionRequest` => `SubmissionUpdateRequest`
```
    name
    ++ secret
    gamesOfTheYear,
    mostAnticipated,
    bestOldGame,
    enteredGiveaway
```

## Limitations
* localStorage is specific browser only so users will need to use the same browser to edit. (This is already an existing limitations with the submission uuid)
* It's possible for the id to be right, but the secret to be wrong. In that event edits are rejected and the frontend will clear the localStorage. The user will need to contact an admin to recover the submission.
