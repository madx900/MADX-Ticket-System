const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const config = require('../../config');
const language = require('../../utils/language');
const logger = require('../../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('transfer')
        .setDescription('Transfer a ticket to another category')
        .addStringOption(option =>
            option.setName('category')
                .setDescription('The category to transfer the ticket to')
                .setRequired(true)
                .addChoices(...config.categories.map(cat => ({
                    name: cat.name,
                    value: cat.id
                })))),

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

        const newCategoryId = interaction.options.getString('category');
        const newCategory = config.categories.find(c => c.id === newCategoryId);
        
        if (!newCategory) {
            return interaction.reply({
                content: '❌ القسم غير موجود!',
                ephemeral: true
            });
        }

        const oldCategory = config.categories.find(c => ticketChannel.parent?.id === c.categoryId);
        
        // Move channel to new category
        await ticketChannel.setParent(newCategory.categoryId);

        // Update ticket embed
        const embed = new EmbedBuilder()
            .setTitle(`${newCategory.emoji} تم نقل التذكرة`)
            .setDescription(`تم نقل التذكرة من ${oldCategory?.name || 'قسم غير معروف'} إلى ${newCategory.name}`)
            .setColor('#2f3136')
            .setTimestamp();

        // Log transfer
        logger.log(interaction.client, 'ticketTransfer', {
            channelId: ticketChannel.id,
            fromCategory: oldCategory?.name || 'Unknown',
            toCategory: newCategory.name,
            staffId: interaction.user.id
        });

        await interaction.reply({ embeds: [embed] });

        // If new category has specific questions, ask them
        if (newCategory.questions?.length > 0) {
            const questionsEmbed = new EmbedBuilder()
                .setTitle('❓ أسئلة القسم الجديد')
                .setDescription('يرجى الإجابة على الأسئلة التالية:')
                .addFields(
                    newCategory.questions.map(q => ({
                        name: q.question,
                        value: q.required ? '(إجباري)' : '(اختياري)'
                    }))
                )
                .setColor('#2f3136');

            await interaction.channel.send({ embeds: [questionsEmbed] });
        }
    },
};
