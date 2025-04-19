const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const config = require('../config.js');
const db = new QuickDB();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('Setup the ticket system')
        .addSubcommand(subcommand =>
            subcommand
                .setName('setup')
                .setDescription('Setup the ticket system')
                .addChannelOption(option =>
                    option.setName('channel')
                        .setDescription('The channel to setup the ticket system in')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('type')
                        .setDescription('The type of ticket system to setup')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Dropdown Menu', value: 'dropdown' },
                            { name: 'Button Menu', value: 'button' },
                            { name: 'Both', value: 'both' }
                        ))),

    async execute(interaction) {
        if (!interaction.memberPermissions.has('ADMINISTRATOR')) {
            return interaction.reply({ content: 'You need administrator permissions to use this command!', ephemeral: true });
        }

        const channel = interaction.options.getChannel('channel');
        const type = interaction.options.getString('type');

        // Get custom categories from database
        const categories = [];
        const keys = await db.list('ticketCategory');
        for (const key of keys) {
            if (key.startsWith('ticketCategory_')) {
                const category = await db.get(key);
                categories.push(category);
            }
        }

        // If no custom categories, use default ones from config
        if (categories.length === 0) {
            Object.entries(config.ticketTypes).forEach(([key, value]) => {
                categories.push({
                    name: key,
                    description: value.description,
                    emoji: value.emoji,
                    color: value.color,
                    autoResponse: value.autoResponse
                });
            });
        }

        const embed = new EmbedBuilder()
            .setTitle('🎫 Ticket System')
            .setDescription('Create a ticket by selecting the appropriate option below')
            .setColor(config.colors.primary)
            .setTimestamp();

        let components = [];

        if (type === 'dropdown' || type === 'both') {
            const dropdown = new StringSelectMenuBuilder()
                .setCustomId('ticket_dropdown')
                .setPlaceholder('Select ticket type');

            categories.forEach(category => {
                dropdown.addOptions({
                    label: category.name,
                    description: category.description,
                    value: category.name,
                    emoji: category.emoji
                });
            });

            components.push(new ActionRowBuilder().addComponents(dropdown));
        }

        if (type === 'button' || type === 'both') {
            const buttons = new ActionRowBuilder();
            
            categories.forEach(category => {
                buttons.addComponents(
                    new ButtonBuilder()
                        .setCustomId(`ticket_${category.name}`)
                        .setLabel(category.name)
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(category.emoji)
                );
            });

            components.push(buttons);
        }

        await channel.send({ embeds: [embed], components });
        await interaction.reply({ content: `Ticket system has been setup in ${channel}!`, ephemeral: true });
    },
};
