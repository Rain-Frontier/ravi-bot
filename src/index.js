"use strict";
require('dotenv').config();
require('module-alias/register');
const { Client, IntentsBitField } = require('discord.js');
const eventHandler = require('./handlers/eventHandler');
const { getPool, testConnection } = require('./utils/dbConnection');

(async () => {
    const pool = await getPool();
    if (!await testConnection()) {
        console.log('[Bot] Launching bot with no database.');
    }

    const client = new Client({
        intents: [
            IntentsBitField.Flags.Guilds
        ],
    });

    client.db = pool;
    
    eventHandler(client);
    client.login(process.env.DISCORD_BOT_TOKEN);
})();