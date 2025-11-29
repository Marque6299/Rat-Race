// Scenarios and Challenges System
const scenariosSystem = {
    activeScenario: null,
    completedScenarios: [],
    challengeMode: false,
    challengeRestrictions: []
};

// Historical Scenarios
const historicalScenarios = [
    {
        id: 'dotcom_bubble',
        name: 'Dot-Com Bubble (2000)',
        description: 'Experience the tech stock crash of 2000. Tech stocks are overvalued and about to crash.',
        startYear: 2000,
        duration: 24, // months
        effects: {
            marketCrash: {
                assetType: 'stocks',
                techStocks: -0.6, // 60% drop
                otherStocks: -0.3
            },
            events: ['tech_crash', 'recession_fear']
        },
        victoryCondition: {
            type: 'survive',
            description: 'Survive the crash with positive net worth'
        }
    },
    {
        id: '2008_crash',
        name: '2008 Financial Crisis',
        description: 'The housing bubble bursts and financial markets collapse.',
        startYear: 2008,
        duration: 36,
        effects: {
            marketCrash: {
                assetType: 'stocks',
                allStocks: -0.5,
                property: -0.4
            },
            events: ['banking_crisis', 'recession', 'unemployment']
        },
        victoryCondition: {
            type: 'recover',
            description: 'Recover to pre-crash net worth within 3 years'
        }
    },
    {
        id: 'covid_pandemic',
        name: 'COVID-19 Pandemic (2020)',
        description: 'A global pandemic causes economic disruption.',
        startYear: 2020,
        duration: 18,
        effects: {
            marketVolatility: 0.4,
            events: ['market_volatility', 'supply_chain', 'remote_work']
        },
        victoryCondition: {
            type: 'adapt',
            description: 'Adapt your portfolio and maintain income'
        }
    },
    {
        id: 'inflation_crisis',
        name: 'High Inflation Period',
        description: 'Rapid inflation erodes purchasing power.',
        startYear: 1980,
        duration: 12,
        effects: {
            inflation: 0.15, // 15% inflation
            interestRates: 0.2 // 20% interest rates
        },
        victoryCondition: {
            type: 'hedge',
            description: 'Protect wealth from inflation'
        }
    }
];

// Challenge Modes
const challengeModes = [
    {
        id: 'no_debt',
        name: 'Debt-Free Challenge',
        description: 'Complete the game without taking any loans.',
        restrictions: ['no_loans'],
        reward: 'Debt-Free Badge'
    },
    {
        id: 'frugal_living',
        name: 'Frugal Living Challenge',
        description: 'Keep monthly expenses below $2000 throughout the game.',
        restrictions: ['max_expenses:2000'],
        reward: 'Frugal Master Badge'
    },
    {
        id: 'passive_income',
        name: 'Passive Income Challenge',
        description: 'Reach $10,000/month passive income before turn 100.',
        restrictions: [],
        goal: { type: 'passive_income', target: 10000, deadline: 100 },
        reward: 'Passive Income Master Badge'
    },
    {
        id: 'speed_run',
        name: 'Speed Run Challenge',
        description: 'Reach $1M net worth in under 50 turns.',
        restrictions: [],
        goal: { type: 'networth', target: 1000000, deadline: 50 },
        reward: 'Speed Runner Badge'
    },
    {
        id: 'diversification',
        name: 'Diversification Challenge',
        description: 'Own investments in all 5 asset categories (stocks, bonds, forex, commodities, crypto).',
        restrictions: [],
        goal: { type: 'diversification', target: 5 },
        reward: 'Diversification Expert Badge'
    },
    {
        id: 'no_insurance',
        name: 'High Risk Challenge',
        description: 'Complete the game without purchasing any insurance.',
        restrictions: ['no_insurance'],
        reward: 'Risk Taker Badge'
    }
];

// Start Historical Scenario
function startHistoricalScenario(scenarioId) {
    const scenario = historicalScenarios.find(s => s.id === scenarioId);
    if (!scenario) return false;
    
    scenariosSystem.activeScenario = {
        ...scenario,
        startTurn: gameState.turn,
        endTurn: gameState.turn + scenario.duration,
        active: true
    };
    
    // Apply scenario effects
    applyScenarioEffects(scenario);
    
    addStory(`📜 Historical Scenario Started: ${scenario.name}`);
    addStory(scenario.description);
    
    return true;
}

// Apply Scenario Effects
function applyScenarioEffects(scenario) {
    if (scenario.effects.marketCrash) {
        const crash = scenario.effects.marketCrash;
        
        if (crash.assetType === 'stocks') {
            gameState.markets.stocks.forEach(asset => {
                if (asset.name.includes('Tech') || asset.symbol.includes('TECH') || asset.symbol.includes('CLD')) {
                    asset.price *= (1 + crash.techStocks);
                } else {
                    asset.price *= (1 + (crash.otherStocks || crash.allStocks || 0));
                }
            });
        }
        
        if (crash.property) {
            gameState.player.properties.forEach(property => {
                property.value *= (1 + crash.property);
            });
        }
    }
    
    if (scenario.effects.inflation) {
        if (typeof marketEconomics !== 'undefined') {
            marketEconomics.indicators.inflation = scenario.effects.inflation;
        }
    }
    
    if (scenario.effects.interestRates) {
        if (typeof marketEconomics !== 'undefined') {
            marketEconomics.indicators.interestRate = scenario.effects.interestRates;
        }
    }
}

// Process Active Scenario
function processActiveScenario() {
    if (!scenariosSystem.activeScenario || !scenariosSystem.activeScenario.active) return;
    
    const scenario = scenariosSystem.activeScenario;
    
    // Check if scenario ended
    if (gameState.turn >= scenario.endTurn) {
        completeScenario(scenario);
        return;
    }
    
    // Trigger scenario events periodically
    if (Math.random() < 0.1) { // 10% chance per turn
        triggerScenarioEvent(scenario);
    }
}

// Trigger Scenario Event
function triggerScenarioEvent(scenario) {
    if (!scenario.effects.events) return;
    
    const eventType = scenario.effects.events[Math.floor(Math.random() * scenario.effects.events.length)];
    
    switch(eventType) {
        case 'tech_crash':
            gameState.markets.stocks.forEach(asset => {
                if (asset.name.includes('Tech') || asset.symbol.includes('TECH')) {
                    asset.price *= 0.95; // 5% drop
                }
            });
            addStory('📉 Tech stocks continue to decline...');
            break;
            
        case 'recession_fear':
            if (typeof marketEconomics !== 'undefined') {
                marketEconomics.indicators.marketSentiment = Math.max(0, 
                    marketEconomics.indicators.marketSentiment - 0.1);
            }
            addStory('⚠️ Recession fears grip the market...');
            break;
            
        case 'banking_crisis':
            gameState.markets.stocks.forEach(asset => {
                if (asset.name.includes('Bank') || asset.symbol.includes('FNB')) {
                    asset.price *= 0.9; // 10% drop
                }
            });
            addStory('🏦 Banking sector faces crisis...');
            break;
            
        case 'market_volatility':
            if (typeof marketEconomics !== 'undefined') {
                Object.keys(marketEconomics.marketConditions).forEach(key => {
                    const condition = marketEconomics.marketConditions[key];
                    condition.volatility = Math.min(0.3, condition.volatility + 0.05);
                });
            }
            addStory('📊 Extreme market volatility continues...');
            break;
    }
}

// Complete Scenario
function completeScenario(scenario) {
    scenario.active = false;
    scenariosSystem.completedScenarios.push({
        id: scenario.id,
        name: scenario.name,
        completedTurn: gameState.turn,
        success: checkScenarioVictory(scenario)
    });
    
    if (checkScenarioVictory(scenario)) {
        addStory(`🎉 Scenario Complete: ${scenario.name} - Victory!`);
    } else {
        addStory(`📜 Scenario Complete: ${scenario.name} - You survived but didn't meet victory conditions.`);
    }
    
    scenariosSystem.activeScenario = null;
}

// Check Scenario Victory
function checkScenarioVictory(scenario) {
    switch(scenario.victoryCondition.type) {
        case 'survive':
            return gameState.player.netWorth > 0;
        case 'recover':
            // Would need to track pre-scenario net worth
            return gameState.player.netWorth > 0;
        case 'adapt':
            return gameState.player.monthlyIncome > 0;
        case 'hedge':
            return gameState.player.netWorth > 0;
        default:
            return true;
    }
}

// Start Challenge Mode
function startChallengeMode(challengeId) {
    const challenge = challengeModes.find(c => c.id === challengeId);
    if (!challenge) return false;
    
    scenariosSystem.challengeMode = true;
    scenariosSystem.challengeRestrictions = challenge.restrictions || [];
    
    if (challenge.goal) {
        if (typeof addGoal === 'function') {
            addGoal(challenge.name, challenge.goal.target, challenge.goal.type, challenge.goal.deadline);
        }
    }
    
    addStory(`🏆 Challenge Mode Started: ${challenge.name}`);
    addStory(challenge.description);
    
    return true;
}

// Check Challenge Restrictions
function checkChallengeRestrictions(action, params = {}) {
    if (!scenariosSystem.challengeMode) return true;
    
    for (const restriction of scenariosSystem.challengeRestrictions) {
        if (restriction === 'no_loans' && action === 'take_loan') {
            if (typeof showToast === 'function') {
                showToast('Challenge restriction: No loans allowed!', 'error', 3000);
            }
            return false;
        }
        
        if (restriction === 'no_insurance' && action === 'purchase_insurance') {
            if (typeof showToast === 'function') {
                showToast('Challenge restriction: No insurance allowed!', 'error', 3000);
            }
            return false;
        }
        
        if (restriction.startsWith('max_expenses:')) {
            const maxExpenses = parseFloat(restriction.split(':')[1]);
            if (action === 'spend' && gameState.player.monthlyExpenses > maxExpenses) {
                if (typeof showToast === 'function') {
                    showToast(`Challenge restriction: Expenses must stay below ${formatMoney(maxExpenses)}!`, 'error', 3000);
                }
                return false;
            }
        }
    }
    
    return true;
}

// Get Available Scenarios
function getAvailableScenarios() {
    return historicalScenarios.filter(s => 
        !scenariosSystem.completedScenarios.find(c => c.id === s.id)
    );
}

// Get Available Challenges
function getAvailableChallenges() {
    return challengeModes;
}

// Make functions globally available
window.scenariosSystem = scenariosSystem;
window.startHistoricalScenario = startHistoricalScenario;
window.startChallengeMode = startChallengeMode;
window.processActiveScenario = processActiveScenario;
window.checkChallengeRestrictions = checkChallengeRestrictions;
window.getAvailableScenarios = getAvailableScenarios;
window.getAvailableChallenges = getAvailableChallenges;

