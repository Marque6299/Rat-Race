// Player Attributes System - Skill and Luck
const playerAttributes = {
    // Skills (0-100, can improve over time)
    skills: {
        trading: 50,        // Affects trading success rate and profit margins
        investing: 50,      // Affects investment returns
        negotiation: 50,    // Affects loan rates, property prices, business deals
        riskManagement: 50, // Affects ability to avoid losses
        marketAnalysis: 50, // Affects ability to predict market trends
        business: 50        // Affects business income and success
    },
    
    // Luck (0-100, fluctuates randomly)
    luck: 50,
    
    // Experience points (gained from actions)
    experience: {
        trading: 0,
        investing: 0,
        negotiation: 0,
        riskManagement: 0,
        marketAnalysis: 0,
        business: 0
    },
    
    // Skill improvement thresholds
    skillThresholds: {
        trading: [100, 250, 500, 1000, 2000],
        investing: [100, 250, 500, 1000, 2000],
        negotiation: [50, 150, 300, 600, 1200],
        riskManagement: [50, 150, 300, 600, 1200],
        marketAnalysis: [100, 250, 500, 1000, 2000],
        business: [50, 150, 300, 600, 1200]
    }
};

// Initialize player attributes
function initializePlayerAttributes() {
    // Starting skills based on trait
    const trait = gameState.player.trait;
    if (trait === 'analyst') {
        playerAttributes.skills.marketAnalysis = 65;
        playerAttributes.skills.trading = 60;
    } else if (trait === 'risk-taker') {
        playerAttributes.skills.trading = 65;
        playerAttributes.skills.riskManagement = 40; // Lower because they take more risks
    } else if (trait === 'entrepreneur') {
        playerAttributes.skills.business = 65;
        playerAttributes.skills.negotiation = 60;
    } else if (trait === 'frugal') {
        playerAttributes.skills.riskManagement = 65;
        playerAttributes.skills.investing = 60;
    }
    
    // Initial luck (random 40-60)
    playerAttributes.luck = 40 + Math.random() * 20;
}

// Update luck (fluctuates each turn)
function updateLuck() {
    // Luck changes by -5 to +5 each turn
    const change = (Math.random() - 0.5) * 10;
    playerAttributes.luck = Math.max(0, Math.min(100, playerAttributes.luck + change));
}

// Gain experience in a skill
function gainExperience(skill, amount) {
    if (!playerAttributes.experience[skill]) {
        playerAttributes.experience[skill] = 0;
    }
    
    playerAttributes.experience[skill] += amount;
    
    // Check for skill level up
    checkSkillLevelUp(skill);
}

// Check if skill should level up
function checkSkillLevelUp(skill) {
    const exp = playerAttributes.experience[skill];
    const thresholds = playerAttributes.skillThresholds[skill];
    const currentLevel = thresholds.findIndex(t => exp < t);
    const newLevel = currentLevel === -1 ? thresholds.length : currentLevel;
    
    // Calculate skill value based on level (0-100)
    const skillValue = Math.min(100, (newLevel / thresholds.length) * 100);
    
    if (skillValue > playerAttributes.skills[skill]) {
        const oldSkill = playerAttributes.skills[skill];
        playerAttributes.skills[skill] = skillValue;
        
        if (typeof showToast === 'function') {
            showToast(`🎓 ${skill.charAt(0).toUpperCase() + skill.slice(1)} skill improved! (${oldSkill.toFixed(0)} → ${skillValue.toFixed(0)})`, 'success', 3000);
        }
    }
}

// Get skill modifier (0.5 to 1.5 multiplier)
function getSkillModifier(skill) {
    const skillValue = playerAttributes.skills[skill] || 50;
    return 0.5 + (skillValue / 100); // 0.5x to 1.5x
}

// Get luck modifier (0.8 to 1.2 multiplier)
function getLuckModifier() {
    const luck = playerAttributes.luck;
    return 0.8 + (luck / 250); // 0.8x to 1.2x
}

// Get combined modifier (skill + luck)
function getCombinedModifier(skill) {
    const skillMod = getSkillModifier(skill);
    const luckMod = getLuckModifier();
    return (skillMod + luckMod) / 2; // Average of both
}

// Apply skill and luck to trading
function applyTradingModifiers(baseProfit, skill = 'trading') {
    const modifier = getCombinedModifier(skill);
    return baseProfit * modifier;
}

// Apply skill to negotiation (better deals)
function applyNegotiationModifier(basePrice) {
    const modifier = getSkillModifier('negotiation');
    // Higher negotiation = lower prices (better deals)
    return basePrice * (2 - modifier); // Inverse relationship
}

// Apply skill to investment returns
function applyInvestmentModifier(baseReturn) {
    const modifier = getCombinedModifier('investing');
    return baseReturn * modifier;
}

// Get skill display info
function getSkillDisplay() {
    return Object.keys(playerAttributes.skills).map(skill => ({
        name: skill.charAt(0).toUpperCase() + skill.slice(1).replace(/([A-Z])/g, ' $1'),
        value: playerAttributes.skills[skill],
        experience: playerAttributes.experience[skill] || 0,
        nextLevel: getNextSkillLevel(skill)
    }));
}

function getNextSkillLevel(skill) {
    const exp = playerAttributes.experience[skill] || 0;
    const thresholds = playerAttributes.skillThresholds[skill];
    const nextThreshold = thresholds.find(t => exp < t);
    return nextThreshold || thresholds[thresholds.length - 1];
}

// Make functions globally available
window.initializePlayerAttributes = initializePlayerAttributes;
window.updateLuck = updateLuck;
window.gainExperience = gainExperience;
window.getSkillModifier = getSkillModifier;
window.getLuckModifier = getLuckModifier;
window.getCombinedModifier = getCombinedModifier;
window.applyTradingModifiers = applyTradingModifiers;
window.applyNegotiationModifier = applyNegotiationModifier;
window.applyInvestmentModifier = applyInvestmentModifier;

