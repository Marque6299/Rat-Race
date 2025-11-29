// Game State
const gameState = {
    player: {
        name: '',
        trait: '',
        cash: 5000,
        monthlyIncome: 3000,
        monthlyExpenses: 2500,
        netWorth: 5000,
        portfolio: {
            stocks: [],
            bonds: [],
            forex: [],
            commodities: [],
            crypto: []
        },
        properties: [],
        loans: [],
        badHabits: [],
        financialHealth: 100,
        healthFactors: [],
        monthlyStats: {
            income: 0,
            expenses: 0,
            taxes: 0,
            loanPayments: 0,
            propertyUpkeep: 0,
            investmentReturns: 0,
            netChange: 0
        },
        investmentHistory: []
    },
    turn: 1,
    year: 2024,
    markets: {
        stocks: [],
        bonds: [],
        forex: [],
        commodities: [],
        crypto: []
    },
    marketHistory: {
        stocks: {},
        bonds: {},
        forex: {},
        commodities: {},
        crypto: {}
    },
    story: [],
    currentEvent: null,
    hasWorkedThisTurn: false,
    needsInitialized: false
};

// Trait Effects
const traitEffects = {
    'frugal': {
        savingsBonus: 0.2,
        expenseReduction: 0.1,
        description: 'You are naturally frugal and save more money.'
    },
    'risk-taker': {
        investmentBonus: 0.15,
        stabilityPenalty: 0.1,
        description: 'You take calculated risks for higher returns.'
    },
    'analyst': {
        tradingAccuracy: 0.1,
        marketInsight: true,
        description: 'You have better market insights and trading accuracy.'
    },
    'entrepreneur': {
        businessIncome: 0.25,
        riskTolerance: 0.2,
        description: 'You excel at business and have higher risk tolerance.'
    }
};

// Market Assets
const marketAssets = {
    stocks: [
        { name: 'TechCorp', symbol: 'TECH', basePrice: 100 },
        { name: 'FinanceBank', symbol: 'FNB', basePrice: 50 },
        { name: 'EnergyCo', symbol: 'ENG', basePrice: 75 },
        { name: 'HealthPharm', symbol: 'HLT', basePrice: 120 },
        { name: 'RetailMart', symbol: 'RTM', basePrice: 40 },
        { name: 'CloudSoft', symbol: 'CLD', basePrice: 85 },
        { name: 'AutoDrive', symbol: 'AUTO', basePrice: 60 },
        { name: 'GreenEnergy', symbol: 'GRN', basePrice: 45 },
        { name: 'MediaStream', symbol: 'MED', basePrice: 95 },
        { name: 'FoodChain', symbol: 'FOOD', basePrice: 35 },
        { name: 'AeroSpace', symbol: 'AERO', basePrice: 110 },
        { name: 'BioTech', symbol: 'BIO', basePrice: 130 },
        { name: 'Telecom', symbol: 'TEL', basePrice: 55 },
        { name: 'RealEstate', symbol: 'RE', basePrice: 70 },
        { name: 'MiningCorp', symbol: 'MIN', basePrice: 40 }
    ],
    bonds: [
        { name: 'Government 10Y', symbol: 'GOV10', basePrice: 1000, yield: 0.03 },
        { name: 'Corporate AAA', symbol: 'CORP', basePrice: 1000, yield: 0.045 },
        { name: 'Municipal Bond', symbol: 'MUNI', basePrice: 1000, yield: 0.025 },
        { name: 'Government 30Y', symbol: 'GOV30', basePrice: 1000, yield: 0.035 },
        { name: 'Corporate AA', symbol: 'CORPAA', basePrice: 1000, yield: 0.05 },
        { name: 'High Yield', symbol: 'HY', basePrice: 1000, yield: 0.08 },
        { name: 'Treasury 5Y', symbol: 'TRE5', basePrice: 1000, yield: 0.028 },
        { name: 'International', symbol: 'INTL', basePrice: 1000, yield: 0.04 },
        { name: 'Inflation Protected', symbol: 'TIPS', basePrice: 1000, yield: 0.025 }
    ],
    forex: [
        { name: 'USD/EUR', symbol: 'EUR', basePrice: 0.92 },
        { name: 'USD/GBP', symbol: 'GBP', basePrice: 0.79 },
        { name: 'USD/JPY', symbol: 'JPY', basePrice: 150 },
        { name: 'USD/CNY', symbol: 'CNY', basePrice: 7.2 },
        { name: 'USD/CAD', symbol: 'CAD', basePrice: 1.35 },
        { name: 'USD/AUD', symbol: 'AUD', basePrice: 1.52 },
        { name: 'USD/CHF', symbol: 'CHF', basePrice: 0.88 },
        { name: 'USD/INR', symbol: 'INR', basePrice: 83.5 },
        { name: 'USD/BRL', symbol: 'BRL', basePrice: 5.2 },
        { name: 'USD/MXN', symbol: 'MXN', basePrice: 17.8 },
        { name: 'USD/ZAR', symbol: 'ZAR', basePrice: 18.5 },
        { name: 'USD/KRW', symbol: 'KRW', basePrice: 1350 }
    ],
    commodities: [
        { name: 'Gold', symbol: 'GOLD', basePrice: 2000, unit: 'oz' },
        { name: 'Oil', symbol: 'OIL', basePrice: 75, unit: 'barrel' },
        { name: 'Silver', symbol: 'SILV', basePrice: 25, unit: 'oz' },
        { name: 'Copper', symbol: 'COPP', basePrice: 4, unit: 'lb' },
        { name: 'Platinum', symbol: 'PLAT', basePrice: 950, unit: 'oz' },
        { name: 'Palladium', symbol: 'PALL', basePrice: 1200, unit: 'oz' },
        { name: 'Natural Gas', symbol: 'NGAS', basePrice: 3.5, unit: 'MMBtu' },
        { name: 'Wheat', symbol: 'WHEAT', basePrice: 6.5, unit: 'bushel' },
        { name: 'Corn', symbol: 'CORN', basePrice: 5.2, unit: 'bushel' },
        { name: 'Soybeans', symbol: 'SOY', basePrice: 12.8, unit: 'bushel' },
        { name: 'Coffee', symbol: 'COFF', basePrice: 1.8, unit: 'lb' },
        { name: 'Sugar', symbol: 'SUGAR', basePrice: 0.22, unit: 'lb' },
        { name: 'Cotton', symbol: 'COT', basePrice: 0.85, unit: 'lb' },
        { name: 'Cattle', symbol: 'CATTLE', basePrice: 1.65, unit: 'lb' }
    ],
    crypto: [
        { name: 'Bitcoin', symbol: 'BTC', basePrice: 45000 },
        { name: 'Ethereum', symbol: 'ETH', basePrice: 2500 },
        { name: 'Litecoin', symbol: 'LTC', basePrice: 75 },
        { name: 'Cardano', symbol: 'ADA', basePrice: 0.5 },
        { name: 'Binance Coin', symbol: 'BNB', basePrice: 320 },
        { name: 'Solana', symbol: 'SOL', basePrice: 95 },
        { name: 'Polkadot', symbol: 'DOT', basePrice: 7.2 },
        { name: 'Chainlink', symbol: 'LINK', basePrice: 14.5 },
        { name: 'Polygon', symbol: 'MATIC', basePrice: 0.85 },
        { name: 'Avalanche', symbol: 'AVAX', basePrice: 35 },
        { name: 'Uniswap', symbol: 'UNI', basePrice: 6.5 },
        { name: 'Dogecoin', symbol: 'DOGE', basePrice: 0.08 }
    ]
};

// Bad Financial Habits
const badHabits = [
    {
        name: 'Impulse Buying',
        effect: { expenseIncrease: 0.1 },
        description: 'You tend to make unplanned purchases.'
    },
    {
        name: 'Credit Card Debt',
        effect: { interestRate: 0.18, monthlyPayment: 200 },
        description: 'You carry high-interest credit card debt.'
    },
    {
        name: 'No Emergency Fund',
        effect: { vulnerability: 0.3 },
        description: 'You lack an emergency fund, making you vulnerable to unexpected expenses.'
    },
    {
        name: 'Lifestyle Inflation',
        effect: { expenseGrowth: 0.15 },
        description: 'Your expenses grow faster than your income.'
    },
    {
        name: 'Emotional Trading',
        effect: { tradingPenalty: 0.2 },
        description: 'You make trading decisions based on emotions rather than analysis.'
    }
];

// Random Events
const randomEvents = [
    {
        type: 'positive',
        title: '💼 Promotion!',
        description: 'You got a promotion! Your monthly income increased.',
        effect: { incomeIncrease: 0.2 }
    },
    {
        type: 'positive',
        title: '🎁 Bonus!',
        description: 'You received a year-end bonus!',
        effect: { cashBonus: 5000 }
    },
    {
        type: 'positive',
        title: '📚 Skill Development',
        description: 'You completed a financial course. Your investment knowledge improved.',
        effect: { investmentBonus: 0.1 }
    },
    {
        type: 'negative',
        title: '🏥 Medical Emergency',
        description: 'Unexpected medical expenses hit your finances.',
        effect: { cashLoss: 3000 }
    },
    {
        type: 'negative',
        title: '🚗 Car Repair',
        description: 'Your car needs major repairs.',
        effect: { cashLoss: 2000 }
    },
    {
        type: 'negative',
        title: '💸 Unexpected Expense',
        description: 'An unexpected bill arrived.',
        effect: { cashLoss: 1000 }
    },
    {
        type: 'market',
        title: '📈 Bull Market',
        description: 'Markets are surging! Stock prices are rising.',
        effect: { marketBoost: 0.15, assetType: 'stocks' }
    },
    {
        type: 'market',
        title: '📉 Bear Market',
        description: 'Markets are declining. Stock prices are falling.',
        effect: { marketDrop: 0.15, assetType: 'stocks' }
    },
    {
        type: 'market',
        title: '💰 Crypto Surge',
        description: 'Cryptocurrency prices are skyrocketing!',
        effect: { marketBoost: 0.25, assetType: 'crypto' }
    },
    {
        type: 'market',
        title: '💎 Gold Rush',
        description: 'Commodity prices, especially gold, are rising.',
        effect: { marketBoost: 0.12, assetType: 'commodities' }
    },
    {
        type: 'market',
        title: '🌍 Currency Crisis',
        description: 'Forex markets are volatile.',
        effect: { marketVolatility: 0.2, assetType: 'forex' }
    },
    {
        type: 'personal',
        title: '🎯 Bad Habit Triggered',
        description: 'One of your bad financial habits is affecting you.',
        effect: { badHabitEffect: true }
    }
];

// Story Templates
const storyTemplates = [
    "You're working your 9-to-5 job, but you know there's more to life than the daily grind.",
    "Your financial journey begins. Every decision matters in your quest to escape the rat race.",
    "The markets are open, and opportunities await those who are prepared.",
    "Building wealth takes time, patience, and smart decisions.",
    "Remember: financial freedom isn't about how much you make, but how much you keep and grow.",
    "Diversification is key - don't put all your eggs in one basket.",
    "Emergency funds protect you from life's unexpected curveballs.",
    "Compound interest is the eighth wonder of the world - use it wisely.",
    "The best time to invest was yesterday. The second best time is now.",
    "Financial education is an investment that pays the best interest."
];

// Generate Historical Market Data (5-10 years = 60-120 turns)
function generateHistoricalData(marketType, asset, startTurn) {
    const history = [];
    const years = 5 + Math.random() * 5; // 5-10 years
    const totalTurns = Math.floor(years * 12); // Convert to months
    const volatility = getMarketVolatility(marketType);
    
    // Start from a random price in the past
    let price = asset.basePrice * (0.5 + Math.random() * 1.0);
    
    // Generate historical prices
    for (let i = 0; i < totalTurns; i++) {
        // Random walk with some trend
        const trend = (Math.random() - 0.48) * 0.01; // Slight upward bias
        const randomChange = (Math.random() - 0.5) * volatility * 2;
        price = Math.max(asset.basePrice * 0.1, price * (1 + trend + randomChange));
        
        history.push({
            turn: startTurn - (totalTurns - i),
            price: price
        });
    }
    
    return { history, finalPrice: price };
}

// Initialize Markets
function initializeMarkets() {
    // Generate historical data going back 5-10 years
    const historicalStartTurn = -(60 + Math.floor(Math.random() * 60)); // -60 to -120 turns ago
    
    Object.keys(marketAssets).forEach(marketType => {
        gameState.markets[marketType] = marketAssets[marketType].map(asset => {
            // Generate historical data
            const historical = generateHistoricalData(marketType, asset, historicalStartTurn);
            const currentPrice = historical.finalPrice * (0.95 + Math.random() * 0.1); // Slight variation from historical end
            
            // Initialize price history with historical data
            if (!gameState.marketHistory[marketType][asset.symbol]) {
                gameState.marketHistory[marketType][asset.symbol] = [];
            }
            
            // Add all historical data points
            gameState.marketHistory[marketType][asset.symbol] = historical.history;
            
            // Add current price
            gameState.marketHistory[marketType][asset.symbol].push({
                turn: gameState.turn,
                price: currentPrice
            });
            
            return {
                ...asset,
                price: currentPrice,
                change: 0,
                changePercent: 0
            };
        });
    });
}

// Update Market Prices
function updateMarkets() {
    Object.keys(gameState.markets).forEach(marketType => {
        gameState.markets[marketType].forEach(asset => {
            const volatility = getMarketVolatility(marketType);
            const change = (Math.random() - 0.5) * volatility * asset.price;
            const oldPrice = asset.price;
            
            // Base price change
            let newPrice = Math.max(asset.price + change, asset.basePrice * 0.1);
            
            // Apply supply/demand if available
            if (typeof calculatePriceWithSupplyDemand === 'function') {
                newPrice = calculatePriceWithSupplyDemand(marketType, asset.symbol, newPrice);
            }
            
            asset.price = newPrice;
            asset.change = newPrice - oldPrice;
            asset.changePercent = (asset.change / oldPrice) * 100;
            
            // Update price history (keep last 50 data points)
            if (!gameState.marketHistory[marketType][asset.symbol]) {
                gameState.marketHistory[marketType][asset.symbol] = [];
            }
            gameState.marketHistory[marketType][asset.symbol].push({
                turn: gameState.turn,
                price: asset.price
            });
            // Keep only last 50 points
            if (gameState.marketHistory[marketType][asset.symbol].length > 50) {
                gameState.marketHistory[marketType][asset.symbol].shift();
            }
        });
    });
}

function getMarketVolatility(marketType) {
    const volatilities = {
        stocks: 0.05,
        bonds: 0.02,
        forex: 0.03,
        commodities: 0.04,
        crypto: 0.08
    };
    return volatilities[marketType] || 0.03;
}

// Calculate Financial Health
function calculateFinancialHealth() {
    let health = 100;
    const factors = [];

    // Emergency fund check
    const emergencyFundMonths = gameState.player.cash / gameState.player.monthlyExpenses;
    if (emergencyFundMonths < 3) {
        health -= 20;
        factors.push('⚠️ Low emergency fund');
    } else if (emergencyFundMonths >= 6) {
        health += 10;
        factors.push('✅ Strong emergency fund');
    }

    // Debt-to-income ratio
    const savingsRate = (gameState.player.monthlyIncome - gameState.player.monthlyExpenses) / gameState.player.monthlyIncome;
    if (savingsRate < 0) {
        health -= 30;
        factors.push('❌ Spending more than earning');
    } else if (savingsRate < 0.1) {
        health -= 15;
        factors.push('⚠️ Low savings rate');
    } else if (savingsRate >= 0.2) {
        health += 15;
        factors.push('✅ Good savings rate');
    }

    // Portfolio diversification
    const portfolioValue = getTotalPortfolioValue();
    if (portfolioValue > 0) {
        const diversification = calculateDiversification();
        if (diversification < 0.3) {
            health -= 10;
            factors.push('⚠️ Poor portfolio diversification');
        } else {
            health += 5;
            factors.push('✅ Well-diversified portfolio');
        }
    }

    // Bad habits penalty
    health -= gameState.player.badHabits.length * 10;
    if (gameState.player.badHabits.length > 0) {
        factors.push(`⚠️ ${gameState.player.badHabits.length} bad financial habit(s)`);
    }

    // Net worth growth
    if (gameState.player.netWorth > gameState.player.cash * 2) {
        health += 10;
        factors.push('✅ Growing net worth');
    }

    gameState.player.financialHealth = Math.max(0, Math.min(100, health));
    gameState.player.healthFactors = factors;
}

function calculateDiversification() {
    const portfolio = gameState.player.portfolio;
    const values = [
        getPortfolioValue('stocks'),
        getPortfolioValue('bonds'),
        getPortfolioValue('forex'),
        getPortfolioValue('commodities'),
        getPortfolioValue('crypto')
    ].filter(v => v > 0);

    if (values.length === 0) return 0;
    if (values.length === 1) return 0.2;

    const total = values.reduce((a, b) => a + b, 0);
    const weights = values.map(v => v / total);
    const hhi = weights.reduce((sum, w) => sum + w * w, 0);
    return 1 - hhi; // Diversification score
}

function getTotalPortfolioValue() {
    return Object.keys(gameState.player.portfolio).reduce((sum, type) => {
        return sum + getPortfolioValue(type);
    }, 0);
}

function getPortfolioValue(type) {
    const holdings = gameState.player.portfolio[type];
    const market = gameState.markets[type];
    return holdings.reduce((sum, holding) => {
        const asset = market.find(a => a.symbol === holding.symbol);
        return sum + (asset ? asset.price * holding.quantity : 0);
    }, 0);
}

function updateNetWorth() {
    const propertyValue = gameState.player.properties.reduce((sum, prop) => sum + prop.value, 0);
    const loanDebt = gameState.player.loans.reduce((sum, loan) => sum + loan.principal, 0);
    const savingsAccount = (typeof bankSystem !== 'undefined' && bankSystem.savingsAccount) || 0;
    gameState.player.netWorth = gameState.player.cash + savingsAccount + getTotalPortfolioValue() + propertyValue - loanDebt;
}

// Character Creation
document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-game-btn');
    const playerNameInput = document.getElementById('player-name');
    const characterSelection = document.getElementById('character-selection');
    
    // Populate character selection
    if (characterSelection && typeof characterDefinitions !== 'undefined') {
        characterSelection.innerHTML = characterDefinitions.map(character => {
            const trait = traitEffects[character.trait] || {};
            return `
                <div class="trait-card character-card" data-character-id="${character.id}" style="cursor: pointer; text-align: center;">
                    <div style="font-size: 3em; margin-bottom: 10px;">${character.icon}</div>
                    <h3 style="margin: 0 0 8px 0;">${character.name}</h3>
                    <p style="font-size: 0.85em; color: var(--text-secondary); margin-bottom: 10px;">${character.description}</p>
                    <div style="background: var(--bg-dark); padding: 8px; border-radius: 6px; font-size: 0.8em; margin-bottom: 8px;">
                        <div>Starting Cash: ${formatMoney(character.startingCash)}</div>
                        <div>Starting Income: ${formatMoney(character.startingIncome)}/month</div>
                    </div>
                    ${character.preUnlockedSkills && character.preUnlockedSkills.length > 0 ? `
                        <div style="font-size: 0.75em; color: var(--success-color); margin-top: 5px;">
                            ✨ Pre-unlocked: ${character.preUnlockedSkills.map(id => {
                                if (typeof skillDefinitions !== 'undefined') {
                                    const skill = skillDefinitions.find(s => s.id === id);
                                    return skill ? skill.name : id;
                                }
                                return id;
                            }).join(', ')}
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');
        
        // Add click handlers
        characterSelection.querySelectorAll('.character-card').forEach(card => {
            card.addEventListener('click', () => {
                characterSelection.querySelectorAll('.character-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                const characterId = card.dataset.characterId;
                gameState.player.characterId = characterId;
                checkStartButton();
            });
        });
    }

    playerNameInput.addEventListener('input', () => {
        gameState.player.name = playerNameInput.value.trim();
        checkStartButton();
    });

    function checkStartButton() {
        startBtn.disabled = !(gameState.player.name && gameState.player.characterId);
    }

    startBtn.addEventListener('click', startGame);
    
    // Add hotkey for next turn (Space key)
    document.addEventListener('keydown', (e) => {
        // Only trigger if not typing in an input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        
        if (e.code === 'Space' && !e.repeat) {
            e.preventDefault();
            const nextTurnBtn = document.getElementById('next-turn-btn');
            if (nextTurnBtn && !nextTurnBtn.disabled) {
                nextTurnBtn.click();
            }
        }
    });
});

function startGame() {
    // Apply character selection
    if (typeof applyCharacterSelection === 'function' && gameState.player.characterId) {
        applyCharacterSelection(gameState.player.characterId);
    } else {
        // Fallback to trait-based system
        const trait = traitEffects[gameState.player.trait];
        if (trait && trait.savingsBonus) {
            gameState.player.monthlyExpenses *= (1 - trait.expenseReduction);
        }
    }

    // Initialize markets with historical data
    initializeMarkets();

    // Initialize needs and wants system
    if (typeof initializeNeedsWants === 'function') {
        initializeNeedsWants();
        gameState.needsInitialized = true;
    }

    // Initialize AI system
    if (typeof initializeAISystem === 'function') {
        initializeAISystem();
    }

    // Initialize opportunities system
    if (typeof generateOpportunities === 'function') {
        generateOpportunities();
    }

    // Initialize bank system credit score
    if (typeof calculateCreditScore === 'function') {
        calculateCreditScore();
    }

    // Initialize logging system
    if (typeof initializeLoggingSystem === 'function') {
        initializeLoggingSystem();
    }
    
    // Initialize skill tree system
    if (typeof initializeSkillTree === 'function') {
        initializeSkillTree();
    }
    
    // Initialize job market system
    if (typeof initializeJobMarket === 'function') {
        initializeJobMarket();
    }
    
    // Initialize quick investments system
    if (typeof generateAvailableProducts === 'function') {
        generateAvailableProducts();
    }
    
    // Initialize badge system
    if (typeof updateBadges === 'function') {
        updateBadges();
    }
    
    // Initialize NPC contacts system
    if (typeof initializeNPCContacts === 'function') {
        initializeNPCContacts();
    }
    
    // Initialize property deterioration profiles
    gameState.player.properties.forEach(property => {
        if (!property.condition) property.condition = 100;
        if (!property.lastMaintenance) property.lastMaintenance = gameState.turn;
        if (!property.originalValue) property.originalValue = property.value;
        if (!property.deteriorationProfile) {
            property.deteriorationProfile = 'good';
        }
    });
    
    // Initialize player attributes (skills and luck)
    if (typeof initializePlayerAttributes === 'function') {
        initializePlayerAttributes();
    }
    
    // Initialize market economics (supply and demand)
    if (typeof initializeMarketConditions === 'function') {
        initializeMarketConditions();
    }
    
    // Initialize achievements system
    if (typeof initializeAchievements === 'function') {
        initializeAchievements();
    }
    
    // Initialize tax system
    if (typeof taxSystem !== 'undefined') {
        taxSystem.currentYear = {
            totalIncome: 0,
            taxableIncome: 0,
            totalTaxes: 0,
            deductions: 0,
            credits: 0,
            capitalGains: 0
        };
    }
    
    // Initialize analytics system
    if (typeof recordPerformanceData === 'function') {
        recordPerformanceData();
    }

    // Initialize bank system
    if (typeof bankSystem !== 'undefined') {
        bankSystem.creditScore = 750; // Starting credit score
        bankSystem.savingsAccount = 0;
        bankSystem.creditHistory = [];
    }

    // Add initial bad habit
    if (Math.random() < 0.5) {
        const habit = badHabits[Math.floor(Math.random() * badHabits.length)];
        gameState.player.badHabits.push(habit);
    }

    // Switch screens
    document.getElementById('character-creation').classList.remove('active');
    document.getElementById('game-screen').classList.add('active');

    // Update display
    updateDisplay();
    if (typeof updateNeedsDisplay === 'function') {
        updateNeedsDisplay();
    }
    if (typeof updateAIDisplay === 'function') {
        updateAIDisplay();
    }
    
    // Attach profile button listeners after game starts
    if (typeof attachProfileButtonListeners === 'function') {
        setTimeout(attachProfileButtonListeners, 200);
    }
    
    addStory('Welcome to your financial journey! Your goal is to escape the rat race by building wealth through smart financial decisions.');
    
    // Introduce AI competition
    if (gameState.aiInitialized) {
        const npcCount = aiSystem.npcs.length;
        const businessCount = aiSystem.businesses.length;
        addStory(`⚠️ You're not alone! ${npcCount} NPCs, ${businessCount} businesses, and ${aiSystem.corporations.length} corporations are competing with you. Some may help, others will try to bankrupt you!`);
    }
}

// Display Updates
function updateDisplay() {
    // Player info
    const playerNameDisplay = document.getElementById('player-name-display');
    if (playerNameDisplay) {
        playerNameDisplay.textContent = gameState.player.name;
    }
    
    // Character icon
    const iconDisplay = document.getElementById('character-icon-display');
    if (iconDisplay && typeof getCharacterIcon === 'function') {
        iconDisplay.textContent = getCharacterIcon();
    }
    
    // Update header turn/year
    const turnCountHeader = document.getElementById('turn-count-header');
    const yearDisplayHeader = document.getElementById('year-display-header');
    if (turnCountHeader) turnCountHeader.textContent = gameState.turn;
    if (yearDisplayHeader) yearDisplayHeader.textContent = gameState.year;

    // Financial status
    const cashDisplay = document.getElementById('cash-display');
    if (cashDisplay) cashDisplay.textContent = formatMoney(gameState.player.cash);
    
    const incomeDisplay = document.getElementById('income-display');
    if (incomeDisplay) incomeDisplay.textContent = formatMoney(gameState.player.monthlyIncome);
    
    const expensesDisplay = document.getElementById('expenses-display');
    if (expensesDisplay) expensesDisplay.textContent = formatMoney(gameState.player.monthlyExpenses);
    
    updateNetWorth();
    
    const networthDisplay = document.getElementById('networth-display');
    if (networthDisplay) networthDisplay.textContent = formatMoney(gameState.player.netWorth);
    
    // Monthly stats (for dashboard quick view)
    const stats = gameState.player.monthlyStats;
    const monthlyNetEl = document.getElementById('monthly-net');
    if (monthlyNetEl) {
        monthlyNetEl.textContent = formatMoney(stats.netChange);
        monthlyNetEl.className = 'quick-stat-value ' + (stats.netChange >= 0 ? 'positive' : 'negative');
    }
    
    // Portfolio total
    const portfolioTotal = getTotalPortfolioValue();
    const portfolioTotalEl = document.getElementById('portfolio-total');
    if (portfolioTotalEl) {
        portfolioTotalEl.textContent = formatMoney(portfolioTotal);
    }

    // Financial health
    calculateFinancialHealth();
    const healthBar = document.getElementById('health-bar-fill');
    healthBar.style.width = gameState.player.financialHealth + '%';
    healthBar.className = 'health-fill ' + 
        (gameState.player.financialHealth >= 70 ? '' : 
         gameState.player.financialHealth >= 40 ? 'medium' : 'poor');
    const healthScore = document.getElementById('health-score');
    if (healthScore) healthScore.textContent = Math.round(gameState.player.financialHealth) + '%';
    
    // Health factors are now in modals - no need to update here

    // Portfolio and Bad habits are now in modals - no need to update here

    // Markets will update when modal is opened

    // Turn info
    const turnCount = document.getElementById('turn-count');
    if (turnCount) turnCount.textContent = gameState.turn;
    
    const yearDisplay = document.getElementById('year-display');
    if (yearDisplay) yearDisplay.textContent = gameState.year;

    if (typeof scheduleSave === 'function') {
        scheduleSave();
    }
}

function updateMarketDisplay() {
    // Get market type from select dropdown or default to stocks
    const marketTypeSelect = document.getElementById('market-type-select');
    const marketType = marketTypeSelect ? marketTypeSelect.value : 'stocks';
    const market = gameState.markets[marketType];
    const marketDisplay = document.getElementById('market-display');
    if (!marketDisplay || !market) return;

    marketDisplay.innerHTML = market.map(asset => {
        const changeClass = asset.change >= 0 ? 'positive' : 'negative';
        const changeSign = asset.change >= 0 ? '+' : '';
        return `
            <div class="market-item">
                <div class="market-item-header">
                    <div>
                        <div class="market-item-name">${asset.name} (${asset.symbol})</div>
                        <div style="font-size: 0.9em; color: var(--text-secondary);">
                            ${asset.unit ? `Per ${asset.unit}` : 'Per share'}
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div class="market-item-price">${formatMoney(asset.price)}</div>
                        <div class="market-item-change ${changeClass}">
                            ${changeSign}${formatMoney(asset.change)} (${changeSign}${asset.changePercent.toFixed(2)}%)
                        </div>
                    </div>
                </div>
                <div class="market-item-actions">
                    <button class="market-btn" onclick="openBuyModal('${marketType}', '${asset.symbol}')">Buy</button>
                    <button class="market-btn" onclick="openSellModal('${marketType}', '${asset.symbol}')">Sell</button>
                    <button class="market-btn" onclick="showMarketChart('${marketType}', '${asset.symbol}')">Chart</button>
                </div>
            </div>
        `;
    }).join('');
    
    // Update loans and properties display
    updateLoansDisplay();
    updatePropertiesDisplay();
}

function updateLoansDisplay() {
    const loansList = document.getElementById('loans-list');
    if (!loansList) return;
    if (gameState.player.loans.length === 0) {
        loansList.innerHTML = '<div style="color: var(--text-secondary); font-size: 0.9em;">No active loans</div>';
    } else {
        loansList.innerHTML = gameState.player.loans.map(loan => `
            <div class="bad-habit-item" style="margin-bottom: 10px;">
                <strong>${loan.name}</strong><br>
                <div style="font-size: 0.85em; margin-top: 5px;">
                    Principal: ${formatMoney(loan.principal)}<br>
                    Interest Rate: ${(loan.interestRate * 100).toFixed(2)}% APR<br>
                    Monthly Payment: ~${formatMoney(loan.principal * loan.interestRate / 12 + 100)}
                </div>
            </div>
        `).join('');
    }
}

function updatePropertiesDisplay() {
    const propertiesList = document.getElementById('properties-list');
    if (!propertiesList) return;
    if (gameState.player.properties.length === 0) {
        propertiesList.innerHTML = '<div style="color: var(--text-secondary); font-size: 0.9em;">No properties owned</div>';
    } else {
        propertiesList.innerHTML = gameState.player.properties.map(property => `
            <div class="bad-habit-item" style="margin-bottom: 10px; border-color: var(--secondary-color);">
                <strong>${property.name}</strong><br>
                <div style="font-size: 0.85em; margin-top: 5px;">
                    Value: ${formatMoney(property.value)}<br>
                    Condition: ${Math.round(property.condition)}%<br>
                    Monthly Upkeep: ${formatMoney(property.value * property.upkeepRate / 12)}<br>
                    Monthly Income: ${formatMoney(property.monthlyIncome || 0)}
                </div>
            </div>
        `).join('');
    }
}

// Market Chart Function
function showMarketChart(marketType, symbol) {
    const history = gameState.marketHistory[marketType] && gameState.marketHistory[marketType][symbol];
    if (!history || history.length < 2) {
        addStory('Not enough data to display chart yet.');
        return;
    }
    
    const chartContainer = document.getElementById('market-chart-container');
    const canvas = document.getElementById('market-chart');
    chartContainer.style.display = 'block';
    
    // Set canvas size
    const containerWidth = chartContainer.offsetWidth - 30;
    canvas.width = containerWidth;
    canvas.height = 150;
    canvas.style.width = containerWidth + 'px';
    canvas.style.height = '150px';
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const padding = 30;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Use last 50 data points for display (or all if less than 50)
    const displayHistory = history.slice(-50);
    
    // Get price range
    const prices = displayHistory.map(h => h.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice || 1;
    
    // Draw background
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, width, height);
    
    // Draw grid
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
        const y = padding + (height - 2 * padding) * (i / 5);
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
    }
    
    // Draw price line
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    displayHistory.forEach((point, index) => {
        const x = padding + (width - 2 * padding) * (index / (displayHistory.length - 1));
        const y = height - padding - ((point.price - minPrice) / priceRange) * (height - 2 * padding);
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.stroke();
    
    // Draw points (only on recent data points to avoid clutter)
    ctx.fillStyle = '#10b981';
    const pointInterval = Math.max(1, Math.floor(displayHistory.length / 20));
    displayHistory.forEach((point, index) => {
        if (index % pointInterval === 0 || index === displayHistory.length - 1) {
            const x = padding + (width - 2 * padding) * (index / (displayHistory.length - 1));
            const y = height - padding - ((point.price - minPrice) / priceRange) * (height - 2 * padding);
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    });
    
    // Draw labels
    ctx.fillStyle = '#f1f5f9';
    ctx.font = '11px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(formatMoney(minPrice), 5, height - padding + 5);
    ctx.fillText(formatMoney(maxPrice), 5, padding + 5);
    
    // Asset name and data range
    const asset = gameState.markets[marketType].find(a => a.symbol === symbol);
    if (asset) {
        const dataPoints = history.length;
        const years = (dataPoints / 12).toFixed(1);
        ctx.fillText(`${asset.name} (${symbol}) - ${years} years of data`, width / 2 - 80, 15);
    }
    
    // Scroll to chart
    chartContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Market type selector (dropdown) - handled in opportunities-system.js modal

// Action Buttons
document.addEventListener('DOMContentLoaded', () => {
    const actionButtons = document.querySelectorAll('[data-action]');
    actionButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            handleAction(action);
        });
    });

    document.getElementById('next-turn-btn').addEventListener('click', nextTurn);
});

function handleAction(action) {
    switch(action) {
        case 'work':
            handleWork();
            break;
        case 'invest':
            if (typeof openInvestmentModal === 'function') {
                openInvestmentModal();
            } else {
                openInvestModal();
            }
            break;
        case 'trade':
            if (typeof openMarketsModal === 'function') {
                openMarketsModal();
            } else {
                addStory('You analyze the markets and look for trading opportunities.');
            }
            break;
        case 'learn':
            handleLearn();
            break;
        case 'bank':
            if (typeof openBankModal === 'function') {
                openBankModal();
            }
            break;
        case 'spend':
            handleSpend();
            break;
    }
}

function handleWork() {
    // Work action now opens job market (salary is automatic each turn)
    if (typeof openJobMarketModal === 'function') {
        openJobMarketModal();
    } else {
        addStory('You can manage your career through the Job Market. Salary is paid automatically each turn.');
    }
}

function handleLearn() {
    const cost = 500;
    if (gameState.player.cash >= cost) {
        gameState.player.cash -= cost;
        
        // Log expense
        if (typeof logTransaction === 'function') {
            logTransaction('expense', 'Financial education', -cost, {
                expenseType: 'education'
            });
        }
        
        const investmentBonus = 0.05;
        addStory(`You invested in financial education. Your investment knowledge improved! This will help you make better decisions.`);
        // Could add a permanent bonus here
        updateDisplay();
    } else {
        addStory('You need more money to invest in education.');
    }
}

function handleSave() {
    const savings = gameState.player.monthlyIncome - gameState.player.monthlyExpenses;
    if (savings > 0) {
        const trait = traitEffects[gameState.player.trait];
        const bonus = trait.savingsBonus ? savings * trait.savingsBonus : 0;
        const totalSavings = savings + bonus;
        gameState.player.cash += totalSavings;
        addStory(`You saved ${formatMoney(totalSavings)} this month.${bonus > 0 ? ' Your frugal trait helped you save even more!' : ''}`);
        updateDisplay();
    } else {
        addStory('You are spending more than you earn. Focus on reducing expenses or increasing income.');
    }
}

function handleSpend() {
    openSpendModal();
}

function openInvestModal() {
    const modal = document.getElementById('action-modal');
    const modalBody = document.getElementById('modal-body');
    if (!modal || !modalBody) return;
    
    // Use modal manager
    if (typeof openModal === 'function') {
        if (!openModal('action-modal')) return;
    } else {
        modal.classList.add('active');
    }
    
    modalBody.innerHTML = `
        <p>Choose an investment strategy:</p>
        <div style="margin-top: 20px;">
            <button class="action-btn" onclick="quickInvest('stocks', 1000)" style="width: 100%; margin-bottom: 10px;">
                Invest $1,000 in Stocks
            </button>
            <button class="action-btn" onclick="quickInvest('bonds', 1000)" style="width: 100%; margin-bottom: 10px;">
                Invest $1,000 in Bonds
            </button>
            <button class="action-btn" onclick="quickInvest('crypto', 500)" style="width: 100%; margin-bottom: 10px;">
                Invest $500 in Crypto
            </button>
        </div>
        <p style="margin-top: 20px; font-size: 0.9em; color: var(--text-secondary);">
            Or use the Markets panel for more control over your investments.
        </p>
    `;
    document.getElementById('modal-title').textContent = 'Invest';
    
    // Show confirm and cancel buttons
    const confirmBtn = document.getElementById('modal-confirm');
    const cancelBtn = document.getElementById('modal-cancel');
    if (confirmBtn) {
        confirmBtn.style.display = 'none'; // Hide confirm for quick invest buttons
        confirmBtn.onclick = null;
    }
    if (cancelBtn) {
        cancelBtn.style.display = 'block';
        cancelBtn.onclick = closeModal;
    }
}

function quickInvest(type, amount) {
    // Open interactive investment modal with adjustable amount/quantity
    const modal = document.getElementById('action-modal');
    const modalBody = document.getElementById('modal-body');
    if (!modal || !modalBody) return;
    
    // Fix: Check if market exists and has assets
    const market = gameState.markets[type];
    if (!market || !Array.isArray(market) || market.length === 0) {
        if (typeof showToast === 'function') {
            showToast('No assets available in this market', 'error');
        }
        return;
    }
    
    // Use modal manager - allow stacking
    if (typeof openModal === 'function') {
        openModal('action-modal', false, true);
    } else {
        modal.classList.add('active');
    }
    
    // Select a random asset from the market
    const asset = market[Math.floor(Math.random() * market.length)];
    if (!asset) {
        if (typeof showToast === 'function') {
            showToast('Unable to select asset from market', 'error');
        }
        closeModal();
        return;
    }
    
    modalBody.innerHTML = `
        <div style="background: var(--bg-dark); padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <h3 style="margin-top: 0;">Quick Investment</h3>
            <div class="stat-grid" style="margin-bottom: 15px;">
                <div class="stat-item">
                    <label>Market Type:</label>
                    <span>${type.charAt(0).toUpperCase() + type.slice(1)}</span>
                </div>
                <div class="stat-item">
                    <label>Selected Asset:</label>
                    <span><strong>${asset.name} (${asset.symbol})</strong></span>
                </div>
                <div class="stat-item">
                    <label>Current Price:</label>
                    <span class="money">${formatMoney(asset.price)} ${asset.unit ? `per ${asset.unit}` : 'per share'}</span>
                </div>
                <div class="stat-item">
                    <label>Your Cash:</label>
                    <span class="money">${formatMoney(gameState.player.cash)}</span>
                </div>
            </div>
        </div>
        
        <div class="modal-form-group">
            <label>Investment Mode:</label>
            <select id="quick-invest-mode" style="width: 100%; padding: 10px; background: var(--bg-dark); border: 2px solid var(--border-color); border-radius: 8px; color: var(--text-primary); margin-bottom: 10px;">
                <option value="amount">Invest by Amount ($)</option>
                <option value="quantity">Invest by Quantity (${asset.unit || 'shares'})</option>
            </select>
        </div>
        
        <div class="modal-form-group">
            <label id="quick-invest-label">Investment Amount ($):</label>
            <input type="number" id="quick-invest-value" min="1" step="100" value="${amount}" style="width: 100%;">
        </div>
        
        <div id="quick-invest-preview" style="margin-top: 10px; padding: 15px; background: var(--bg-dark); border-radius: 8px; color: var(--text-secondary);"></div>
    `;
    
    document.getElementById('modal-title').textContent = `Quick Investment: ${asset.name}`;
    
    const modeSelect = document.getElementById('quick-invest-mode');
    const valueInput = document.getElementById('quick-invest-value');
    const label = document.getElementById('quick-invest-label');
    const preview = document.getElementById('quick-invest-preview');
    
    const updatePreview = () => {
        const mode = modeSelect.value;
        const value = parseFloat(valueInput.value) || 0;
        let quantity, totalCost, canAfford;
        
        if (mode === 'amount') {
            totalCost = value;
            quantity = value / asset.price;
            canAfford = gameState.player.cash >= value;
        } else {
            quantity = value;
            totalCost = quantity * asset.price;
            canAfford = gameState.player.cash >= totalCost;
        }
        
        preview.innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                <div>
                    <strong>Quantity:</strong><br>
                    <span style="font-size: 1.1em;">${quantity.toFixed(4)} ${asset.unit || 'shares'}</span>
                </div>
                <div>
                    <strong>Total Cost:</strong><br>
                    <span class="money" style="font-size: 1.1em; color: ${canAfford ? 'var(--text-primary)' : 'var(--danger-color)'};">
                        ${formatMoney(totalCost)}
                    </span>
                </div>
            </div>
            ${!canAfford ? `
                <div style="padding: 10px; background: rgba(239, 68, 68, 0.1); border-left: 4px solid var(--danger-color); border-radius: 8px;">
                    <strong>⚠️ Insufficient Funds</strong><br>
                    You need ${formatMoney(totalCost - gameState.player.cash)} more to make this investment.
                </div>
            ` : `
                <div style="padding: 10px; background: rgba(34, 197, 94, 0.1); border-left: 4px solid var(--success-color); border-radius: 8px;">
                    <strong>✅ Investment Ready</strong><br>
                    After purchase, you'll have ${formatMoney(gameState.player.cash - totalCost)} remaining.
                </div>
            `}
        `;
    };
    
    modeSelect.addEventListener('change', () => {
        const mode = modeSelect.value;
        if (mode === 'amount') {
            label.textContent = 'Investment Amount ($):';
            valueInput.min = '1';
            valueInput.step = '100';
            valueInput.value = amount;
        } else {
            label.textContent = `Quantity (${asset.unit || 'shares'}):`;
            valueInput.min = '0.0001';
            valueInput.step = '0.0001';
            valueInput.value = (amount / asset.price).toFixed(4);
        }
        updatePreview();
    });
    
    valueInput.addEventListener('input', updatePreview);
    updatePreview();
    
    const confirmBtn = document.getElementById('modal-confirm');
    const cancelBtn = document.getElementById('modal-cancel');
    if (confirmBtn) {
        confirmBtn.style.display = 'block';
        confirmBtn.textContent = 'Confirm Investment';
        confirmBtn.onclick = () => {
            const mode = modeSelect.value;
            const value = parseFloat(valueInput.value) || 0;
            
            if (value <= 0) {
                if (typeof showToast === 'function') {
                    showToast('Please enter a valid amount', 'error');
                }
                return;
            }
            
            let finalAmount, finalQuantity;
            if (mode === 'amount') {
                finalAmount = value;
                finalQuantity = finalAmount / asset.price;
            } else {
                finalQuantity = value;
                finalAmount = finalQuantity * asset.price;
            }
            
            if (gameState.player.cash < finalAmount) {
                if (typeof showToast === 'function') {
                    showToast('Insufficient funds', 'error');
                }
                return;
            }
            
            gameState.player.cash -= finalAmount;
            const existing = gameState.player.portfolio[type].find(h => h.symbol === asset.symbol);
            if (existing) {
                const totalCost = existing.avgPrice * existing.quantity + finalAmount;
                existing.quantity += finalQuantity;
                existing.avgPrice = totalCost / existing.quantity;
            } else {
                gameState.player.portfolio[type].push({
                    symbol: asset.symbol,
                    quantity: finalQuantity,
                    avgPrice: asset.price
                });
            }
            
            // Log asset purchase
            if (typeof logAssetChange === 'function') {
                logAssetChange(type, asset.symbol, finalQuantity, asset.price, 'buy');
            }
            
            addStory(`You invested ${formatMoney(finalAmount)} in ${asset.name}.`);
            closeModal();
            updateDisplay();
        };
    }
    if (cancelBtn) {
        cancelBtn.style.display = 'block';
        cancelBtn.textContent = 'Cancel';
        cancelBtn.onclick = closeModal;
    }
}

// Make function globally available
window.quickInvest = quickInvest;

function openSpendModal() {
    const modal = document.getElementById('action-modal');
    const modalBody = document.getElementById('modal-body');
    if (!modal || !modalBody) return;
    
    // Use modal manager
    if (typeof openModal === 'function') {
        if (!openModal('action-modal')) return;
    } else {
        modal.classList.add('active');
    }
    
    modalBody.innerHTML = `
        <p>Choose what to spend on:</p>
        <div style="margin-top: 20px;">
            <button class="action-btn" onclick="spendMoney('lifestyle', 500)" style="width: 100%; margin-bottom: 10px;">
                Lifestyle Expenses ($500)
            </button>
            <button class="action-btn" onclick="spendMoney('emergency', 1000)" style="width: 100%; margin-bottom: 10px;">
                Build Emergency Fund ($1,000)
            </button>
            <button class="action-btn" onclick="spendMoney('education', 800)" style="width: 100%; margin-bottom: 10px;">
                Financial Education ($800)
            </button>
        </div>
        <p style="margin-top: 20px; font-size: 0.9em; color: var(--text-secondary);">
            Be careful with spending - it affects your financial health!
        </p>
    `;
    document.getElementById('modal-title').textContent = 'Spend Money';
}

function spendMoney(type, amount) {
    if (gameState.player.cash >= amount) {
        gameState.player.cash -= amount;
        
        // Log expense
        if (typeof logTransaction === 'function') {
            logTransaction('expense', `Spent on ${type}`, -amount, {
                expenseType: type
            });
        }
        
        switch(type) {
            case 'lifestyle':
                addStory(`You spent ${formatMoney(amount)} on lifestyle expenses. Remember: lifestyle inflation can hurt your financial goals.`);
                break;
            case 'emergency':
                addStory(`You added ${formatMoney(amount)} to your emergency fund. Smart move!`);
                break;
            case 'education':
                addStory(`You invested ${formatMoney(amount)} in financial education. Knowledge is power!`);
                break;
        }
        
        closeModal();
        updateDisplay();
    } else {
        addStory('You don\'t have enough cash.');
    }
}

// Buy/Sell Functions
function openBuyModal(marketType, symbol) {
    const asset = gameState.markets[marketType].find(a => a.symbol === symbol);
    const modal = document.getElementById('action-modal');
    const modalBody = document.getElementById('modal-body');
    if (!modal || !modalBody) return;
    
    // Use modal manager - allow stacking on top of markets modal
    if (typeof openModal === 'function') {
        if (!openModal('action-modal', false, true)) return; // allowStacking = true
    } else {
        modal.classList.add('active');
    }
    
    modalBody.innerHTML = `
        <div class="modal-form-group">
            <label>Asset: ${asset.name} (${asset.symbol})</label>
            <div style="margin: 10px 0;">Current Price: ${formatMoney(asset.price)} ${asset.unit ? `per ${asset.unit}` : 'per share'}</div>
        </div>
        <div class="modal-form-group">
            <label>Buy By:</label>
            <select id="buy-mode" style="width: 100%; padding: 10px; background: var(--bg-dark); border: 2px solid var(--border-color); border-radius: 8px; color: var(--text-primary); margin-bottom: 10px;">
                <option value="amount">Amount ($)</option>
                <option value="quantity">Quantity (${asset.unit || 'shares'})</option>
            </select>
        </div>
        <div class="modal-form-group">
            <label id="buy-input-label">Amount to Invest ($):</label>
            <input type="number" id="buy-input" min="100" step="100" value="1000">
        </div>
        <div id="buy-preview" style="margin-top: 10px; color: var(--text-secondary);"></div>
    `;
    
    document.getElementById('modal-title').textContent = `Buy ${asset.name}`;
    
    // Show confirm and cancel buttons
    const confirmBtn = document.getElementById('modal-confirm');
    const cancelBtn = document.getElementById('modal-cancel');
    if (confirmBtn) {
        confirmBtn.style.display = 'block';
        confirmBtn.textContent = 'Confirm Purchase';
    }
    if (cancelBtn) {
        cancelBtn.style.display = 'block';
        cancelBtn.textContent = 'Cancel';
        cancelBtn.onclick = closeModal;
    }
    
    const modeSelect = document.getElementById('buy-mode');
    const input = document.getElementById('buy-input');
    const label = document.getElementById('buy-input-label');
    
    const updatePreview = () => {
        const mode = modeSelect.value;
        const value = parseFloat(input.value) || 0;
        
        if (mode === 'amount') {
            const quantity = value / asset.price;
            document.getElementById('buy-preview').textContent = 
                `You will buy ${quantity.toFixed(4)} ${asset.unit || 'shares'} for ${formatMoney(value)}`;
        } else {
            const totalCost = value * asset.price;
            document.getElementById('buy-preview').textContent = 
                `You will buy ${value.toFixed(4)} ${asset.unit || 'shares'} for ${formatMoney(totalCost)}`;
        }
    };
    
    modeSelect.addEventListener('change', () => {
        const mode = modeSelect.value;
        if (mode === 'amount') {
            label.textContent = 'Amount to Invest ($):';
            input.min = '100';
            input.step = '100';
            input.value = '1000';
        } else {
            label.textContent = `Quantity (${asset.unit || 'shares'}):`;
            input.min = '0.0001';
            input.step = '0.0001';
            input.value = '1';
        }
        updatePreview();
    });
    
    input.addEventListener('input', updatePreview);
    updatePreview();
    
    if (confirmBtn) {
        confirmBtn.onclick = () => {
            const mode = modeSelect.value;
            const value = parseFloat(input.value) || 0;
            
            if (value <= 0) {
                if (typeof showToast === 'function') {
                    showToast('Please enter a valid amount', 'error');
                }
                return;
            }
            
            if (mode === 'amount') {
                buyAsset(marketType, symbol, value);
            } else {
                buyAssetByQuantity(marketType, symbol, value);
            }
        };
    }
}

function buyAsset(marketType, symbol, amount) {
    if (gameState.player.cash < amount) {
        addStory('You don\'t have enough cash for this purchase.');
        closeModal();
        return;
    }
    
    const asset = gameState.markets[marketType].find(a => a.symbol === symbol);
    if (!asset) return;
    
    // Apply supply/demand pricing
    const actualPrice = typeof calculatePriceWithSupplyDemand === 'function' ? 
        calculatePriceWithSupplyDemand(marketType, symbol, asset.price) : asset.price;
    const quantity = amount / actualPrice;
    
    gameState.player.cash -= amount;
    const existing = gameState.player.portfolio[marketType].find(h => h.symbol === symbol);
    if (existing) {
        const totalCost = existing.avgPrice * existing.quantity + amount;
        existing.quantity += quantity;
        existing.avgPrice = totalCost / existing.quantity;
    } else {
        gameState.player.portfolio[marketType].push({
            symbol: symbol,
            quantity: quantity,
            avgPrice: actualPrice
        });
    }
    
    // Apply trading impact on supply/demand
    if (typeof applyTradingImpact === 'function') {
        applyTradingImpact(marketType, symbol, quantity, true);
    }
    
    // Gain experience
    if (typeof gainExperience === 'function') {
        gainExperience('trading', Math.min(10, quantity / 10));
    }
    
    // Log asset purchase
    if (typeof logAssetChange === 'function') {
        logAssetChange(marketType, symbol, quantity, actualPrice, 'buy');
    }
    
    addStory(`You bought ${quantity.toFixed(4)} ${asset.unit || 'shares'} of ${asset.name} for ${formatMoney(amount)}.`);
    closeModal();
    updateDisplay();
}

function buyAssetByQuantity(marketType, symbol, quantity) {
    const asset = gameState.markets[marketType].find(a => a.symbol === symbol);
    if (!asset) return;
    
    // Apply supply/demand pricing
    const actualPrice = typeof calculatePriceWithSupplyDemand === 'function' ? 
        calculatePriceWithSupplyDemand(marketType, symbol, asset.price) : asset.price;
    const amount = quantity * actualPrice;
    
    if (gameState.player.cash < amount) {
        addStory('You don\'t have enough cash for this purchase.');
        closeModal();
        return;
    }
    
    gameState.player.cash -= amount;
    const existing = gameState.player.portfolio[marketType].find(h => h.symbol === symbol);
    if (existing) {
        const totalCost = existing.avgPrice * existing.quantity + amount;
        existing.quantity += quantity;
        existing.avgPrice = totalCost / existing.quantity;
    } else {
        gameState.player.portfolio[marketType].push({
            symbol: symbol,
            quantity: quantity,
            avgPrice: actualPrice
        });
    }
    
    // Apply trading impact on supply/demand
    if (typeof applyTradingImpact === 'function') {
        applyTradingImpact(marketType, symbol, quantity, true);
    }
    
    // Gain experience
    if (typeof gainExperience === 'function') {
        gainExperience('trading', Math.min(10, quantity / 10));
    }
    
    // Log asset purchase
    if (typeof logAssetChange === 'function') {
        logAssetChange(marketType, symbol, quantity, actualPrice, 'buy');
    }
    
    addStory(`You bought ${quantity.toFixed(4)} ${asset.unit || 'shares'} of ${asset.name} for ${formatMoney(amount)}.`);
    closeModal();
    updateDisplay();
}

function openSellModal(marketType, symbol) {
    const holding = gameState.player.portfolio[marketType].find(h => h.symbol === symbol);
    if (!holding) {
        addStory('You don\'t own this asset.');
        return;
    }
    
    const asset = gameState.markets[marketType].find(a => a.symbol === symbol);
    const currentValue = asset.price * holding.quantity;
    const profit = currentValue - (holding.avgPrice * holding.quantity);
    
    const modal = document.getElementById('action-modal');
    const modalBody = document.getElementById('modal-body');
    if (!modal || !modalBody) return;
    
    // Use modal manager - allow stacking on top of markets modal
    if (typeof openModal === 'function') {
        if (!openModal('action-modal', false, true)) return; // allowStacking = true
    } else {
        modal.classList.add('active');
    }
    
    modalBody.innerHTML = `
        <div class="modal-form-group">
            <label>Asset: ${asset.name} (${asset.symbol})</label>
            <div style="margin: 10px 0;">Current Price: ${formatMoney(asset.price)}</div>
            <div style="margin: 10px 0;">You own: ${holding.quantity.toFixed(4)} ${asset.unit || 'shares'}</div>
            <div style="margin: 10px 0;">Current Value: ${formatMoney(currentValue)}</div>
            <div style="margin: 10px 0; color: ${profit >= 0 ? 'var(--success-color)' : 'var(--danger-color)'};">
                Profit/Loss: ${formatMoney(profit)} (${((profit / (holding.avgPrice * holding.quantity)) * 100).toFixed(2)}%)
            </div>
        </div>
        <div class="modal-form-group">
            <label>Quantity to Sell:</label>
            <input type="number" id="sell-quantity" min="0.0001" step="0.0001" max="${holding.quantity}" value="${holding.quantity}">
        </div>
        <div id="sell-preview" style="margin-top: 10px; color: var(--text-secondary);"></div>
    `;
    
    document.getElementById('modal-title').textContent = `Sell ${asset.name}`;
    
    // Show confirm and cancel buttons
    const confirmBtn = document.getElementById('modal-confirm');
    const cancelBtn = document.getElementById('modal-cancel');
    if (confirmBtn) {
        confirmBtn.style.display = 'block';
        confirmBtn.textContent = 'Confirm Sale';
    }
    if (cancelBtn) {
        cancelBtn.style.display = 'block';
        cancelBtn.textContent = 'Cancel';
        cancelBtn.onclick = closeModal;
    }
    
    const quantityInput = document.getElementById('sell-quantity');
    quantityInput.addEventListener('input', () => {
        const qty = parseFloat(quantityInput.value) || 0;
        const value = qty * asset.price;
        document.getElementById('sell-preview').textContent = 
            `You will receive ${formatMoney(value)} for ${qty.toFixed(4)} ${asset.unit || 'shares'}`;
    });
    
    if (confirmBtn) {
        confirmBtn.onclick = () => {
            const quantity = parseFloat(quantityInput.value) || 0;
            
            if (quantity <= 0) {
                if (typeof showToast === 'function') {
                    showToast('Please enter a valid quantity', 'error');
                }
                return;
            }
            
            if (quantity > holding.quantity) {
                if (typeof showToast === 'function') {
                    showToast('You don\'t own enough of this asset', 'error');
                }
                return;
            }
            
            sellAsset(marketType, symbol, quantity);
        };
    }
}

function sellAsset(marketType, symbol, quantity) {
    const holding = gameState.player.portfolio[marketType].find(h => h.symbol === symbol);
    if (!holding || holding.quantity < quantity) {
        addStory('You don\'t own enough of this asset.');
        closeModal();
        return;
    }
    
    const asset = gameState.markets[marketType].find(a => a.symbol === symbol);
    const value = quantity * asset.price;
    const profit = value - (holding.avgPrice * quantity);
    
    gameState.player.cash += value;
    holding.quantity -= quantity;
    
    if (holding.quantity < 0.0001) {
        const index = gameState.player.portfolio[marketType].indexOf(holding);
        gameState.player.portfolio[marketType].splice(index, 1);
    }
    
    // Log asset sale with profit/loss
    if (typeof logAssetChange === 'function') {
        logAssetChange(marketType, symbol, quantity, asset.price, 'sell', profit);
    }
    
    const profitText = profit >= 0 ? 
        `You made a profit of ${formatMoney(profit)}!` : 
        `You took a loss of ${formatMoney(Math.abs(profit))}.`;
    addStory(`You sold ${quantity.toFixed(4)} ${asset.unit || 'shares'} of ${asset.name} for ${formatMoney(value)}. ${profitText}`);
    closeModal();
    updateDisplay();
}

// Loan Management
function openLoanModal() {
    // Check loan eligibility
    if (typeof getMaxLoans === 'function') {
        const maxLoans = getMaxLoans();
        const currentLoans = gameState.player.loans.length;
        
        if (currentLoans >= maxLoans) {
            if (typeof showToast === 'function') {
                showToast(`You've reached the maximum number of loans (${maxLoans}). Improve your credit score or net worth to get more loans.`, 'error');
            }
            return;
        }
    }
    
    const modal = document.getElementById('action-modal');
    const modalBody = document.getElementById('modal-body');
    if (!modal || !modalBody) return;
    
    // Use modal manager
    if (typeof openModal === 'function') {
        if (!openModal('action-modal')) return;
    } else {
        modal.classList.add('active');
    }
    
    // Generate random loan terms
    const termOptions = [12, 24, 36, 48, 60]; // months
    const randomTerm = termOptions[Math.floor(Math.random() * termOptions.length)];
    const allowEarlyPayoff = Math.random() > 0.3; // 70% chance
    
    modalBody.innerHTML = `
        <div class="modal-form-group">
            <label>Loan Type:</label>
            <select id="loan-type">
                <option value="personal">Personal Loan (12% APR)</option>
                <option value="mortgage">Mortgage (6% APR)</option>
                <option value="credit">Credit Card (18% APR)</option>
                <option value="business">Business Loan (8% APR)</option>
            </select>
        </div>
        <div class="modal-form-group">
            <label>Loan Amount ($):</label>
            <input type="number" id="loan-amount" min="1000" step="1000" value="10000">
        </div>
        <div class="modal-form-group">
            <label>Loan Term:</label>
            <select id="loan-term">
                <option value="12">12 months</option>
                <option value="24">24 months</option>
                <option value="36" selected>36 months</option>
                <option value="48">48 months</option>
                <option value="60">60 months</option>
            </select>
        </div>
        <div class="modal-form-group">
            <label>
                <input type="checkbox" id="allow-early-payoff" ${allowEarlyPayoff ? 'checked' : ''}>
                Allow Early Payoff
            </label>
        </div>
        <div id="loan-preview" style="margin-top: 10px; color: var(--text-secondary);"></div>
        ${typeof getMaxLoans === 'function' ? `
            <div style="margin-top: 15px; padding: 10px; background: var(--bg-dark); border-radius: 8px; font-size: 0.9em;">
                <strong>Loan Eligibility:</strong><br>
                Max Loans: ${getMaxLoans()}<br>
                Current Loans: ${gameState.player.loans.length}<br>
                Available Slots: ${getMaxLoans() - gameState.player.loans.length}
            </div>
        ` : ''}
        <p style="margin-top: 15px; font-size: 0.9em; color: var(--warning-color);">
            ⚠️ Loans accrue interest monthly. Make sure you can afford the payments!
        </p>
    `;
    
    document.getElementById('modal-title').textContent = 'Take a Loan';
    
    const loanTypeSelect = document.getElementById('loan-type');
    const amountInput = document.getElementById('loan-amount');
    const termSelect = document.getElementById('loan-term');
    
    const updatePreview = () => {
        const type = loanTypeSelect.value;
        const amount = parseFloat(amountInput.value) || 0;
        const term = parseInt(termSelect.value) || 36;
        const rates = { personal: 0.12, mortgage: 0.06, credit: 0.18, business: 0.08 };
        const rate = rates[type];
        const monthlyInterest = amount * rate / 12;
        const principalPayment = amount / term;
        const minPayment = monthlyInterest + principalPayment;
        const totalInterest = monthlyInterest * term;
        const totalCost = amount + totalInterest;
        
        document.getElementById('loan-preview').innerHTML = `
            <strong>Loan Details:</strong><br>
            Interest Rate: ${(rate * 100).toFixed(2)}% APR<br>
            Term: ${term} months<br>
            Monthly Interest: ${formatMoney(monthlyInterest)}<br>
            Estimated Monthly Payment: ${formatMoney(minPayment)}<br>
            Total Interest: ${formatMoney(totalInterest)}<br>
            Total Cost: ${formatMoney(totalCost)}
        `;
    };
    
    loanTypeSelect.addEventListener('change', updatePreview);
    amountInput.addEventListener('input', updatePreview);
    termSelect.addEventListener('change', updatePreview);
    updatePreview();
    
    document.getElementById('modal-confirm').onclick = () => {
        const type = loanTypeSelect.value;
        const amount = parseFloat(amountInput.value) || 0;
        const term = parseInt(termSelect.value) || 36;
        const allowEarly = document.getElementById('allow-early-payoff').checked;
        takeLoan(type, amount, term, allowEarly);
    };
}

function takeLoan(type, amount, term, allowEarlyPayoff) {
    if (amount < 1000) {
        if (typeof showToast === 'function') {
            showToast('Minimum loan amount is $1,000.', 'error');
        }
        closeModal();
        return;
    }
    
    // Check loan limits
    if (typeof getMaxLoans === 'function') {
        const maxLoans = getMaxLoans();
        if (gameState.player.loans.length >= maxLoans) {
            if (typeof showToast === 'function') {
                showToast(`You've reached the maximum number of loans (${maxLoans}).`, 'error');
            }
            closeModal();
            return;
        }
    }
    
    // Check available credit
    if (typeof calculateTotalCreditLimit === 'function') {
        const totalCreditLimit = calculateTotalCreditLimit();
        const usedCredit = gameState.player.loans.reduce((sum, loan) => sum + loan.principal, 0);
        const availableCredit = totalCreditLimit - usedCredit;
        
        if (amount > availableCredit) {
            if (typeof showToast === 'function') {
                showToast(`Loan amount exceeds available credit. Maximum: ${formatMoney(availableCredit)}`, 'error');
            }
            closeModal();
            return;
        }
    }
    
    const rates = { personal: 0.12, mortgage: 0.06, credit: 0.18, business: 0.08 };
    const rate = rates[type];
    const names = { personal: 'Personal Loan', mortgage: 'Mortgage', credit: 'Credit Card', business: 'Business Loan' };
    
    gameState.player.cash += amount;
    gameState.player.loans.push({
        name: names[type],
        principal: amount,
        interestRate: rate,
        type: type,
        terms: {
            duration: term,
            allowEarlyPayoff: allowEarlyPayoff,
            startTurn: gameState.turn
        }
    });
    
    // Record credit inquiry
    if (typeof bankSystem !== 'undefined') {
        bankSystem.creditHistory.push({
            turn: gameState.turn,
            type: 'credit_inquiry',
            amount: amount
        });
    }
    
    // Log loan transaction
    if (typeof logTransaction === 'function') {
        logTransaction('loan', `Took out ${names[type]}`, amount, {
            loanType: type,
            interestRate: rate,
            term: term,
            allowEarlyPayoff: allowEarlyPayoff
        });
    }
    
    if (typeof showToast === 'function') {
        showToast(`Loan approved! ${formatMoney(amount)} at ${(rate * 100).toFixed(2)}% APR for ${term} months.`, 'success');
    }
    addStory(`You took out a ${names[type]} for ${formatMoney(amount)} at ${(rate * 100).toFixed(2)}% APR for ${term} months.`);
    closeModal();
    updateDisplay();
}

// Property Management
function openPropertyModal() {
    const modal = document.getElementById('action-modal');
    const modalBody = document.getElementById('modal-body');
    if (!modal || !modalBody) return;
    
    // Use modal manager
    if (typeof openModal === 'function') {
        if (!openModal('action-modal')) return;
    } else {
        modal.classList.add('active');
    }
    
    const properties = [
        { name: 'Small Apartment', price: 80000, income: 600, upkeep: 0.01, deterioration: 0.5 },
        { name: 'House', price: 200000, income: 1200, upkeep: 0.015, deterioration: 0.3 },
        { name: 'Commercial Property', price: 500000, income: 4000, upkeep: 0.02, deterioration: 0.4 },
        { name: 'Rental Property', price: 150000, income: 1500, upkeep: 0.012, deterioration: 0.35 }
    ];
    
    modalBody.innerHTML = `
        <p>Choose a property to purchase:</p>
        <div style="margin-top: 20px;">
            ${properties.map((prop, index) => `
                <div style="background: var(--bg-dark); padding: 15px; margin-bottom: 10px; border-radius: 8px; border: 2px solid var(--border-color); cursor: pointer; transition: all 0.2s;" 
                     onclick="openPropertyPurchaseModal(${index})" id="prop-${index}" onmouseover="this.style.borderColor='var(--secondary-color)'; this.style.transform='scale(1.02)'" onmouseout="this.style.borderColor='var(--border-color)'; this.style.transform='scale(1)'">
                    <strong>${prop.name}</strong><br>
                    <div style="font-size: 0.9em; margin-top: 5px;">
                        Price: ${formatMoney(prop.price)}<br>
                        Monthly Income: ${formatMoney(prop.income)}<br>
                        Monthly Upkeep: ${formatMoney(prop.price * prop.upkeep / 12)}<br>
                        Net Monthly: ${formatMoney(prop.income - prop.price * prop.upkeep / 12)}
                    </div>
                </div>
            `).join('')}
        </div>
        <input type="hidden" id="selected-property" value="">
    `;
    
    document.getElementById('modal-title').textContent = 'Buy Property';
    
    // Store properties globally for purchase modal
    window.propertiesList = properties;
    
    // Hide confirm button - properties will open purchase modal
    const confirmBtn = document.getElementById('modal-confirm');
    const cancelBtn = document.getElementById('modal-cancel');
    if (confirmBtn) confirmBtn.style.display = 'none';
    if (cancelBtn) {
        cancelBtn.style.display = 'block';
        cancelBtn.textContent = 'Close';
        cancelBtn.onclick = closeModal;
    }
}

// Open property purchase confirmation modal
function openPropertyPurchaseModal(index) {
    const properties = window.propertiesList || [];
    if (index < 0 || index >= properties.length) return;
    
    const property = properties[index];
    const modal = document.getElementById('action-modal');
    const modalBody = document.getElementById('modal-body');
    if (!modal || !modalBody) return;
    
    // Use modal manager - allow stacking
    if (typeof openModal === 'function') {
        openModal('action-modal', false, true);
    } else {
        modal.classList.add('active');
    }
    
    const canAfford = gameState.player.cash >= property.price;
    const monthlyUpkeep = property.price * property.upkeep / 12;
    const netMonthlyIncome = property.income - monthlyUpkeep;
    
    modalBody.innerHTML = `
        <div style="background: var(--bg-dark); padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <h3 style="margin-top: 0;">${property.name}</h3>
            <div class="stat-grid">
                <div class="stat-item">
                    <label>Purchase Price:</label>
                    <span class="money">${formatMoney(property.price)}</span>
                </div>
                <div class="stat-item">
                    <label>Monthly Income:</label>
                    <span class="money positive">${formatMoney(property.income)}</span>
                </div>
                <div class="stat-item">
                    <label>Monthly Upkeep:</label>
                    <span class="money negative">${formatMoney(monthlyUpkeep)}</span>
                </div>
                <div class="stat-item">
                    <label>Net Monthly Income:</label>
                    <span class="money ${netMonthlyIncome >= 0 ? 'positive' : 'negative'}">${formatMoney(netMonthlyIncome)}</span>
                </div>
                <div class="stat-item">
                    <label>Your Cash:</label>
                    <span class="money ${canAfford ? '' : 'negative'}">${formatMoney(gameState.player.cash)}</span>
                </div>
                <div class="stat-item">
                    <label>After Purchase:</label>
                    <span class="money ${canAfford ? '' : 'negative'}">${formatMoney(gameState.player.cash - property.price)}</span>
                </div>
            </div>
            ${!canAfford ? `
                <div style="margin-top: 15px; padding: 10px; background: rgba(239, 68, 68, 0.1); border-left: 4px solid var(--danger-color); border-radius: 8px;">
                    <strong>⚠️ Insufficient Funds</strong><br>
                    You need ${formatMoney(property.price - gameState.player.cash)} more to purchase this property.
                </div>
            ` : ''}
        </div>
    `;
    
    document.getElementById('modal-title').textContent = `Purchase: ${property.name}`;
    
    const confirmBtn = document.getElementById('modal-confirm');
    const cancelBtn = document.getElementById('modal-cancel');
    if (confirmBtn) {
        confirmBtn.style.display = 'block';
        confirmBtn.textContent = 'Confirm Purchase';
        confirmBtn.disabled = !canAfford;
        confirmBtn.onclick = () => {
            if (canAfford) {
                buyProperty(property);
            }
        };
    }
    if (cancelBtn) {
        cancelBtn.style.display = 'block';
        cancelBtn.textContent = 'Cancel';
        cancelBtn.onclick = closeModal;
    }
}

// Make function globally available
window.openPropertyPurchaseModal = openPropertyPurchaseModal;

function buyProperty(property) {
    if (gameState.player.cash < property.price) {
        addStory(`You don't have enough cash. You need ${formatMoney(property.price)}.`);
        closeModal();
        return;
    }
    
    gameState.player.cash -= property.price;
    gameState.player.properties.push({
        name: property.name,
        value: property.price,
        monthlyIncome: property.income,
        upkeepRate: property.upkeep,
        deteriorationRate: property.deterioration,
        condition: 100
    });
    
    // Check if this satisfies housing need
    if (property.name.includes('House') || property.name.includes('Apartment')) {
        gameState.player.ownsHouse = true;
        const housingNeed = gameState.player.needs?.find(n => n.id === 'housing');
        if (housingNeed) {
            housingNeed.satisfied = true;
            housingNeed.unmetTurns = 0;
        }
    }
    
    // Log property purchase
    if (typeof logTransaction === 'function') {
        logTransaction('property', `Purchased ${property.name}`, -property.price, {
            propertyType: property.name,
            monthlyIncome: property.income
        });
    }
    
    addStory(`You purchased ${property.name} for ${formatMoney(property.price)}. It will generate ${formatMoney(property.income)} monthly income.`);
    closeModal();
    updateDisplay();
    if (typeof updateNeedsDisplay === 'function') {
        updateNeedsDisplay();
    }
}

// Modal Functions
// closeModal is now handled by modal-manager.js
function closeModal() {
    if (typeof closeModalById === 'function') {
        closeModalById('action-modal');
    } else {
        const modal = document.getElementById('action-modal');
        if (modal) modal.classList.remove('active');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.close').addEventListener('click', closeModal);
    document.getElementById('modal-cancel').addEventListener('click', closeModal);
    
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('action-modal');
        if (e.target === modal) {
            closeModal();
        }
    });
});

// Calculate Taxes (Legacy function - kept for compatibility)
function calculateTaxes() {
    // Tax on income earned this turn (work income + property income)
    const taxableIncome = gameState.player.monthlyStats.income || 
                         (gameState.player.properties.reduce((sum, p) => sum + (p.monthlyIncome || 0), 0));
    const taxRate = 0.15; // 15% tax rate
    const taxes = taxableIncome * taxRate;
    return taxes;
}

// Process Loans
function processLoans() {
    let totalLoanPayments = 0;
    gameState.player.loans.forEach(loan => {
        // Calculate interest
        const monthlyInterest = loan.principal * loan.interestRate / 12;
        loan.principal += monthlyInterest; // Compound interest
        
        // Calculate payment based on term
        let minPayment;
        if (loan.terms && loan.terms.duration) {
            const remainingMonths = loan.terms.duration - (gameState.turn - loan.terms.startTurn);
            if (remainingMonths > 0) {
                const principalPayment = loan.principal / remainingMonths;
                minPayment = monthlyInterest + principalPayment;
            } else {
                minPayment = loan.principal; // Pay off remaining
            }
        } else {
            // Fallback for old loans without terms
            minPayment = Math.max(loan.principal * 0.02, monthlyInterest + 100);
        }
        
        const payment = Math.min(minPayment, loan.principal);
        
        if (gameState.player.cash >= payment) {
            gameState.player.cash -= payment;
            loan.principal -= payment;
            totalLoanPayments += payment;
            
            // Record on-time payment
            if (typeof bankSystem !== 'undefined') {
                bankSystem.creditHistory.push({
                    turn: gameState.turn,
                    type: 'payment',
                    amount: payment
                });
            }
            
            // Log loan payment
            if (typeof logTransaction === 'function') {
                logTransaction('loan', `Loan payment: ${loan.name}`, -payment, {
                    loanName: loan.name,
                    remainingPrincipal: loan.principal
                });
            }
            
            if (loan.principal < 1) {
                loan.principal = 0;
            }
        } else {
            // Can't pay - penalty
            loan.principal += monthlyInterest * 0.5; // Late fee
            
            // Record missed payment
            if (typeof bankSystem !== 'undefined') {
                bankSystem.creditHistory.push({
                    turn: gameState.turn,
                    type: 'missed_payment',
                    amount: payment
                });
            }
            
            // Log missed payment
            if (typeof logEvent === 'function') {
                logEvent('negative', 'Missed Loan Payment', `Unable to make payment for ${loan.name}. Late fees applied.`, {
                    loanName: loan.name,
                    amount: payment
                });
            }
            
            addStory(`⚠️ Warning: Unable to make loan payment for ${loan.name}. Late fees applied.`);
            if (typeof showToast === 'function') {
                showToast(`Missed payment on ${loan.name}. Credit score may be affected.`, 'warning');
            }
        }
    });
    
    // Remove paid-off loans
    const beforeCount = gameState.player.loans.length;
    gameState.player.loans = gameState.player.loans.filter(loan => loan.principal > 0);
    
    if (gameState.player.loans.length < beforeCount) {
        if (typeof showToast === 'function') {
            showToast('Loan paid off! Credit score improved.', 'success');
        }
    }
    
    return totalLoanPayments;
}

// Process Property Upkeep
function processPropertyUpkeep() {
    let totalUpkeep = 0;
    gameState.player.properties.forEach(property => {
        const upkeep = property.value * property.upkeepRate / 12;
        if (gameState.player.cash >= upkeep) {
            gameState.player.cash -= upkeep;
            totalUpkeep += upkeep;
            
            // Log property upkeep expense
            if (typeof logTransaction === 'function') {
                logTransaction('expense', `Property upkeep: ${property.name}`, -upkeep, {
                    expenseType: 'property_upkeep',
                    propertyName: property.name
                });
            }
        } else {
            // Can't afford upkeep - property deteriorates faster
            addStory(`⚠️ Warning: Can't afford upkeep for ${property.name}. Property condition deteriorating.`);
            
            // Log missed upkeep
            if (typeof logEvent === 'function') {
                logEvent('negative', 'Missed Property Upkeep', `Couldn't afford upkeep for ${property.name}`, {
                    propertyName: property.name,
                    amount: upkeep
                });
            }
        }
        
        // Property deterioration
        property.condition = Math.max(0, property.condition - property.deteriorationRate);
        if (property.condition < 50) {
            property.value *= 0.995; // Value decreases with poor condition
            property.monthlyIncome *= 0.99; // Income decreases too
        }
    });
    return totalUpkeep;
}

// Calculate Investment Returns
function calculateInvestmentReturns() {
    let totalReturns = 0;
    const previousTurn = gameState.turn - 1;
    
    Object.keys(gameState.player.portfolio).forEach(marketType => {
        gameState.player.portfolio[marketType].forEach(holding => {
            const asset = gameState.markets[marketType].find(a => a.symbol === holding.symbol);
            if (asset) {
                const currentValue = asset.price * holding.quantity;
                const costBasis = holding.avgPrice * holding.quantity;
                const profit = currentValue - costBasis;
                
                // Track investment history
                const historyEntry = {
                    turn: gameState.turn,
                    marketType: marketType,
                    symbol: holding.symbol,
                    quantity: holding.quantity,
                    costBasis: costBasis,
                    currentValue: currentValue,
                    profit: profit,
                    returnPercent: ((profit / costBasis) * 100) || 0
                };
                
                gameState.player.investmentHistory.push(historyEntry);
                if (gameState.player.investmentHistory.length > 100) {
                    gameState.player.investmentHistory.shift();
                }
                
                // For bonds, calculate interest separately
                if (marketType === 'bonds') {
                    const bond = asset;
                    if (bond.yield) {
                        const interest = holding.quantity * bond.basePrice * bond.yield / 12;
                        totalReturns += interest;
                        
                        // Log bond interest (will be logged in nextTurn where this is called)
                    }
                }
            }
        });
    });
    
    return totalReturns;
}

// Turn System
function nextTurn() {
    gameState.turn++;
    if (gameState.turn % 12 === 1 && gameState.turn > 1) {
        gameState.year++;
    }
    
    // Update luck (fluctuates each turn)
    if (typeof updateLuck === 'function') {
        updateLuck();
    }
    
    // Update supply and demand
    if (typeof updateSupplyAndDemand === 'function') {
        updateSupplyAndDemand();
    }
    
    // Update markets with supply/demand pricing
    updateMarkets();
    
    // Apply supply/demand to market prices
    if (typeof calculatePriceWithSupplyDemand === 'function') {
        Object.keys(gameState.markets).forEach(marketType => {
            gameState.markets[marketType].forEach(asset => {
                const newPrice = calculatePriceWithSupplyDemand(marketType, asset.symbol, asset.basePrice);
                asset.price = newPrice;
            });
        });
    }
    
    // Reset monthly stats for this new turn
    gameState.player.monthlyStats = {
        income: 0,
        incomeFromWork: 0,      // Salary/work income
        incomeFromAssets: 0,    // Property, business, investment returns
        expenses: 0,
        expensesNeeds: 0,      // Basic needs (housing, food, etc.)
        expensesLifestyle: 0,   // Lifestyle expenses
        expensesDebt: 0,        // Loan payments
        expensesOther: 0,       // Other expenses (upkeep, etc.)
        taxes: 0,
        loanPayments: 0,
        propertyUpkeep: 0,
        investmentReturns: 0,
        netChange: 0
    };
    
    // Process job/salary income (work income)
    if (typeof jobMarketSystem !== 'undefined' && jobMarketSystem.playerJob) {
        const salary = jobMarketSystem.playerJob.baseSalary;
        gameState.player.cash += salary;
        gameState.player.monthlyStats.income += salary;
        gameState.player.monthlyStats.incomeFromWork += salary;
        
        // Process job turn (experience, promotions, etc.)
        if (typeof processJobTurn === 'function') {
            processJobTurn();
        }
        
        // Log salary
        if (salary > 0 && typeof logTransaction === 'function') {
            logTransaction('income', `Salary from ${jobMarketSystem.playerJob.title}`, salary, {
                incomeType: 'salary',
                jobId: jobMarketSystem.playerJob.id
            });
        }
    }
    
    // Process property income (passive income - assets)
    let propertyIncome = 0;
    gameState.player.properties.forEach(property => {
        if (property.monthlyIncome) {
            propertyIncome += property.monthlyIncome;
        }
    });
    gameState.player.cash += propertyIncome;
    gameState.player.monthlyStats.income += propertyIncome;
    gameState.player.monthlyStats.incomeFromAssets += propertyIncome;
    
    // Log property income
    if (propertyIncome > 0 && typeof logTransaction === 'function') {
        logTransaction('income', 'Property rental income', propertyIncome, {
            incomeType: 'property',
            propertyCount: gameState.player.properties.length
        });
    }
    
    // Process business income (assets)
    if (typeof opportunitiesSystem !== 'undefined' && opportunitiesSystem.playerBusinesses) {
        let businessIncome = 0;
        opportunitiesSystem.playerBusinesses.forEach(business => {
            if (business.monthlyIncome) {
                // Business income can vary
                const income = business.monthlyIncome * (0.8 + Math.random() * 0.4);
                businessIncome += income;
            }
        });
        gameState.player.cash += businessIncome;
        gameState.player.monthlyStats.income += businessIncome;
        gameState.player.monthlyStats.incomeFromAssets += businessIncome;
        
        // Log business income
        if (businessIncome > 0 && typeof logTransaction === 'function') {
            logTransaction('income', 'Business income', businessIncome, {
                incomeType: 'business',
                businessCount: opportunitiesSystem.playerBusinesses.length
            });
        }
    }
    
    // Process quick investment products
    if (typeof processInvestmentProducts === 'function') {
        const productReturns = processInvestmentProducts();
        gameState.player.monthlyStats.incomeFromAssets += productReturns;
    }
    
    // Process skill learning
    if (typeof processSkillLearning === 'function') {
        processSkillLearning();
    }
    
    // Process auctions (decrease time left, check for wins)
    if (typeof opportunitiesSystem !== 'undefined' && opportunitiesSystem.currentOpportunities) {
        opportunitiesSystem.currentOpportunities.auctions.forEach(auction => {
            auction.timeLeft--;
            if (auction.timeLeft <= 0) {
                // Auction ended - player wins if they have highest bid
                // For now, just remove expired auctions
                const index = opportunitiesSystem.currentOpportunities.auctions.indexOf(auction);
                if (index > -1) {
                    opportunitiesSystem.currentOpportunities.auctions.splice(index, 1);
                }
            }
        });
    }
    
    // Generate new opportunities and show toast if important
    if (typeof generateOpportunities === 'function') {
        const beforeCount = {
            businesses: opportunitiesSystem.currentOpportunities.businesses.length,
            auctions: opportunitiesSystem.currentOpportunities.auctions.length,
            properties: opportunitiesSystem.currentOpportunities.properties.length
        };
        
        generateOpportunities();
        
        const afterCount = {
            businesses: opportunitiesSystem.currentOpportunities.businesses.length,
            auctions: opportunitiesSystem.currentOpportunities.auctions.length,
            properties: opportunitiesSystem.currentOpportunities.properties.length
        };
        
        // Show toast for new opportunities
        if (afterCount.businesses > beforeCount.businesses && typeof showToast === 'function') {
            showToast('💼 New business opportunities available!', 'info', 5000);
        }
        if (afterCount.auctions > beforeCount.auctions && typeof showToast === 'function') {
            showToast('🔨 New auctions starting!', 'warning', 5000);
        }
        if (afterCount.properties > beforeCount.properties && typeof showToast === 'function') {
            showToast('🏠 Special property deals available!', 'info', 5000);
        }
    }
    
    // Generate new jobs in job market
    if (typeof generateAvailableJobs === 'function') {
        generateAvailableJobs();
    }
    
    // Process contact events
    if (typeof processContactEvents === 'function') {
        processContactEvents();
    }
    
    // Process event effects (duration tracking)
    if (typeof processEventEffects === 'function') {
        processEventEffects();
    }
    
    // Process AI actions (before player actions affect markets)
    if (gameState.aiInitialized && typeof processAITrading === 'function') {
        processAITrading();
        checkAITargetingPlayer();
    }
    
    // Process needs and wants (if system is initialized)
    if (gameState.needsInitialized && typeof checkNeedsSatisfaction === 'function') {
        checkNeedsSatisfaction();
        applyNeedsImpacts();
        processRandomExpenses();
    }
    
    // Process expenses (separated by category)
    let baseExpenses = gameState.player.monthlyExpenses;
    let needsExpenses = 0;
    let lifestyleExpenses = 0;
    
    // Calculate needs expenses (from needs system)
    if (gameState.needsInitialized && gameState.player.needs) {
        gameState.player.needs.forEach(need => {
            if (need.satisfied && need.cost) {
                needsExpenses += need.cost;
            }
        });
    }
    
    // Lifestyle expenses (base expenses minus needs)
    lifestyleExpenses = baseExpenses - needsExpenses;
    if (lifestyleExpenses < 0) lifestyleExpenses = 0;
    
    // Apply bad habit effects (adds to lifestyle expenses)
    gameState.player.badHabits.forEach(habit => {
        if (habit.effect.expenseIncrease) {
            lifestyleExpenses += gameState.player.monthlyExpenses * habit.effect.expenseIncrease;
        }
        if (habit.effect.monthlyPayment) {
            gameState.player.monthlyStats.expensesDebt += habit.effect.monthlyPayment;
        }
    });
    
    const totalExpenses = needsExpenses + lifestyleExpenses + gameState.player.monthlyStats.expensesDebt;
    
    gameState.player.cash -= totalExpenses;
    gameState.player.monthlyStats.expenses = totalExpenses;
    gameState.player.monthlyStats.expensesNeeds = needsExpenses;
    gameState.player.monthlyStats.expensesLifestyle = lifestyleExpenses;
    
    // Process taxes (enhanced tax system)
    let taxes = 0;
    if (typeof processMonthlyTaxes === 'function') {
        taxes = processMonthlyTaxes();
    } else {
        taxes = calculateTaxes(); // Fallback to old system
    }
    gameState.player.cash -= taxes;
    gameState.player.monthlyStats.taxes = taxes;
    
    // Annual tax reconciliation (at end of year)
    if (gameState.turn % 12 === 0 && typeof reconcileAnnualTaxes === 'function') {
        reconcileAnnualTaxes();
    }
    
    // Process insurance premiums
    if (typeof processInsurancePremiums === 'function') {
        const insurancePremiums = processInsurancePremiums();
        gameState.player.monthlyStats.expenses += insurancePremiums;
        gameState.player.monthlyStats.expensesOther += insurancePremiums;
    }
    
    // Process family expenses
    if (typeof processFamilyTurn === 'function') {
        processFamilyTurn();
    }
    
    // Process active scenario
    if (typeof processActiveScenario === 'function') {
        processActiveScenario();
    }
    
    // Record analytics data
    if (typeof recordPerformanceData === 'function') {
        recordPerformanceData();
    }
    
    // Update goals progress
    if (typeof updateGoalsProgress === 'function') {
        updateGoalsProgress();
    }
    
    // Log tax payment
    if (taxes > 0 && typeof logTransaction === 'function') {
        logTransaction('tax', 'Income tax payment', -taxes, {
            taxableIncome: gameState.player.monthlyStats.income
        });
    }
    
    // Process loans
    const loanPayments = processLoans();
    gameState.player.monthlyStats.loanPayments = loanPayments;
    
    // Process property deterioration
    if (typeof processPropertyDeterioration === 'function') {
        processPropertyDeterioration();
    }
    
    // Process property upkeep (other expenses)
    const propertyUpkeep = processPropertyUpkeep();
    gameState.player.monthlyStats.propertyUpkeep = propertyUpkeep;
    gameState.player.monthlyStats.expensesOther += propertyUpkeep;
    
    // Calculate investment returns (bonds interest, dividends, etc.) - from portfolio
    const investmentReturns = calculateInvestmentReturns();
    gameState.player.cash += investmentReturns;
    gameState.player.monthlyStats.investmentReturns = investmentReturns;
    gameState.player.monthlyStats.incomeFromAssets += investmentReturns;
    
    // Log investment returns
    if (investmentReturns > 0 && typeof logTransaction === 'function') {
        logTransaction('income', 'Investment returns (bonds interest)', investmentReturns, {
            incomeType: 'investment'
        });
    }
    
    // Calculate net change
    gameState.player.monthlyStats.netChange = 
        gameState.player.monthlyStats.income - 
        gameState.player.monthlyStats.expenses - 
        gameState.player.monthlyStats.taxes - 
        gameState.player.monthlyStats.loanPayments - 
        gameState.player.monthlyStats.propertyUpkeep + 
        gameState.player.monthlyStats.investmentReturns;
    
    // Reset work flag for new turn
    gameState.hasWorkedThisTurn = false;
    
    // Generate and process random events
    if (typeof generateRandomEvent === 'function') {
        if (Math.random() < 0.4) {
            const event = generateRandomEvent();
            if (event) {
                event.turn = gameState.turn;
                expandedEvents.events.push(event);
                applyEventEffect(event);
                triggerRandomEvent(event);
            }
        }
    } else {
        // Fallback to old system
        if (Math.random() < 0.4) {
            triggerRandomEvent();
        }
    }
    
    // Generate offers
    if (typeof generateOffer === 'function') {
        const offer = generateOffer();
        if (offer && typeof showToast === 'function') {
            showToast(`💼 New offer available: ${offer.title}`, 'info', 4000);
        }
    }
    
    // Generate incidents
    if (typeof generateIncident === 'function') {
        const incident = generateIncident();
        if (incident) {
            applyEventEffect(incident);
            if (typeof showToast === 'function') {
                showToast(`⚠️ ${incident.title}`, 'warning', 5000);
            }
        }
    }
    
    // Process active incidents
    if (typeof processActiveIncidents === 'function') {
        processActiveIncidents();
    }
    
    // Process active offers (remove expired)
    if (typeof processActiveOffers === 'function') {
        processActiveOffers();
    }
    
    // Check achievements
    if (typeof checkAchievements === 'function') {
        checkAchievements();
    }
    
    // Check milestones
    if (typeof checkMilestones === 'function') {
        checkMilestones();
    }
    
    // Check for new bad habits
    if (Math.random() < 0.15 && gameState.player.badHabits.length < 3) {
        const availableHabits = badHabits.filter(h => 
            !gameState.player.badHabits.some(bh => bh.name === h.name)
        );
        if (availableHabits.length > 0) {
            const newHabit = availableHabits[Math.floor(Math.random() * availableHabits.length)];
            gameState.player.badHabits.push(newHabit);
            addStory(`⚠️ You developed a bad financial habit: ${newHabit.name}. ${newHabit.description}`);
        }
    }
    
    // Check win condition (EXTREME difficulty - designed for weeks/months of gameplay)
    const victoryNetWorth = 50000000; // $50 million (extremely difficult)
    const victoryHealth = 95; // Near-perfect financial health
    const minProperties = 10; // Must own at least 10 properties
    const minBusinesses = 5; // Must own at least 5 businesses
    const minSkills = 25; // Must have learned at least 25 skills
    const minTurnCount = 200; // Must have played at least 200 turns (16+ years in-game)
    const minCreditScore = 800; // Excellent credit score
    const minPassiveIncome = 500000; // $500k monthly passive income
    
    // Calculate passive income (properties + businesses + investments)
    const victoryPropertyIncome = gameState.player.properties.reduce((sum, prop) => sum + (prop.monthlyIncome || 0), 0);
    const businessIncome = (typeof opportunitiesSystem !== 'undefined' && opportunitiesSystem.playerBusinesses) ?
        opportunitiesSystem.playerBusinesses.reduce((sum, biz) => sum + (biz.monthlyIncome || 0), 0) : 0;
    const investmentIncome = gameState.player.monthlyStats.investmentReturns || 0;
    const totalPassiveIncome = victoryPropertyIncome + businessIncome + investmentIncome;
    
    // Count learned skills
    let learnedSkillsCount = 0;
    if (typeof skillTreeSystem !== 'undefined') {
        Object.keys(skillTreeSystem.skills).forEach(skillId => {
            if (skillTreeSystem.skills[skillId].learned) {
                learnedSkillsCount++;
            }
        });
    }
    
    // Check all victory conditions
    const hasNetWorth = gameState.player.netWorth >= victoryNetWorth;
    const hasHealth = gameState.player.financialHealth >= victoryHealth;
    const hasProperties = gameState.player.properties.length >= minProperties;
    const hasBusinesses = (typeof opportunitiesSystem !== 'undefined' && opportunitiesSystem.playerBusinesses) ?
        opportunitiesSystem.playerBusinesses.length >= minBusinesses : false;
    const hasSkills = learnedSkillsCount >= minSkills;
    const hasTurns = gameState.turn >= minTurnCount;
    const hasCredit = (typeof bankSystem !== 'undefined' && bankSystem.creditScore) ?
        bankSystem.creditScore >= minCreditScore : false;
    const hasPassiveIncome = totalPassiveIncome >= minPassiveIncome;
    
    // Only show victory if ALL conditions are met
    if (hasNetWorth && hasHealth && hasProperties && hasBusinesses && hasSkills && hasTurns && hasCredit && hasPassiveIncome) {
        if (typeof showVictoryModal === 'function') {
            showVictoryModal();
        }
    }
    
    // Update credit score each turn
    if (typeof calculateCreditScore === 'function') {
        calculateCreditScore();
    }
    
    updateDisplay();
    if (typeof updateNeedsDisplay === 'function') {
        updateNeedsDisplay();
    }
    if (typeof updateAIDisplay === 'function') {
        updateAIDisplay();
    }
    
    // Active effects are now shown in modal, no need to update dashboard
    
    // Update badges for new items/events
    if (typeof updateBadges === 'function') {
        updateBadges();
    }
    
    addStory(storyTemplates[Math.floor(Math.random() * storyTemplates.length)]);
    
    // Show turn summary modal
    if (typeof displayTurnSummary === 'function') {
        // Delay slightly to ensure all updates are complete
        setTimeout(() => {
            displayTurnSummary();
        }, 500);
    }
}

function triggerRandomEvent(customEvent = null) {
    const event = customEvent || randomEvents[Math.floor(Math.random() * randomEvents.length)];
    gameState.currentEvent = event;
    
    // Log event
    if (typeof logEvent === 'function') {
        logEvent(event.type, event.title, event.description, event.effect);
    }
    
    const eventsDisplay = document.getElementById('events-display');
    if (!eventsDisplay) return; // Fix: Check if element exists
    
    const eventClass = event.type === 'positive' ? 'positive' : event.type === 'negative' ? 'negative' : 'neutral';
    const eventId = `event_${Date.now()}`;
    
    // Escape event for onclick
    const eventJson = JSON.stringify(event).replace(/'/g, "\\'").replace(/"/g, '&quot;');
    
    eventsDisplay.innerHTML = `
        <div class="event-item ${eventClass}" onclick="showEventDetailsFromString('${eventJson}')" style="cursor: pointer; transition: all 0.2s;" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
            <strong>${event.title}</strong>
            <p>${event.description}</p>
            <div style="font-size: 0.85em; color: var(--text-secondary); margin-top: 5px;">Click for details →</div>
        </div>
    `;
    
    // Apply event effects
    if (event.effect.incomeIncrease) {
        gameState.player.monthlyIncome *= (1 + event.effect.incomeIncrease);
    }
    if (event.effect.cashBonus) {
        gameState.player.cash += event.effect.cashBonus;
    }
    if (event.effect.cashLoss) {
        gameState.player.cash = Math.max(0, gameState.player.cash - event.effect.cashLoss);
    }
    // Register event with tracking system if available
    if (typeof registerEvent === 'function' && event.effect) {
        const effects = [];
        const eventId = `event_${Date.now()}`;
        
        // Convert event effects to tracking system format
        if (event.effect.marketBoost) {
            effects.push(createEventEffect(
                eventId,
                effectTypes.MARKET_PRICE,
                event.effect.assetType || 'stocks',
                event.effect.marketBoost,
                event.effect.duration || 3,
                true,
                true,
                `${event.title}: Market prices increased`
            ));
        }
        if (event.effect.marketDrop) {
            effects.push(createEventEffect(
                eventId,
                effectTypes.MARKET_PRICE,
                event.effect.assetType || 'stocks',
                event.effect.marketDrop,
                event.effect.duration || 3,
                false,
                true,
                `${event.title}: Market prices decreased`
            ));
        }
        if (event.effect.investmentBonus) {
            effects.push(createEventEffect(
                eventId,
                effectTypes.SKILL_BOOST,
                'investing',
                event.effect.investmentBonus * 10,
                event.effect.duration || 1,
                true,
                true,
                `${event.title}: Investment skills improved`
            ));
        }
        
        if (effects.length > 0) {
            registerEvent(eventId, event.title, effects, true);
        }
    }
    
    if (event.effect.marketBoost) {
        gameState.markets[event.effect.assetType].forEach(asset => {
            asset.price *= (1 + event.effect.marketBoost);
        });
    }
    if (event.effect.marketDrop) {
        gameState.markets[event.effect.assetType].forEach(asset => {
            asset.price *= (1 - event.effect.marketDrop);
        });
    }
    if (event.effect.badHabitEffect) {
        if (gameState.player.badHabits.length > 0) {
            const habit = gameState.player.badHabits[Math.floor(Math.random() * gameState.player.badHabits.length)];
            if (habit.effect.expenseIncrease) {
                gameState.player.cash -= gameState.player.monthlyExpenses * habit.effect.expenseIncrease;
            }
        }
    }
    
    addStory(`Event: ${event.title} - ${event.description}`);
}

// Make functions globally available
window.showHoldingDetails = showHoldingDetails;
window.showEventDetails = showEventDetails;
window.showEventDetailsFromString = showEventDetailsFromString;

// Show holding details modal
function showHoldingDetails(marketType, symbol) {
    const holding = gameState.player.portfolio[marketType]?.find(h => h.symbol === symbol);
    if (!holding) {
        if (typeof showToast === 'function') {
            showToast('Holding not found', 'error');
        }
        return;
    }
    
    const asset = gameState.markets[marketType]?.find(a => a.symbol === symbol);
    if (!asset) {
        if (typeof showToast === 'function') {
            showToast('Asset not found', 'error');
        }
        return;
    }
    
    const modal = document.getElementById('action-modal');
    const modalBody = document.getElementById('modal-body');
    if (!modal || !modalBody) return;
    
    // Use modal manager - allow stacking
    if (typeof openModal === 'function') {
        openModal('action-modal', false, true);
    } else {
        modal.classList.add('active');
    }
    
    const currentValue = asset.price * holding.quantity;
    const costBasis = holding.avgPrice * holding.quantity;
    const profit = currentValue - costBasis;
    const profitPercent = ((profit / costBasis) * 100) || 0;
    const profitClass = profit >= 0 ? 'positive' : 'negative';
    
    // Get price history
    const history = gameState.marketHistory[marketType]?.[symbol] || [];
    const priceChange = history.length > 1 ? 
        ((asset.price - history[history.length - 2].price) / history[history.length - 2].price * 100) : 0;
    
    modalBody.innerHTML = `
        <div style="background: var(--bg-dark); padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <h3 style="margin-top: 0;">${asset.name} (${symbol})</h3>
            <div class="stat-grid">
                <div class="stat-item">
                    <label>Quantity:</label>
                    <span>${holding.quantity.toFixed(4)} ${asset.unit || 'shares'}</span>
                </div>
                <div class="stat-item">
                    <label>Average Price:</label>
                    <span class="money">${formatMoney(holding.avgPrice)}</span>
                </div>
                <div class="stat-item">
                    <label>Current Price:</label>
                    <span class="money">${formatMoney(asset.price)}</span>
                </div>
                <div class="stat-item">
                    <label>Price Change:</label>
                    <span style="color: ${priceChange >= 0 ? 'var(--success-color)' : 'var(--danger-color)'};">
                        ${priceChange >= 0 ? '+' : ''}${priceChange.toFixed(2)}%
                    </span>
                </div>
                <div class="stat-item">
                    <label>Cost Basis:</label>
                    <span class="money">${formatMoney(costBasis)}</span>
                </div>
                <div class="stat-item">
                    <label>Current Value:</label>
                    <span class="money">${formatMoney(currentValue)}</span>
                </div>
                <div class="stat-item" style="border-top: 2px solid var(--border-color); padding-top: 10px;">
                    <label><strong>Profit/Loss:</strong></label>
                    <span class="money" style="font-size: 1.2em; color: var(--${profitClass === 'positive' ? 'success' : 'danger'}-color);">
                        ${profit >= 0 ? '+' : ''}${formatMoney(profit)} (${profitPercent.toFixed(2)}%)
                    </span>
                </div>
            </div>
        </div>
        <div style="display: flex; gap: 10px;">
            <button class="btn-primary" onclick="openBuyModal('${marketType}', '${symbol}'); closeModal();" style="flex: 1;">
                Buy More
            </button>
            <button class="btn-secondary" onclick="openSellModal('${marketType}', '${symbol}'); closeModal();" style="flex: 1;">
                Sell
            </button>
        </div>
    `;
    
    document.getElementById('modal-title').textContent = `Holding Details: ${asset.name}`;
    document.getElementById('modal-confirm').style.display = 'none';
    document.getElementById('modal-cancel').textContent = 'Close';
    document.getElementById('modal-cancel').onclick = closeModal;
}

// Show event details from string (for onclick)
function showEventDetailsFromString(eventJson) {
    try {
        const event = JSON.parse(eventJson.replace(/&quot;/g, '"'));
        showEventDetails(event);
    } catch (e) {
        console.error('Error parsing event:', e);
    }
}

// Show event details modal
function showEventDetails(event) {
    const modal = document.getElementById('action-modal');
    const modalBody = document.getElementById('modal-body');
    if (!modal || !modalBody) return;
    
    // Use modal manager - allow opening on top of other modals
    if (typeof openModal === 'function') {
        openModal('action-modal', false, true); // Allow stacking
    } else {
        modal.classList.add('active');
    }
    
    const effectDetails = [];
    if (event.effect) {
        Object.keys(event.effect).forEach(key => {
            if (key !== 'assetType' && key !== 'duration') {
                const value = event.effect[key];
                if (typeof value === 'number') {
                    if (key.includes('Increase') || key.includes('Bonus')) {
                        effectDetails.push(`${key.replace(/([A-Z])/g, ' $1').trim()}: +${(value * 100).toFixed(0)}%`);
                    } else if (key.includes('Decrease') || key.includes('Loss') || key.includes('Drop')) {
                        effectDetails.push(`${key.replace(/([A-Z])/g, ' $1').trim()}: -${(value * 100).toFixed(0)}%`);
                    } else if (key.includes('cash') || key.includes('Cash')) {
                        effectDetails.push(`${key.replace(/([A-Z])/g, ' $1').trim()}: ${formatMoney(value)}`);
                    } else {
                        effectDetails.push(`${key.replace(/([A-Z])/g, ' $1').trim()}: ${(value * 100).toFixed(0)}%`);
                    }
                } else if (typeof value === 'object' && value !== null) {
                    // Handle skill boost objects
                    Object.keys(value).forEach(skill => {
                        effectDetails.push(`${skill}: +${value[skill]}`);
                    });
                } else {
                    effectDetails.push(`${key.replace(/([A-Z])/g, ' $1').trim()}: ${value}`);
                }
            }
        });
    }
    
    modalBody.innerHTML = `
        <div style="background: var(--bg-dark); padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <h3 style="margin-top: 0; color: ${event.type === 'positive' ? 'var(--success-color)' : event.type === 'negative' ? 'var(--danger-color)' : 'var(--text-primary)'};">
                ${event.title}
            </h3>
            <p style="font-size: 1.1em; margin-bottom: 15px;">${event.description}</p>
            <div style="margin-top: 15px;">
                <strong>Event Type:</strong> ${event.type.charAt(0).toUpperCase() + event.type.slice(1)}<br>
                ${event.rarity ? `<strong>Rarity:</strong> ${event.rarity.charAt(0).toUpperCase() + event.rarity.slice(1)}<br>` : ''}
                ${event.duration ? `<strong>Duration:</strong> ${event.duration} turn(s)<br>` : ''}
            </div>
        </div>
        ${effectDetails.length > 0 ? `
            <div style="background: var(--bg-dark); padding: 20px; border-radius: 10px;">
                <h4 style="margin-top: 0;">Effects:</h4>
                <ul style="margin: 0; padding-left: 20px;">
                    ${effectDetails.map(effect => `<li>${effect}</li>`).join('')}
                </ul>
            </div>
        ` : ''}
    `;
    
    document.getElementById('modal-title').textContent = 'Event Details';
    document.getElementById('modal-confirm').textContent = 'Close';
    document.getElementById('modal-confirm').style.display = 'block';
    document.getElementById('modal-cancel').style.display = 'none';
    document.getElementById('modal-confirm').onclick = () => {
        closeModal();
    };
}

function addStory(text) {
    const storyDisplay = document.getElementById('story-display');
    const timestamp = `[Turn ${gameState.turn}] `;
    storyDisplay.innerHTML = `<p><strong>${timestamp}</strong>${text}</p>`;
}

function formatMoney(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Set default market tab
    updateMarketDisplay();
});

