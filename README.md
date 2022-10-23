# Game of the Year

TODO

# Developer Resources

## Getting Started

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
