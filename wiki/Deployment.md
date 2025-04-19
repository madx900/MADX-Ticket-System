# Deployment Guide

## Deployment Options

### 1. Local Server Deployment
Best for development and small servers.

```bash
# Install PM2 globally
npm install -g pm2

# Start the bot with PM2
pm2 start index.js --name "madx-ticket"

# Monitor the bot
pm2 monitor

# View logs
pm2 logs madx-ticket

# Restart bot
pm2 restart madx-ticket
```

### 2. Docker Deployment
Best for containerized environments.

```bash
# Build the Docker image
docker build -t madx-ticket .

# Run the container
docker run -d \
  --name madx-ticket \
  --env-file .env \
  --restart unless-stopped \
  madx-ticket
```

### 3. Cloud Deployment

#### Heroku Deployment
```bash
# Login to Heroku
heroku login

# Create a new app
heroku create madx-ticket-bot

# Set environment variables
heroku config:set TOKEN=your_token
heroku config:set CLIENT_ID=your_client_id
heroku config:set GUILD_ID=your_guild_id

# Deploy
git push heroku main
```

#### Railway.app Deployment
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically

## Production Best Practices

### 1. Environment Setup
```env
NODE_ENV=production
DISCORD_TOKEN=your_token
CLIENT_ID=your_client_id
GUILD_ID=your_guild_id
MONGODB_URI=your_mongodb_uri
```

### 2. Security Measures
- Use environment variables
- Enable rate limiting
- Set up error logging
- Configure backup system

### 3. Monitoring
- Set up health checks
- Configure error notifications
- Monitor resource usage

### 4. Backup Strategy
```bash
# Automated daily backups
0 0 * * * /usr/local/bin/node /path/to/backup.js

# Backup rotation
- Keep last 7 daily backups
- Keep last 4 weekly backups
- Keep last 3 monthly backups
```

### 5. Scaling Considerations
- Use MongoDB for large servers
- Enable caching
- Optimize database queries
- Use load balancing for high traffic

## Maintenance

### 1. Updates
```bash
# Pull latest changes
git pull origin main

# Install dependencies
npm install

# Deploy commands
npm run deploy

# Restart service
pm2 restart madx-ticket
```

### 2. Monitoring Commands
```bash
# Check bot status
pm2 status

# View error logs
pm2 logs madx-ticket --err

# Monitor performance
pm2 monit
```

### 3. Backup Commands
```bash
# Manual backup
npm run backup

# Restore from backup
npm run restore --file=backup_file
```
