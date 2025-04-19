const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../config');
const cart = require('../../utils/shoppingCart');
const language = require('../../utils/language');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('checkout')
        .setDescription('Checkout your shopping cart and get payment information'),

    async execute(interaction) {
        const userCart = cart.getCart(interaction.user.id);
        
        if (userCart.length === 0) {
            return interaction.reply({
                content: language.getText('cartEmpty'),
                ephemeral: true
            });
        }

        // Create invoice embed
        const embed = new EmbedBuilder()
            .setTitle('💰 فاتورة الطلب')
            .setDescription(cart.formatCart(interaction.user.id))
            .addFields(
                { name: 'طرق الدفع المتاحة', value: '━━━━━━━━━━━━━━' },
                { 
                    name: 'PayPal', 
                    value: config.paymentMethods.paypal,
                    inline: true 
                },
                { 
                    name: 'Streamlabs', 
                    value: config.paymentMethods.streamlabs,
                    inline: true 
                }
            )
            .setColor('#2f3136')
            .setFooter({ text: 'يرجى إرسال إثبات الدفع في هذه التذكرة' })
            .setTimestamp();

        // Clear the cart after checkout
        cart.clearCart(interaction.user.id);

        await interaction.reply({
            embeds: [embed]
        });

        // If we're in a ticket channel, ping staff
        if (interaction.channel.name.startsWith('ticket-')) {
            await interaction.channel.send({
                content: config.staffRoles.map(role => `<@&${role}>`).join(', '),
                embeds: [
                    new EmbedBuilder()
                        .setTitle('💰 طلب جديد')
                        .setDescription('يرجى متابعة الطلب وتأكيد الدفع')
                        .setColor('#2f3136')
                ]
            });
        }
    },
};
