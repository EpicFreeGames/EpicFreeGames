# EpicFreeGames

Check out the website for more information about the bot:  
https://epicfreegames.net

## What is this?

This repo is a monorepo containing the source code for EpicFreeGames.

`apps` contains all the stuff running on a server.  
`packages` contains all the stuff shared between `apps`.  
`_services` contains a Docker Compose file with all the self hosted services:

- [PostgreSQL](https://www.postgresql.org/) as the database
- [Traefik](https://traefik.io/traefik/) as a reverse proxy
- [Plausible](https://plausible.io/) for analytics
- [Uptime Kuma](https://uptime.kuma.pet/) for status pages and monitoring.

Localization is done using [Crowdin](https://crowdin.com/project/epicfreegames).  
[![Crowdin](https://badges.crowdin.net/epicfreegames/localized.svg)](https://crowdin.com/project/epicfreegames)

If you have any problems, suggestions or questions about the bot, feel free to [join the support server on Discord](https://epicfreegames.net/discord) and let us know!

## Invite links

Production bot: https://epicfreegames.net/invite  
Staging bot: https://epicfreegames.net/invite-staging

## Contributors

- [@veeti-k](https://github.com/veeti-k) - Took over the project in late 2021
- [@NoahEmmenegger](https://github.com/NoahEmmenegger) - Started the project in 2020
