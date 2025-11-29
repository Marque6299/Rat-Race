// Financial, Event, and Transaction Logging System
const logsSystem = {
    transactions: [],
    events: [],
    financial: [],
    maxLogs: 500 // Keep last 500 entries per category
};

// Log Types
const logTypes = {
    TRANSACTION: 'transaction',
    EVENT: 'event',
    FINANCIAL: 'financial'
};

// Transaction Types
const transactionTypes = {
    INCOME: 'income',
    EXPENSE: 'expense',
    INVESTMENT: 'investment',
    TRADE: 'trade',
    LOAN: 'loan',
    PROPERTY: 'property',
    BANK: 'bank',
    TAX: 'tax'
};

// Log Transaction
function logTransaction(type, description, amount, details = {}) {
    const log = {
        id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        turn: gameState.turn,
        year: gameState.year,
        type: type,
        description: description,
        amount: amount,
        cashBefore: gameState.player.cash,
        cashAfter: gameState.player.cash + (type === transactionTypes.INCOME ? amount : -amount),
        netWorthBefore: gameState.player.netWorth,
        details: details
    };
    
    logsSystem.transactions.push(log);
    
    // Keep only last maxLogs entries
    if (logsSystem.transactions.length > logsSystem.maxLogs) {
        logsSystem.transactions.shift();
    }
    
    return log;
}

// Log Event
function logEvent(type, title, description, impact = {}) {
    const log = {
        id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        turn: gameState.turn,
        year: gameState.year,
        type: type, // 'positive', 'negative', 'neutral', 'market', 'personal'
        title: title,
        description: description,
        impact: impact
    };
    
    logsSystem.events.push(log);
    
    if (logsSystem.events.length > logsSystem.maxLogs) {
        logsSystem.events.shift();
    }
    
    return log;
}

// Log Financial Status
function logFinancialStatus() {
    const previousLog = logsSystem.financial[logsSystem.financial.length - 1];
    
    const log = {
        id: `fin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        turn: gameState.turn,
        year: gameState.year,
        cash: gameState.player.cash,
        savingsAccount: (typeof bankSystem !== 'undefined' && bankSystem.savingsAccount) || 0,
        netWorth: gameState.player.netWorth,
        monthlyIncome: gameState.player.monthlyIncome,
        monthlyExpenses: gameState.player.monthlyExpenses,
        portfolioValue: getTotalPortfolioValue(),
        propertyValue: gameState.player.properties.reduce((sum, p) => sum + p.value, 0),
        loanDebt: gameState.player.loans.reduce((sum, loan) => sum + loan.principal, 0),
        financialHealth: gameState.player.financialHealth,
        creditScore: (typeof bankSystem !== 'undefined' && bankSystem.creditScore) || 0,
        changes: {}
    };
    
    // Calculate changes from previous log
    if (previousLog) {
        log.changes = {
            cash: log.cash - previousLog.cash,
            netWorth: log.netWorth - previousLog.netWorth,
            portfolioValue: log.portfolioValue - previousLog.portfolioValue,
            financialHealth: log.financialHealth - previousLog.financialHealth,
            creditScore: log.creditScore - previousLog.creditScore
        };
    }
    
    logsSystem.financial.push(log);
    
    if (logsSystem.financial.length > logsSystem.maxLogs) {
        logsSystem.financial.shift();
    }
    
    return log;
}

// Log Asset Gain/Loss
function logAssetChange(marketType, symbol, quantity, price, action, profit = null) {
    const asset = gameState.markets[marketType]?.find(a => a.symbol === symbol);
    if (!asset) return;
    
    const description = `${action === 'buy' ? 'Bought' : 'Sold'} ${quantity.toFixed(4)} ${asset.unit || 'shares'} of ${asset.name} (${symbol}) at ${formatMoney(price)}`;
    
    logTransaction(
        transactionTypes.TRADE,
        description,
        action === 'buy' ? -price * quantity : price * quantity,
        {
            marketType: marketType,
            symbol: symbol,
            assetName: asset.name,
            quantity: quantity,
            price: price,
            action: action,
            profit: profit,
            totalValue: price * quantity
        }
    );
    
    if (profit !== null) {
        logFinancialStatus(); // Update financial status after trade
    }
}

// Initialize Logging System
function initializeLoggingSystem() {
    // Log initial financial status
    logFinancialStatus();
    
    // Log game start event
    logEvent('neutral', 'Game Started', 'Your financial journey begins!');
}

// Open Logs Modal
function openLogsModal() {
    const modal = document.getElementById('logs-modal');
    if (!modal) {
        console.warn('Logs modal not found');
        if (typeof showToast === 'function') {
            showToast('Logs modal not available', 'error');
        }
        return;
    }
    
    // Use modal manager - allow stacking on top of other modals
    if (typeof openModal === 'function') {
        // Force open and allow stacking (logs modal should always be on top)
        openModal('logs-modal', true, true);
        // Ensure logs modal is on top by setting high z-index after opening
        setTimeout(() => {
            if (typeof updateModalZIndexes === 'function') {
                updateModalZIndexes();
            }
            const currentZIndex = parseInt(modal.style.zIndex) || 1095;
            modal.style.zIndex = currentZIndex + 100; // Extra boost to ensure it's on top
        }, 10);
    } else {
        modal.classList.add('active');
        modal.style.zIndex = '1200'; // High z-index if modal manager not available
    }
    
    // Display content after a brief delay to ensure modal is visible
    setTimeout(() => {
        displayLogsContent('transactions');
        
        // Tab switching
        document.querySelectorAll('.logs-tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.logs-tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                displayLogsContent(btn.dataset.tab);
            });
        });
    }, 100);
}

function displayLogsContent(tab) {
    const content = document.getElementById('logs-content');
    if (!content) return;
    
    switch(tab) {
        case 'transactions':
            displayTransactionsLog(content);
            break;
        case 'events':
            displayEventsLog(content);
            break;
        case 'financial':
            displayFinancialLog(content);
            break;
    }
}

function displayTransactionsLog(content) {
    const transactions = [...logsSystem.transactions].reverse(); // Latest first
    
    if (transactions.length === 0) {
        content.innerHTML = '<div style="padding: 40px; text-align: center; color: var(--text-secondary);">No transactions recorded yet.</div>';
        return;
    }
    
    let html = `
        <div class="logs-table-container">
            <table class="logs-table">
                <thead>
                    <tr>
                        <th>Turn</th>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Cash After</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    transactions.forEach(txn => {
        const date = new Date(txn.timestamp).toLocaleDateString();
        const time = new Date(txn.timestamp).toLocaleTimeString();
        const amountClass = txn.amount >= 0 ? 'positive' : 'negative';
        const typeLabel = txn.type.charAt(0).toUpperCase() + txn.type.slice(1);
        
        html += `
            <tr>
                <td>${txn.turn}</td>
                <td>${date}<br><span style="font-size: 0.8em; color: var(--text-secondary);">${time}</span></td>
                <td><span class="log-badge log-badge-${txn.type}">${typeLabel}</span></td>
                <td>${txn.description}</td>
                <td class="money ${amountClass}">${txn.amount >= 0 ? '+' : ''}${formatMoney(txn.amount)}</td>
                <td class="money">${formatMoney(txn.cashAfter)}</td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
        </div>
    `;
    
    content.innerHTML = html;
}

function displayEventsLog(content) {
    const events = [...logsSystem.events].reverse(); // Latest first
    
    if (events.length === 0) {
        content.innerHTML = '<div style="padding: 40px; text-align: center; color: var(--text-secondary);">No events recorded yet.</div>';
        return;
    }
    
    let html = `
        <div class="logs-table-container">
            <table class="logs-table">
                <thead>
                    <tr>
                        <th>Turn</th>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Title</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    events.forEach(evt => {
        const date = new Date(evt.timestamp).toLocaleDateString();
        const time = new Date(evt.timestamp).toLocaleTimeString();
        const typeClass = evt.type === 'positive' ? 'positive' : evt.type === 'negative' ? 'negative' : 'neutral';
        
        html += `
            <tr>
                <td>${evt.turn}</td>
                <td>${date}<br><span style="font-size: 0.8em; color: var(--text-secondary);">${time}</span></td>
                <td><span class="log-badge log-badge-${typeClass}">${evt.type}</span></td>
                <td><strong>${evt.title}</strong></td>
                <td>${evt.description}</td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
        </div>
    `;
    
    content.innerHTML = html;
}

function displayFinancialLog(content) {
    const financial = [...logsSystem.financial].reverse(); // Latest first
    
    if (financial.length === 0) {
        content.innerHTML = '<div style="padding: 40px; text-align: center; color: var(--text-secondary);">No financial records yet.</div>';
        return;
    }
    
    let html = `
        <div class="logs-table-container">
            <table class="logs-table">
                <thead>
                    <tr>
                        <th>Turn</th>
                        <th>Date</th>
                        <th>Cash</th>
                        <th>Net Worth</th>
                        <th>Portfolio</th>
                        <th>Financial Health</th>
                        <th>Credit Score</th>
                        <th>Changes</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    financial.forEach(fin => {
        const date = new Date(fin.timestamp).toLocaleDateString();
        const changes = fin.changes || {};
        const netWorthChange = changes.netWorth || 0;
        const netWorthClass = netWorthChange >= 0 ? 'positive' : 'negative';
        
        html += `
            <tr>
                <td>${fin.turn}</td>
                <td>${date}</td>
                <td class="money">${formatMoney(fin.cash)}</td>
                <td class="money">${formatMoney(fin.netWorth)}</td>
                <td class="money">${formatMoney(fin.portfolioValue)}</td>
                <td>${Math.round(fin.financialHealth)}%</td>
                <td>${fin.creditScore || 'N/A'}</td>
                <td>
                    ${Object.keys(changes).length > 0 ? `
                        <div style="font-size: 0.85em;">
                            ${changes.netWorth ? `<div class="${netWorthClass}">Net Worth: ${changes.netWorth >= 0 ? '+' : ''}${formatMoney(changes.netWorth)}</div>` : ''}
                            ${changes.cash ? `<div>Cash: ${changes.cash >= 0 ? '+' : ''}${formatMoney(changes.cash)}</div>` : ''}
                            ${changes.financialHealth ? `<div>Health: ${changes.financialHealth >= 0 ? '+' : ''}${changes.financialHealth.toFixed(1)}%</div>` : ''}
                        </div>
                    ` : '-'}
                </td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
        </div>
    `;
    
    content.innerHTML = html;
}

