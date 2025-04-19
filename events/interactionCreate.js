const { Events, ChannelType, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../config');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        // Handle Dropdown Menu Select
        if (interaction.isStringSelectMenu() && interaction.customId === 'ticket_menu') {
            await handleTicketCreation(interaction, interaction.values[0]);
        }
        
        // Handle Button Click
        if (interaction.isButton() && interaction.customId.startsWith('ticket_button_')) {
            const categoryId = interaction.customId.replace('ticket_button_', '');
            await handleTicketCreation(interaction, categoryId);
        }
    }
};

async function handleTicketCreation(interaction, categoryId) {
    const category = config.categories.find(c => c.id === categoryId);
    if (!category) return;

    // Check if user already has a ticket
    const existingTicket = interaction.guild.channels.cache.find(
        channel => channel.name.includes(interaction.user.id) && 
                  channel.parentId === category.categoryId
    );

    if (existingTicket) {
        return interaction.reply({
            content: `لديك تذكرة مفتوحة بالفعل: ${existingTicket}`,
            ephemeral: true
        });
    }

    // Create ticket channel
    const ticketChannel = await interaction.guild.channels.create({
        name: `ticket-${interaction.user.username}-${interaction.user.id}`,
        type: ChannelType.GuildText,
        parent: category.categoryId,
        permissionOverwrites: [
            {
                id: interaction.guild.id,
                deny: [PermissionFlagsBits.ViewChannel],
            },
            {
                id: interaction.user.id,
                allow: [
                    PermissionFlagsBits.ViewChannel,
                    PermissionFlagsBits.SendMessages,
                    PermissionFlagsBits.ReadMessageHistory,
                ],
            },
            ...config.staffRoles.map(roleId => ({
                id: roleId,
                allow: [
                    PermissionFlagsBits.ViewChannel,
                    PermissionFlagsBits.SendMessages,
                    PermissionFlagsBits.ReadMessageHistory,
                ],
            })),
        ],
    });

    const embed = new EmbedBuilder()
        .setTitle(`${category.emoji} ${category.name}`)
        .setDescription(`مرحباً بك ${interaction.user}\nسيتم مساعدتك من قبل المسؤولين في اقرب وقت ممكن.\nاشرح طلبك وسيتم الرد عليك بأسرع وقت ممكن شاكرين لك إنتظارك 🌹`)
        .setColor('#2f3136')
        .setTimestamp();

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('close_ticket')
                .setLabel('إغلاق التذكرة')
                .setEmoji('🔒')
                .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId('claim_ticket')
                .setLabel('استلام التذكرة')
                .setEmoji('✋')
                .setStyle(ButtonStyle.Success)
        );

    await ticketChannel.send({
        content: `${interaction.user} | ${config.staffRoles.map(role => `<@&${role}>`).join(', ')}`,
        embeds: [embed],
        components: [row]
    });

    await interaction.reply({
        content: `تم إنشاء تذكرتك بنجاح: ${ticketChannel}`,
        ephemeral: true
    });

    // Set up auto-delete if enabled
    if (category.autoDelete?.enabled) {
        setTimeout(() => {
            checkTicketActivity(ticketChannel, interaction.user, category);
        }, category.autoDelete.timeout * 1000 * category.autoDelete.warningAt);
    }
}

async function checkTicketActivity(channel, user, category) {
    const messages = await channel.messages.fetch({ limit: 100 });
    const userMessages = messages.filter(m => m.author.id === user.id);
    
    if (userMessages.size <= 1) {
        // Send warning
        const warningEmbed = new EmbedBuilder()
            .setTitle('⚠️ تحذير: تذكرة غير نشطة')
            .setDescription(`${user}, تذكرتك ستغلق تلقائياً إذا لم يتم الرد خلال ${category.autoDelete.timeout * (1 - category.autoDelete.warningAt)} ثانية`)
            .setColor('Yellow');
            
        await channel.send({ content: `${user}`, embeds: [warningEmbed] });
        
        // Set final warning timeout
        setTimeout(() => {
            checkFinalWarning(channel, user, category);
        }, category.autoDelete.timeout * 1000 * (category.autoDelete.finalWarningAt - category.autoDelete.warningAt));
    }
}

async function checkFinalWarning(channel, user, category) {
    const messages = await channel.messages.fetch({ limit: 100 });
    const userMessages = messages.filter(m => m.author.id === user.id);
    
    if (userMessages.size <= 1) {
        const finalWarningEmbed = new EmbedBuilder()
            .setTitle('⚠️ تحذير نهائي: تذكرة غير نشطة')
            .setDescription(`${user}, تذكرتك ستغلق تلقائياً خلال ${category.autoDelete.timeout * (1 - category.autoDelete.finalWarningAt)} ثانية`)
            .setColor('Red');
            
        await channel.send({ content: `${user}`, embeds: [finalWarningEmbed] });
        
        // Set final deletion timeout
        setTimeout(() => {
            if (channel.deletable) {
                channel.delete().catch(console.error);
            }
        }, category.autoDelete.timeout * 1000 * (1 - category.autoDelete.finalWarningAt));
    }
}
