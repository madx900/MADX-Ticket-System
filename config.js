module.exports = {
    // Bot Configuration
    token: process.env.TOKEN,
    clientId: process.env.CLIENT_ID,
    guildId: process.env.GUILD_ID,
    debug: process.env.DEBUG === 'true',
    environment: process.env.NODE_ENV || 'production',

    // Ticket System Settings
    ticketLogChannel: "CHANNEL_ID", // Channel where logs will be sent
    transcriptChannel: "CHANNEL_ID", // Channel where transcripts will be saved
    ticketCategory: "CATEGORY_ID", // Default category for tickets if no specific one is set
    maxActiveTickets: 3, // Maximum tickets per user
    minTicketNameLength: 3,
    maxTicketNameLength: 50,
    allowTicketRename: true,

    // Staff Roles (ID)
    adminRoles: ["ADMIN_ROLE_ID"],
    staffRoles: ["STAFF_ROLE_ID", "SUPPORT_ROLE_ID"],
    supportTeamRole: "SUPPORT_TEAM_ROLE_ID", // For notifications
    
    // Cooldown Settings
    ticketCooldown: 300, // 5 minutes in seconds
    rateCooldown: 600,   // 10 minutes in seconds
    commandCooldown: 5,
    
    // Auto Delete Settings
    autoDelete: {
        enabled: true,
        warningTime: 48,   // Hours before warning
        deleteTime: 72,    // Hours before deletion
        inactiveTime: 24,  // Hours of inactivity before counting as inactive
        excludeCategories: [], // Category IDs to exclude from auto-deletion
        warningMessage: "⚠️ سيتم إغلاق التذكرة تلقائياً خلال {time} ساعة",
        deleteMessage: "🔒 تم إغلاق التذكرة تلقائياً لعدم النشاط",
        dmNotification: true // Notify user via DM before deletion
    },

    // Ticket Archival
    archiveTickets: true,
    archiveChannel: "ARCHIVE_CHANNEL_ID",
    saveTranscripts: true,
    transcriptFormat: "html", // html or txt
    
    // Anti-Abuse System
    antiAbuse: {
        enabled: true,
        maxTicketsPerDay: 5,
        maxMessagesPerMinute: 10,
        actionThreshold: 3, // Warnings before blacklist
        punishments: {
            warn: true,
            blacklist: true,
            timeout: true,
            timeoutDuration: 60 * 60 * 1000 // 1 hour
        }
    },

    // Notification Settings
    notifications: {
        dmUsers: true,
        mentionStaff: true,
        ticketUpdates: true,
        ratingReceived: true,
        useEmbeds: true,
        pingStaffOnNew: true,
        pingStaffOnClose: false
    },

    // Image Upload Settings
    imageUpload: {
        enabled: true,
        maxSize: 5 * 1024 * 1024, // 5MB
        allowedFormats: ['png', 'jpg', 'jpeg', 'gif'],
        uploadToImgur: false,
        imgurClientId: process.env.IMGUR_CLIENT_ID
    },

    // Database Settings (if using MongoDB)
    database: {
        enabled: false,
        uri: process.env.MONGODB_URI,
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    },

    // Categories Configuration
    categories: [
        {
            id: "general_support",
            name: "الدعم العام",
            emoji: "❓",
            categoryId: "CATEGORY_ID",
            description: "للمساعدة العامة والاستفسارات",
            buttonColor: "PRIMARY", // PRIMARY, SECONDARY, SUCCESS, DANGER
            questions: [
                {
                    question: "ما هو سبب فتح التذكرة؟",
                    required: true
                },
                {
                    question: "هل حاولت البحث عن حل في الأسئلة الشائعة؟",
                    required: false
                }
            ],
            shortcuts: [
                {
                    name: "ترحيب",
                    content: "مرحباً! كيف يمكنني مساعدتك اليوم؟"
                },
                {
                    name: "شكراً",
                    content: "شكراً لتواصلك معنا! هل هناك شيء آخر يمكنني مساعدتك به؟"
                }
            ]
        },
        {
            id: "technical_support",
            name: "الدعم الفني",
            emoji: "🔧",
            categoryId: "CATEGORY_ID",
            description: "للمشاكل التقنية والأعطال",
            buttonColor: "DANGER",
            questions: [
                {
                    question: "ما هي المشكلة التي تواجهها؟",
                    required: true
                },
                {
                    question: "هل يمكنك إرفاق صورة للمشكلة؟",
                    required: false
                }
            ]
        },
        {
            id: "store",
            name: "المتجر",
            emoji: "🛍️",
            categoryId: "CATEGORY_ID",
            description: "لطلبات الشراء والاستفسارات عن المنتجات",
            buttonColor: "SUCCESS",
            questions: [
                {
                    question: "ما هو المنتج الذي تريد شراءه؟",
                    required: true
                }
            ]
        }
    ],

    // Products Configuration
    products: {
        "تصميم لوقو": {
            price: 15,
            description: "تصميم لوقو احترافي مع تعديلات غير محدودة",
            image: "https://example.com/logo-design.png",
            category: "تصميم"
        },
        "تصميم بنر": {
            price: 25,
            description: "تصميم بنر احترافي لمواقع التواصل الاجتماعي",
            image: "https://example.com/banner-design.png",
            category: "تصميم"
        },
        "موقع ويب": {
            price: 100,
            description: "تصميم وتطوير موقع ويب كامل",
            image: "https://example.com/web-design.png",
            category: "برمجة"
        }
    },
    
    // Payment Methods
    paymentMethods: {
        paypal: "your-paypal-email@example.com",
        streamlabs: "https://streamlabs.com/yourusername/tip",
        bankTransfer: {
            bankName: "اسم البنك",
            accountNumber: "رقم الحساب",
            iban: "رقم الآيبان"
        }
    },

    // Rating System
    ratingEnabled: true,
    ratingMessage: {
        title: "تقييم الخدمة",
        description: "نرجو تقييم الخدمة المقدمة لتحسين جودة خدماتنا",
        image: "https://example.com/rating-banner.png",
        lowRatingThreshold: 3, // Ratings below this will notify staff
        rewardRoles: {
            "5": "VIP_ROLE_ID", // Give VIP role for 5-star ratings
            "4": "PREMIUM_ROLE_ID" // Give Premium role for 4-star ratings
        }
    },

    // Logging Settings
    logging: {
        enabled: true,
        events: {
            ticketCreate: true,
            ticketClose: true,
            ticketClaim: true,
            ticketTransfer: true,
            ticketRating: true,
            ticketTranscript: true,
            blacklistUpdate: true,
            productPurchase: true,
            configUpdate: true
        },
        // Optional: Discord Webhook for external logging
        webhook: {
            url: "YOUR_WEBHOOK_URL",
            enabled: false
        }
    },

    // Language Settings
    defaultLanguage: "ar", // ar or en
    allowLanguageChange: true,
    
    // Interface Settings
    interface: {
        useButtons: true, // false for dropdowns
        embedColor: "#2f3136",
        successColor: "#57F287",
        errorColor: "#ED4245",
        footerText: "MADX Ticket System",
        footerIcon: "https://example.com/bot-icon.png"
    },

    // Custom Commands
    customCommands: {
        enabled: true,
        prefix: '!',
        commands: {
            'help': {
                enabled: true,
                staffOnly: false,
                response: 'Here are the available commands...'
            },
            'status': {
                enabled: true,
                staffOnly: true,
                response: 'System is operational'
            }
        }
    },

    // Backup Settings
    backup: {
        enabled: true,
        interval: 24 * 60 * 60 * 1000, // 24 hours
        maxBackups: 7,
        includeTranscripts: true,
        backupChannel: "BACKUP_CHANNEL_ID"
    }
};
