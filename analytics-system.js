// Advanced Analytics and Reporting System
const analyticsSystem = {
    // Performance metrics
    metrics: {
        totalReturn: 0,
        annualizedReturn: 0,
        sharpeRatio: 0,
        maxDrawdown: 0,
        winRate: 0,
        averageWin: 0,
        averageLoss: 0
    },
    
    // Historical data
    performanceHistory: [],
    portfolioHistory: [],
    incomeHistory: [],
    expenseHistory: [],
    
    // Goals tracking
    goals: [],
    
    // Comparison data
    benchmarks: {
        market: 0.08, // 8% annual market return
        inflation: 0.02 // 2% inflation
    }
};

// Calculate Portfolio Performance Metrics
function calculatePortfolioMetrics() {
    const portfolio = gameState.player.portfolio;
    let totalValue = 0;
    let totalCost = 0;
    let wins = 0;
    let losses = 0;
    let totalWins = 0;
    let totalLosses = 0;
    
    Object.keys(portfolio).forEach(marketType => {
        portfolio[marketType].forEach(holding => {
            const asset = gameState.markets[marketType]?.find(a => a.symbol === holding.symbol);
            if (asset) {
                const currentValue = asset.price * holding.quantity;
                const costBasis = holding.avgPrice * holding.quantity;
                totalValue += currentValue;
                totalCost += costBasis;
                
                const profit = currentValue - costBasis;
                if (profit > 0) {
                    wins++;
                    totalWins += profit;
                } else if (profit < 0) {
                    losses++;
                    totalLosses += Math.abs(profit);
                }
            }
        });
    });
    
    const totalReturn = totalCost > 0 ? ((totalValue - totalCost) / totalCost) * 100 : 0;
    const years = (gameState.turn / 12);
    const annualizedReturn = years > 0 ? Math.pow(1 + (totalReturn / 100), 1 / years) - 1 : 0;
    
    analyticsSystem.metrics.totalReturn = totalReturn;
    analyticsSystem.metrics.annualizedReturn = annualizedReturn * 100;
    analyticsSystem.metrics.winRate = (wins + losses) > 0 ? (wins / (wins + losses)) * 100 : 0;
    analyticsSystem.metrics.averageWin = wins > 0 ? totalWins / wins : 0;
    analyticsSystem.metrics.averageLoss = losses > 0 ? totalLosses / losses : 0;
    
    return analyticsSystem.metrics;
}

// Calculate Sharpe Ratio (risk-adjusted return)
function calculateSharpeRatio() {
    const returns = analyticsSystem.performanceHistory.map(h => h.return).filter(r => !isNaN(r));
    if (returns.length < 2) return 0;
    
    const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
    const stdDev = Math.sqrt(variance);
    
    const riskFreeRate = 0.02; // 2% risk-free rate
    const sharpe = stdDev > 0 ? (avgReturn - riskFreeRate) / stdDev : 0;
    
    analyticsSystem.metrics.sharpeRatio = sharpe;
    return sharpe;
}

// Calculate Maximum Drawdown
function calculateMaxDrawdown() {
    const portfolioValues = analyticsSystem.portfolioHistory.map(h => h.value);
    if (portfolioValues.length < 2) return 0;
    
    let maxDrawdown = 0;
    let peak = portfolioValues[0];
    
    portfolioValues.forEach(value => {
        if (value > peak) {
            peak = value;
        }
        const drawdown = ((peak - value) / peak) * 100;
        if (drawdown > maxDrawdown) {
            maxDrawdown = drawdown;
        }
    });
    
    analyticsSystem.metrics.maxDrawdown = maxDrawdown;
    return maxDrawdown;
}

// Record Performance Data
function recordPerformanceData() {
    // Portfolio value
    const portfolioValue = calculatePortfolioValue();
    const netWorth = gameState.player.netWorth;
    
    analyticsSystem.portfolioHistory.push({
        turn: gameState.turn,
        value: netWorth,
        portfolioValue: portfolioValue,
        cash: gameState.player.cash
    });
    
    // Income/Expense tracking
    analyticsSystem.incomeHistory.push({
        turn: gameState.turn,
        income: gameState.player.monthlyStats.income,
        workIncome: gameState.player.monthlyStats.incomeFromWork,
        assetIncome: gameState.player.monthlyStats.incomeFromAssets
    });
    
    analyticsSystem.expenseHistory.push({
        turn: gameState.turn,
        expenses: gameState.player.monthlyStats.expenses,
        needs: gameState.player.monthlyStats.expensesNeeds,
        lifestyle: gameState.player.monthlyStats.expensesLifestyle,
        debt: gameState.player.monthlyStats.expensesDebt
    });
    
    // Performance return
    if (analyticsSystem.portfolioHistory.length > 1) {
        const prevValue = analyticsSystem.portfolioHistory[analyticsSystem.portfolioHistory.length - 2].value;
        const returnPercent = prevValue > 0 ? ((netWorth - prevValue) / prevValue) * 100 : 0;
        
        analyticsSystem.performanceHistory.push({
            turn: gameState.turn,
            return: returnPercent,
            netWorth: netWorth
        });
    }
    
    // Keep only last 100 entries
    if (analyticsSystem.portfolioHistory.length > 100) {
        analyticsSystem.portfolioHistory.shift();
        analyticsSystem.incomeHistory.shift();
        analyticsSystem.expenseHistory.shift();
    }
    if (analyticsSystem.performanceHistory.length > 100) {
        analyticsSystem.performanceHistory.shift();
    }
}

// Calculate Portfolio Value
function calculatePortfolioValue() {
    let value = 0;
    Object.keys(gameState.player.portfolio).forEach(marketType => {
        gameState.player.portfolio[marketType].forEach(holding => {
            const asset = gameState.markets[marketType]?.find(a => a.symbol === holding.symbol);
            if (asset) {
                value += asset.price * holding.quantity;
            }
        });
    });
    return value;
}

// Add Goal
function addGoal(name, target, type, deadline = null) {
    const goal = {
        id: `goal_${Date.now()}`,
        name: name,
        target: target,
        current: 0,
        type: type, // 'networth', 'income', 'property', 'business', 'skill'
        deadline: deadline,
        created: gameState.turn,
        completed: false
    };
    
    analyticsSystem.goals.push(goal);
    return goal;
}

// Update Goals Progress
function updateGoalsProgress() {
    analyticsSystem.goals.forEach(goal => {
        if (goal.completed) return;
        
        switch(goal.type) {
            case 'networth':
                goal.current = gameState.player.netWorth;
                break;
            case 'income':
                goal.current = gameState.player.monthlyIncome;
                break;
            case 'property':
                goal.current = gameState.player.properties.length;
                break;
            case 'business':
                goal.current = (typeof opportunitiesSystem !== 'undefined' && opportunitiesSystem.playerBusinesses) ?
                    opportunitiesSystem.playerBusinesses.length : 0;
                break;
            case 'skill':
                if (typeof skillTreeSystem !== 'undefined') {
                    goal.current = Object.keys(skillTreeSystem.skills).filter(s => 
                        skillTreeSystem.skills[s].learned
                    ).length;
                }
                break;
        }
        
        if (goal.current >= goal.target) {
            goal.completed = true;
            goal.completedTurn = gameState.turn;
            addStory(`🎯 Goal achieved: ${goal.name}!`);
        }
        
        if (goal.deadline && gameState.turn >= goal.deadline && !goal.completed) {
            goal.failed = true;
        }
    });
}

// Get Analytics Report
function getAnalyticsReport() {
    calculatePortfolioMetrics();
    calculateSharpeRatio();
    calculateMaxDrawdown();
    
    const months = gameState.turn;
    const years = months / 12;
    
    // Income growth
    const recentIncome = analyticsSystem.incomeHistory.slice(-12);
    const oldIncome = analyticsSystem.incomeHistory.slice(0, 12);
    const avgRecentIncome = recentIncome.length > 0 ?
        recentIncome.reduce((sum, h) => sum + h.income, 0) / recentIncome.length : 0;
    const avgOldIncome = oldIncome.length > 0 ?
        oldIncome.reduce((sum, h) => sum + h.income, 0) / oldIncome.length : 0;
    const incomeGrowth = avgOldIncome > 0 ? ((avgRecentIncome - avgOldIncome) / avgOldIncome) * 100 : 0;
    
    // Expense analysis
    const recentExpenses = analyticsSystem.expenseHistory.slice(-12);
    const avgExpenses = recentExpenses.length > 0 ?
        recentExpenses.reduce((sum, h) => sum + h.expenses, 0) / recentExpenses.length : 0;
    
    return {
        metrics: analyticsSystem.metrics,
        performance: {
            totalReturn: analyticsSystem.metrics.totalReturn,
            annualizedReturn: analyticsSystem.metrics.annualizedReturn,
            sharpeRatio: analyticsSystem.metrics.sharpeRatio,
            maxDrawdown: analyticsSystem.metrics.maxDrawdown,
            winRate: analyticsSystem.metrics.winRate
        },
        income: {
            current: gameState.player.monthlyIncome,
            growth: incomeGrowth,
            workIncome: gameState.player.monthlyStats.incomeFromWork,
            assetIncome: gameState.player.monthlyStats.incomeFromAssets
        },
        expenses: {
            current: gameState.player.monthlyExpenses,
            average: avgExpenses,
            breakdown: {
                needs: gameState.player.monthlyStats.expensesNeeds,
                lifestyle: gameState.player.monthlyStats.expensesLifestyle,
                debt: gameState.player.monthlyStats.expensesDebt
            }
        },
        goals: analyticsSystem.goals,
        timePlayed: {
            months: months,
            years: years.toFixed(1)
        },
        benchmarks: {
            marketReturn: analyticsSystem.benchmarks.market * 100,
            yourReturn: analyticsSystem.metrics.annualizedReturn,
            beatMarket: analyticsSystem.metrics.annualizedReturn > (analyticsSystem.benchmarks.market * 100)
        }
    };
}

// Make functions globally available
window.analyticsSystem = analyticsSystem;
window.calculatePortfolioMetrics = calculatePortfolioMetrics;
window.calculateSharpeRatio = calculateSharpeRatio;
window.calculateMaxDrawdown = calculateMaxDrawdown;
window.recordPerformanceData = recordPerformanceData;
window.addGoal = addGoal;
window.updateGoalsProgress = updateGoalsProgress;
window.getAnalyticsReport = getAnalyticsReport;

