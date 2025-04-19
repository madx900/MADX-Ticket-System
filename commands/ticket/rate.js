const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../../config');
const language = require('../../utils/language');
const logger = require('../../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rate')
        .setDescription('Rate the service provided in this ticket')
        .addIntegerOption(option =>
            option.setName('stars')
                .setDescription('Rating from 1 to 5 stars')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(5))
        .addStringOption(option =>
            option.setName('feedback')
                .setDescription('Additional feedback (optional)')
                .setRequired(false)),

    async execute(interaction) {
        // Check if channel is a ticket
        if (!interaction.channel.name.startsWith('ticket-')) {
            return interaction.reply({
                content: '❌ هذا الأمر يمكن استخدامه فقط في التذاكر!',
                ephemeral: true
            });
        }

        const stars = interaction.options.getInteger('stars');
        const feedback = interaction.options.getString('feedback');

        // Create rating embed
        const embed = new EmbedBuilder()
            .setTitle('⭐ تقييم الخدمة')
            .setDescription(`تم تقييم الخدمة بـ ${'⭐'.repeat(stars)}`)
            .setColor('#2f3136')
            .setTimestamp();

        if (feedback) {
            embed.addFields({ name: 'الملاحظات', value: feedback });
        }

        if (config.ratingMessage?.image) {
            embed.setImage(config.ratingMessage.image);
        }

        // Log the rating
        logger.log(interaction.client, 'ticketRating', {
            channelName: interaction.channel.name,
            rating: stars,
            userId: interaction.user.id,
            feedback: feedback
        });

        // Send thank you message
        const thankYouEmbed = new EmbedBuilder()
            .setTitle('🌟 شكراً لك!')
            .setDescription('شكراً لتقييمك! نحن نقدر ملاحظاتك ونسعى دائماً للتحسين.')
            .setColor('#2f3136');

        await interaction.reply({
            embeds: [embed, thankYouEmbed]
        });

        // If rating is low (1-2 stars), notify staff
        if (stars <= 2) {
            const staffNotification = new EmbedBuilder()
                .setTitle('⚠️ تقييم منخفض')
                .setDescription(`تم استلام تقييم منخفض في ${interaction.channel}`)
                .addFields(
                    { name: 'التقييم', value: '⭐'.repeat(stars), inline: true },
                    { name: 'المستخدم', value: interaction.user.toString(), inline: true }
                )
                .setColor('Red');

            if (feedback) {
                staffNotification.addFields({ name: 'الملاحظات', value: feedback });
            }

            // Send to log channel
            const logChannel = interaction.guild.channels.cache.get(config.ticketLogChannel);
            if (logChannel) {
                await logChannel.send({
                    content: config.staffRoles.map(role => `<@&${role}>`).join(', '),
                    embeds: [staffNotification]
                });
            }
        }
    },
};
