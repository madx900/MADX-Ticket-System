const { 
    SlashCommandBuilder, 
    PermissionFlagsBits, 
    EmbedBuilder, 
    ActionRowBuilder, 
    StringSelectMenuBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');
const config = require('../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Setup the ticket system')
        .addStringOption(option =>
            option.setName('style')
                .setDescription('Choose the ticket interface style')
                .setRequired(true)
                .addChoices(
                    { name: 'Dropdown Menu', value: 'dropdown' },
                    { name: 'Buttons', value: 'buttons' }
                ))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
        
    async execute(interaction) {
        const style = interaction.options.getString('style');
        
        const embed = new EmbedBuilder()
            .setTitle('🎫 | افتح تذكرة اضغط على الزر ادناه')
            .setDescription('اختر نوع التذكرة التي تريد فتحها')
            .setColor('#2f3136')
            .setFooter({ text: 'Qz Services  2022' });

        let components = [];

        if (style === 'dropdown') {
            const row = new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('ticket_menu')
                        .setPlaceholder('اختر نوع التذكرة')
                        .addOptions(
                            config.categories.map(category => ({
                                label: category.name,
                                value: category.id,
                                emoji: category.emoji,
                                description: `فتح تذكرة ${category.name}`
                            }))
                        )
                );
            components.push(row);
        } else {
            // Create button rows (max 5 buttons per row)
            const buttons = config.categories.map(category => 
                new ButtonBuilder()
                    .setCustomId(`ticket_button_${category.id}`)
                    .setLabel(category.name)
                    .setEmoji(category.emoji)
                    .setStyle(ButtonStyle[category.buttonStyle])
            );

            // Split buttons into rows of 5
            for (let i = 0; i < buttons.length; i += 5) {
                const row = new ActionRowBuilder()
                    .addComponents(buttons.slice(i, i + 5));
                components.push(row);
            }
        }

        await interaction.reply({ content: 'Ticket message has been set up!', ephemeral: true });
        await interaction.channel.send({ 
            embeds: [embed], 
            components: components
        });
    },
};
