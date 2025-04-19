# MADX Discord Ticket System

![MADX Ticket System](https://example.com/banner.png)

## 🌟 Features

### 🎫 Advanced Ticket Management
- **Category-based** ticket system
- **Auto-deletion** with configurable timeouts
- **Pre-ticket questions** for better organization
- **Staff shortcuts** for quick responses
- **Claim & Transfer** system
- **Transcript generation** in HTML/TXT format

### 🛒 Integrated Shop System
- **Shopping cart** functionality
- **Multiple payment methods** support
- **Automated invoicing**
- **Product categories**
- **Price tracking**

### ⭐ Rating & Feedback
- **5-star rating** system
- **Custom feedback** options
- **Reward roles** for good ratings
- **Staff notifications** for low ratings

### 🛡️ Administration Tools
- **Blacklist management**
- **Custom embed** creator
- **Anti-abuse** system
- **Staff commands**
- **Logging system**

### 🌐 Additional Features
- **Full Arabic & English** support
- **Customizable UI** (buttons/dropdowns)
- **MongoDB** support
- **Backup system**
- **Image upload** handling

## 📋 Requirements

- Node.js 16.9.0 or higher
- Discord.js v14
- MongoDB (optional)
- Discord Bot Token
- Required Discord Intents:
  - GUILDS
  - GUILD_MESSAGES
  - GUILD_MEMBERS
  - MESSAGE_CONTENT

## 🚀 Quick Start

1. Clone the repository
```bash
git clone https://github.com/madx900/MADX-Ticket-System.git
```

2. Install dependencies
```bash
cd MADX-Ticket-System
npm install
```

3. Set up configuration
```bash
cp .env.example .env
# Edit .env with your credentials
```

4. Start the bot
```bash
npm start
```

## 📚 Documentation

Detailed documentation can be found in the following files:
- [Setup Guide](setup.md)
- [Configuration Guide](config.md)
- [Command List](commands.md)

## 🛠️ Commands

### User Commands
\`\`\`
/ticket create - Create a new ticket
/ticket close  - Close current ticket
/cart add      - Add item to cart
/cart view     - View cart contents
/checkout      - Process checkout
/rate          - Rate the service
\`\`\`

### Staff Commands
\`\`\`
/ticket claim    - Claim a ticket
/ticket transfer - Transfer ticket
/transcript      - Generate transcript
/blacklist      - Manage blacklist
\`\`\`

### Admin Commands
\`\`\`
/embed   - Create custom embeds
/config  - Update bot settings
\`\`\`

## 🔧 Configuration

The bot is highly configurable through:
- `.env` file for sensitive data
- `config.js` for bot settings
- Category-specific settings
- Product configurations
- Language files

## 🌍 Localization

Currently supported languages:
- Arabic (Default)
- English

Adding new languages is easy through the language system.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📜 License

This project is licensed under the MIT License.

```
MIT License

Copyright (c) 2023 MADX

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

See the [LICENSE](LICENSE) file for the full license text.

## 🆘 Support

Need help? Check out our:
- [Discord Server](https://discord.gg/your-server)
- [GitHub Issues](https://github.com/madx900/MADX-Ticket-System/issues)
- [Documentation](docs/)
