"use strict" ;
const { Client, Interaction, ApplicationCommandOptionType, MessageFlags, EmbedBuilder } = require("discord.js");
const { createPool, getPool, testConnection } = require('@/src/utils/dbConnection');
const { updateGuildConfig } = require('@/src/utils/configManager');
const { ownerInfos } = require('@/src/state/globalState');

module.exports = {

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    callback: async (client, interaction) => {
        const userAvatarUrl = interaction.member.user.displayAvatarURL();
        const ownerInfo = await ownerInfos.get(client);
        try {
            const subcommand = interaction.options.getSubcommand();

            if (subcommand === 'channel') {
                const guildId = interaction.guildId;
        
                const type = interaction.options.getString('type');
                const channel = interaction.options.getChannel('channel');
        
                updateGuildConfig(guildId, (cfg) => {
                    cfg.channels[type] = channel.id;
                });
        
                await interaction.reply({
                    content: `✅ Channel for **${type}** set to <#${channel.id}>.`,
                    flags: MessageFlags.Ephemeral
                });

            }
        } catch (err) {
            const errorEmbeds = new EmbedBuilder()
                .setAuthor({name: interaction.member.user.username, iconURL: userAvatarUrl})
                .setThumbnail(client.user.displayAvatarURL())
                .setTitle(`🛑 Error Occurred 🛑`)
                .setDescription(`Some error can't be handled`)
                .addFields([
                    {
                        name: `🚧Command Used`,
                        value: "`/ravi-config`",
                    },
                    {
                        name: '📜Error message',
                        value: `>>> Error code: ${err.code ?? 'N/A'}\nError message: ${err.message ?? 'No message provided'}`,
                    },
                    {
                        name: `⛑ Author's advice`,
                        value: "```Error is written by the bot itself, please read the message carefully and contact the bot's owner```",
                    },
                ])
                .setColor(0x94fc03)
                .setFooter({ text: `You can consult this to ${ ownerInfo.username }`, iconURL: ownerInfo.avatarURL})
                .setTimestamp();
            await interaction.reply({
                embeds: [errorEmbeds],
                flags: MessageFlags.Ephemeral
            });
        }
    },

    name: 'ravi-config',
    description: `Configure server and database settings.`,
    devOnly: false,
    adminOnly: true,
    options: [
        {
            name: 'channel',
            description: 'Set up bot channels',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'type',
                    description: 'Type of channel to configure.',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    choices: [
                        { name: 'Receptionnist', value: 'receptionist'},
                        { name: 'Review', value: 'review'},
                        { name: 'Errors', value: 'errors'},
                    ]
                },
                {
                    name: 'channel',
                    description: 'The channel to assign.',
                    type: ApplicationCommandOptionType.Channel,
                    required: true
                }
            ]
        }
    ]

};