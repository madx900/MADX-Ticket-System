# 🎫 MADX Ticket System

A powerful Discord ticket management system built with Discord.js v14. Perfect for both regular Discord servers and shop servers, featuring both dropdown and button-based ticket creation.

![Discord](https://img.shields.io/badge/Discord-7289DA?style=for-the-badge&logo=discord&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- **Dual Menu System**
  - Dropdown menu for organized category selection
  - Button-based menu for quick access
  - Support for both regular and shop servers

- **Advanced Ticket Management**
  - Custom ticket categories
  - Auto-responses per category
  - HTML transcripts generation
  - Staff-only commands
  - Ticket claiming system

- **Staff Commands**
  - `/ticket-admin category` - Add/edit ticket categories
  - `/ticket-admin remove-category` - Remove ticket categories
  - `/ticket-admin add-staff` - Add staff roles
  - `/ticket-admin set-transcript-channel` - Configure transcript channel

## 📋 Prerequisites

- Node.js 16.9.0 or higher
- Discord Bot Token
- Discord Server with admin permissions

## 🚀 Installation

1. Clone the repository:
```bash
git clone https://github.com/madx900/MADX-Ticket-System.git
cd MADX-Ticket-System
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
TOKEN=your_bot_token_here
CLIENT_ID=your_client_id_here
```

4. Configure `src/config.js` with your server settings:
```javascript
STAFF_ROLE_ID: 'your_staff_role_id'
TICKETS_CATEGORY: 'your_category_id'
```

5. Deploy slash commands:
```bash
node src/deploy-commands.js
```

6. Start the bot:
```bash
node src/index.js
```

## 💡 Usage

1. Use `/ticket setup` to create the ticket panel
2. Choose between dropdown menu, button menu, or both
3. Customize ticket categories using `/ticket-admin category`
4. Add staff roles with `/ticket-admin add-staff`

## 🛠️ Configuration

### Ticket Categories
Each ticket category can have:
- Custom name and description
- Unique emoji
- Custom color
- Auto-response message

### Transcripts
- HTML format transcripts
- Save locally and/or in a Discord channel
- Includes all messages and attachments
- Records who closed the ticket

## 🤝 Support

Need help? Join our Discord server:
[Discord Support Server](https://discord.gg/yKQaBYpGuh)

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Credits

Created by [madx900](https://github.com/madx900)

---
⭐ Star this repository if you find it helpful!
