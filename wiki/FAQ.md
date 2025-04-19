# Frequently Asked Questions

## General Questions

### Q: How many tickets can a user have open at once?
A: By default, users can have 1 ticket open at a time. This can be configured in `config.js`.

### Q: How does the auto-deletion system work?
A: Tickets are automatically deleted after a configurable period of inactivity. Users receive a warning before deletion.

### Q: Can I use the bot without MongoDB?
A: Yes, the bot works with SQLite by default. MongoDB is optional for larger servers.

## Shop System

### Q: What payment methods are supported?
A: The bot supports PayPal, bank transfer, and custom payment methods configured in `config.js`.

### Q: Can I add custom items to the shop?
A: Yes, items can be added and configured in `config.js`.

## Staff Features

### Q: How do I set up staff roles?
A: Staff roles are configured in `config.js`. Multiple role levels are supported.

### Q: Can staff see all tickets?
A: Yes, staff with appropriate roles can view and manage all tickets.

## Technical Questions

### Q: What Node.js version is required?
A: Node.js 16.9.0 or higher is required due to Discord.js v14 requirements.

### Q: How do I update the bot?
A: Pull the latest changes from GitHub and run `npm install` for any new dependencies.

## Troubleshooting

### Q: The bot is not responding to commands
A: Check:
1. Bot token is correct
2. Required intents are enabled
3. Commands are deployed
4. Bot has proper permissions

### Q: Tickets are not being created
A: Verify:
1. Bot has channel permissions
2. Category limits are not reached
3. User is not blacklisted

For more issues, see [Troubleshooting Guide](Troubleshooting).
