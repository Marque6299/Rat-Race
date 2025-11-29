// Turn Summary Modal System
const turnSummary = {
    lastTurn: 0,
    summaryData: null
};

// News System
const newsSystem = {
    newsItems: [],
    newsCategories: ['market', 'economic', 'political', 'technology', 'business', 'global']
};

// Generate News Items
function generateNews() {
    const newsTemplates = [
        {
            category: 'market',
            templates: [
                {
                    title: 'Stock Market Reaches New Highs',
                    description: 'Major indices surge as investor confidence grows.',
                    effect: { type: 'price', assetType: 'stocks', modifier: 1.05, duration: 2 },
                    sentiment: 'positive'
                },
                {
                    title: 'Stock Market Correction',
                    description: 'Markets experience a significant correction after recent gains.',
                    effect: { type: 'price', assetType: 'stocks', modifier: 0.95, duration: 2 },
                    sentiment: 'negative'
                },
                {
                    title: 'Crypto Market Volatility',
                    description: 'Cryptocurrency markets show extreme volatility.',
                    effect: { type: 'volatility', assetType: 'crypto', modifier: 1.2, duration: 1 },
                    sentiment: 'neutral'
                }
            ]
        },
        {
            category: 'economic',
            templates: [
                {
                    title: 'Interest Rates Lowered',
                    description: 'Central bank cuts interest rates to stimulate economy.',
                    effect: { type: 'sentiment', modifier: 0.1, duration: 3 },
                    sentiment: 'positive'
                },
                {
                    title: 'Inflation Concerns Rise',
                    description: 'Economists warn of rising inflation rates.',
                    effect: { type: 'sentiment', modifier: -0.1, duration: 2 },
                    sentiment: 'negative'
                },
                {
                    title: 'Economic Growth Exceeds Expectations',
                    description: 'GDP growth stronger than predicted.',
                    effect: { type: 'sentiment', modifier: 0.15, duration: 2 },
                    sentiment: 'positive'
                }
            ]
        },
        {
            category: 'business',
            templates: [
                {
                    title: 'Tech Sector Booms',
                    description: 'Technology companies report record profits.',
                    effect: { type: 'price', assetType: 'stocks', symbol: 'TECH', modifier: 1.1, duration: 1 },
                    sentiment: 'positive'
                },
                {
                    title: 'Real Estate Market Heats Up',
                    description: 'Property prices surge in major markets.',
                    effect: { type: 'price', assetType: 'properties', modifier: 1.08, duration: 2 },
                    sentiment: 'positive'
                }
            ]
        },
        {
            category: 'global',
            templates: [
                {
                    title: 'Global Trade Tensions',
                    description: 'International trade disputes affect markets.',
                    effect: { type: 'sentiment', modifier: -0.15, duration: 3 },
                    sentiment: 'negative'
                },
                {
                    title: 'Commodity Prices Surge',
                    description: 'Global demand drives commodity prices higher.',
                    effect: { type: 'price', assetType: 'commodities', modifier: 1.12, duration: 2 },
                    sentiment: 'positive'
                }
            ]
        }
    ];
    
    // Generate 2-4 news items per turn
    const numNews = 2 + Math.floor(Math.random() * 3);
    const news = [];
    
    for (let i = 0; i < numNews; i++) {
        const category = newsSystem.newsCategories[Math.floor(Math.random() * newsSystem.newsCategories.length)];
        const categoryTemplates = newsTemplates.find(c => c.category === category);
        
        if (categoryTemplates && categoryTemplates.templates.length > 0) {
            const template = categoryTemplates.templates[Math.floor(Math.random() * categoryTemplates.templates.length)];
            const newsItem = {
                id: `news_${Date.now()}_${i}`,
                category: category,
                title: template.title,
                description: template.description,
                effect: template.effect,
                sentiment: template.sentiment,
                turn: gameState.turn,
                timestamp: new Date().toISOString()
            };
            
            news.push(newsItem);
            
            // Apply news effects to market
            if (typeof applyNewsToMarket === 'function') {
                applyNewsToMarket({ marketEffects: [newsItem.effect] });
            }
        }
    }
    
    newsSystem.newsItems.push(...news);
    
    // Keep only last 50 news items
    if (newsSystem.newsItems.length > 50) {
        newsSystem.newsItems = newsSystem.newsItems.slice(-50);
    }
    
    return news;
}

// Generate Turn Summary
function generateTurnSummary() {
    if (!gameState || !gameState.player) {
        console.warn('Game state not initialized');
        return null;
    }
    
    const stats = gameState.player.monthlyStats;
    const previousTurn = turnSummary.lastTurn;
    
    const summary = {
        turn: gameState.turn,
        year: gameState.year,
        financial: {
            income: stats.income,
            incomeFromWork: stats.incomeFromWork || 0,
            incomeFromAssets: stats.incomeFromAssets || 0,
            expenses: stats.expenses,
            expensesNeeds: stats.expensesNeeds || 0,
            expensesLifestyle: stats.expensesLifestyle || 0,
            expensesDebt: stats.expensesDebt || stats.loanPayments || 0,
            expensesOther: stats.expensesOther || stats.propertyUpkeep || 0,
            taxes: stats.taxes,
            loanPayments: stats.loanPayments,
            propertyUpkeep: stats.propertyUpkeep,
            investmentReturns: stats.investmentReturns,
            netChange: stats.netChange,
            cashBefore: gameState.player.cash - stats.netChange,
            cashAfter: gameState.player.cash,
            netWorthBefore: gameState.player.netWorth - stats.netChange,
            netWorthAfter: gameState.player.netWorth
        },
        actions: {
            worked: gameState.hasWorkedThisTurn,
            trades: getTradesThisTurn(),
            investments: getInvestmentsThisTurn(),
            purchases: getPurchasesThisTurn()
        },
        marketConditions: typeof getMarketConditionSummary === 'function' ? 
            getMarketConditionSummary() : null,
        news: typeof generateNews === 'function' ? generateNews() : [],
        events: (typeof expandedEvents !== 'undefined' && expandedEvents.events) ? 
            expandedEvents.events.filter(e => e.turn === gameState.turn) : [],
        achievements: (typeof achievementsSystem !== 'undefined' && achievementsSystem.unlockedAchievements) ?
            achievementsSystem.unlockedAchievements.filter(id => {
                const ach = achievementsSystem.achievements.find(a => a.id === id);
                return ach && ach.unlockedAt && ach.unlockedAt.turn === gameState.turn;
            }) : [],
        milestones: (typeof achievementsSystem !== 'undefined' && achievementsSystem.reachedMilestones) ?
            achievementsSystem.reachedMilestones.filter(id => {
                const mil = achievementsSystem.milestones.find(m => m.id === id);
                return mil && mil.reachedAt && mil.reachedAt.turn === gameState.turn;
            }) : [],
        playerAttributes: {
            luck: playerAttributes?.luck || 50,
            skills: playerAttributes?.skills || {}
        }
    };
    
    turnSummary.lastTurn = gameState.turn;
    turnSummary.summaryData = summary;
    
    return summary;
}

// Get trades this turn
function getTradesThisTurn() {
    if (!logsSystem || !logsSystem.transactions) return [];
    return logsSystem.transactions.filter(t => 
        t.turn === gameState.turn && t.type === 'trade'
    );
}

// Get investments this turn
function getInvestmentsThisTurn() {
    if (!logsSystem || !logsSystem.transactions) return [];
    return logsSystem.transactions.filter(t => 
        t.turn === gameState.turn && (t.type === 'investment' || t.type === 'trade')
    );
}

// Get purchases this turn
function getPurchasesThisTurn() {
    if (!logsSystem || !logsSystem.transactions) return [];
    return logsSystem.transactions.filter(t => 
        t.turn === gameState.turn && (t.type === 'property' || t.type === 'expense')
    );
}

// Display Turn Summary Modal
function displayTurnSummary() {
    const summary = generateTurnSummary();
    if (!summary) {
        console.warn('Could not generate turn summary');
        return;
    }
    
    const modal = document.getElementById('turn-summary-modal');
    if (!modal) {
        console.warn('Turn summary modal not found');
        return;
    }
    
    const content = document.getElementById('turn-summary-content');
    const title = document.getElementById('turn-summary-title');
    if (!content) {
        console.warn('Turn summary content not found');
        return;
    }
    
    // Use modal manager - allow opening on top of other modals
    if (typeof openModal === 'function') {
        openModal('turn-summary-modal', true, true); // Force open, allow stacking
    } else {
        modal.classList.add('active');
    }
    
    if (title) {
        title.textContent = `📊 Turn Summary - Turn ${summary.turn}`;
    }
    
    const financial = summary.financial;
    const news = summary.news;
    
    let html = `
        <div>
            <!-- Financial Summary -->
            <div style="background: var(--bg-dark); padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                <h3 style="margin-top: 0;">💰 Financial Summary</h3>
                
                <!-- Income Breakdown -->
                <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid var(--border-color);">
                    <h4 style="margin-top: 0; margin-bottom: 10px; color: var(--success-color);">📈 Income</h4>
                    <div class="stat-grid">
                        <div class="stat-item">
                            <label>From Work/Salary:</label>
                            <span class="money positive">${formatMoney(financial.incomeFromWork || 0)}</span>
                        </div>
                        <div class="stat-item">
                            <label>From Assets/Investments:</label>
                            <span class="money positive">${formatMoney(financial.incomeFromAssets || 0)}</span>
                        </div>
                        <div class="stat-item" style="border-top: 1px solid var(--border-color); padding-top: 10px;">
                            <label><strong>Total Income:</strong></label>
                            <span class="money positive" style="font-size: 1.1em;">${formatMoney(financial.income)}</span>
                        </div>
                    </div>
                </div>
                
                <!-- Expense Breakdown -->
                <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid var(--border-color);">
                    <h4 style="margin-top: 0; margin-bottom: 10px; color: var(--danger-color);">📉 Expenses</h4>
                    <div class="stat-grid">
                        <div class="stat-item">
                            <label>Needs (Housing, Food, etc.):</label>
                            <span class="money negative">${formatMoney(financial.expensesNeeds || 0)}</span>
                        </div>
                        <div class="stat-item">
                            <label>Lifestyle Expenses:</label>
                            <span class="money negative">${formatMoney(financial.expensesLifestyle || 0)}</span>
                        </div>
                        <div class="stat-item">
                            <label>Debt Payments:</label>
                            <span class="money negative">${formatMoney(financial.expensesDebt || financial.loanPayments || 0)}</span>
                        </div>
                        <div class="stat-item">
                            <label>Other (Upkeep, etc.):</label>
                            <span class="money negative">${formatMoney(financial.expensesOther || financial.propertyUpkeep || 0)}</span>
                        </div>
                        <div class="stat-item" style="border-top: 1px solid var(--border-color); padding-top: 10px;">
                            <label><strong>Total Expenses:</strong></label>
                            <span class="money negative" style="font-size: 1.1em;">${formatMoney(financial.expenses)}</span>
                        </div>
                    </div>
                </div>
                
                <!-- Other Financial Items -->
                <div class="stat-grid">
                    <div class="stat-item">
                        <label>Taxes:</label>
                        <span class="money negative">${formatMoney(financial.taxes)}</span>
                    </div>
                    <div class="stat-item">
                        <label>Investment Returns:</label>
                        <span class="money positive">${formatMoney(financial.investmentReturns)}</span>
                    </div>
                    <div class="stat-item" style="border-top: 2px solid var(--border-color); padding-top: 10px;">
                        <label><strong>Net Change:</strong></label>
                        <span class="money" style="font-size: 1.2em; color: ${financial.netChange >= 0 ? 'var(--success-color)' : 'var(--danger-color)'};">
                            ${financial.netChange >= 0 ? '+' : ''}${formatMoney(financial.netChange)}
                        </span>
                    </div>
                    <div class="stat-item">
                        <label>Cash:</label>
                        <span class="money">${formatMoney(financial.cashAfter)}</span>
                    </div>
                    <div class="stat-item">
                        <label>Net Worth:</label>
                        <span class="money">${formatMoney(financial.netWorthAfter)}</span>
                    </div>
                </div>
            </div>
            
            <!-- Market Conditions -->
            ${summary.marketConditions ? `
                <div style="background: var(--bg-dark); padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                    <h3 style="margin-top: 0;">📊 Market Conditions</h3>
                    <div class="stat-grid">
                        <div class="stat-item">
                            <label>Inflation:</label>
                            <span>${summary.marketConditions.inflation}</span>
                        </div>
                        <div class="stat-item">
                            <label>Interest Rate:</label>
                            <span>${summary.marketConditions.interestRate}</span>
                        </div>
                        <div class="stat-item">
                            <label>Economic Growth:</label>
                            <span>${summary.marketConditions.economicGrowth}</span>
                        </div>
                        <div class="stat-item">
                            <label>Market Sentiment:</label>
                            <span style="color: ${summary.marketConditions.sentimentValue >= 0.6 ? 'var(--success-color)' : summary.marketConditions.sentimentValue >= 0.4 ? 'var(--warning-color)' : 'var(--danger-color)'};">
                                ${summary.marketConditions.marketSentiment}
                            </span>
                        </div>
                    </div>
                </div>
            ` : ''}
            
            <!-- News Section -->
            <div style="background: var(--bg-dark); padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                <h3 style="margin-top: 0;">📰 News</h3>
                ${news.length === 0 ? 
                    '<p style="color: var(--text-secondary);">No major news this turn.</p>' :
                    news.map(item => {
                        const sentimentClass = item.sentiment === 'positive' ? 'positive' : 
                                              item.sentiment === 'negative' ? 'negative' : 'neutral';
                        return `
                            <div class="event-item ${sentimentClass}" style="margin-bottom: 10px;">
                                <strong>${item.title}</strong>
                                <p style="margin: 5px 0;">${item.description}</p>
                                <div style="font-size: 0.85em; color: var(--text-secondary);">
                                    ${item.category.charAt(0).toUpperCase() + item.category.slice(1)} • Turn ${item.turn}
                                </div>
                            </div>
                        `;
                    }).join('')
                }
            </div>
            
            <!-- Achievements & Milestones -->
            ${(summary.achievements.length > 0 || summary.milestones.length > 0) ? `
                <div style="background: var(--bg-dark); padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                    <h3 style="margin-top: 0;">🏆 Progress</h3>
                    ${summary.achievements.length > 0 ? `
                        <div style="margin-bottom: 15px;">
                            <strong>Achievements Unlocked:</strong>
                            ${summary.achievements.map(id => {
                                const ach = achievementsSystem.achievements.find(a => a.id === id);
                                return ach ? `<div style="margin-top: 5px;">${ach.icon} ${ach.name}</div>` : '';
                            }).join('')}
                        </div>
                    ` : ''}
                    ${summary.milestones.length > 0 ? `
                        <div>
                            <strong>Milestones Reached:</strong>
                            ${summary.milestones.map(id => {
                                const mil = achievementsSystem.milestones.find(m => m.id === id);
                                return mil ? `<div style="margin-top: 5px;">🎯 ${mil.name}</div>` : '';
                            }).join('')}
                        </div>
                    ` : ''}
                </div>
            ` : ''}
            
            <!-- Player Attributes -->
            <div style="background: var(--bg-dark); padding: 20px; border-radius: 10px;">
                <h3 style="margin-top: 0;">📈 Player Status</h3>
                <div class="stat-grid">
                    <div class="stat-item">
                        <label>Luck:</label>
                        <span style="color: ${summary.playerAttributes.luck >= 70 ? 'var(--success-color)' : summary.playerAttributes.luck >= 40 ? 'var(--warning-color)' : 'var(--danger-color)'};">
                            ${summary.playerAttributes.luck.toFixed(0)}%
                        </span>
                    </div>
                    <div class="stat-item">
                        <label>Financial Health:</label>
                        <span>${Math.round(gameState.player.financialHealth)}%</span>
                    </div>
                </div>
            </div>
        </div>
        
        <div style="margin-top: 20px; text-align: center;">
            <button class="btn-primary" onclick="closeModalById('turn-summary-modal')" style="width: 100%;">
                Continue
            </button>
        </div>
    `;
    
    content.innerHTML = html;
}

// Make functions globally available
window.displayTurnSummary = displayTurnSummary;
window.generateNews = generateNews;

