const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../../config');
const cart = require('../../utils/shoppingCart');
const language = require('../../utils/language');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cart')
        .setDescription('Manage your shopping cart')
        .addSubcommand(subcommand =>
            subcommand
                .setName('view')
                .setDescription('View your shopping cart'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Add an item to your cart')
                .addStringOption(option =>
                    option.setName('item')
                        .setDescription('The item to add')
                        .setRequired(true)
                        .addChoices(...Object.keys(config.products).map(product => ({
                            name: product,
                            value: product
                        })))))
        .addSubcommand(subcommand =>
            subcommand
                .setName('clear')
                .setDescription('Clear your shopping cart')),

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        switch (subcommand) {
            case 'view':
                await handleViewCart(interaction);
                break;
            case 'add':
                await handleAddToCart(interaction);
                break;
            case 'clear':
                await handleClearCart(interaction);
                break;
        }
    },
};

async function handleViewCart(interaction) {
    const userCart = cart.getCart(interaction.user.id);
    
    if (userCart.length === 0) {
        return interaction.reply({
            content: language.getText('cartEmpty'),
            ephemeral: true
        });
    }

    const embed = new EmbedBuilder()
        .setTitle('🛒 عربة التسوق')
        .setDescription(cart.formatCart(interaction.user.id))
        .setColor('#2f3136')
        .setTimestamp();

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('checkout')
                .setLabel('طلب الفاتورة')
                .setEmoji('💰')
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId('clear_cart')
                .setLabel('تفريغ العربة')
                .setEmoji('🗑️')
                .setStyle(ButtonStyle.Danger)
        );

    await interaction.reply({
        embeds: [embed],
        components: [row],
        ephemeral: true
    });
}

async function handleAddToCart(interaction) {
    const itemName = interaction.options.getString('item');
    
    if (!config.products[itemName]) {
        return interaction.reply({
            content: '❌ المنتج غير موجود!',
            ephemeral: true
        });
    }

    const success = cart.addItem(interaction.user.id, itemName);
    
    if (success) {
        const embed = new EmbedBuilder()
            .setTitle('✅ تمت الإضافة للعربة')
            .setDescription(cart.formatCart(interaction.user.id))
            .setColor('#2f3136');

        if (config.products[itemName].image) {
            embed.setThumbnail(config.products[itemName].image);
        }

        await interaction.reply({
            embeds: [embed],
            ephemeral: true
        });
    } else {
        await interaction.reply({
            content: '❌ حدث خطأ أثناء إضافة المنتج للعربة',
            ephemeral: true
        });
    }
}

async function handleClearCart(interaction) {
    cart.clearCart(interaction.user.id);
    await interaction.reply({
        content: '🗑️ تم تفريغ عربة التسوق',
        ephemeral: true
    });
}
