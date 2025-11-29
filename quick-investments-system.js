// Quick Investment Products System
const quickInvestmentsSystem = {
    availableProducts: [],
    playerProducts: [] // Products player owns
};

// Investment Product Definitions
const investmentProductDefinitions = [
    {
        id: 'savings_account',
        name: 'High-Yield Savings Account',
        type: 'savings',
        description: 'Safe savings account with guaranteed returns.',
        minInvestment: 100,
        maxInvestment: 100000,
        annualReturn: 0.04, // 4% APY
        risk: 'low',
        liquidity: 'high', // Can withdraw anytime
        term: 0, // No term
        pricePerUnit: 1, // $1 per unit (dollar-based)
        defaultRisk: 0.0,
        defaultProfile: 'none'
    },
    {
        id: 'cd_6month',
        name: '6-Month Certificate of Deposit',
        type: 'cd',
        description: 'Fixed-term deposit with guaranteed returns. Cannot withdraw early.',
        minInvestment: 500,
        maxInvestment: 50000,
        annualReturn: 0.045, // 4.5% APY
        risk: 'low',
        liquidity: 'low',
        term: 6, // 6 months
        pricePerUnit: 1,
        defaultRisk: 0.0,
        defaultProfile: 'none'
    },
    {
        id: 'cd_12month',
        name: '12-Month Certificate of Deposit',
        type: 'cd',
        description: 'One-year fixed-term deposit with higher returns.',
        minInvestment: 1000,
        maxInvestment: 100000,
        annualReturn: 0.05, // 5% APY
        risk: 'low',
        liquidity: 'low',
        term: 12, // 12 months
        pricePerUnit: 1,
        defaultRisk: 0.0,
        defaultProfile: 'none'
    },
    {
        id: 'money_market',
        name: 'Money Market Account',
        type: 'money_market',
        description: 'Higher yield than savings with check-writing privileges.',
        minInvestment: 1000,
        maxInvestment: 250000,
        annualReturn: 0.042, // 4.2% APY
        risk: 'low',
        liquidity: 'high',
        term: 0,
        pricePerUnit: 1,
        defaultRisk: 0.0,
        defaultProfile: 'none'
    },
    {
        id: 'treasury_bond',
        name: 'Treasury Bond (10-Year)',
        type: 'bond',
        description: 'Government bond with guaranteed returns.',
        minInvestment: 1000,
        maxInvestment: 100000,
        annualReturn: 0.035, // 3.5% APY
        risk: 'very_low',
        liquidity: 'medium',
        term: 120, // 10 years
        pricePerUnit: 1000, // $1000 per bond
        defaultRisk: 0.0, // 0% default risk (government guaranteed)
        defaultProfile: 'government'
    },
    {
        id: 'corporate_bond',
        name: 'Corporate Bond (Investment Grade)',
        type: 'bond',
        description: 'Corporate bond with higher returns than treasury bonds.',
        minInvestment: 5000,
        maxInvestment: 200000,
        annualReturn: 0.055, // 5.5% APY
        risk: 'medium',
        liquidity: 'medium',
        term: 60, // 5 years
        pricePerUnit: 1000, // $1000 per bond
        defaultRisk: 0.02, // 2% default risk
        defaultProfile: 'investment_grade'
    },
    {
        id: 'high_yield_bond',
        name: 'High-Yield Bond Fund',
        type: 'bond',
        description: 'Higher risk bonds with higher potential returns.',
        minInvestment: 2000,
        maxInvestment: 200000,
        annualReturn: 0.075, // 7.5% APY
        risk: 'high',
        liquidity: 'medium',
        term: 0,
        pricePerUnit: 1000, // $1000 per bond
        defaultRisk: 0.05, // 5% default risk
        defaultProfile: 'high_yield'
    },
    {
        id: 'index_fund',
        name: 'S&P 500 Index Fund',
        type: 'fund',
        description: 'Diversified stock market fund tracking the S&P 500.',
        minInvestment: 500,
        maxInvestment: 500000,
        annualReturn: 0.08, // 8% average
        risk: 'medium',
        liquidity: 'high',
        term: 0,
        pricePerUnit: 50, // $50 per share
        defaultRisk: 0.0,
        defaultProfile: 'none'
    },
    {
        id: 'reit',
        name: 'Real Estate Investment Trust (REIT)',
        type: 'reit',
        description: 'Invest in real estate without buying property directly.',
        minInvestment: 1000,
        maxInvestment: 300000,
        annualReturn: 0.07, // 7% average
        risk: 'medium',
        liquidity: 'high',
        term: 0,
        pricePerUnit: 25, // $25 per share
        defaultRisk: 0.0,
        defaultProfile: 'none'
    },
    {
        id: 'dividend_stock',
        name: 'Dividend Stock Fund',
        type: 'fund',
        description: 'Fund focused on dividend-paying stocks.',
        minInvestment: 1000,
        maxInvestment: 400000,
        annualReturn: 0.065, // 6.5% average
        risk: 'medium',
        liquidity: 'high',
        term: 0,
        pricePerUnit: 30, // $30 per share
        defaultRisk: 0.0,
        defaultProfile: 'none'
    }
];

// Generate Available Products
function generateAvailableProducts() {
    // Always show all products (they're always available)
    quickInvestmentsSystem.availableProducts = investmentProductDefinitions.map(product => ({
        ...product
    }));
}

// Purchase Investment Product (by amount or units)
function purchaseInvestmentProduct(productId, value, mode = 'amount') {
    const product = quickInvestmentsSystem.availableProducts.find(p => p.id === productId);
    if (!product) {
        if (typeof showToast === 'function') {
            showToast('Product not found', 'error');
        }
        return false;
    }
    
    let amount, units;
    
    if (mode === 'units') {
        // Purchase by number of units
        units = Math.floor(value);
        amount = units * product.pricePerUnit;
    } else {
        // Purchase by amount
        amount = value;
        units = Math.floor(amount / product.pricePerUnit);
        amount = units * product.pricePerUnit; // Round to nearest unit
    }
    
    if (amount < product.minInvestment) {
        if (typeof showToast === 'function') {
            showToast(`Minimum investment is ${formatMoney(product.minInvestment)}`, 'error');
        }
        return false;
    }
    
    if (amount > product.maxInvestment) {
        if (typeof showToast === 'function') {
            showToast(`Maximum investment is ${formatMoney(product.maxInvestment)}`, 'error');
        }
        return false;
    }
    
    if (gameState.player.cash < amount) {
        if (typeof showToast === 'function') {
            showToast('Insufficient funds', 'error');
        }
        return false;
    }
    
    if (units <= 0) {
        if (typeof showToast === 'function') {
            showToast('Invalid number of units', 'error');
        }
        return false;
    }
    
    // Deduct cash
    gameState.player.cash -= amount;
    
    // Add to player products
    const playerProduct = {
        id: `${productId}_${Date.now()}`,
        productId: productId,
        name: product.name,
        type: product.type,
        amount: amount,
        units: units,
        pricePerUnit: product.pricePerUnit,
        purchaseDate: gameState.turn,
        maturityDate: product.term > 0 ? gameState.turn + product.term : null,
        annualReturn: product.annualReturn,
        risk: product.risk,
        liquidity: product.liquidity,
        defaultRisk: product.defaultRisk || 0,
        defaultProfile: product.defaultProfile || 'none'
    };
    
    quickInvestmentsSystem.playerProducts.push(playerProduct);
    
    // Log transaction
    if (typeof logTransaction === 'function') {
        logTransaction('investment', `Purchased ${product.name}`, -amount, {
            investmentType: 'quick_product',
            productId: productId,
            units: units,
            annualReturn: product.annualReturn,
            term: product.term
        });
    }
    
    if (typeof showToast === 'function') {
        showToast(`Purchased ${units} unit(s) of ${product.name} for ${formatMoney(amount)}`, 'success');
    }
    
    addStory(`💰 You invested ${formatMoney(amount)} (${units} unit(s)) in ${product.name}.`);
    
    if (typeof updateDisplay === 'function') {
        updateDisplay();
    }
    
    return true;
}

// Sell Investment Product
function sellInvestmentProduct(productId) {
    const product = quickInvestmentsSystem.playerProducts.find(p => p.id === productId);
    if (!product) {
        if (typeof showToast === 'function') {
            showToast('Investment not found', 'error');
        }
        return false;
    }
    
    const productDef = investmentProductDefinitions.find(p => p.id === product.productId);
    if (!productDef) return false;
    
    // Check if product can be sold (liquidity and term)
    if (productDef.term > 0 && product.maturityDate && gameState.turn < product.maturityDate) {
        if (typeof showToast === 'function') {
            const turnsRemaining = product.maturityDate - gameState.turn;
            showToast(`Cannot sell early. Matures in ${turnsRemaining} turn(s). Early withdrawal penalty applies.`, 'error');
        }
        return false;
    }
    
    // Calculate return
    const turnsHeld = gameState.turn - product.purchaseDate;
    const monthlyReturn = product.annualReturn / 12;
    const totalReturn = product.amount * (1 + monthlyReturn * turnsHeld);
    
    // Early withdrawal penalty (if applicable)
    let finalAmount = totalReturn;
    if (productDef.term > 0 && product.maturityDate && gameState.turn < product.maturityDate) {
        // Apply penalty (10% of interest earned)
        const interestEarned = totalReturn - product.amount;
        const penalty = interestEarned * 0.1;
        finalAmount = product.amount + interestEarned - penalty;
    }
    
    // Add cash back
    gameState.player.cash += finalAmount;
    
    // Calculate profit/loss
    const profit = finalAmount - product.amount;
    
    // Remove from player products
    const index = quickInvestmentsSystem.playerProducts.indexOf(product);
    quickInvestmentsSystem.playerProducts.splice(index, 1);
    
    // Log transaction
    if (typeof logTransaction === 'function') {
        logTransaction('investment', `Sold ${product.name}`, finalAmount, {
            investmentType: 'quick_product',
            profit: profit,
            turnsHeld: turnsHeld
        });
    }
    
    if (typeof showToast === 'function') {
        const profitText = profit >= 0 ? `Profit: ${formatMoney(profit)}` : `Loss: ${formatMoney(Math.abs(profit))}`;
        showToast(`Sold ${product.name}. ${profitText}`, 'success');
    }
    
    addStory(`💰 You sold ${product.name} for ${formatMoney(finalAmount)}. ${profit >= 0 ? 'Profit' : 'Loss'}: ${formatMoney(profit)}.`);
    
    if (typeof updateDisplay === 'function') {
        updateDisplay();
    }
    
    return true;
}

// Process Investment Products Each Turn
function processInvestmentProducts() {
    let totalReturns = 0;
    const defaultedProducts = [];
    
    quickInvestmentsSystem.playerProducts.forEach((product, index) => {
        // Check for bond defaults
        if (product.type === 'bond' && product.defaultRisk > 0) {
            // Roll for default
            if (Math.random() < product.defaultRisk) {
                // Bond defaulted!
                defaultedProducts.push({
                    product: product,
                    index: index
                });
                addStory(`⚠️ ${product.name} has defaulted! You lost ${formatMoney(product.amount)}.`);
                
                // Log transaction
                if (typeof logTransaction === 'function') {
                    logTransaction('loss', `Bond default: ${product.name}`, -product.amount, {
                        lossType: 'bond_default',
                        productId: product.productId
                    });
                }
                return; // Skip return calculation for defaulted bonds
            }
        }
        
        // Calculate monthly return
        const monthlyReturn = product.annualReturn / 12;
        const returnAmount = product.amount * monthlyReturn;
        totalReturns += returnAmount;
        
        // Check if product has matured (for term products)
        if (product.maturityDate && gameState.turn >= product.maturityDate) {
            // Product matured - can be sold without penalty
            addStory(`📅 Your ${product.name} has matured. You can now sell it without penalty.`);
        }
    });
    
    // Remove defaulted products
    defaultedProducts.reverse().forEach(({ index }) => {
        quickInvestmentsSystem.playerProducts.splice(index, 1);
    });
    
    // Add returns to cash
    if (totalReturns > 0) {
        gameState.player.cash += totalReturns;
        gameState.player.monthlyStats.investmentReturns += totalReturns;
        
        // Log transaction
        if (typeof logTransaction === 'function') {
            logTransaction('income', 'Quick investment product returns', totalReturns, {
                incomeType: 'investment_product',
                productCount: quickInvestmentsSystem.playerProducts.length
            });
        }
    }
    
    return totalReturns;
}

// Display Quick Investments Modal
function openQuickInvestmentsModal() {
    const modal = document.getElementById('quick-investments-modal');
    if (!modal) {
        createQuickInvestmentsModal();
    }
    
    // Use modal manager
    if (typeof openModal === 'function') {
        if (!openModal('quick-investments-modal')) return;
    } else {
        modal.classList.add('active');
    }
    
    displayQuickInvestments();
}

// Create Quick Investments Modal
function createQuickInvestmentsModal() {
    const modal = document.createElement('div');
    modal.id = 'quick-investments-modal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 900px; max-height: 90vh;">
            <span class="close" onclick="closeModalById('quick-investments-modal')">&times;</span>
            <h2>💰 Quick Investment Products</h2>
            <div style="margin-bottom: 20px;">
                <div class="bank-tabs">
                    <button class="bank-tab-btn active" data-tab="available">Available Products</button>
                    <button class="bank-tab-btn" data-tab="owned">My Investments</button>
                </div>
            </div>
            <div id="quick-investments-content" style="max-height: 65vh; overflow-y: auto;"></div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Tab switching
    document.querySelectorAll('.bank-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.bank-tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            displayQuickInvestments(btn.dataset.tab);
        });
    });
}

// Display Quick Investments
function displayQuickInvestments(tab = 'available') {
    const content = document.getElementById('quick-investments-content');
    if (!content) return;
    
    if (tab === 'available') {
        displayAvailableProducts(content);
    } else {
        displayOwnedProducts(content);
    }
}

// Display Available Products
function displayAvailableProducts(content) {
    generateAvailableProducts();
    
    if (quickInvestmentsSystem.availableProducts.length === 0) {
        content.innerHTML = '<p style="color: var(--text-secondary);">No products available.</p>';
        return;
    }
    
    let html = '';
    
    quickInvestmentsSystem.availableProducts.forEach(product => {
        const riskColor = product.risk === 'very_low' || product.risk === 'low' ? 'var(--success-color)' :
                         product.risk === 'medium' ? 'var(--warning-color)' : 'var(--danger-color)';
        
        html += `
            <div style="background: var(--bg-dark); padding: 20px; border-radius: 10px; margin-bottom: 15px; border-left: 4px solid ${riskColor};">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
                    <div>
                        <div style="font-size: 1.1em; font-weight: 600;">${product.name}</div>
                        <div style="color: var(--text-secondary); font-size: 0.9em; margin-top: 3px;">${product.description}</div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 1.2em; font-weight: 600; color: var(--success-color);">
                            ${(product.annualReturn * 100).toFixed(2)}% APY
                        </div>
                    </div>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 15px; font-size: 0.9em;">
                    <div>
                        <div style="color: var(--text-secondary);">Risk:</div>
                        <div style="color: ${riskColor}; text-transform: capitalize;">${product.risk.replace('_', ' ')}</div>
                    </div>
                    <div>
                        <div style="color: var(--text-secondary);">Liquidity:</div>
                        <div style="text-transform: capitalize;">${product.liquidity}</div>
                    </div>
                    <div>
                        <div style="color: var(--text-secondary);">Term:</div>
                        <div>${product.term > 0 ? `${product.term} months` : 'No term'}</div>
                    </div>
                    ${product.pricePerUnit ? `
                    <div>
                        <div style="color: var(--text-secondary);">Price per Unit:</div>
                        <div>${formatMoney(product.pricePerUnit)}</div>
                    </div>
                    ` : ''}
                </div>
                <div style="background: var(--bg-light); padding: 10px; border-radius: 8px; margin-bottom: 10px; font-size: 0.9em;">
                    <div>Investment Range: ${formatMoney(product.minInvestment)} - ${formatMoney(product.maxInvestment)}</div>
                </div>
                <div style="margin-bottom: 10px;">
                    <label style="display: block; margin-bottom: 5px; font-size: 0.9em;">Purchase Mode:</label>
                    <select id="purchase-mode-${product.id}" style="width: 100%; padding: 8px; background: var(--bg-light); border: 2px solid var(--border-color); border-radius: 8px; color: var(--text-primary); margin-bottom: 10px;">
                        <option value="amount">By Amount ($)</option>
                        <option value="units">By Units (${product.pricePerUnit ? formatMoney(product.pricePerUnit) + ' per unit' : 'units'})</option>
                    </select>
                </div>
                <div style="display: flex; gap: 10px; align-items: flex-start;">
                    <div style="flex: 1; min-width: 200px;">
                        <input type="number" id="invest-${product.id}" 
                               min="${product.minInvestment}" 
                               max="${product.maxInvestment}" 
                               step="${product.pricePerUnit > 1 ? product.pricePerUnit : 100}" 
                               placeholder="${product.pricePerUnit > 1 ? `Amount or units (${formatMoney(product.pricePerUnit)}/unit)` : 'Amount to invest'}"
                               style="width: 100%; padding: 12px; background: var(--bg-light); border: 2px solid var(--border-color); border-radius: 8px; color: var(--text-primary); font-size: 16px;">
                        <div id="invest-preview-${product.id}" style="margin-top: 8px; padding: 8px; background: var(--bg-dark); border-radius: 6px; font-size: 0.85em; color: var(--text-secondary); min-height: 20px;"></div>
                    </div>
                    <button class="btn-primary" onclick="purchaseInvestmentProductWithMode('${product.id}')" style="padding: 12px 24px; white-space: nowrap;">
                        Invest
                    </button>
                </div>
                ${product.defaultRisk > 0 ? `
                    <div style="margin-top: 10px; padding: 8px; background: rgba(239, 68, 68, 0.1); border-left: 3px solid var(--danger-color); border-radius: 4px; font-size: 0.85em;">
                        ⚠️ Default Risk: ${(product.defaultRisk * 100).toFixed(2)}% chance of default per turn
                    </div>
                ` : ''}
            </div>
        `;
    });
    
    content.innerHTML = html;
    
    // Attach real-time calculation listeners after HTML is inserted
    quickInvestmentsSystem.availableProducts.forEach(product => {
        const input = document.getElementById(`invest-${product.id}`);
        const preview = document.getElementById(`invest-preview-${product.id}`);
        const modeSelect = document.getElementById(`purchase-mode-${product.id}`);
        
        if (!input || !preview || !modeSelect) return;
        
        function updatePreview() {
            const mode = modeSelect.value;
            const value = parseFloat(input.value) || 0;
            
            if (value <= 0) {
                preview.innerHTML = '';
                return;
            }
            
            let amount, units, totalCost, canAfford;
            
            if (mode === 'amount') {
                amount = value;
                units = product.pricePerUnit > 1 ? (amount / product.pricePerUnit) : amount;
                totalCost = amount;
            } else {
                units = value;
                amount = units * product.pricePerUnit;
                totalCost = amount;
            }
            
            canAfford = typeof gameState !== 'undefined' && gameState.player.cash >= totalCost;
            
            const annualReturn = amount * product.annualReturn;
            const monthlyReturn = annualReturn / 12;
            
            preview.innerHTML = `
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 0.9em;">
                    <div>
                        <strong>Amount:</strong> ${formatMoney(amount)}
                    </div>
                    <div>
                        <strong>Units:</strong> ${units.toFixed(4)}
                    </div>
                    <div>
                        <strong>Total Cost:</strong> 
                        <span style="color: ${canAfford ? 'var(--success-color)' : 'var(--danger-color)'};">${formatMoney(totalCost)}</span>
                    </div>
                    <div>
                        <strong>Monthly Return:</strong> 
                        <span style="color: var(--success-color);">${formatMoney(monthlyReturn)}</span>
                    </div>
                </div>
                ${!canAfford ? `
                    <div style="margin-top: 5px; padding: 5px; background: rgba(239, 68, 68, 0.1); border-left: 3px solid var(--danger-color); border-radius: 4px; font-size: 0.85em;">
                        ⚠️ Need ${formatMoney(totalCost - (typeof gameState !== 'undefined' ? gameState.player.cash : 0))} more
                    </div>
                ` : ''}
            `;
        }
        
        input.addEventListener('input', updatePreview);
        input.addEventListener('change', updatePreview);
        modeSelect.addEventListener('change', function() {
            const mode = modeSelect.value;
            if (mode === 'amount') {
                input.min = product.minInvestment;
                input.max = product.maxInvestment;
                input.step = product.pricePerUnit > 1 ? product.pricePerUnit : 100;
            } else {
                input.min = Math.ceil(product.minInvestment / product.pricePerUnit);
                input.max = Math.floor(product.maxInvestment / product.pricePerUnit);
                input.step = 1;
            }
            updatePreview();
        });
        
        // Initial preview
        updatePreview();
    });
}

// Display Owned Products
function displayOwnedProducts(content) {
    if (quickInvestmentsSystem.playerProducts.length === 0) {
        content.innerHTML = '<p style="color: var(--text-secondary);">You don\'t own any investment products yet.</p>';
        return;
    }
    
    let html = '';
    let totalValue = 0;
    
    quickInvestmentsSystem.playerProducts.forEach(product => {
        const productDef = investmentProductDefinitions.find(p => p.id === product.productId);
        if (!productDef) return;
        
        // Calculate current value
        const turnsHeld = gameState.turn - product.purchaseDate;
        const monthlyReturn = product.annualReturn / 12;
        const currentValue = product.amount * (1 + monthlyReturn * turnsHeld);
        totalValue += currentValue;
        
        const profit = currentValue - product.amount;
        const profitPercent = (profit / product.amount) * 100;
        
        const canSell = productDef.term === 0 || (product.maturityDate && gameState.turn >= product.maturityDate);
        const turnsRemaining = product.maturityDate ? Math.max(0, product.maturityDate - gameState.turn) : 0;
        
        html += `
            <div style="background: var(--bg-dark); padding: 20px; border-radius: 10px; margin-bottom: 15px; border-left: 4px solid var(--secondary-color);">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
                    <div>
                        <div style="font-size: 1.1em; font-weight: 600;">${product.name}</div>
                        <div style="color: var(--text-secondary); font-size: 0.9em; margin-top: 3px;">
                            Purchased: Turn ${product.purchaseDate} • Held for ${turnsHeld} month(s)
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 1.2em; font-weight: 600; color: var(--success-color);">
                            ${formatMoney(currentValue)}
                        </div>
                        <div style="font-size: 0.9em; color: ${profit >= 0 ? 'var(--success-color)' : 'var(--danger-color)'};">
                            ${profit >= 0 ? '+' : ''}${formatMoney(profit)} (${profitPercent >= 0 ? '+' : ''}${profitPercent.toFixed(2)}%)
                        </div>
                    </div>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 15px; font-size: 0.9em;">
                    <div>
                        <div style="color: var(--text-secondary);">Initial Investment:</div>
                        <div>${formatMoney(product.amount)}</div>
                    </div>
                    <div>
                        <div style="color: var(--text-secondary);">Annual Return:</div>
                        <div>${(product.annualReturn * 100).toFixed(2)}%</div>
                    </div>
                    <div>
                        <div style="color: var(--text-secondary);">Status:</div>
                        <div>${canSell ? '✅ Can Sell' : `⏳ Matures in ${turnsRemaining} turn(s)`}</div>
                    </div>
                </div>
                <button class="btn-secondary" onclick="sellInvestmentProduct('${product.id}')" 
                        ${!canSell ? 'disabled style="opacity: 0.5;" title="Cannot sell before maturity"' : ''}
                        style="width: 100%;">
                    ${canSell ? 'Sell Investment' : `Sell Early (Penalty Applies)`}
                </button>
            </div>
        `;
    });
    
    html += `
        <div style="background: var(--bg-dark); padding: 20px; border-radius: 10px; margin-top: 20px; border: 2px solid var(--secondary-color);">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <div style="font-size: 1.1em; font-weight: 600;">Total Portfolio Value</div>
                    <div style="color: var(--text-secondary); font-size: 0.9em;">${quickInvestmentsSystem.playerProducts.length} investment(s)</div>
                </div>
                <div style="text-align: right; font-size: 1.5em; font-weight: 600; color: var(--success-color);">
                    ${formatMoney(totalValue)}
                </div>
            </div>
        </div>
    `;
    
    content.innerHTML = html;
}

// Purchase with mode selection
function purchaseInvestmentProductWithMode(productId) {
    const product = quickInvestmentsSystem.availableProducts.find(p => p.id === productId);
    if (!product) return;
    
    const modeSelect = document.getElementById(`purchase-mode-${productId}`);
    const valueInput = document.getElementById(`invest-${productId}`);
    
    if (!modeSelect || !valueInput) return;
    
    const mode = modeSelect.value;
    const value = parseFloat(valueInput.value) || 0;
    
    if (value <= 0) {
        if (typeof showToast === 'function') {
            showToast('Please enter a valid amount or number of units', 'error');
        }
        return;
    }
    
    purchaseInvestmentProduct(productId, value, mode);
    displayQuickInvestments('available'); // Refresh display
}

// Make functions globally available
window.generateAvailableProducts = generateAvailableProducts;
window.purchaseInvestmentProduct = purchaseInvestmentProduct;
window.purchaseInvestmentProductWithMode = purchaseInvestmentProductWithMode;
window.sellInvestmentProduct = sellInvestmentProduct;
window.processInvestmentProducts = processInvestmentProducts;
window.openQuickInvestmentsModal = openQuickInvestmentsModal;
window.quickInvestmentsSystem = quickInvestmentsSystem;

