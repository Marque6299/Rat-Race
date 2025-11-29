// Bank System with Credit Score
const bankSystem = {
    savingsAccount: 0,
    creditScore: 750, // Starting credit score (300-850 range)
    creditHistory: []
};

// Credit Score Calculation Factors
function calculateCreditScore() {
    let score = 300; // Base score
    
    // Payment History (35% of score)
    const paymentHistory = calculatePaymentHistory();
    score += paymentHistory * 0.35;
    
    // Credit Utilization (30% of score)
    const creditUtilization = calculateCreditUtilization();
    score += creditUtilization * 0.30;
    
    // Length of Credit History (15% of score)
    const creditHistoryLength = calculateCreditHistoryLength();
    score += creditHistoryLength * 0.15;
    
    // Credit Mix (10% of score)
    const creditMix = calculateCreditMix();
    score += creditMix * 0.10;
    
    // New Credit (10% of score)
    const newCredit = calculateNewCredit();
    score += newCredit * 0.10;
    
    // Net Worth Bonus
    const netWorthBonus = Math.min(50, gameState.player.netWorth / 20000);
    score += netWorthBonus;
    
    // Financial Health Bonus
    const healthBonus = gameState.player.financialHealth / 2;
    score += healthBonus;
    
    // Cap at 850
    bankSystem.creditScore = Math.max(300, Math.min(850, Math.round(score)));
    
    return bankSystem.creditScore;
}

function calculatePaymentHistory() {
    // Check if player has missed any loan payments
    let missedPayments = 0;
    let totalPayments = 0;
    
    bankSystem.creditHistory.forEach(record => {
        totalPayments++;
        if (record.type === 'missed_payment') {
            missedPayments++;
        }
    });
    
    if (totalPayments === 0) return 200; // No history = neutral
    
    const onTimeRate = 1 - (missedPayments / totalPayments);
    return onTimeRate * 200; // 0-200 points
}

function calculateCreditUtilization() {
    const totalDebt = gameState.player.loans.reduce((sum, loan) => sum + loan.principal, 0);
    const totalCredit = calculateTotalCreditLimit();
    
    if (totalCredit === 0) return 100; // No credit = neutral
    
    const utilization = totalDebt / totalCredit;
    
    // Optimal utilization is 10-30%
    if (utilization <= 0.30) return 200;
    if (utilization <= 0.50) return 150;
    if (utilization <= 0.70) return 100;
    if (utilization <= 0.90) return 50;
    return 0; // Over 90% utilization is bad
}

function calculateTotalCreditLimit() {
    // Based on net worth and income
    const baseLimit = gameState.player.monthlyIncome * 12; // 1 year of income
    const netWorthBonus = gameState.player.netWorth * 0.5;
    return baseLimit + netWorthBonus;
}

function calculateCreditHistoryLength() {
    // Based on game turns (longer history = better)
    const months = gameState.turn;
    if (months < 6) return 50;
    if (months < 12) return 100;
    if (months < 24) return 150;
    return 200; // 2+ years
}

function calculateCreditMix() {
    // Variety of credit types
    const hasLoans = gameState.player.loans.length > 0;
    const hasProperties = gameState.player.properties.length > 0;
    const hasPortfolio = typeof getTotalPortfolioValue === 'function' ? 
        getTotalPortfolioValue() > 0 : 
        Object.keys(gameState.player.portfolio).some(type => gameState.player.portfolio[type].length > 0);
    
    let mix = 0;
    if (hasLoans) mix += 50;
    if (hasProperties) mix += 50;
    if (hasPortfolio) mix += 50;
    if (hasLoans && hasProperties) mix += 50; // Bonus for diversity
    
    return Math.min(200, mix);
}

function calculateNewCredit() {
    // Recent credit inquiries (too many = bad)
    const recentInquiries = bankSystem.creditHistory.filter(r => 
        r.type === 'credit_inquiry' && r.turn > gameState.turn - 6
    ).length;
    
    if (recentInquiries === 0) return 200;
    if (recentInquiries === 1) return 150;
    if (recentInquiries === 2) return 100;
    return Math.max(0, 200 - (recentInquiries * 50));
}

// Get Credit Score Rating
function getCreditScoreRating(score) {
    if (score >= 800) return { rating: 'Excellent', color: 'var(--success-color)' };
    if (score >= 740) return { rating: 'Very Good', color: 'var(--secondary-color)' };
    if (score >= 670) return { rating: 'Good', color: 'var(--primary-color)' };
    if (score >= 580) return { rating: 'Fair', color: 'var(--warning-color)' };
    return { rating: 'Poor', color: 'var(--danger-color)' };
}

// Bank Functions
function openBankModal() {
    const modal = document.getElementById('bank-modal');
    if (!modal) return;
    
    // Use modal manager
    if (typeof openModal === 'function') {
        if (!openModal('bank-modal')) return;
    } else {
        modal.classList.add('active');
    }
    
    calculateCreditScore();
    displayBankContent('account');
    
    // Tab switching
    document.querySelectorAll('.bank-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.bank-tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            displayBankContent(btn.dataset.tab);
        });
    });
}

function displayBankContent(tab) {
    const content = document.getElementById('bank-content');
    if (!content) return;
    
    switch(tab) {
        case 'account':
            displayBankAccount(content);
            break;
        case 'credit':
            displayCreditScore(content);
            break;
        case 'loans':
            displayBankLoans(content);
            break;
    }
}

function displayBankAccount(content) {
    content.innerHTML = `
        <div style="background: var(--bg-dark); padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <div>
                    <h3 style="margin: 0;">Savings Account</h3>
                    <div style="font-size: 0.9em; color: var(--text-secondary);">Balance</div>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 2em; font-weight: 600; color: var(--secondary-color);">
                        ${formatMoney(bankSystem.savingsAccount)}
                    </div>
                </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 15px;">
                <div>
                    <label style="display: block; margin-bottom: 5px; color: var(--text-secondary);">Deposit Amount:</label>
                    <input type="number" id="deposit-amount" min="0" step="100" 
                           style="width: 100%; padding: 10px; background: var(--bg-light); border: 2px solid var(--border-color); border-radius: 8px; color: var(--text-primary);">
                </div>
                <div>
                    <label style="display: block; margin-bottom: 5px; color: var(--text-secondary);">Withdraw Amount:</label>
                    <input type="number" id="withdraw-amount" min="0" step="100" 
                           style="width: 100%; padding: 10px; background: var(--bg-light); border: 2px solid var(--border-color); border-radius: 8px; color: var(--text-primary);">
                </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 15px;">
                <button class="btn-primary" onclick="depositToBank()">Deposit</button>
                <button class="btn-secondary" onclick="withdrawFromBank()">Withdraw</button>
            </div>
        </div>
        <div style="background: var(--bg-dark); padding: 15px; border-radius: 10px;">
            <h4 style="margin: 0 0 10px 0;">Financial Statistics</h4>
            <div class="stat-grid">
                <div class="stat-item">
                    <label>Cash on Hand:</label>
                    <span class="money">${formatMoney(gameState.player.cash)}</span>
                </div>
                <div class="stat-item">
                    <label>Savings Account:</label>
                    <span class="money">${formatMoney(bankSystem.savingsAccount)}</span>
                </div>
                <div class="stat-item">
                    <label>Total Liquid:</label>
                    <span class="money">${formatMoney(gameState.player.cash + bankSystem.savingsAccount)}</span>
                </div>
                <div class="stat-item">
                    <label>Net Worth:</label>
                    <span class="money">${formatMoney(gameState.player.netWorth)}</span>
                </div>
            </div>
        </div>
    `;
}

function displayCreditScore(content) {
    const rating = getCreditScoreRating(bankSystem.creditScore);
    
    content.innerHTML = `
        <div style="background: var(--bg-dark); padding: 20px; border-radius: 10px; margin-bottom: 20px; text-align: center;">
            <div style="font-size: 3em; font-weight: 600; color: ${rating.color}; margin-bottom: 10px;">
                ${bankSystem.creditScore}
            </div>
            <div style="font-size: 1.2em; color: ${rating.color}; margin-bottom: 20px;">
                ${rating.rating}
            </div>
            <div style="background: var(--bg-light); padding: 15px; border-radius: 8px; margin-top: 20px;">
                <div style="font-size: 0.9em; color: var(--text-secondary); margin-bottom: 10px;">Credit Score Range: 300-850</div>
                <div style="width: 100%; height: 20px; background: var(--bg-dark); border-radius: 10px; overflow: hidden; position: relative;">
                    <div style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; background: linear-gradient(to right, var(--danger-color) 0%, var(--warning-color) 35%, var(--primary-color) 50%, var(--secondary-color) 70%, var(--success-color) 100%);"></div>
                    <div style="position: absolute; left: ${((bankSystem.creditScore - 300) / 550) * 100}%; top: 0; width: 3px; height: 100%; background: white; box-shadow: 0 0 5px rgba(255,255,255,0.8);"></div>
                </div>
            </div>
        </div>
        <div style="background: var(--bg-dark); padding: 15px; border-radius: 10px;">
            <h4 style="margin: 0 0 15px 0;">Credit Factors</h4>
            <div class="stat-grid">
                <div class="stat-item">
                    <label>Payment History:</label>
                    <span>${calculatePaymentHistory().toFixed(0)}/200</span>
                </div>
                <div class="stat-item">
                    <label>Credit Utilization:</label>
                    <span>${calculateCreditUtilization().toFixed(0)}/200</span>
                </div>
                <div class="stat-item">
                    <label>Credit History:</label>
                    <span>${calculateCreditHistoryLength().toFixed(0)}/200</span>
                </div>
                <div class="stat-item">
                    <label>Credit Mix:</label>
                    <span>${calculateCreditMix().toFixed(0)}/200</span>
                </div>
                <div class="stat-item">
                    <label>New Credit:</label>
                    <span>${calculateNewCredit().toFixed(0)}/200</span>
                </div>
            </div>
        </div>
    `;
}

function displayBankLoans(content) {
    const maxLoans = getMaxLoans();
    const availableLoans = maxLoans - gameState.player.loans.length;
    const totalCreditLimit = calculateTotalCreditLimit();
    const usedCredit = gameState.player.loans.reduce((sum, loan) => sum + loan.principal, 0);
    const availableCredit = totalCreditLimit - usedCredit;
    
    content.innerHTML = `
        <div style="background: var(--bg-dark); padding: 15px; border-radius: 10px; margin-bottom: 15px;">
            <h4 style="margin: 0 0 10px 0;">Loan Eligibility</h4>
            <div class="stat-grid">
                <div class="stat-item">
                    <label>Credit Score:</label>
                    <span style="color: ${getCreditScoreRating(bankSystem.creditScore).color};">
                        ${bankSystem.creditScore} (${getCreditScoreRating(bankSystem.creditScore).rating})
                    </span>
                </div>
                <div class="stat-item">
                    <label>Max Active Loans:</label>
                    <span>${maxLoans}</span>
                </div>
                <div class="stat-item">
                    <label>Available Loan Slots:</label>
                    <span style="color: ${availableLoans > 0 ? 'var(--success-color)' : 'var(--danger-color)'};">
                        ${availableLoans}
                    </span>
                </div>
                <div class="stat-item">
                    <label>Total Credit Limit:</label>
                    <span class="money">${formatMoney(totalCreditLimit)}</span>
                </div>
                <div class="stat-item">
                    <label>Used Credit:</label>
                    <span class="money">${formatMoney(usedCredit)}</span>
                </div>
                <div class="stat-item">
                    <label>Available Credit:</label>
                    <span class="money" style="color: ${availableCredit > 0 ? 'var(--success-color)' : 'var(--danger-color)'};">
                        ${formatMoney(availableCredit)}
                    </span>
                </div>
            </div>
        </div>
        <div style="margin-bottom: 15px;">
            <button class="btn-primary" onclick="openLoanModal(); closeModalById('bank-modal');" 
                    ${availableLoans <= 0 ? 'disabled style="opacity: 0.5;"' : ''}>
                Apply for New Loan
            </button>
        </div>
        <div>
            <h4 style="margin: 0 0 15px 0;">Active Loans</h4>
            ${gameState.player.loans.length === 0 ? 
                '<div style="padding: 20px; text-align: center; color: var(--text-secondary);">No active loans</div>' :
                gameState.player.loans.map(loan => {
                    const monthlyInterest = loan.principal * loan.interestRate / 12;
                    const minPayment = Math.max(loan.principal * 0.02, monthlyInterest + 100);
                    const canPayEarly = loan.terms?.allowEarlyPayoff !== false;
                    return `
                        <div style="background: var(--bg-dark); padding: 15px; margin-bottom: 10px; border-radius: 8px; border-left: 4px solid var(--warning-color);">
                            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
                                <div>
                                    <strong>${loan.name}</strong><br>
                                    <div style="font-size: 0.85em; color: var(--text-secondary);">Term: ${loan.terms?.duration || 'N/A'} months</div>
                                </div>
                                <div style="text-align: right;">
                                    <div style="font-size: 1.2em; font-weight: 600; color: var(--warning-color);">${formatMoney(loan.principal)}</div>
                                    <div style="font-size: 0.85em; color: var(--text-secondary);">Remaining</div>
                                </div>
                            </div>
                            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; font-size: 0.9em; margin-bottom: 10px;">
                                <div>
                                    <div style="color: var(--text-secondary);">Interest Rate</div>
                                    <div>${(loan.interestRate * 100).toFixed(2)}% APR</div>
                                </div>
                                <div>
                                    <div style="color: var(--text-secondary);">Monthly Payment</div>
                                    <div>~${formatMoney(minPayment)}</div>
                                </div>
                                <div>
                                    <div style="color: var(--text-secondary);">Early Payoff</div>
                                    <div>${canPayEarly ? '✅ Allowed' : '❌ Not Allowed'}</div>
                                </div>
                            </div>
                            ${canPayEarly ? `
                                <div style="display: flex; gap: 10px; margin-top: 10px;">
                                    <input type="number" id="payoff-${loan.name.replace(/\s+/g, '-')}" 
                                           placeholder="Amount to pay" min="0" max="${loan.principal}" step="100"
                                           style="flex: 1; padding: 8px; background: var(--bg-light); border: 2px solid var(--border-color); border-radius: 6px; color: var(--text-primary);">
                                    <button class="btn-secondary" onclick="payOffLoan('${loan.name.replace(/\s+/g, '-')}')">Pay Off</button>
                                </div>
                            ` : ''}
                        </div>
                    `;
                }).join('')
            }
        </div>
    `;
}

function getMaxLoans() {
    const creditScore = bankSystem.creditScore;
    const netWorth = gameState.player.netWorth;
    
    // Base on credit score
    let maxLoans = 1;
    if (creditScore >= 800) maxLoans = 5;
    else if (creditScore >= 740) maxLoans = 4;
    else if (creditScore >= 670) maxLoans = 3;
    else if (creditScore >= 580) maxLoans = 2;
    
    // Net worth bonus
    if (netWorth >= 100000) maxLoans += 1;
    if (netWorth >= 500000) maxLoans += 1;
    
    return Math.min(7, maxLoans); // Cap at 7 loans
}

function depositToBank() {
    const amount = parseFloat(document.getElementById('deposit-amount').value) || 0;
    
    if (amount <= 0) {
        if (typeof showToast === 'function') {
            showToast('Please enter a valid amount', 'error');
        }
        return;
    }
    
    if (gameState.player.cash < amount) {
        if (typeof showToast === 'function') {
            showToast('Insufficient cash', 'error');
        }
        return;
    }
    
    gameState.player.cash -= amount;
    bankSystem.savingsAccount += amount;
    
    // Log transaction
    if (typeof logTransaction === 'function') {
        logTransaction('bank', `Deposit to savings account`, -amount, {
            savingsBalance: bankSystem.savingsAccount
        });
    }
    
    if (typeof showToast === 'function') {
        showToast(`Deposited ${formatMoney(amount)} to savings account`, 'success');
    }
    
    displayBankContent('account');
    if (typeof updateDisplay === 'function') {
        updateDisplay();
    }
}

function withdrawFromBank() {
    const amount = parseFloat(document.getElementById('withdraw-amount').value) || 0;
    
    if (amount <= 0) {
        if (typeof showToast === 'function') {
            showToast('Please enter a valid amount', 'error');
        }
        return;
    }
    
    if (bankSystem.savingsAccount < amount) {
        if (typeof showToast === 'function') {
            showToast('Insufficient savings', 'error');
        }
        return;
    }
    
    bankSystem.savingsAccount -= amount;
    gameState.player.cash += amount;
    
    // Log transaction
    if (typeof logTransaction === 'function') {
        logTransaction('bank', `Withdrawal from savings account`, amount, {
            savingsBalance: bankSystem.savingsAccount
        });
    }
    
    if (typeof showToast === 'function') {
        showToast(`Withdrew ${formatMoney(amount)} from savings account`, 'success');
    }
    
    displayBankContent('account');
    if (typeof updateDisplay === 'function') {
        updateDisplay();
    }
}

function payOffLoan(loanId) {
    const loanName = loanId.replace(/-/g, ' ');
    const loan = gameState.player.loans.find(l => l.name === loanName);
    if (!loan) return;
    
    const input = document.getElementById(`payoff-${loanId}`);
    const amount = parseFloat(input.value) || 0;
    
    if (amount <= 0) {
        if (typeof showToast === 'function') {
            showToast('Please enter a valid amount', 'error');
        }
        return;
    }
    
    if (amount > loan.principal) {
        if (typeof showToast === 'function') {
            showToast('Amount exceeds loan principal', 'error');
        }
        return;
    }
    
    if (gameState.player.cash < amount) {
        if (typeof showToast === 'function') {
            showToast('Insufficient cash', 'error');
        }
        return;
    }
    
    gameState.player.cash -= amount;
    loan.principal -= amount;
    
    // Record payment in credit history
    bankSystem.creditHistory.push({
        turn: gameState.turn,
        type: 'payment',
        amount: amount
    });
    
    if (loan.principal < 1) {
        // Loan paid off
        const index = gameState.player.loans.indexOf(loan);
        gameState.player.loans.splice(index, 1);
        if (typeof showToast === 'function') {
            showToast(`Loan ${loan.name} paid off completely!`, 'success');
        }
    } else {
        if (typeof showToast === 'function') {
            showToast(`Paid ${formatMoney(amount)} towards ${loan.name}`, 'success');
        }
    }
    
    displayBankContent('loans');
    if (typeof updateDisplay === 'function') {
        updateDisplay();
    }
}

