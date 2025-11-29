// Character System with Icons and Pre-unlocked Skills
const characterDefinitions = [
    {
        id: 'frugal_saver',
        name: 'The Frugal Saver',
        icon: '💰',
        trait: 'frugal',
        description: 'A disciplined saver who knows the value of every dollar.',
        startingCash: 6000,
        startingIncome: 2800,
        preUnlockedSkills: ['basic_budgeting'],
        bonus: {
            savingsBonus: 0.2,
            expenseReduction: 0.1
        }
    },
    {
        id: 'risk_taker',
        name: 'The Risk Taker',
        icon: '🎲',
        trait: 'risk-taker',
        description: 'Bold and adventurous, willing to take calculated risks for big rewards.',
        startingCash: 4000,
        startingIncome: 3200,
        preUnlockedSkills: ['investment_fundamentals'],
        bonus: {
            investmentBonus: 0.15,
            stabilityPenalty: 0.1
        }
    },
    {
        id: 'analyst',
        name: 'The Analyst',
        icon: '📊',
        trait: 'analyst',
        description: 'A data-driven strategist with sharp market insights.',
        startingCash: 5000,
        startingIncome: 3000,
        preUnlockedSkills: ['digital_literacy', 'data_analysis'],
        bonus: {
            tradingAccuracy: 0.1,
            marketInsight: true
        }
    },
    {
        id: 'entrepreneur',
        name: 'The Entrepreneur',
        icon: '🚀',
        trait: 'entrepreneur',
        description: 'A natural business leader with entrepreneurial spirit.',
        startingCash: 4500,
        startingIncome: 3500,
        preUnlockedSkills: ['business_basics', 'effective_communication'],
        bonus: {
            businessIncome: 0.25,
            riskTolerance: 0.2
        }
    },
    {
        id: 'tech_savvy',
        name: 'The Tech Savvy',
        icon: '💻',
        trait: 'analyst',
        description: 'A tech enthusiast who leverages digital tools for financial success.',
        startingCash: 5500,
        startingIncome: 3100,
        preUnlockedSkills: ['digital_literacy', 'data_analysis'],
        bonus: {
            tradingAccuracy: 0.08,
            efficiencyBonus: 0.15
        }
    },
    {
        id: 'networker',
        name: 'The Networker',
        icon: '🤝',
        trait: 'entrepreneur',
        description: 'A charismatic connector who builds valuable relationships.',
        startingCash: 5000,
        startingIncome: 3000,
        preUnlockedSkills: ['effective_communication', 'public_speaking'],
        bonus: {
            negotiationBonus: 0.15,
            relationshipBonus: 0.2
        }
    },
    {
        id: 'conservative',
        name: 'The Conservative',
        icon: '🛡️',
        trait: 'frugal',
        description: 'Cautious and methodical, prioritizing stability and security.',
        startingCash: 7000,
        startingIncome: 2700,
        preUnlockedSkills: ['basic_budgeting', 'risk_management'],
        bonus: {
            savingsBonus: 0.15,
            riskReduction: 0.2
        }
    },
    {
        id: 'visionary',
        name: 'The Visionary',
        icon: '🔮',
        trait: 'risk-taker',
        description: 'Forward-thinking innovator who sees opportunities others miss.',
        startingCash: 4000,
        startingIncome: 3300,
        preUnlockedSkills: ['investment_fundamentals', 'strategic_planning'],
        bonus: {
            investmentBonus: 0.2,
            marketInsight: true
        }
    }
];

// Apply Character Selection
function applyCharacterSelection(characterId) {
    const character = characterDefinitions.find(c => c.id === characterId);
    if (!character) return;
    
    gameState.player.characterId = characterId;
    gameState.player.trait = character.trait;
    gameState.player.cash = character.startingCash;
    gameState.player.monthlyIncome = character.startingIncome;
    
    // Pre-unlock skills
    if (typeof skillTreeSystem !== 'undefined' && character.preUnlockedSkills) {
        character.preUnlockedSkills.forEach(skillId => {
            const skill = skillTreeSystem.skills[skillId];
            if (skill) {
                skill.unlocked = true;
                skill.learned = true;
                skill.learningProgress = 100;
                
                // Apply skill effects immediately
                if (typeof applySkillEffects === 'function') {
                    applySkillEffects(skill);
                }
                
                // Add to unlocked skills list
                if (!skillTreeSystem.unlockedSkills.includes(skillId)) {
                    skillTreeSystem.unlockedSkills.push(skillId);
                }
            }
        });
    }
    
    // Apply character bonuses
    if (character.bonus) {
        Object.keys(character.bonus).forEach(key => {
            if (key === 'savingsBonus') {
                gameState.player.monthlyExpenses *= (1 - (character.bonus.expenseReduction || 0));
            }
        });
    }
}

// Get Character Icon
function getCharacterIcon() {
    if (!gameState.player.characterId) return '👤';
    const character = characterDefinitions.find(c => c.id === gameState.player.characterId);
    return character ? character.icon : '👤';
}

// Make functions globally available
window.characterDefinitions = characterDefinitions;
window.applyCharacterSelection = applyCharacterSelection;
window.getCharacterIcon = getCharacterIcon;

