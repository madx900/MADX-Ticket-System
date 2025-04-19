const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const config = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('embed')
        .setDescription('Create and send a custom embed message')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand =>
            subcommand
                .setName('create')
                .setDescription('Create and send a custom embed')
                .addStringOption(option =>
                    option.setName('title')
                        .setDescription('Embed title')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('description')
                        .setDescription('Embed description')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('color')
                        .setDescription('Embed color (hex code)')
                        .setRequired(false))
                .addStringOption(option =>
                    option.setName('image')
                        .setDescription('Embed image URL')
                        .setRequired(false))
                .addStringOption(option =>
                    option.setName('thumbnail')
                        .setDescription('Embed thumbnail URL')
                        .setRequired(false))
                .addStringOption(option =>
                    option.setName('footer')
                        .setDescription('Embed footer text')
                        .setRequired(false)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('field')
                .setDescription('Add a field to the last embed in the channel')
                .addStringOption(option =>
                    option.setName('name')
                        .setDescription('Field name')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('value')
                        .setDescription('Field value')
                        .setRequired(true))
                .addBooleanOption(option =>
                    option.setName('inline')
                        .setDescription('Should the field be inline?')
                        .setRequired(false))),

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        switch (subcommand) {
            case 'create': {
                const title = interaction.options.getString('title');
                const description = interaction.options.getString('description');
                const color = interaction.options.getString('color') || '#2f3136';
                const image = interaction.options.getString('image');
                const thumbnail = interaction.options.getString('thumbnail');
                const footer = interaction.options.getString('footer');

                const embed = new EmbedBuilder()
                    .setTitle(title)
                    .setDescription(description)
                    .setColor(color)
                    .setTimestamp();

                if (image) embed.setImage(image);
                if (thumbnail) embed.setThumbnail(thumbnail);
                if (footer) embed.setFooter({ text: footer });

                await interaction.reply({ embeds: [embed] });
                break;
            }

            case 'field': {
                const name = interaction.options.getString('name');
                const value = interaction.options.getString('value');
                const inline = interaction.options.getBoolean('inline') || false;

                // Get the last message in the channel
                const messages = await interaction.channel.messages.fetch({ limit: 1 });
                const lastMessage = messages.first();

                if (!lastMessage?.embeds[0]) {
                    return interaction.reply({
                        content: '❌ لم يتم العثور على رسالة مضمنة!',
                        ephemeral: true
                    });
                }

                // Create new embed with existing data plus new field
                const oldEmbed = lastMessage.embeds[0];
                const newEmbed = EmbedBuilder.from(oldEmbed)
                    .addFields({ name, value, inline });

                await lastMessage.edit({ embeds: [newEmbed] });
                await interaction.reply({
                    content: '✅ تم إضافة الحقل بنجاح!',
                    ephemeral: true
                });
                break;
            }
        }
    },
};
