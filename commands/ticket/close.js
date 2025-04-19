const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const config = require('../../config');
const language = require('../../utils/language');
const logger = require('../../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('close')
        .setDescription('Close a ticket')
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('Reason for closing the ticket')
                .setRequired(false)),

    async execute(interaction) {
        // Check if channel is a ticket
        const ticketChannel = interaction.channel;
        if (!ticketChannel.name.startsWith('ticket-')) {
            return interaction.reply({
                content: '❌ هذا الأمر يمكن استخدامه فقط في التذاكر!',
                ephemeral: true
            });
        }

        // Check permissions
        const hasPermission = interaction.member.roles.cache.some(role => 
            config.staffRoles.includes(role.id) || config.adminRoles.includes(role.id)
        );

        if (!hasPermission) {
            return interaction.reply({
                content: language.getText('noPermission'),
                ephemeral: true
            });
        }

        const reason = interaction.options.getString('reason') || 'No reason provided';

        // Create close confirmation embed
        const embed = new EmbedBuilder()
            .setTitle('🔒 إغلاق التذكرة')
            .setDescription(`هل أنت متأكد من إغلاق التذكرة؟\nالسبب: ${reason}`)
            .setColor('Red')
            .setTimestamp();

        await interaction.reply({
            embeds: [embed],
            ephemeral: true
        });

        // Log ticket closure
        logger.log(interaction.client, 'ticketClose', {
            channelName: ticketChannel.name,
            closedBy: interaction.user.id,
            reason: reason
        });

        // Delete channel after 5 seconds
        setTimeout(() => {
            ticketChannel.delete().catch(console.error);
        }, 5000);
    },
};
