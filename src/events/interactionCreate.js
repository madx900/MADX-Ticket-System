const { Events, ChannelType, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { createTranscript } = require('discord-html-transcripts');
const { QuickDB } = require('quick.db');
const config = require('../config.js');
const fs = require('fs').promises;
const path = require('path');
const db = new QuickDB();

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);
            if (!command) return;

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'There was an error executing this command!', ephemeral: true });
            }
            return;
        }

        // Handle ticket creation from dropdown menu
        if (interaction.isStringSelectMenu() && interaction.customId === 'ticket_dropdown') {
            await handleTicketCreation(interaction, interaction.values[0]);
            return;
        }

        // Handle ticket creation from buttons
        if (interaction.isButton() && interaction.customId.startsWith('ticket_')) {
            const ticketType = interaction.customId.split('_')[1];
            await handleTicketCreation(interaction, ticketType);
            return;
        }

        // Handle ticket closure
        if (interaction.isButton() && interaction.customId === 'close_ticket') {
            await handleTicketClose(interaction);
        }
    },
};

async function handleTicketCreation(interaction, ticketType) {
    const guild = interaction.guild;
    const member = interaction.member;

    // Check if user already has an open ticket
    const existingTicket = interaction.client.tickets.get(member.id);
    if (existingTicket) {
        return interaction.reply({ 
            content: `You already have an open ticket! <#${existingTicket}>`,
            ephemeral: true 
        });
    }

    // Get ticket category settings
    const category = await db.get(`ticketCategory_${ticketType}`) || config.ticketTypes[ticketType];
    if (!category) {
        return interaction.reply({
            content: 'This ticket category no longer exists.',
            ephemeral: true
        });
    }

    // Get staff roles
    const staffRoles = await db.get('staffRoles') || [];
    if (staffRoles.length === 0 && config.STAFF_ROLE_ID) {
        staffRoles.push(config.STAFF_ROLE_ID);
    }

    // Create ticket channel
    const ticketChannel = await guild.channels.create({
        name: `ticket-${member.user.username}-${ticketType}`,
        type: ChannelType.GuildText,
        parent: config.TICKETS_CATEGORY,
        permissionOverwrites: [
            {
                id: guild.id,
                deny: [PermissionFlagsBits.ViewChannel],
            },
            {
                id: member.id,
                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
            },
            {
                id: interaction.client.user.id,
                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageChannels],
            },
            ...staffRoles.map(roleId => ({
                id: roleId,
                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
            }))
        ],
    });

    // Store ticket in collection
    interaction.client.tickets.set(member.id, ticketChannel.id);

    const embed = new EmbedBuilder()
        .setTitle(`${category.emoji} ${category.name} Support Ticket`)
        .setDescription(category.autoResponse)
        .setColor(category.color)
        .setTimestamp();

    const closeButton = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('close_ticket')
                .setLabel('Close Ticket')
                .setStyle(ButtonStyle.Danger)
                .setEmoji('🔒')
        );

    await ticketChannel.send({ embeds: [embed], components: [closeButton] });
    await interaction.reply({ 
        content: `Your ticket has been created! ${ticketChannel}`,
        ephemeral: true 
    });
}

async function handleTicketClose(interaction) {
    const channel = interaction.channel;
    const ticketOwner = Array.from(interaction.client.tickets.entries())
        .find(([_, channelId]) => channelId === channel.id)?.[0];

    if (!ticketOwner) {
        return interaction.reply({ 
            content: 'Error: Could not find ticket information.',
            ephemeral: true 
        });
    }

    await interaction.reply({ content: 'Creating transcript and closing ticket...' });

    // Create transcript
    const transcript = await createTranscript(channel, {
        limit: -1,
        fileName: `ticket-${channel.name}.html`,
    });

    // Save transcript locally if enabled
    if (config.transcripts.saveLocally) {
        const transcriptPath = path.join(process.cwd(), config.transcripts.path);
        try {
            await fs.mkdir(transcriptPath, { recursive: true });
            await fs.writeFile(
                path.join(transcriptPath, `ticket-${channel.name}.html`),
                transcript.toString()
            );
        } catch (error) {
            console.error('Error saving transcript locally:', error);
        }
    }

    // Send transcript to designated channel
    const transcriptChannelId = await db.get('transcriptChannel') || config.transcripts.saveInChannel;
    if (transcriptChannelId) {
        const transcriptChannel = await interaction.guild.channels.fetch(transcriptChannelId);
        if (transcriptChannel) {
            const embed = new EmbedBuilder()
                .setTitle('Ticket Transcript')
                .setDescription(`Ticket: ${channel.name}\nClosed by: ${interaction.user.tag}`)
                .setColor(config.colors.primary)
                .setTimestamp();

            await transcriptChannel.send({
                embeds: [embed],
                files: [transcript]
            });
        }
    }

    // Remove ticket from collection and delete channel
    interaction.client.tickets.delete(ticketOwner);
    setTimeout(() => channel.delete(), 5000);
}
