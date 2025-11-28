// AI System - NPCs, Businesses, and Corporations
const aiSystem = {
    npcs: [],
    businesses: [],
    corporations: [],
    marketInfluence: 0.1, // How much AI actions affect markets
    turnCount: 0
};

// NPC Types
const npcTypes = {
    aggressive: {
        name: 'Aggressive Trader',
        strategy: 'compete',
        riskTolerance: 0.8,
        capital: 50000,
        marketActivity: 0.7,
        description: 'Aggressively competes for assets and tries to drive prices up'
    },
    defensive: {
        name: 'Defensive Investor',
        strategy: 'defend',
        riskTolerance: 0.3,
        capital: 75000,
        marketActivity: 0.4,
        description: 'Focuses on stable investments and property acquisition'
    },
    manipulator: {
        name: 'Market Manipulator',
        strategy: 'manipulate',
        riskTolerance: 0.6,
        capital: 100000,
        marketActivity: 0.9,
        description: 'Tries to manipulate markets to bankrupt competitors'
    },
    cooperative: {
        name: 'Cooperative Partner',
        strategy: 'cooperate',
        riskTolerance: 0.5,
        capital: 40000,
        marketActivity: 0.3,
        description: 'May offer beneficial deals and partnerships'
    },
    mentor: {
        name: 'Financial Mentor',
        strategy: 'mentor',
        riskTolerance: 0.4,
        capital: 200000,
        marketActivity: 0.2,
        description: 'Provides advice and sometimes financial help'
    }
};

// Business Types
const businessTypes = {
    realEstate: {
        name: 'Real Estate Corp',
        focus: 'properties',
        capital: 500000,
        aggression: 0.6,
        description: 'Competes aggressively for properties'
    },
    investment: {
        name: 'Investment Firm',
        focus: 'stocks',
        capital: 1000000,
        aggression: 0.7,
        description: 'Trades heavily in stocks and bonds'
    },
    commodity: {
        name: 'Commodity Trader',
        focus: 'commodities',
        capital: 300000,
        aggression: 0.5,
        description: 'Specializes in commodities trading'
    },
    crypto: {
        name: 'Crypto Exchange',
        focus: 'crypto',
        capital: 800000,
        aggression: 0.8,
        description: 'Manipulates cryptocurrency markets'
    }
};

// Initialize AI System
function initializeAISystem() {
    // Create NPCs
    aiSystem.npcs = [];
    const npcTypeKeys = Object.keys(npcTypes);
    
    // Create 3-5 NPCs
    const numNPCs = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < numNPCs; i++) {
        const typeKey = npcTypeKeys[Math.floor(Math.random() * npcTypeKeys.length)];
        const type = npcTypes[typeKey];
        
        const npc = {
            id: `npc_${i}`,
            name: `${type.name} ${i + 1}`,
            type: typeKey,
            ...type,
            cash: type.capital * (0.8 + Math.random() * 0.4),
            portfolio: {
                stocks: [],
                bonds: [],
                forex: [],
                commodities: [],
                crypto: []
            },
            properties: [],
            netWorth: 0,
            bankrupt: false,
            bankruptTurn: null,
            relationship: typeKey === 'cooperative' || typeKey === 'mentor' ? 'friendly' : 'neutral',
            lastAction: null
        };
        
        npc.netWorth = npc.cash;
        aiSystem.npcs.push(npc);
    }
    
    // Create Businesses
    aiSystem.businesses = [];
    const businessTypeKeys = Object.keys(businessTypes);
    
    const numBusinesses = 2 + Math.floor(Math.random() * 2);
    for (let i = 0; i < numBusinesses; i++) {
        const typeKey = businessTypeKeys[Math.floor(Math.random() * businessTypeKeys.length)];
        const type = businessTypes[typeKey];
        
        const business = {
            id: `business_${i}`,
            name: `${type.name} ${i + 1}`,
            type: typeKey,
            ...type,
            cash: type.capital * (0.7 + Math.random() * 0.6),
            portfolio: {
                stocks: [],
                bonds: [],
                forex: [],
                commodities: [],
                crypto: []
            },
            properties: [],
            netWorth: 0,
            bankrupt: false,
            marketShare: 0,
            lastAction: null
        };
        
        business.netWorth = business.cash;
        aiSystem.businesses.push(business);
    }
    
    // Create Corporations (larger entities)
    aiSystem.corporations = [
        {
            id: 'corp_1',
            name: 'MegaCorp Industries',
            cash: 5000000,
            portfolio: { stocks: [], bonds: [], forex: [], commodities: [], crypto: [] },
            properties: [],
            netWorth: 5000000,
            bankrupt: false,
            strategy: 'dominate',
            marketInfluence: 0.15,
            lastAction: null
        },
        {
            id: 'corp_2',
            name: 'Global Financial Group',
            cash: 3000000,
            portfolio: { stocks: [], bonds: [], forex: [], commodities: [], crypto: [] },
            properties: [],
            netWorth: 3000000,
            bankrupt: false,
            strategy: 'manipulate',
            marketInfluence: 0.12,
            lastAction: null
        }
    ];
    
    gameState.aiInitialized = true;
}

// Calculate NPC Net Worth
function calculateAINetWorth(entity) {
    let portfolioValue = 0;
    Object.keys(entity.portfolio).forEach(marketType => {
        entity.portfolio[marketType].forEach(holding => {
            const asset = gameState.markets[marketType]?.find(a => a.symbol === holding.symbol);
            if (asset) {
                portfolioValue += asset.price * holding.quantity;
            }
        });
    });
    
    const propertyValue = entity.properties.reduce((sum, p) => sum + p.value, 0);
    entity.netWorth = entity.cash + portfolioValue + propertyValue;
    return entity.netWorth;
}

// AI Trading Actions
function processAITrading() {
    // Process NPCs
    aiSystem.npcs.forEach(npc => {
        if (npc.bankrupt) return;
        
        calculateAINetWorth(npc);
        
        // Check for bankruptcy
        if (npc.netWorth < 0 || (npc.cash < 0 && npc.netWorth < 1000)) {
            npc.bankrupt = true;
            npc.bankruptTurn = gameState.turn;
            addStory(`💀 ${npc.name} has gone bankrupt!`);
            return;
        }
        
        // AI makes trading decisions based on strategy
        if (Math.random() < npc.marketActivity) {
            executeNPCAction(npc);
        }
    });
    
    // Process Businesses
    aiSystem.businesses.forEach(business => {
        if (business.bankrupt) return;
        
        calculateAINetWorth(business);
        
        if (business.netWorth < 0 || (business.cash < 0 && business.netWorth < 5000)) {
            business.bankrupt = true;
            addStory(`💀 ${business.name} has gone bankrupt!`);
            return;
        }
        
        if (Math.random() < 0.6) {
            executeBusinessAction(business);
        }
    });
    
    // Process Corporations
    aiSystem.corporations.forEach(corp => {
        if (corp.bankrupt) return;
        
        calculateAINetWorth(corp);
        
        if (corp.netWorth < 0 || (corp.cash < 0 && corp.netWorth < 10000)) {
            corp.bankrupt = true;
            addStory(`💀 ${corp.name} has collapsed!`);
            return;
        }
        
        if (Math.random() < 0.4) {
            executeCorporationAction(corp);
        }
    });
}

// Execute NPC Action
function executeNPCAction(npc) {
    const strategy = npc.strategy;
    
    switch(strategy) {
        case 'compete':
            // Aggressive trading - try to outbid player
            aggressiveTrading(npc);
            break;
        case 'defend':
            // Defensive - buy stable assets
            defensiveTrading(npc);
            break;
        case 'manipulate':
            // Market manipulation
            manipulateMarket(npc);
            break;
        case 'cooperate':
            // Sometimes help player
            if (Math.random() < 0.3) {
                offerCooperation(npc);
            } else {
                normalTrading(npc);
            }
            break;
        case 'mentor':
            // Provide advice or help
            if (Math.random() < 0.2) {
                offerMentorHelp(npc);
            } else {
                normalTrading(npc);
            }
            break;
        default:
            normalTrading(npc);
    }
}

// Aggressive Trading
function aggressiveTrading(npc) {
    const marketTypes = ['stocks', 'crypto', 'commodities'];
    const marketType = marketTypes[Math.floor(Math.random() * marketTypes.length)];
    const market = gameState.markets[marketType];
    
    if (market && market.length > 0) {
        const asset = market[Math.floor(Math.random() * market.length)];
        const investment = Math.min(npc.cash * 0.3, 10000);
        
        if (investment > 100 && npc.cash >= investment) {
            const quantity = investment / asset.price;
            npc.cash -= investment;
            
            const existing = npc.portfolio[marketType].find(h => h.symbol === asset.symbol);
            if (existing) {
                existing.quantity += quantity;
            } else {
                npc.portfolio[marketType].push({
                    symbol: asset.symbol,
                    quantity: quantity,
                    avgPrice: asset.price
                });
            }
            
            // Market impact - drives price up
            asset.price *= (1 + aiSystem.marketInfluence * 0.5);
            npc.lastAction = `Bought ${asset.name} aggressively`;
        }
    }
}

// Defensive Trading
function defensiveTrading(npc) {
    // Focus on bonds and stable stocks
    const marketTypes = ['bonds', 'stocks'];
    const marketType = marketTypes[Math.floor(Math.random() * marketTypes.length)];
    const market = gameState.markets[marketType];
    
    if (market && market.length > 0) {
        const asset = market[Math.floor(Math.random() * market.length)];
        const investment = Math.min(npc.cash * 0.2, 5000);
        
        if (investment > 100 && npc.cash >= investment) {
            const quantity = investment / asset.price;
            npc.cash -= investment;
            
            const existing = npc.portfolio[marketType].find(h => h.symbol === asset.symbol);
            if (existing) {
                existing.quantity += quantity;
            } else {
                npc.portfolio[marketType].push({
                    symbol: asset.symbol,
                    quantity: quantity,
                    avgPrice: asset.price
                });
            }
            
            npc.lastAction = `Bought ${asset.name} (defensive)`;
        }
    }
}

// Market Manipulation
function manipulateMarket(npc) {
    const marketTypes = ['stocks', 'crypto'];
    const marketType = marketTypes[Math.floor(Math.random() * marketTypes.length)];
    const market = gameState.markets[marketType];
    
    if (market && market.length > 0) {
        const asset = market[Math.floor(Math.random() * market.length)];
        const manipulation = Math.min(npc.cash * 0.4, 20000);
        
        if (manipulation > 500 && npc.cash >= manipulation) {
            // Large buy to drive price up
            const quantity = manipulation / asset.price;
            npc.cash -= manipulation;
            
            const existing = npc.portfolio[marketType].find(h => h.symbol === asset.symbol);
            if (existing) {
                existing.quantity += quantity;
            } else {
                npc.portfolio[marketType].push({
                    symbol: asset.symbol,
                    quantity: quantity,
                    avgPrice: asset.price
                });
            }
            
            // Strong market impact
            asset.price *= (1 + aiSystem.marketInfluence * 1.5);
            npc.lastAction = `Manipulated ${asset.name} market`;
            
            // This can hurt player if they're holding different assets
            if (Math.random() < 0.3) {
                addStory(`⚠️ ${npc.name} is manipulating ${asset.name} markets! Prices are rising.`);
            }
        }
    }
}

// Normal Trading
function normalTrading(npc) {
    const marketTypes = Object.keys(gameState.markets);
    const marketType = marketTypes[Math.floor(Math.random() * marketTypes.length)];
    const market = gameState.markets[marketType];
    
    if (market && market.length > 0) {
        const asset = market[Math.floor(Math.random() * market.length)];
        const investment = Math.min(npc.cash * 0.15, 3000);
        
        if (investment > 100 && npc.cash >= investment) {
            const quantity = investment / asset.price;
            npc.cash -= investment;
            
            const existing = npc.portfolio[marketType].find(h => h.symbol === asset.symbol);
            if (existing) {
                existing.quantity += quantity;
            } else {
                npc.portfolio[marketType].push({
                    symbol: asset.symbol,
                    quantity: quantity,
                    avgPrice: asset.price
                });
            }
            
            npc.lastAction = `Traded ${asset.name}`;
        }
    }
}

// Offer Cooperation
function offerCooperation(npc) {
    if (gameState.player.cash < 1000 && Math.random() < 0.5) {
        const help = 2000 + Math.random() * 3000;
        gameState.player.cash += help;
        npc.cash -= help;
        addStory(`🤝 ${npc.name} offered you ${formatMoney(help)} in financial assistance!`);
        npc.lastAction = 'Helped player';
    } else if (Math.random() < 0.3) {
        // Offer a good deal
        addStory(`💡 ${npc.name} suggests a good investment opportunity. Markets might be favorable.`);
        npc.lastAction = 'Offered advice';
    }
}

// Offer Mentor Help
function offerMentorHelp(npc) {
    if (gameState.player.financialHealth < 50 && Math.random() < 0.4) {
        const help = 5000 + Math.random() * 5000;
        gameState.player.cash += help;
        npc.cash -= help;
        gameState.player.financialHealth = Math.min(100, gameState.player.financialHealth + 10);
        addStory(`🎓 ${npc.name} (Financial Mentor) provided ${formatMoney(help)} and financial advice! Your financial health improved.`);
        npc.lastAction = 'Mentored player';
    } else if (Math.random() < 0.5) {
        // Market insight
        const marketTypes = Object.keys(gameState.markets);
        const marketType = marketTypes[Math.floor(Math.random() * marketTypes.length)];
        addStory(`📊 ${npc.name} shares market insight: ${marketType} markets look promising.`);
        npc.lastAction = 'Shared insight';
    }
}

// Execute Business Action
function executeBusinessAction(business) {
    const focus = business.focus;
    
    if (focus === 'properties') {
        // Compete for properties
        competeForProperties(business);
    } else {
        // Trade in focused market
        const market = gameState.markets[focus];
        if (market && market.length > 0) {
            const asset = market[Math.floor(Math.random() * market.length)];
            const investment = Math.min(business.cash * 0.25, 50000);
            
            if (investment > 1000 && business.cash >= investment) {
                const quantity = investment / asset.price;
                business.cash -= investment;
                
                const existing = business.portfolio[focus].find(h => h.symbol === asset.symbol);
                if (existing) {
                    existing.quantity += quantity;
                } else {
                    business.portfolio[focus].push({
                        symbol: asset.symbol,
                        quantity: quantity,
                        avgPrice: asset.price
                    });
                }
                
                // Business activity affects market
                asset.price *= (1 + aiSystem.marketInfluence * business.aggression);
                business.lastAction = `${business.name} traded ${asset.name}`;
                
                if (Math.random() < 0.2) {
                    addStory(`📈 ${business.name} made large ${focus} trades, affecting market prices.`);
                }
            }
        }
    }
}

// Compete for Properties
function competeForProperties(business) {
    // Properties are limited - AI competes with player
    if (Math.random() < 0.3) {
        const propertyOptions = [
            { name: 'Small Apartment', price: 80000, income: 600 },
            { name: 'House', price: 200000, income: 1200 },
            { name: 'Commercial Property', price: 500000, income: 4000 },
            { name: 'Rental Property', price: 150000, income: 1500 }
        ];
        
        const property = propertyOptions[Math.floor(Math.random() * propertyOptions.length)];
        
        // AI might bid higher than base price (driving up costs)
        const bidMultiplier = 1 + (business.aggression * 0.2);
        const bidPrice = property.price * bidMultiplier;
        
        if (business.cash >= bidPrice) {
            business.cash -= bidPrice;
            business.properties.push({
                name: property.name,
                value: bidPrice,
                monthlyIncome: property.income,
                upkeepRate: 0.015,
                deteriorationRate: 0.3,
                condition: 100
            });
            
            business.lastAction = `Acquired ${property.name} (outbid competition)`;
            
            // Property prices increase due to competition
            if (Math.random() < 0.5) {
                addStory(`🏢 ${business.name} acquired ${property.name} at ${formatMoney(bidPrice)}! Property prices are rising due to competition.`);
            } else {
                addStory(`🏢 ${business.name} outbid competitors for ${property.name}!`);
            }
        }
    }
}

// Execute Corporation Action
function executeCorporationAction(corp) {
    if (corp.strategy === 'dominate') {
        // Try to dominate multiple markets
        const marketTypes = Object.keys(gameState.markets);
        const marketType = marketTypes[Math.floor(Math.random() * marketTypes.length)];
        const market = gameState.markets[marketType];
        
        if (market && market.length > 0) {
            const asset = market[Math.floor(Math.random() * market.length)];
            const investment = Math.min(corp.cash * 0.2, 100000);
            
            if (investment > 5000 && corp.cash >= investment) {
                const quantity = investment / asset.price;
                corp.cash -= investment;
                
                const existing = corp.portfolio[marketType].find(h => h.symbol === asset.symbol);
                if (existing) {
                    existing.quantity += quantity;
                } else {
                    corp.portfolio[marketType].push({
                        symbol: asset.symbol,
                        quantity: quantity,
                        avgPrice: asset.price
                    });
                }
                
                // Strong market impact
                asset.price *= (1 + corp.marketInfluence);
                corp.lastAction = `${corp.name} dominated ${asset.name} market`;
                
                if (Math.random() < 0.3) {
                    addStory(`🌐 ${corp.name} made massive ${marketType} trades, significantly affecting prices!`);
                }
            }
        }
    } else if (corp.strategy === 'manipulate') {
        // Market manipulation
        const marketTypes = ['stocks', 'crypto'];
        const marketType = marketTypes[Math.floor(Math.random() * marketTypes.length)];
        const market = gameState.markets[marketType];
        
        if (market) {
            // Manipulate all assets in market
            market.forEach(asset => {
                const manipulation = Math.min(corp.cash * 0.1, 50000);
                if (manipulation > 1000) {
                    asset.price *= (1 + (Math.random() - 0.5) * corp.marketInfluence * 2);
                }
            });
            
            corp.lastAction = `${corp.name} manipulated ${marketType} markets`;
            addStory(`⚠️ ${corp.name} is manipulating ${marketType} markets! Extreme volatility expected.`);
        }
    }
}

// Check if AI is targeting player
function checkAITargetingPlayer() {
    // Aggressive NPCs and manipulators might target player
    aiSystem.npcs.forEach(npc => {
        if (npc.bankrupt || npc.relationship === 'friendly') return;
        
        if ((npc.strategy === 'compete' || npc.strategy === 'manipulate') && Math.random() < 0.15) {
            // Try to drive down prices on assets player owns
            const playerPortfolio = gameState.player.portfolio;
            Object.keys(playerPortfolio).forEach(marketType => {
                if (playerPortfolio[marketType].length > 0 && Math.random() < 0.3) {
                    const holding = playerPortfolio[marketType][0];
                    const asset = gameState.markets[marketType]?.find(a => a.symbol === holding.symbol);
                    
                    if (asset && npc.cash > 5000) {
                        // Drive price down by manipulating market
                        asset.price *= (1 - aiSystem.marketInfluence * 0.8);
                        addStory(`⚠️ ${npc.name} is targeting your ${asset.name} holdings! Price dropping.`);
                        npc.lastAction = 'Targeted player assets';
                    }
                }
            });
        }
    });
    
    // Businesses compete for properties player wants
    if (gameState.player.properties.length > 0 && Math.random() < 0.2) {
        aiSystem.businesses.forEach(business => {
            if (business.bankrupt || business.focus !== 'properties') return;
            
            // Try to outbid player on properties
            if (Math.random() < 0.3 && business.cash > 100000) {
                addStory(`⚠️ ${business.name} is actively competing for properties, driving up prices!`);
                business.lastAction = 'Competing for properties';
            }
        });
    }
    
    // Corporations can create market crashes
    aiSystem.corporations.forEach(corp => {
        if (corp.bankrupt || corp.strategy !== 'manipulate') return;
        
        if (Math.random() < 0.05) {
            // Market crash event
            const marketTypes = ['stocks', 'crypto'];
            const marketType = marketTypes[Math.floor(Math.random() * marketTypes.length)];
            const market = gameState.markets[marketType];
            
            if (market) {
                market.forEach(asset => {
                    asset.price *= (1 - 0.15); // 15% drop
                });
                addStory(`💥 ${corp.name} triggered a ${marketType} market crash! Prices plummeted.`);
                corp.lastAction = 'Triggered market crash';
            }
        }
    });
}

// Update AI Display
function updateAIDisplay() {
    const aiStatusDisplay = document.getElementById('ai-status-display');
    if (!aiStatusDisplay) return;
    
    const status = getAIStatusSummary();
    
    let html = `
        <div style="font-size: 0.85em; margin-bottom: 10px;">
            <strong>NPCs:</strong> ${status.npcs.active}/${status.npcs.total} active
            ${status.npcs.bankrupt > 0 ? `<span style="color: var(--danger-color);"> (${status.npcs.bankrupt} bankrupt)</span>` : ''}
        </div>
        <div style="font-size: 0.85em; margin-bottom: 10px;">
            <strong>Businesses:</strong> ${status.businesses.active}/${status.businesses.total} active
            ${status.businesses.bankrupt > 0 ? `<span style="color: var(--danger-color);"> (${status.businesses.bankrupt} bankrupt)</span>` : ''}
        </div>
        <div style="font-size: 0.85em; margin-bottom: 10px;">
            <strong>Corporations:</strong> ${status.corporations.active}/${status.corporations.total} active
            ${status.corporations.bankrupt > 0 ? `<span style="color: var(--danger-color);"> (${status.corporations.bankrupt} bankrupt)</span>` : ''}
        </div>
    `;
    
    // Show recent AI activity
    const recentActions = [];
    aiSystem.npcs.forEach(npc => {
        if (!npc.bankrupt && npc.lastAction) {
            recentActions.push({ name: npc.name, action: npc.lastAction, type: 'npc' });
        }
    });
    aiSystem.businesses.forEach(business => {
        if (!business.bankrupt && business.lastAction) {
            recentActions.push({ name: business.name, action: business.lastAction, type: 'business' });
        }
    });
    aiSystem.corporations.forEach(corp => {
        if (!corp.bankrupt && corp.lastAction) {
            recentActions.push({ name: corp.name, action: corp.lastAction, type: 'corp' });
        }
    });
    
    if (recentActions.length > 0) {
        html += '<div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--border-color);">';
        html += '<strong style="font-size: 0.85em;">Recent Activity:</strong>';
        recentActions.slice(-3).forEach(item => {
            html += `<div style="font-size: 0.75em; color: var(--text-secondary); margin-top: 5px;">${item.name}: ${item.action}</div>`;
        });
        html += '</div>';
    }
    
    aiStatusDisplay.innerHTML = html;
}

// Show AI Details Modal
function showAIDetails() {
    const modal = document.getElementById('action-modal');
    const modalBody = document.getElementById('modal-body');
    
    let html = '<div style="max-height: 500px; overflow-y: auto;">';
    
    // NPCs
    html += '<h3 style="margin-top: 0;">NPCs</h3>';
    aiSystem.npcs.forEach(npc => {
        calculateAINetWorth(npc);
        const status = npc.bankrupt ? '🔴 Bankrupt' : '🟢 Active';
        const relationship = npc.relationship === 'friendly' ? '🤝 Friendly' : '⚔️ Competitive';
        html += `
            <div style="background: var(--bg-dark); padding: 10px; margin-bottom: 10px; border-radius: 8px;">
                <strong>${npc.name}</strong> ${status}<br>
                <div style="font-size: 0.85em; margin-top: 5px;">
                    Type: ${npcTypes[npc.type]?.name || npc.type}<br>
                    Relationship: ${relationship}<br>
                    Net Worth: ${formatMoney(npc.netWorth)}<br>
                    Strategy: ${npc.strategy}<br>
                    ${npc.lastAction ? `Last Action: ${npc.lastAction}` : ''}
                </div>
            </div>
        `;
    });
    
    // Businesses
    html += '<h3>Businesses</h3>';
    aiSystem.businesses.forEach(business => {
        calculateAINetWorth(business);
        const status = business.bankrupt ? '🔴 Bankrupt' : '🟢 Active';
        html += `
            <div style="background: var(--bg-dark); padding: 10px; margin-bottom: 10px; border-radius: 8px;">
                <strong>${business.name}</strong> ${status}<br>
                <div style="font-size: 0.85em; margin-top: 5px;">
                    Focus: ${business.focus}<br>
                    Net Worth: ${formatMoney(business.netWorth)}<br>
                    Aggression: ${(business.aggression * 100).toFixed(0)}%<br>
                    ${business.lastAction ? `Last Action: ${business.lastAction}` : ''}
                </div>
            </div>
        `;
    });
    
    // Corporations
    html += '<h3>Corporations</h3>';
    aiSystem.corporations.forEach(corp => {
        calculateAINetWorth(corp);
        const status = corp.bankrupt ? '🔴 Bankrupt' : '🟢 Active';
        html += `
            <div style="background: var(--bg-dark); padding: 10px; margin-bottom: 10px; border-radius: 8px;">
                <strong>${corp.name}</strong> ${status}<br>
                <div style="font-size: 0.85em; margin-top: 5px;">
                    Strategy: ${corp.strategy}<br>
                    Net Worth: ${formatMoney(corp.netWorth)}<br>
                    Market Influence: ${(corp.marketInfluence * 100).toFixed(1)}%<br>
                    ${corp.lastAction ? `Last Action: ${corp.lastAction}` : ''}
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    
    modalBody.innerHTML = html;
    document.getElementById('modal-title').textContent = 'AI Competition Status';
    modal.classList.add('active');
    
    document.getElementById('modal-confirm').textContent = 'Close';
    const confirmBtn = document.getElementById('modal-confirm');
    const cancelBtn = document.getElementById('modal-cancel');
    
    // Store original onclick
    const originalConfirm = confirmBtn.onclick;
    
    confirmBtn.onclick = () => {
        cancelBtn.style.display = 'block'; // Restore cancel button
        closeModal();
    };
    cancelBtn.style.display = 'none';
}

// Get AI Status Summary
function getAIStatusSummary() {
    const activeNPCs = aiSystem.npcs.filter(n => !n.bankrupt).length;
    const activeBusinesses = aiSystem.businesses.filter(b => !b.bankrupt).length;
    const activeCorps = aiSystem.corporations.filter(c => !c.bankrupt).length;
    
    return {
        npcs: { total: aiSystem.npcs.length, active: activeNPCs, bankrupt: aiSystem.npcs.length - activeNPCs },
        businesses: { total: aiSystem.businesses.length, active: activeBusinesses, bankrupt: aiSystem.businesses.length - activeBusinesses },
        corporations: { total: aiSystem.corporations.length, active: activeCorps, bankrupt: aiSystem.corporations.length - activeCorps }
    };
}

