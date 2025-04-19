# Installation Guide

## Prerequisites

1. Node.js 16.9.0 or higher
2. Git
3. Discord Bot Token
4. MongoDB (optional)

## Step-by-Step Installation

### 1. Clone the Repository
```bash
git clone https://github.com/madx900/MADX-Ticket-System.git
cd MADX-Ticket-System
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory:
```env
TOKEN=your_bot_token
CLIENT_ID=your_client_id
GUILD_ID=your_guild_id
MONGODB_URI=your_mongodb_uri (optional)
```

### 4. Configure Settings
Edit `config.js` to match your server's needs:
- Set up ticket categories
- Configure auto-deletion settings
- Set up shop items
- Customize messages

### 5. Deploy Commands
```bash
npm run deploy
```

### 6. Start the Bot
```bash
npm start
```

## Post-Installation

1. Set up staff roles in your Discord server
2. Create necessary channels
3. Test the bot's functionality

See [Configuration Guide](Configuration) for detailed settings setup.
