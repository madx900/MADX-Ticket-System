const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const config = require('../../config');
const language = require('../../utils/language');
const logger = require('../../utils/logger');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('transcript')
        .setDescription('Generate a transcript of the ticket'),

    async execute(interaction) {
        if (!interaction.channel.name.startsWith('ticket-')) {
            return interaction.reply({
                content: '❌ هذا الأمر يمكن استخدامه فقط في التذاكر!',
                ephemeral: true
            });
        }

        await interaction.deferReply();

        try {
            // Create transcripts directory if it doesn't exist
            const transcriptsDir = path.join(__dirname, '../../transcripts');
            if (!fs.existsSync(transcriptsDir)) {
                fs.mkdirSync(transcriptsDir);
            }

            // Fetch all messages
            let messages = [];
            let lastId;

            while (true) {
                const options = { limit: 100 };
                if (lastId) {
                    options.before = lastId;
                }

                const fetchedMessages = await interaction.channel.messages.fetch(options);
                if (fetchedMessages.size === 0) break;

                messages = [...messages, ...fetchedMessages.values()];
                lastId = fetchedMessages.last().id;
            }

            messages = messages.reverse();

            // Generate HTML transcript
            let html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Ticket Transcript - ${interaction.channel.name}</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 1000px; margin: 0 auto; padding: 20px; }
        .message { margin: 10px 0; padding: 10px; border-bottom: 1px solid #eee; }
        .author { font-weight: bold; color: #7289da; }
        .timestamp { color: #999; font-size: 0.8em; }
        .content { margin-top: 5px; }
        .attachment { color: #7289da; text-decoration: none; }
        .embed { margin: 5px 0; padding: 10px; background: #f5f5f5; border-radius: 5px; }
    </style>
</head>
<body>
    <h1>Ticket Transcript - ${interaction.channel.name}</h1>
    <div class="info">
        <p>Generated on: ${new Date().toLocaleString()}</p>
        <p>Channel: ${interaction.channel.name}</p>
        <p>Category: ${interaction.channel.parent?.name || 'None'}</p>
    </div>
    <div class="messages">`;

            for (const message of messages) {
                html += `
        <div class="message">
            <div class="author">${message.author.tag}</div>
            <div class="timestamp">${message.createdAt.toLocaleString()}</div>
            <div class="content">${message.content || ''}</div>`;

                // Add attachments
                if (message.attachments.size > 0) {
                    html += '<div class="attachments">';
                    message.attachments.forEach(attachment => {
                        html += `<a class="attachment" href="${attachment.url}" target="_blank">[Attachment: ${attachment.name}]</a><br>`;
                    });
                    html += '</div>';
                }

                // Add embeds
                if (message.embeds.length > 0) {
                    message.embeds.forEach(embed => {
                        html += `
                <div class="embed">
                    ${embed.title ? `<strong>${embed.title}</strong><br>` : ''}
                    ${embed.description || ''}
                </div>`;
                    });
                }

                html += `
        </div>`;
            }

            html += `
    </div>
</body>
</html>`;

            // Save transcript
            const fileName = `transcript-${interaction.channel.name}-${Date.now()}.html`;
            const filePath = path.join(transcriptsDir, fileName);
            fs.writeFileSync(filePath, html);

            // Create attachment
            const attachment = new AttachmentBuilder(filePath, { name: fileName });

            // Create embed
            const embed = new EmbedBuilder()
                .setTitle('📑 نسخة المحادثة')
                .setDescription('تم إنشاء نسخة من المحادثة بنجاح')
                .setColor('#2f3136')
                .setTimestamp();

            // Send transcript
            await interaction.editReply({
                embeds: [embed],
                files: [attachment]
            });

            // Log transcript creation
            logger.log(interaction.client, 'ticketTranscript', {
                channelId: interaction.channel.id,
                userId: interaction.user.id,
                fileName: fileName
            });

            // Clean up file
            fs.unlinkSync(filePath);

        } catch (error) {
            console.error('Error generating transcript:', error);
            await interaction.editReply({
                content: '❌ حدث خطأ أثناء إنشاء نسخة المحادثة',
                ephemeral: true
            });
        }
    },
};
