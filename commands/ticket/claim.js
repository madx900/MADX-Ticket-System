const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const config = require('../../config');
const language = require('../../utils/language');
const logger = require('../../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('claim')
        .setDescription('Claim a ticket to handle it'),

    async execute(interaction) {
        // Check if channel is a ticket
        const ticketChannel = interaction.channel;
        if (!ticketChannel.name.startsWith('ticket-')) {
            return interaction.reply({
                content: '❌ هذا الأمر يمكن استخدامه فقط في التذاكر!',
                ephemeral: true
            });
        }

        // Check if user has staff role
        const hasStaffRole = interaction.member.roles.cache.some(role => 
            config.staffRoles.includes(role.id)
        );

        if (!hasStaffRole) {
            return interaction.reply({
                content: language.getText('noPermission'),
                ephemeral: true
            });
        }

        // Check if ticket is already claimed
        const ticketMessages = await ticketChannel.messages.fetch({ limit: 1 });
        const firstMessage = ticketMessages.first();
        if (firstMessage?.embeds[0]?.description?.includes('تم استلام التذكرة')) {
            return interaction.reply({
                content: '❌ هذه التذكرة تم استلامها بالفعل!',
                ephemeral: true
            });
        }

        // Create claim embed
        const embed = new EmbedBuilder()
            .setTitle(`${config.categories.find(c => ticketChannel.parent?.id === c.categoryId)?.emoji || '🎫'} تم استلام التذكرة`)
            .setDescription(`تم استلام التذكرة بواسطة ${interaction.user}\nسيتم الرد عليك في أقرب وقت ممكن 🌹`)
            .setColor('#2f3136')
            .setTimestamp();

        // Update channel permissions to give claimer extra permissions
        await ticketChannel.permissionOverwrites.edit(interaction.user.id, {
            ViewChannel: true,
            SendMessages: true,
            ReadMessageHistory: true,
            ManageMessages: true
        });

        // Log claim
        logger.log(interaction.client, 'ticketClaim', {
            channelId: ticketChannel.id,
            staffId: interaction.user.id
        });

        // Send claim message
        await interaction.reply({ embeds: [embed] });

        // Optional: Add staff shortcuts/macros if configured
        const category = config.categories.find(c => ticketChannel.parent?.id === c.categoryId);
        if (category?.shortcuts?.length > 0) {
            const shortcuts = category.shortcuts.map(s => `\`${s.name}\` - ${s.content}`).join('\n');
            await interaction.followUp({
                content: `**الاختصارات المتاحة:**\n${shortcuts}`,
                ephemeral: true
            });
        }
    },
};
