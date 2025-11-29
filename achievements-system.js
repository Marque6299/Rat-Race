// Achievements and Milestones System
const achievementsSystem = {
    achievements: [],
    milestones: [],
    unlockedAchievements: [],
    reachedMilestones: []
};

// Achievement Definitions
const achievementDefinitions = [
    {
        id: 'first_investment',
        name: 'First Investment',
        description: 'Make your first investment',
        icon: '💰',
        category: 'investment',
        condition: (state) => {
            if (typeof getTotalPortfolioValue === 'function') {
                return getTotalPortfolioValue() > 0;
            }
            return Object.keys(state.player.portfolio).some(type => 
                state.player.portfolio[type].length > 0
            );
        },
        reward: { experience: { investing: 50 } }
    },
    {
        id: 'first_property',
        name: 'Property Owner',
        description: 'Purchase your first property',
        icon: '🏠',
        category: 'property',
        condition: (state) => state.player.properties.length > 0,
        reward: { experience: { negotiation: 50 }, cash: 1000 }
    },
    {
        id: 'first_business',
        name: 'Entrepreneur',
        description: 'Start or buy your first business',
        icon: '💼',
        category: 'business',
        condition: (state) => opportunitiesSystem?.playerBusinesses?.length > 0,
        reward: { experience: { business: 100 } }
    },
    {
        id: 'networth_10k',
        name: 'Ten Thousandaire',
        description: 'Reach $10,000 net worth',
        icon: '💵',
        category: 'wealth',
        condition: (state) => state.player.netWorth >= 10000,
        reward: { experience: { investing: 50 } }
    },
    {
        id: 'networth_100k',
        name: 'Hundred Thousandaire',
        description: 'Reach $100,000 net worth',
        icon: '💸',
        category: 'wealth',
        condition: (state) => state.player.netWorth >= 100000,
        reward: { experience: { investing: 100 }, cash: 5000 }
    },
    {
        id: 'networth_500k',
        name: 'Half Millionaire',
        description: 'Reach $500,000 net worth',
        icon: '💴',
        category: 'wealth',
        condition: (state) => state.player.netWorth >= 500000,
        reward: { experience: { investing: 200 }, cash: 10000 }
    },
    {
        id: 'networth_1m',
        name: 'Millionaire',
        description: 'Reach $1,000,000 net worth',
        icon: '💶',
        category: 'wealth',
        condition: (state) => state.player.netWorth >= 1000000,
        reward: { experience: { investing: 500 }, cash: 50000 }
    },
    {
        id: 'credit_800',
        name: 'Excellent Credit',
        description: 'Achieve a credit score of 800 or higher',
        icon: '⭐',
        category: 'credit',
        condition: (state) => bankSystem?.creditScore >= 800,
        reward: { experience: { riskManagement: 100 } }
    },
    {
        id: 'diversified',
        name: 'Diversified Portfolio',
        description: 'Hold investments in 3 or more asset types',
        icon: '📊',
        category: 'investment',
        condition: (state) => {
            let types = 0;
            Object.keys(state.player.portfolio).forEach(type => {
                if (typeof getPortfolioValue === 'function') {
                    if (getPortfolioValue(type) > 0) types++;
                } else {
                    if (state.player.portfolio[type].length > 0) types++;
                }
            });
            return types >= 3;
        },
        reward: { experience: { investing: 150 } }
    },
    {
        id: 'debt_free',
        name: 'Debt Free',
        description: 'Pay off all loans',
        icon: '✅',
        category: 'debt',
        condition: (state) => state.player.loans.length === 0 && state.player.netWorth > 0,
        reward: { experience: { riskManagement: 200 }, cash: 2000 }
    },
    {
        id: 'trader_100',
        name: 'Active Trader',
        description: 'Make 100 trades',
        icon: '📈',
        category: 'trading',
        condition: (state) => {
            const trades = logsSystem?.transactions?.filter(t => t.type === 'trade') || [];
            return trades.length >= 100;
        },
        reward: { experience: { trading: 200 } }
    },
    {
        id: 'property_tycoon',
        name: 'Property Tycoon',
        description: 'Own 5 or more properties',
        icon: '🏘️',
        category: 'property',
        condition: (state) => state.player.properties.length >= 5,
        reward: { experience: { negotiation: 200 }, cash: 10000 }
    },
    {
        id: 'business_mogul',
        name: 'Business Mogul',
        description: 'Own 3 or more businesses',
        icon: '🏢',
        category: 'business',
        condition: (state) => opportunitiesSystem?.playerBusinesses?.length >= 3,
        reward: { experience: { business: 300 } }
    },
    {
        id: 'year_1',
        name: 'One Year',
        description: 'Survive your first year',
        icon: '📅',
        category: 'time',
        condition: (state) => state.turn >= 12,
        reward: { experience: { riskManagement: 100 } }
    },
    {
        id: 'year_5',
        name: 'Five Years',
        description: 'Reach 5 years in the game',
        icon: '📆',
        category: 'time',
        condition: (state) => state.turn >= 60,
        reward: { experience: { investing: 200 }, cash: 5000 }
    },
    {
        id: 'lucky_strike',
        name: 'Lucky Strike',
        description: 'Have luck above 90',
        icon: '🍀',
        category: 'luck',
        condition: (state) => playerAttributes?.luck >= 90,
        reward: { experience: { trading: 100 } }
    }
];

// Milestone Definitions
const milestoneDefinitions = [
    {
        id: 'milestone_10k',
        name: '$10,000 Net Worth',
        target: 10000,
        type: 'networth',
        reward: { cash: 500 }
    },
    {
        id: 'milestone_25k',
        name: '$25,000 Net Worth',
        target: 25000,
        type: 'networth',
        reward: { cash: 1000 }
    },
    {
        id: 'milestone_50k',
        name: '$50,000 Net Worth',
        target: 50000,
        type: 'networth',
        reward: { cash: 2000 }
    },
    {
        id: 'milestone_100k',
        name: '$100,000 Net Worth',
        target: 100000,
        type: 'networth',
        reward: { cash: 5000 }
    },
    {
        id: 'milestone_250k',
        name: '$250,000 Net Worth',
        target: 250000,
        type: 'networth',
        reward: { cash: 10000 }
    },
    {
        id: 'milestone_500k',
        name: '$500,000 Net Worth',
        target: 500000,
        type: 'networth',
        reward: { cash: 20000 }
    },
    {
        id: 'milestone_1m',
        name: '$1,000,000 Net Worth',
        target: 1000000,
        type: 'networth',
        reward: { cash: 50000 }
    },
    {
        id: 'milestone_2m',
        name: '$2,000,000 Net Worth',
        target: 2000000,
        type: 'networth',
        reward: { cash: 100000 }
    },
    {
        id: 'milestone_5m',
        name: '$5,000,000 Net Worth',
        target: 5000000,
        type: 'networth',
        reward: { cash: 250000 }
    },
    {
        id: 'milestone_10m',
        name: '$10,000,000 Net Worth',
        target: 10000000,
        type: 'networth',
        reward: { cash: 500000 }
    }
];

// Make functions globally available
window.initializeAchievements = initializeAchievements;
window.checkAchievements = checkAchievements;
window.checkMilestones = checkMilestones;
window.getAchievementProgress = getAchievementProgress;
window.getMilestoneProgress = getMilestoneProgress;

// Initialize achievements system
function initializeAchievements() {
    achievementsSystem.achievements = achievementDefinitions.map(ach => ({
        ...ach,
        unlocked: false,
        unlockedAt: null
    }));
    
    achievementsSystem.milestones = milestoneDefinitions.map(mil => ({
        ...mil,
        reached: false,
        reachedAt: null
    }));
}

// Check achievements
function checkAchievements() {
    achievementsSystem.achievements.forEach(achievement => {
        if (!achievement.unlocked && achievement.condition(gameState)) {
            unlockAchievement(achievement.id);
        }
    });
}

// Unlock achievement
function unlockAchievement(achievementId) {
    const achievement = achievementsSystem.achievements.find(a => a.id === achievementId);
    if (!achievement || achievement.unlocked) return;
    
    achievement.unlocked = true;
    achievement.unlockedAt = {
        turn: gameState.turn,
        year: gameState.year
    };
    
    achievementsSystem.unlockedAchievements.push(achievementId);
    
    // Apply rewards
    if (achievement.reward) {
        if (achievement.reward.experience) {
            Object.keys(achievement.reward.experience).forEach(skill => {
                gainExperience(skill, achievement.reward.experience[skill]);
            });
        }
        if (achievement.reward.cash) {
            gameState.player.cash += achievement.reward.cash;
        }
    }
    
    // Show notification
    if (typeof showToast === 'function') {
        showToast(`🏆 Achievement Unlocked: ${achievement.name}! ${achievement.description}`, 'success', 5000);
    }
    
    if (typeof logEvent === 'function') {
        logEvent('positive', 'Achievement Unlocked', achievement.name, {
            achievementId: achievementId,
            reward: achievement.reward
        });
    }
}

// Check milestones
function checkMilestones() {
    achievementsSystem.milestones.forEach(milestone => {
        if (!milestone.reached) {
            let currentValue = 0;
            
            if (milestone.type === 'networth') {
                currentValue = gameState.player.netWorth;
            }
            
            if (currentValue >= milestone.target) {
                reachMilestone(milestone.id);
            }
        }
    });
}

// Reach milestone
function reachMilestone(milestoneId) {
    const milestone = achievementsSystem.milestones.find(m => m.id === milestoneId);
    if (!milestone || milestone.reached) return;
    
    milestone.reached = true;
    milestone.reachedAt = {
        turn: gameState.turn,
        year: gameState.year
    };
    
    achievementsSystem.reachedMilestones.push(milestoneId);
    
    // Apply rewards
    if (milestone.reward) {
        if (milestone.reward.cash) {
            gameState.player.cash += milestone.reward.cash;
        }
    }
    
    // Show notification
    if (typeof showToast === 'function') {
        showToast(`🎯 Milestone Reached: ${milestone.name}! +${formatMoney(milestone.reward.cash)}`, 'success', 5000);
    }
    
    if (typeof logEvent === 'function') {
        logEvent('positive', 'Milestone Reached', milestone.name, {
            milestoneId: milestoneId,
            reward: milestone.reward
        });
    }
}

// Get achievement progress
function getAchievementProgress() {
    const total = achievementsSystem.achievements.length;
    const unlocked = achievementsSystem.unlockedAchievements.length;
    return {
        unlocked,
        total,
        percentage: (unlocked / total * 100).toFixed(1)
    };
}

// Get milestone progress
function getMilestoneProgress() {
    const nextMilestone = achievementsSystem.milestones.find(m => !m.reached);
    if (!nextMilestone) {
        return {
            current: gameState.player.netWorth,
            target: null,
            progress: 100,
            nextMilestone: null
        };
    }
    
    const current = gameState.player.netWorth;
    const target = nextMilestone.target;
    const progress = Math.min(100, (current / target * 100));
    
    return {
        current,
        target,
        progress: progress.toFixed(1),
        nextMilestone: nextMilestone.name
    };
}

// Make functions globally available
window.initializeAchievements = initializeAchievements;
window.checkAchievements = checkAchievements;
window.checkMilestones = checkMilestones;
window.getAchievementProgress = getAchievementProgress;
window.getMilestoneProgress = getMilestoneProgress;

