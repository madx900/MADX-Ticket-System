const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const config = require('../../config');
const language = require('../../utils/language');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('blacklist')
        .setDescription('Manage the ticket system blacklist')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Add a user to the blacklist')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('The user to blacklist')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('reason')
                        .setDescription('Reason for blacklisting')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Remove a user from the blacklist')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('The user to remove from blacklist')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('List all blacklisted users')),

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        const configPath = path.join(__dirname, '../../config.js');

        switch (subcommand) {
            case 'add': {
                const user = interaction.options.getUser('user');
                const reason = interaction.options.getString('reason');

                if (config.blacklistedUsers.includes(user.id)) {
                    return interaction.reply({
                        content: '❌ هذا المستخدم محظور بالفعل!',
                        ephemeral: true
                    });
                }

                // Update blacklist in memory
                config.blacklistedUsers.push(user.id);

                // Update config file
                let configContent = fs.readFileSync(configPath, 'utf8');
                configContent = configContent.replace(
                    /blacklistedUsers:\s*\[([\s\S]*?)\]/,
                    `blacklistedUsers: [${config.blacklistedUsers.map(id => `"${id}"`).join(', ')}]`
                );
                fs.writeFileSync(configPath, configContent);

                const embed = new EmbedBuilder()
                    .setTitle('⛔ إضافة للقائمة السوداء')
                    .setDescription(`تم إضافة ${user} إلى القائمة السوداء`)
                    .addFields(
                        { name: 'السبب', value: reason },
                        { name: 'بواسطة', value: interaction.user.toString() }
                    )
                    .setColor('Red')
                    .setTimestamp();

                await interaction.reply({ embeds: [embed] });
                break;
            }

            case 'remove': {
                const user = interaction.options.getUser('user');

                if (!config.blacklistedUsers.includes(user.id)) {
                    return interaction.reply({
                        content: '❌ هذا المستخدم غير محظور!',
                        ephemeral: true
                    });
                }

                // Update blacklist in memory
                config.blacklistedUsers = config.blacklistedUsers.filter(id => id !== user.id);

                // Update config file
                let configContent = fs.readFileSync(configPath, 'utf8');
                configContent = configContent.replace(
                    /blacklistedUsers:\s*\[([\s\S]*?)\]/,
                    `blacklistedUsers: [${config.blacklistedUsers.map(id => `"${id}"`).join(', ')}]`
                );
                fs.writeFileSync(configPath, configContent);

                const embed = new EmbedBuilder()
                    .setTitle('✅ إزالة من القائمة السوداء')
                    .setDescription(`تم إزالة ${user} من القائمة السوداء`)
                    .addFields(
                        { name: 'بواسطة', value: interaction.user.toString() }
                    )
                    .setColor('Green')
                    .setTimestamp();

                await interaction.reply({ embeds: [embed] });
                break;
            }

            case 'list': {
                const blacklistedUsers = await Promise.all(
                    config.blacklistedUsers.map(async (userId) => {
                        try {
                            const user = await interaction.client.users.fetch(userId);
                            return `${user.tag} (${user.id})`;
                        } catch {
                            return `Unknown User (${userId})`;
                        }
                    })
                );

                const embed = new EmbedBuilder()
                    .setTitle('⛔ القائمة السوداء')
                    .setDescription(blacklistedUsers.length > 0 
                        ? blacklistedUsers.join('\n')
                        : 'القائمة السوداء فارغة')
                    .setColor('#2f3136')
                    .setTimestamp();

                await interaction.reply({ embeds: [embed], ephemeral: true });
                break;
            }
        }
    },
};
