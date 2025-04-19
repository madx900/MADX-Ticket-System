const { EmbedBuilder } = require('discord.js');
const config = require('../config');

class Logger {
    constructor() {
        this.enabled = config.logging.enabled;
    }

    async log(client, type, data) {
        if (!this.enabled || !config.logging.events[type]) return;

        const channel = await client.channels.fetch(config.ticketLogChannel).catch(() => null);
        if (!channel) return;

        const embed = new EmbedBuilder()
            .setColor('#2f3136')
            .setTimestamp();

        switch (type) {
            case 'ticketCreate':
                embed.setTitle('🎫 تم إنشاء تذكرة جديدة')
                    .addFields(
                        { name: 'القسم', value: data.category, inline: true },
                        { name: 'المستخدم', value: `<@${data.userId}>`, inline: true },
                        { name: 'التذكرة', value: `<#${data.channelId}>`, inline: true }
                    );
                break;

            case 'ticketClose':
                embed.setTitle('🔒 تم إغلاق تذكرة')
                    .addFields(
                        { name: 'التذكرة', value: data.channelName, inline: true },
                        { name: 'بواسطة', value: `<@${data.closedBy}>`, inline: true }
                    );
                break;

            case 'ticketClaim':
                embed.setTitle('✋ تم استلام تذكرة')
                    .addFields(
                        { name: 'التذكرة', value: `<#${data.channelId}>`, inline: true },
                        { name: 'المسؤول', value: `<@${data.staffId}>`, inline: true }
                    );
                break;

            case 'ticketTransfer':
                embed.setTitle('📋 تم نقل تذكرة')
                    .addFields(
                        { name: 'التذكرة', value: `<#${data.channelId}>`, inline: true },
                        { name: 'من', value: data.fromCategory, inline: true },
                        { name: 'إلى', value: data.toCategory, inline: true },
                        { name: 'بواسطة', value: `<@${data.staffId}>`, inline: true }
                    );
                break;

            case 'ticketRating':
                embed.setTitle('⭐ تقييم جديد')
                    .addFields(
                        { name: 'التذكرة', value: data.channelName, inline: true },
                        { name: 'التقييم', value: '⭐'.repeat(data.rating), inline: true },
                        { name: 'المستخدم', value: `<@${data.userId}>`, inline: true }
                    );
                if (data.feedback) {
                    embed.addFields({ name: 'الملاحظات', value: data.feedback });
                }
                break;
        }

        await channel.send({ embeds: [embed] });
    }
}

module.exports = new Logger();
