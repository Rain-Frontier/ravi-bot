const fs = require('fs');
const path = require('path');

const guildConfigPath = path.join(process.cwd(), 'config/rain.json');
const databaseConfigPath = path.join(process.cwd(), 'config/bot.json');
let guildConfig = null;
let config = null;

function loadGuildConfig() {
    if (!guildConfig) {
        guildConfig = JSON.parse(fs.readFileSync(guildConfigPath, 'utf-8'));
    }
    return guildConfig;
}

function saveConfig(cfg, chosenPath) {
    if (cfg) {
        fs.writeFileSync(chosenPath, JSON.stringify(cfg, null, 2));
    }
}

function ensureGuildConfig(cfg, guildId) {
    cfg[guildId] ??= {};

    cfg[guildId].channels ??= {};
    cfg[guildId].roles ??= {};

    return cfg[guildId];
}

function getGuildConfig(guildId) {
    const cfg = loadGuildConfig();

    const guild = ensureGuildConfig(cfg, guildId);

    saveConfig(cfg, guildConfigPath);
    
    return guild;
}

function updateGuildConfig(guildId, updateFn) {
    const cfg = getGuildConfig(guildId);
    updateFn(cfg);
    saveConfig(guildConfig, guildConfigPath);
}

function loadConfig() {
    if (!config) {
        config = JSON.parse(fs.readFileSync(databaseConfigPath, 'utf-8'));
    }
    return config;
}

function updateConfig(updateFn) {
    const cfg = loadConfig();
    updateFn(cfg);
    saveConfig(config, databaseConfigPath);
}

module.exports = {
    getGuildConfig,
    updateGuildConfig,
    updateConfig
}