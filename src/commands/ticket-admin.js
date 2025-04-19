const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const config = require('../config.js');
const db = new QuickDB();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket-admin')
        .setDescription('Ticket administration commands')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addSubcommand(subcommand =>
            subcommand
                .setName('category')
                .setDescription('Add or edit a ticket category')
                .addStringOption(option =>
                    option.setName('name')
                        .setDescription('Category name')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('description')
                        .setDescription('Category description')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('emoji')
                        .setDescription('Category emoji')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('color')
                        .setDescription('Category color (hex)')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('auto_response')
                        .setDescription('Automatic response message')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove-category')
                .setDescription('Remove a ticket category')
                .addStringOption(option =>
                    option.setName('name')
                        .setDescription('Category name')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('add-staff')
                .setDescription('Add a role that can manage tickets')
                .addRoleOption(option =>
                    option.setName('role')
                        .setDescription('Staff role')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('set-transcript-channel')
                .setDescription('Set the channel for ticket transcripts')
                .addChannelOption(option =>
                    option.setName('channel')
                        .setDescription('Channel for transcripts')
                        .setRequired(true))),

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        switch (subcommand) {
            case 'category': {
                const name = interaction.options.getString('name').toLowerCase();
                const description = interaction.options.getString('description');
                const emoji = interaction.options.getString('emoji');
                const color = interaction.options.getString('color');
                const autoResponse = interaction.options.getString('auto_response');

                await db.set(`ticketCategory_${name}`, {
                    name,
                    description,
                    emoji,
                    color,
                    autoResponse
                });

                const embed = new EmbedBuilder()
                    .setTitle('Ticket Category Added')
                    .setDescription(`Successfully added/updated category: ${emoji} ${name}`)
                    .setColor(color)
                    .addFields(
                        { name: 'Description', value: description },
                        { name: 'Auto Response', value: autoResponse }
                    );

                await interaction.reply({ embeds: [embed], ephemeral: true });
                break;
            }

            case 'remove-category': {
                const name = interaction.options.getString('name').toLowerCase();
                await db.delete(`ticketCategory_${name}`);
                await interaction.reply({ 
                    content: `Successfully removed category: ${name}`,
                    ephemeral: true 
                });
                break;
            }

            case 'add-staff': {
                const role = interaction.options.getRole('role');
                const staffRoles = await db.get('staffRoles') || [];
                
                if (!staffRoles.includes(role.id)) {
                    staffRoles.push(role.id);
                    await db.set('staffRoles', staffRoles);
                }

                await interaction.reply({ 
                    content: `Added ${role.name} as a staff role for tickets.`,
                    ephemeral: true 
                });
                break;
            }

            case 'set-transcript-channel': {
                const channel = interaction.options.getChannel('channel');
                await db.set('transcriptChannel', channel.id);
                await interaction.reply({ 
                    content: `Set ${channel} as the transcript channel.`,
                    ephemeral: true 
                });
                break;
            }
        }
    },
};
