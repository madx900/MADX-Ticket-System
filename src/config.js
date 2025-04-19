module.exports = {
    // Staff role ID that can manage tickets
    STAFF_ROLE_ID: 'YOUR_STAFF_ROLE_ID',
    
    // Category where tickets will be created
    TICKETS_CATEGORY: 'YOUR_CATEGORY_ID',
    
    // Ticket categories and their auto-responses
    ticketTypes: {
        general: {
            emoji: '❓',
            name: 'General Support',
            description: 'Get help with general questions',
            color: '#5865F2',
            autoResponse: 'Thank you for creating a general support ticket! Please describe your issue and a staff member will assist you shortly.'
        },
        purchase: {
            emoji: '💰',
            name: 'Purchase Support',
            description: 'Get help with purchases',
            color: '#57F287',
            autoResponse: 'Thank you for contacting our purchase support! Please provide your order number and describe your issue.'
        },
        technical: {
            emoji: '🔧',
            name: 'Technical Support',
            description: 'Get help with technical issues',
            color: '#ED4245',
            autoResponse: 'Welcome to technical support! Please provide:\n1. What issue you\'re experiencing\n2. Steps to reproduce\n3. Any error messages you\'re seeing'
        }
    },
    
    // Embed colors
    colors: {
        primary: '#5865F2',
        success: '#57F287',
        error: '#ED4245',
        warning: '#FEE75C'
    },
    
    // Transcript settings
    transcripts: {
        saveInChannel: 'YOUR_TRANSCRIPT_CHANNEL_ID', // Channel where transcripts will be saved
        saveLocally: true, // Save transcripts locally
        path: './transcripts' // Local path to save transcripts
    }
};
