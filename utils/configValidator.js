const { ColorResolvable } = require('discord.js');

class ConfigValidator {
    static validate(config) {
        const errors = [];

        // Check required bot settings
        if (!config.token) errors.push('Bot token is required');
        if (!config.clientId) errors.push('Client ID is required');
        if (!config.guildId) errors.push('Guild ID is required');

        // Validate channels
        if (!config.ticketLogChannel) errors.push('Ticket log channel ID is required');
        if (!config.transcriptChannel) errors.push('Transcript channel ID is required');
        if (!config.ticketCategory) errors.push('Default ticket category ID is required');

        // Validate roles
        if (!Array.isArray(config.adminRoles) || config.adminRoles.length === 0) {
            errors.push('At least one admin role ID is required');
        }
        if (!Array.isArray(config.staffRoles) || config.staffRoles.length === 0) {
            errors.push('At least one staff role ID is required');
        }

        // Validate cooldowns
        if (typeof config.ticketCooldown !== 'number' || config.ticketCooldown < 0) {
            errors.push('Invalid ticket cooldown value');
        }
        if (typeof config.rateCooldown !== 'number' || config.rateCooldown < 0) {
            errors.push('Invalid rate cooldown value');
        }

        // Validate auto delete settings
        if (config.autoDelete) {
            const { warningTime, deleteTime, inactiveTime } = config.autoDelete;
            if (warningTime >= deleteTime) {
                errors.push('Warning time must be less than delete time');
            }
            if (inactiveTime >= warningTime) {
                errors.push('Inactive time must be less than warning time');
            }
        }

        // Validate categories
        if (!Array.isArray(config.categories) || config.categories.length === 0) {
            errors.push('At least one ticket category is required');
        } else {
            config.categories.forEach((category, index) => {
                if (!category.id) errors.push(`Category ${index + 1}: ID is required`);
                if (!category.name) errors.push(`Category ${index + 1}: Name is required`);
                if (!category.categoryId) errors.push(`Category ${index + 1}: Category ID is required`);
                if (!['PRIMARY', 'SECONDARY', 'SUCCESS', 'DANGER'].includes(category.buttonColor)) {
                    errors.push(`Category ${index + 1}: Invalid button color`);
                }
            });
        }

        // Validate products
        if (Object.keys(config.products).length === 0) {
            errors.push('At least one product is required');
        } else {
            Object.entries(config.products).forEach(([name, product]) => {
                if (typeof product.price !== 'number' || product.price <= 0) {
                    errors.push(`Product ${name}: Invalid price`);
                }
                if (!product.description) {
                    errors.push(`Product ${name}: Description is required`);
                }
            });
        }

        // Validate payment methods
        if (!config.paymentMethods.paypal && !config.paymentMethods.streamlabs && !config.paymentMethods.bankTransfer) {
            errors.push('At least one payment method is required');
        }

        // Validate interface settings
        if (config.interface) {
            try {
                if (config.interface.embedColor) {
                    const color = parseInt(config.interface.embedColor.replace('#', ''), 16);
                    if (isNaN(color)) throw new Error();
                }
            } catch {
                errors.push('Invalid embed color format (use hex color)');
            }
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }
}

module.exports = ConfigValidator;
