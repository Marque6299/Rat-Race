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
        { name: 'RetailMart', symbol: 'RTM', basePrice: 40 }
    ],
    bonds: [
        { name: 'Government 10Y', symbol: 'GOV10', basePrice: 1000, yield: 0.03 },
        { name: 'Corporate AAA', symbol: 'CORP', basePrice: 1000, yield: 0.045 },
        { name: 'Municipal Bond', symbol: 'MUNI', basePrice: 1000, yield: 0.025 }
    ],
    forex: [
        { name: 'USD/EUR', symbol: 'EUR', basePrice: 0.92 },
        { name: 'USD/GBP', symbol: 'GBP', basePrice: 0.79 },
        { name: 'USD/JPY', symbol: 'JPY', basePrice: 150 },
        { name: 'USD/CNY', symbol: 'CNY', basePrice: 7.2 }
    ],
    commodities: [
        { name: 'Gold', symbol: 'GOLD', basePrice: 2000, unit: 'oz' },
        { name: 'Oil', symbol: 'OIL', basePrice: 75, unit: 'barrel' },
        { name: 'Silver', symbol: 'SILV', basePrice: 25, unit: 'oz' },
        { name: 'Copper', symbol: 'COPP', basePrice: 4, unit: 'lb' }
    ],
    crypto: [
        { name: 'Bitcoin', symbol: 'BTC', basePrice: 45000 },
        { name: 'Ethereum', symbol: 'ETH', basePrice: 2500 },
        { name: 'Litecoin', symbol: 'LTC', basePrice: 75 },
        { name: 'Cardano', symbol: 'ADA', basePrice: 0.5 }
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
            asset.price = Math.max(asset.price + change, asset.basePrice * 0.1);
            asset.change = change;
            asset.changePercent = (change / oldPrice) * 100;
            
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
    const traitCards = document.querySelectorAll('.trait-card');
    const startBtn = document.getElementById('start-game-btn');
    const playerNameInput = document.getElementById('player-name');

    traitCards.forEach(card => {
        card.addEventListener('click', () => {
            traitCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            gameState.player.trait = card.dataset.trait;
            checkStartButton();
        });
    });

    playerNameInput.addEventListener('input', () => {
        gameState.player.name = playerNameInput.value.trim();
        checkStartButton();
    });

    function checkStartButton() {
        startBtn.disabled = !(gameState.player.name && gameState.player.trait);
    }

    startBtn.addEventListener('click', startGame);
});

function startGame() {
    // Apply trait effects
    const trait = traitEffects[gameState.player.trait];
    if (trait.savingsBonus) {
        gameState.player.monthlyExpenses *= (1 - trait.expenseReduction);
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
    document.getElementById('player-name-display').textContent = gameState.player.name;
    document.getElementById('trait-display').textContent = traitEffects[gameState.player.trait].description;

    // Financial status
    document.getElementById('cash-display').textContent = formatMoney(gameState.player.cash);
    document.getElementById('income-display').textContent = formatMoney(gameState.player.monthlyIncome);
    document.getElementById('expenses-display').textContent = formatMoney(gameState.player.monthlyExpenses);
    updateNetWorth();
    document.getElementById('networth-display').textContent = formatMoney(gameState.player.netWorth);
    
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
    document.getElementById('health-score').textContent = Math.round(gameState.player.financialHealth) + '%';
    
    // Health factors are now in modals - no need to update here

    // Portfolio and Bad habits are now in modals - no need to update here

    // Markets will update when modal is opened

    // Turn info
    document.getElementById('turn-count').textContent = gameState.turn;
    document.getElementById('year-display').textContent = gameState.year;

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
    if (gameState.hasWorkedThisTurn) {
        addStory('You\'ve already worked this turn. Wait for the next turn to work again.');
        return;
    }
    
    const income = gameState.player.monthlyIncome;
    const trait = traitEffects[gameState.player.trait];
    
    let bonus = 0;
    if (trait.businessIncome && Math.random() < 0.3) {
        bonus = income * trait.businessIncome;
        addStory(`Your entrepreneurial skills paid off! You earned a bonus of ${formatMoney(bonus)}.`);
    }

    const totalIncome = income + bonus;
    gameState.player.cash += totalIncome;
    gameState.player.monthlyStats.income += totalIncome;
    gameState.hasWorkedThisTurn = true;
    
    // Log transaction
    if (typeof logTransaction === 'function') {
        logTransaction('income', `Work income${bonus > 0 ? ' + bonus' : ''}`, totalIncome, {
            baseIncome: income,
            bonus: bonus
        });
    }
    
    addStory(`You worked this month and earned ${formatMoney(totalIncome)}.`);
    updateDisplay();
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
    modal.classList.add('active');
}

function quickInvest(type, amount) {
    if (gameState.player.cash >= amount) {
        const market = gameState.markets[type];
        if (market.length > 0) {
            const asset = market[Math.floor(Math.random() * market.length)];
            const quantity = amount / asset.price;
            
            gameState.player.cash -= amount;
            const existing = gameState.player.portfolio[type].find(h => h.symbol === asset.symbol);
            if (existing) {
                existing.quantity += quantity;
            } else {
                gameState.player.portfolio[type].push({
                    symbol: asset.symbol,
                    quantity: quantity,
                    avgPrice: asset.price
                });
            }
            
            addStory(`You invested ${formatMoney(amount)} in ${asset.name}.`);
            closeModal();
            updateDisplay();
        }
    } else {
        addStory('You don\'t have enough cash for this investment.');
    }
}

function openSpendModal() {
    const modal = document.getElementById('action-modal');
    const modalBody = document.getElementById('modal-body');
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
    modal.classList.add('active');
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
    
    modalBody.innerHTML = `
        <div class="modal-form-group">
            <label>Asset: ${asset.name} (${asset.symbol})</label>
            <div style="margin: 10px 0;">Current Price: ${formatMoney(asset.price)}</div>
        </div>
        <div class="modal-form-group">
            <label>Amount to Invest ($):</label>
            <input type="number" id="buy-amount" min="100" step="100" value="1000">
        </div>
        <div id="buy-preview" style="margin-top: 10px; color: var(--text-secondary);"></div>
    `;
    
    document.getElementById('modal-title').textContent = `Buy ${asset.name}`;
    modal.classList.add('active');
    
    const amountInput = document.getElementById('buy-amount');
    amountInput.addEventListener('input', () => {
        const amount = parseFloat(amountInput.value) || 0;
        const quantity = amount / asset.price;
        document.getElementById('buy-preview').textContent = 
            `You will buy ${quantity.toFixed(4)} ${asset.unit || 'shares'} for ${formatMoney(amount)}`;
    });
    
    document.getElementById('modal-confirm').onclick = () => {
        const amount = parseFloat(amountInput.value) || 0;
        buyAsset(marketType, symbol, amount);
    };
}

function buyAsset(marketType, symbol, amount) {
    if (gameState.player.cash < amount) {
        addStory('You don\'t have enough cash for this purchase.');
        closeModal();
        return;
    }
    
    const asset = gameState.markets[marketType].find(a => a.symbol === symbol);
    const quantity = amount / asset.price;
    
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
            avgPrice: asset.price
        });
    }
    
    // Log asset purchase
    if (typeof logAssetChange === 'function') {
        logAssetChange(marketType, symbol, quantity, asset.price, 'buy');
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
    modal.classList.add('active');
    
    const quantityInput = document.getElementById('sell-quantity');
    quantityInput.addEventListener('input', () => {
        const qty = parseFloat(quantityInput.value) || 0;
        const value = qty * asset.price;
        document.getElementById('sell-preview').textContent = 
            `You will receive ${formatMoney(value)} for ${qty.toFixed(4)} ${asset.unit || 'shares'}`;
    });
    
    document.getElementById('modal-confirm').onclick = () => {
        const quantity = parseFloat(quantityInput.value) || 0;
        sellAsset(marketType, symbol, quantity);
    };
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
    modal.classList.add('active');
    
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
                <div style="background: var(--bg-dark); padding: 15px; margin-bottom: 10px; border-radius: 8px; border: 2px solid var(--border-color); cursor: pointer;" 
                     onclick="selectProperty(${index})" id="prop-${index}">
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
    modal.classList.add('active');
    
    window.selectProperty = (index) => {
        document.querySelectorAll('[id^="prop-"]').forEach(el => {
            el.style.borderColor = 'var(--border-color)';
        });
        document.getElementById(`prop-${index}`).style.borderColor = 'var(--secondary-color)';
        document.getElementById('selected-property').value = index;
    };
    
    document.getElementById('modal-confirm').onclick = () => {
        const index = parseInt(document.getElementById('selected-property').value);
        if (index >= 0 && index < properties.length) {
            buyProperty(properties[index]);
        } else {
            addStory('Please select a property.');
        }
    };
}

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
function closeModal() {
    document.getElementById('action-modal').classList.remove('active');
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

// Calculate Taxes
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
    
    // Update markets first
    updateMarkets();
    
    // Reset monthly stats for this new turn
    gameState.player.monthlyStats = {
        income: 0,
        expenses: 0,
        taxes: 0,
        loanPayments: 0,
        propertyUpkeep: 0,
        investmentReturns: 0,
        netChange: 0
    };
    
    // Process property income (passive income)
    let propertyIncome = 0;
    gameState.player.properties.forEach(property => {
        if (property.monthlyIncome) {
            propertyIncome += property.monthlyIncome;
        }
    });
    gameState.player.cash += propertyIncome;
    gameState.player.monthlyStats.income += propertyIncome;
    
    // Log property income
    if (propertyIncome > 0 && typeof logTransaction === 'function') {
        logTransaction('income', 'Property rental income', propertyIncome, {
            incomeType: 'property',
            propertyCount: gameState.player.properties.length
        });
    }
    
    // Process business income
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
        
        // Log business income
        if (businessIncome > 0 && typeof logTransaction === 'function') {
            logTransaction('income', 'Business income', businessIncome, {
                incomeType: 'business',
                businessCount: opportunitiesSystem.playerBusinesses.length
            });
        }
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
    
    // Process expenses
    let totalExpenses = gameState.player.monthlyExpenses;
    
    // Apply bad habit effects
    gameState.player.badHabits.forEach(habit => {
        if (habit.effect.expenseIncrease) {
            totalExpenses += gameState.player.monthlyExpenses * habit.effect.expenseIncrease;
        }
        if (habit.effect.monthlyPayment) {
            totalExpenses += habit.effect.monthlyPayment;
        }
    });
    
    gameState.player.cash -= totalExpenses;
    gameState.player.monthlyStats.expenses = totalExpenses;
    
    // Process taxes (on income earned this turn)
    const taxes = calculateTaxes();
    gameState.player.cash -= taxes;
    gameState.player.monthlyStats.taxes = taxes;
    
    // Log tax payment
    if (taxes > 0 && typeof logTransaction === 'function') {
        logTransaction('tax', 'Income tax payment', -taxes, {
            taxableIncome: gameState.player.monthlyStats.income
        });
    }
    
    // Process loans
    const loanPayments = processLoans();
    gameState.player.monthlyStats.loanPayments = loanPayments;
    
    // Process property upkeep
    const propertyUpkeep = processPropertyUpkeep();
    gameState.player.monthlyStats.propertyUpkeep = propertyUpkeep;
    
    // Calculate investment returns (bonds interest, dividends, etc.)
    const investmentReturns = calculateInvestmentReturns();
    gameState.player.cash += investmentReturns;
    gameState.player.monthlyStats.investmentReturns = investmentReturns;
    
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
    
    // Random event
    if (Math.random() < 0.4) {
        triggerRandomEvent();
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
    
    // Check win condition
    if (gameState.player.netWorth >= 1000000 && gameState.player.financialHealth >= 80) {
        addStory('🎉 CONGRATULATIONS! You\'ve escaped the rat race! You\'ve built wealth and achieved financial freedom!');
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
    addStory(storyTemplates[Math.floor(Math.random() * storyTemplates.length)]);
}

function triggerRandomEvent() {
    const event = randomEvents[Math.floor(Math.random() * randomEvents.length)];
    gameState.currentEvent = event;
    
    // Log event
    if (typeof logEvent === 'function') {
        logEvent(event.type, event.title, event.description, event.effect);
    }
    
    const eventsDisplay = document.getElementById('events-display');
    const eventClass = event.type === 'positive' ? 'positive' : event.type === 'negative' ? 'negative' : 'neutral';
    
    eventsDisplay.innerHTML = `
        <div class="event-item ${eventClass}">
            <strong>${event.title}</strong>
            <p>${event.description}</p>
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

