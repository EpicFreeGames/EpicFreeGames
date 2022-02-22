##### This is a monorepo for a Discord bot focused around free games.

#### Data

All data is stored in a [MongoDB](https://www.mongodb.com/) database. The games are saved there by a scraper which is closed source. Schemas can be found [here](packages/shared/src/data/models.ts).

#### Packages

- [config](packages/config) contains all the configuration for the bot.
- [shared](packages/shared) contains all the shared types, schemas, data access, utils, embeds etc.
- [tsconfig](packages/tsconfig) contains a base tsconfig from which all the other tsconfigs inherit from.

#### Apps

(interactions = commands)

- [deploy-slash-commands](apps/deploy-slash-commands) provides `yarn/npm run reg` and `yarn/npm run reg-g` commands to register the bot's commands on Discord. `reg` registers the commands to a guild given in the config file and `reg-g` registers the commands to all the guilds the bot is in.
- [interactions-endpoint](apps/interactions-endpoint) [`receives`](https://discord.com/developers/docs/interactions/receiving-and-responding#receiving-an-interaction), [`verifies`](https://discord.com/developers/docs/interactions/receiving-and-responding#security-and-authorization) and [`responds`](https://discord.com/developers/docs/interactions/receiving-and-responding#responding-to-an-interaction) to interactions sent towards the bot.
- [sender](apps/sender) handles the sending of all the new free game notifications.
