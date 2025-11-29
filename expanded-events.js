// Expanded Events, Offers, and Incidents System
const expandedEvents = {
    // Random events pool
    events: [],
    
    // Active offers
    activeOffers: [],
    
    // Active incidents
    activeIncidents: [],
    
    // News items
    newsItems: []
};

// Expanded Random Events
const expandedEventDefinitions = [
    // Positive Events
    {
        type: 'positive',
        title: '💼 Promotion!',
        description: 'You got a promotion! Your monthly income increased.',
        effect: { incomeIncrease: 0.2 },
        rarity: 'common'
    },
    {
        type: 'positive',
        title: '🎁 Year-End Bonus',
        description: 'You received a substantial year-end bonus!',
        effect: { cashBonus: 5000 + Math.random() * 5000 },
        rarity: 'common'
    },
    {
        type: 'positive',
        title: '📚 Skill Development',
        description: 'You completed a financial course. Your investment knowledge improved.',
        effect: { skillBoost: { investing: 10, marketAnalysis: 10 } },
        rarity: 'common'
    },
    {
        type: 'positive',
        title: '💡 Investment Insight',
        description: 'You discovered a promising investment opportunity.',
        effect: { investmentBonus: 0.15, duration: 3 },
        rarity: 'uncommon'
    },
    {
        type: 'positive',
        title: '🤝 Partnership Opportunity',
        description: 'A business partner offers you a lucrative deal.',
        effect: { cashBonus: 10000, businessIncome: 0.1 },
        rarity: 'rare'
    },
    {
        type: 'positive',
        title: '🎰 Lucky Break',
        description: 'Your luck pays off with an unexpected windfall!',
        effect: { cashBonus: 2000 + playerAttributes?.luck * 50 },
        rarity: 'uncommon'
    },
    
    // Negative Events
    {
        type: 'negative',
        title: '🏥 Medical Emergency',
        description: 'Unexpected medical expenses hit your finances.',
        effect: { cashLoss: 3000 + Math.random() * 2000 },
        rarity: 'common'
    },
    {
        type: 'negative',
        title: '🚗 Car Repair',
        description: 'Your car needs major repairs.',
        effect: { cashLoss: 2000 + Math.random() * 1000 },
        rarity: 'common'
    },
    {
        type: 'negative',
        title: '💸 Unexpected Expense',
        description: 'An unexpected bill arrived.',
        effect: { cashLoss: 1000 + Math.random() * 1000 },
        rarity: 'common'
    },
    {
        type: 'negative',
        title: '⚖️ Legal Issue',
        description: 'You face unexpected legal fees.',
        effect: { cashLoss: 5000 + Math.random() * 5000 },
        rarity: 'uncommon'
    },
    {
        type: 'negative',
        title: '🏠 Property Damage',
        description: 'One of your properties needs emergency repairs.',
        effect: { cashLoss: 3000, propertyDamage: true },
        rarity: 'uncommon'
    },
    {
        type: 'negative',
        title: '📉 Bad Investment',
        description: 'One of your investments performed poorly.',
        effect: { portfolioLoss: 0.1 },
        rarity: 'uncommon'
    },
    
    // Market Events
    {
        type: 'market',
        title: '📈 Bull Market',
        description: 'Markets are surging! Stock prices are rising.',
        effect: { marketBoost: 0.15, assetType: 'stocks', duration: 3 },
        rarity: 'common'
    },
    {
        type: 'market',
        title: '📉 Bear Market',
        description: 'Markets are declining. Stock prices are falling.',
        effect: { marketDrop: 0.15, assetType: 'stocks', duration: 3 },
        rarity: 'common'
    },
    {
        type: 'market',
        title: '💰 Crypto Surge',
        description: 'Cryptocurrency prices are skyrocketing!',
        effect: { marketBoost: 0.25, assetType: 'crypto', duration: 2 },
        rarity: 'uncommon'
    },
    {
        type: 'market',
        title: '💎 Gold Rush',
        description: 'Commodity prices, especially gold, are rising.',
        effect: { marketBoost: 0.12, assetType: 'commodities', duration: 3 },
        rarity: 'common'
    },
    {
        type: 'market',
        title: '🌍 Currency Crisis',
        description: 'Forex markets are volatile.',
        effect: { marketVolatility: 0.2, assetType: 'forex', duration: 2 },
        rarity: 'uncommon'
    },
    {
        type: 'market',
        title: '📊 Market Correction',
        description: 'Markets are correcting after a period of growth.',
        effect: { marketDrop: 0.1, assetType: 'stocks', duration: 1 },
        rarity: 'common'
    },
    {
        type: 'positive',
        title: '🎯 Inheritance',
        description: 'You received an inheritance from a distant relative.',
        effect: { cashBonus: 15000 + Math.random() * 25000 },
        rarity: 'rare'
    },
    {
        type: 'positive',
        title: '🏆 Award Recognition',
        description: 'You won an industry award, boosting your reputation and income.',
        effect: { incomeIncrease: 0.15, skillBoost: { negotiation: 5, business: 5 } },
        rarity: 'uncommon'
    },
    {
        type: 'positive',
        title: '💼 New Job Offer',
        description: 'A better-paying job opportunity comes your way.',
        effect: { incomeIncrease: 0.25 },
        rarity: 'uncommon'
    },
    {
        type: 'positive',
        title: '📈 Stock Dividend',
        description: 'Your stock holdings pay out substantial dividends.',
        effect: { cashBonus: 2000 + Math.random() * 3000 },
        rarity: 'common'
    },
    {
        type: 'positive',
        title: '🎁 Tax Refund',
        description: 'You received a larger-than-expected tax refund.',
        effect: { cashBonus: 3000 + Math.random() * 5000 },
        rarity: 'common'
    },
    {
        type: 'positive',
        title: '🤝 Mentorship',
        description: 'A successful investor offers to mentor you.',
        effect: { skillBoost: { investing: 15, marketAnalysis: 15, trading: 10 } },
        rarity: 'rare'
    },
    {
        type: 'positive',
        title: '🏠 Property Appreciation',
        description: 'Your properties have significantly appreciated in value.',
        effect: { propertyValueIncrease: 0.2 },
        rarity: 'uncommon'
    },
    {
        type: 'negative',
        title: '💳 Identity Theft',
        description: 'You fell victim to identity theft. Financial losses and stress.',
        effect: { cashLoss: 5000 + Math.random() * 5000, financialHealth: -10 },
        rarity: 'uncommon'
    },
    {
        type: 'negative',
        title: '⚡ Power Outage',
        description: 'Extended power outage damages equipment and causes losses.',
        effect: { cashLoss: 1500 + Math.random() * 1500 },
        rarity: 'common'
    },
    {
        type: 'negative',
        title: '🌪️ Natural Disaster',
        description: 'A natural disaster affects your area, causing property damage.',
        effect: { cashLoss: 8000 + Math.random() * 12000, propertyDamage: true },
        rarity: 'rare'
    },
    {
        type: 'negative',
        title: '📱 Phone Scam',
        description: 'You fell for a phone scam and lost money.',
        effect: { cashLoss: 2000 + Math.random() * 3000 },
        rarity: 'common'
    },
    {
        type: 'negative',
        title: '🚨 Audit Notice',
        description: 'You received an audit notice from the tax authorities.',
        effect: { cashLoss: 4000 + Math.random() * 6000, financialHealth: -5 },
        rarity: 'uncommon'
    },
    {
        type: 'negative',
        title: '💔 Divorce Settlement',
        description: 'A divorce settlement significantly impacts your finances.',
        effect: { cashLoss: 20000 + Math.random() * 30000, monthlyExpenses: 0.1 },
        rarity: 'rare'
    },
    {
        type: 'negative',
        title: '🏥 Long-term Illness',
        description: 'A family member requires expensive long-term medical care.',
        effect: { monthlyExpenses: 0.15, duration: 6 },
        rarity: 'uncommon'
    },
    {
        type: 'market',
        title: '🔥 Tech Bubble',
        description: 'Technology stocks are experiencing a massive bubble.',
        effect: { marketBoost: 0.3, assetType: 'stocks', duration: 2 },
        rarity: 'rare'
    },
    {
        type: 'market',
        title: '💣 Tech Crash',
        description: 'The tech bubble bursts, causing massive losses.',
        effect: { marketDrop: 0.4, assetType: 'stocks', duration: 3 },
        rarity: 'rare'
    },
    {
        type: 'market',
        title: '🛢️ Oil Price Shock',
        description: 'Geopolitical events cause oil prices to spike.',
        effect: { marketBoost: 0.25, assetType: 'commodities', duration: 2 },
        rarity: 'uncommon'
    },
    {
        type: 'market',
        title: '🌐 Global Trade War',
        description: 'Trade tensions cause market volatility across all assets.',
        effect: { marketVolatility: 0.3, duration: 4 },
        rarity: 'rare'
    },
    {
        type: 'market',
        title: '🏦 Banking Crisis',
        description: 'A banking crisis affects financial markets.',
        effect: { marketDrop: 0.2, assetType: 'stocks', duration: 3 },
        rarity: 'rare'
    },
    {
        type: 'market',
        title: '🌍 Emerging Market Boom',
        description: 'Emerging markets are experiencing rapid growth.',
        effect: { marketBoost: 0.18, assetType: 'forex', duration: 3 },
        rarity: 'uncommon'
    },
    {
        type: 'market',
        title: '⚡ Crypto Regulation',
        description: 'New regulations cause crypto market volatility.',
        effect: { marketVolatility: 0.25, assetType: 'crypto', duration: 2 },
        rarity: 'uncommon'
    },
    {
        type: 'market',
        title: '💎 Rare Metal Discovery',
        description: 'A major rare metal discovery affects commodity markets.',
        effect: { marketBoost: 0.15, assetType: 'commodities', duration: 2 },
        rarity: 'uncommon'
    }
];

// Offer Definitions
const offerDefinitions = [
    {
        id: 'loan_offer',
        type: 'loan',
        title: 'Special Loan Offer',
        description: 'A bank offers you a loan with favorable terms.',
        terms: {
            amount: () => gameState.player.monthlyIncome * 12 * (0.5 + Math.random() * 0.5),
            interestRate: 0.08,
            term: 36
        },
        expiresIn: 3,
        rarity: 'common'
    },
    {
        id: 'property_deal',
        type: 'property',
        title: 'Property Investment Opportunity',
        description: 'A distressed property is available at a discount.',
        terms: {
            price: () => 150000 * (0.7 + Math.random() * 0.2),
            discount: 0.2,
            monthlyIncome: 1200
        },
        expiresIn: 5,
        rarity: 'uncommon'
    },
    {
        id: 'business_partnership',
        type: 'business',
        title: 'Business Partnership Offer',
        description: 'An investor wants to partner with you on a business venture.',
        terms: {
            investment: () => 50000 + Math.random() * 50000,
            yourShare: 0.5,
            monthlyIncome: () => 3000 + Math.random() * 2000
        },
        expiresIn: 7,
        rarity: 'rare'
    },
    {
        id: 'investment_opportunity',
        type: 'investment',
        title: 'Exclusive Investment Opportunity',
        description: 'A high-return investment opportunity is available.',
        terms: {
            minimum: 10000,
            returnRate: 0.12,
            duration: 12
        },
        expiresIn: 4,
        rarity: 'uncommon'
    }
];

// Incident Definitions
const incidentDefinitions = [
    {
        id: 'market_crash',
        type: 'market',
        title: '💥 Market Crash',
        description: 'A major market crash affects all investments.',
        effect: { portfolioLoss: 0.2, marketDrop: 0.15, assetType: 'stocks' },
        duration: 3,
        rarity: 'rare'
    },
    {
        id: 'recession',
        type: 'economic',
        title: '📉 Economic Recession',
        description: 'The economy enters a recession. Income decreases, expenses increase.',
        effect: { incomeDecrease: 0.1, expenseIncrease: 0.15, duration: 6 },
        duration: 6,
        rarity: 'rare'
    },
    {
        id: 'inflation_spike',
        type: 'economic',
        title: '📊 Inflation Spike',
        description: 'Inflation spikes, affecting all prices and expenses.',
        effect: { expenseIncrease: 0.2, priceIncrease: 0.15, duration: 4 },
        duration: 4,
        rarity: 'uncommon'
    },
    {
        id: 'property_market_crash',
        type: 'property',
        title: '🏠 Property Market Crash',
        description: 'Property values plummet across the market.',
        effect: { propertyValueLoss: 0.25, duration: 3 },
        duration: 3,
        rarity: 'rare'
    },
    {
        id: 'cyber_attack',
        type: 'crypto',
        title: '🔒 Crypto Exchange Hack',
        description: 'A major crypto exchange is hacked, affecting crypto prices.',
        effect: { marketDrop: 0.3, assetType: 'crypto', duration: 2 },
        duration: 2,
        rarity: 'rare'
    }
];

// Generate random event
function generateRandomEvent() {
    const rarityWeights = {
        common: 0.6,
        uncommon: 0.3,
        rare: 0.1
    };
    
    const rarity = weightedRandom(rarityWeights);
    const availableEvents = expandedEventDefinitions.filter(e => e.rarity === rarity);
    
    if (availableEvents.length === 0) return null;
    
    const event = { ...availableEvents[Math.floor(Math.random() * availableEvents.length)] };
    return event;
}

// Generate offer
function generateOffer() {
    if (Math.random() < 0.3) { // 30% chance per turn
        const offer = { ...offerDefinitions[Math.floor(Math.random() * offerDefinitions.length)] };
        offer.id = `${offer.id}_${Date.now()}`;
        offer.turn = gameState.turn;
        offer.expiresAt = gameState.turn + offer.expiresIn;
        
        // Calculate terms
        if (offer.terms.amount && typeof offer.terms.amount === 'function') {
            offer.terms.amount = offer.terms.amount();
        }
        if (offer.terms.monthlyIncome && typeof offer.terms.monthlyIncome === 'function') {
            offer.terms.monthlyIncome = offer.terms.monthlyIncome();
        }
        
        expandedEvents.activeOffers.push(offer);
        return offer;
    }
    return null;
}

// Generate incident
function generateIncident() {
    if (Math.random() < 0.05) { // 5% chance per turn
        const incident = { ...incidentDefinitions[Math.floor(Math.random() * incidentDefinitions.length)] };
        incident.id = `${incident.id}_${Date.now()}`;
        incident.turn = gameState.turn;
        incident.expiresAt = gameState.turn + incident.duration;
        incident.active = true;
        
        expandedEvents.activeIncidents.push(incident);
        return incident;
    }
    return null;
}

// Weighted random selection
function weightedRandom(weights) {
    const total = Object.values(weights).reduce((a, b) => a + b, 0);
    let random = Math.random() * total;
    
    for (const [key, weight] of Object.entries(weights)) {
        random -= weight;
        if (random <= 0) return key;
    }
    
    return Object.keys(weights)[0];
}

// Apply event effects
function applyEventEffect(event) {
    if (event.effect.incomeIncrease) {
        gameState.player.monthlyIncome *= (1 + event.effect.incomeIncrease);
    }
    if (event.effect.cashBonus) {
        gameState.player.cash += event.effect.cashBonus;
    }
    if (event.effect.cashLoss) {
        gameState.player.cash = Math.max(0, gameState.player.cash - event.effect.cashLoss);
    }
    if (event.effect.skillBoost) {
        Object.keys(event.effect.skillBoost).forEach(skill => {
            playerAttributes.skills[skill] = Math.min(100, 
                playerAttributes.skills[skill] + event.effect.skillBoost[skill]);
        });
    }
    if (event.effect.marketBoost) {
        const assetType = event.effect.assetType || 'stocks';
        gameState.markets[assetType].forEach(asset => {
            asset.price *= (1 + event.effect.marketBoost);
        });
    }
    if (event.effect.marketDrop) {
        const assetType = event.effect.assetType || 'stocks';
        gameState.markets[assetType].forEach(asset => {
            asset.price *= (1 - event.effect.marketDrop);
        });
    }
    if (event.effect.portfolioLoss) {
        Object.keys(gameState.player.portfolio).forEach(marketType => {
            gameState.player.portfolio[marketType].forEach(holding => {
                const asset = gameState.markets[marketType]?.find(a => a.symbol === holding.symbol);
                if (asset) {
                    asset.price *= (1 - event.effect.portfolioLoss);
                }
            });
        });
    }
}

// Process active incidents
function processActiveIncidents() {
    expandedEvents.activeIncidents.forEach(incident => {
        if (incident.active && incident.turn <= gameState.turn && gameState.turn < incident.expiresAt) {
            // Apply recurring effects
            if (incident.effect.incomeDecrease) {
                gameState.player.monthlyIncome *= (1 - incident.effect.incomeDecrease);
            }
            if (incident.effect.expenseIncrease) {
                gameState.player.monthlyExpenses *= (1 + incident.effect.expenseIncrease);
            }
        }
        
        // Remove expired incidents
        if (gameState.turn >= incident.expiresAt) {
            incident.active = false;
        }
    });
    
    expandedEvents.activeIncidents = expandedEvents.activeIncidents.filter(i => i.active);
}

// Process active offers (remove expired)
function processActiveOffers() {
    expandedEvents.activeOffers = expandedEvents.activeOffers.filter(offer => 
        gameState.turn < offer.expiresAt
    );
}

// Make functions globally available
window.generateRandomEvent = generateRandomEvent;
window.generateOffer = generateOffer;
window.generateIncident = generateIncident;
window.applyEventEffect = applyEventEffect;
window.processActiveIncidents = processActiveIncidents;
window.processActiveOffers = processActiveOffers;

