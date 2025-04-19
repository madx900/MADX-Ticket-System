class CooldownManager {
    constructor() {
        this.cooldowns = new Map();
    }

    isOnCooldown(userId, commandId) {
        const key = `${userId}-${commandId}`;
        const cooldown = this.cooldowns.get(key);
        
        if (!cooldown) {
            return false;
        }

        return Date.now() < cooldown;
    }

    setCooldown(userId, commandId, duration) {
        const key = `${userId}-${commandId}`;
        this.cooldowns.set(key, Date.now() + duration);
    }

    getRemainingTime(userId, commandId) {
        const key = `${userId}-${commandId}`;
        const cooldown = this.cooldowns.get(key);
        
        if (!cooldown) {
            return 0;
        }

        const remaining = cooldown - Date.now();
        return remaining > 0 ? Math.ceil(remaining / 1000) : 0;
    }
}

module.exports = new CooldownManager();
