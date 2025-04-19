# MADX Discord Ticket System - Setup Guide

## 🚀 Quick Start

1. **Prerequisites**
   - Node.js v16.9.0 or higher
   - Discord.js v14
   - A Discord Bot Token
   - MongoDB (optional)

2. **Installation**
   ```bash
   # Clone the repository
   git clone https://github.com/madx900/MADX-Ticket-System.git
   
   # Navigate to the project directory
   cd MADX-Ticket-System
   
   # Install dependencies
   npm install
   ```

3. **Configuration**
   - Copy `.env.example` to `.env`
   - Fill in your bot token and other credentials
   - Update `config.js` with your server's settings

## ⚙️ Configuration Guide

### 1. Discord Bot Setup
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Navigate to the "Bot" section
4. Create a bot and copy the token
5. Enable required intents:
   - GUILDS
   - GUILD_MESSAGES
   - GUILD_MEMBERS
   - MESSAGE_CONTENT

### 2. Environment Variables
Create a `.env` file with:
```env
TOKEN=your_bot_token
CLIENT_ID=your_client_id
GUILD_ID=your_guild_id
```

### 3. Server Configuration
1. **Create Required Channels**
   - Ticket logs channel
   - Transcript channel
   - Archive channel (optional)
   - Backup channel (optional)

2. **Create Required Roles**
   - Admin role
   - Staff role
   - Support team role

3. **Create Categories**
   - General Support
   - Technical Support
   - Store/Shop

### 4. Update config.js
1. **Basic Settings**
   ```javascript
   ticketLogChannel: "CHANNEL_ID"
   transcriptChannel: "CHANNEL_ID"
   ticketCategory: "CATEGORY_ID"
   ```

2. **Role Configuration**
   ```javascript
   adminRoles: ["ROLE_ID"]
   staffRoles: ["ROLE_ID"]
   ```

3. **Categories Setup**
   ```javascript
   categories: [
     {
       id: "general_support",
       name: "الدعم العام",
       emoji: "❓",
       categoryId: "CATEGORY_ID"
     }
   ]
   ```

## 🛠️ Features Configuration

### 1. Ticket System
- Set maximum active tickets per user
- Configure auto-delete timeouts
- Set up pre-ticket questions
- Configure staff shortcuts

### 2. Shopping Cart
- Add products in config.js
- Set up payment methods
- Configure checkout process

### 3. Rating System
- Enable/disable ratings
- Set up reward roles
- Configure feedback options

### 4. Anti-Abuse System
- Set rate limits
- Configure warnings
- Set up blacklist

## 📝 Commands

### User Commands
- `/ticket create` - Create a new ticket
- `/ticket close` - Close current ticket
- `/cart add` - Add item to cart
- `/cart view` - View cart
- `/checkout` - Process checkout
- `/rate` - Rate service

### Staff Commands
- `/ticket claim` - Claim a ticket
- `/ticket transfer` - Transfer ticket
- `/transcript` - Generate transcript
- `/blacklist` - Manage blacklist

### Admin Commands
- `/embed` - Create custom embeds
- `/config` - Update bot settings

## 🔧 Advanced Configuration

### 1. MongoDB Setup (Optional)
```javascript
database: {
    enabled: true,
    uri: "mongodb://localhost:27017/ticket-system"
}
```

### 2. Image Upload
```javascript
imageUpload: {
    enabled: true,
    maxSize: 5 * 1024 * 1024,
    allowedFormats: ['png', 'jpg', 'jpeg', 'gif']
}
```

### 3. Backup System
```javascript
backup: {
    enabled: true,
    interval: 24 * 60 * 60 * 1000,
    maxBackups: 7
}
```

## 🌐 Language Support
- Arabic (Default)
- English
- Custom translations can be added in `utils/language.js`

## 📊 Logging System
All events are logged to the specified logging channel:
- Ticket creation/closure
- Staff actions
- Purchases
- Ratings
- System changes

## ⚠️ Troubleshooting

1. **Bot Not Responding**
   - Check token in .env
   - Verify intents are enabled
   - Check permissions

2. **Commands Not Working**
   - Re-run deploy-commands.js
   - Check slash command permissions
   - Verify role hierarchy

3. **Database Issues**
   - Check MongoDB connection
   - Verify database credentials
   - Check network connectivity

## 🆘 Support

For additional support:
1. Check the issues section on GitHub
2. Join our Discord support server
3. Contact the development team

## 📜 License
This project is licensed under the MIT License - see the LICENSE file for details
