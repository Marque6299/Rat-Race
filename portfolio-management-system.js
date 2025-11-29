// Portfolio Management Dashboard
function openPortfolioManagementModal() {
    const modal = document.getElementById('portfolio-management-modal');
    if (!modal) {
        createPortfolioManagementModal();
    }
    
    // Use modal manager
    if (typeof openModal === 'function') {
        if (!openModal('portfolio-management-modal')) return;
    } else {
        modal.classList.add('active');
    }
    
    displayPortfolioManagement();
}

// Create Portfolio Management Modal
function createPortfolioManagementModal() {
    const modal = document.createElement('div');
    modal.id = 'portfolio-management-modal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 1200px; max-height: 90vh;">
            <span class="close" onclick="closeModalById('portfolio-management-modal')">&times;</span>
            <h2>📊 Portfolio Management Dashboard</h2>
            <div style="margin-bottom: 20px;">
                <div class="bank-tabs">
                    <button class="bank-tab-btn active" data-tab="overview">Overview</button>
                    <button class="bank-tab-btn" data-tab="stocks">Stocks</button>
                    <button class="bank-tab-btn" data-tab="bonds">Bonds</button>
                    <button class="bank-tab-btn" data-tab="forex">Forex</button>
                    <button class="bank-tab-btn" data-tab="commodities">Commodities</button>
                    <button class="bank-tab-btn" data-tab="crypto">Crypto</button>
                </div>
            </div>
            <div id="portfolio-management-content" style="max-height: 65vh; overflow-y: auto;"></div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Tab switching
    document.querySelectorAll('.bank-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.bank-tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            displayPortfolioManagement(btn.dataset.tab);
        });
    });
}

// Display Portfolio Management
function displayPortfolioManagement(tab = 'overview') {
    const content = document.getElementById('portfolio-management-content');
    if (!content) return;
    
    if (tab === 'overview') {
        displayPortfolioOverview(content);
    } else {
        displayPortfolioCategory(content, tab);
    }
}

// Display Portfolio Overview
function displayPortfolioOverview(content) {
    const portfolio = gameState.player.portfolio;
    const markets = gameState.markets;
    
    // Calculate totals
    let totalValue = 0;
    let totalCost = 0;
    const categoryBreakdown = {};
    
    Object.keys(portfolio).forEach(marketType => {
        const holdings = portfolio[marketType];
        let categoryValue = 0;
        let categoryCost = 0;
        
        holdings.forEach(holding => {
            const asset = markets[marketType]?.find(a => a.symbol === holding.symbol);
            if (asset) {
                const currentValue = asset.price * holding.quantity;
                const cost = holding.avgPrice * holding.quantity;
                categoryValue += currentValue;
                categoryCost += cost;
            }
        });
        
        categoryBreakdown[marketType] = {
            value: categoryValue,
            cost: categoryCost,
            profit: categoryValue - categoryCost,
            holdings: holdings.length
        };
        
        totalValue += categoryValue;
        totalCost += categoryCost;
    });
    
    const totalProfit = totalValue - totalCost;
    const profitPercent = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;
    
    // Add quick investments
    if (typeof quickInvestmentsSystem !== 'undefined' && quickInvestmentsSystem.playerProducts) {
        let quickInvestValue = 0;
        quickInvestmentsSystem.playerProducts.forEach(product => {
            const turnsHeld = gameState.turn - product.purchaseDate;
            const monthlyReturn = product.annualReturn / 12;
            quickInvestValue += product.amount * (1 + monthlyReturn * turnsHeld);
        });
        categoryBreakdown['quick_investments'] = {
            value: quickInvestValue,
            cost: quickInvestmentsSystem.playerProducts.reduce((sum, p) => sum + p.amount, 0),
            profit: quickInvestValue - quickInvestmentsSystem.playerProducts.reduce((sum, p) => sum + p.amount, 0),
            holdings: quickInvestmentsSystem.playerProducts.length
        };
        totalValue += quickInvestValue;
    }
    
    let html = `
        <div style="background: var(--bg-dark); padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <h3 style="margin-top: 0;">Portfolio Summary</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-bottom: 15px;">
                <div>
                    <div style="font-size: 0.9em; color: var(--text-secondary); margin-bottom: 5px;">Total Value</div>
                    <div style="font-size: 1.8em; font-weight: 600; color: var(--secondary-color);">
                        ${formatMoney(totalValue)}
                    </div>
                </div>
                <div>
                    <div style="font-size: 0.9em; color: var(--text-secondary); margin-bottom: 5px;">Total Cost</div>
                    <div style="font-size: 1.5em; font-weight: 600;">
                        ${formatMoney(totalCost)}
                    </div>
                </div>
                <div>
                    <div style="font-size: 0.9em; color: var(--text-secondary); margin-bottom: 5px;">Total Profit/Loss</div>
                    <div style="font-size: 1.5em; font-weight: 600; color: ${totalProfit >= 0 ? 'var(--success-color)' : 'var(--danger-color)'};">
                        ${totalProfit >= 0 ? '+' : ''}${formatMoney(totalProfit)} (${profitPercent >= 0 ? '+' : ''}${profitPercent.toFixed(2)}%)
                    </div>
                </div>
            </div>
        </div>
        
        <div style="background: var(--bg-dark); padding: 20px; border-radius: 10px;">
            <h3 style="margin-top: 0;">Asset Allocation</h3>
            <div style="display: flex; flex-direction: column; gap: 10px;">
    `;
    
    const categoryNames = {
        stocks: '📈 Stocks',
        bonds: '💼 Bonds',
        forex: '💱 Forex',
        commodities: '⚡ Commodities',
        crypto: '₿ Crypto',
        quick_investments: '💰 Quick Investments'
    };
    
    Object.keys(categoryBreakdown).forEach(category => {
        const data = categoryBreakdown[category];
        const percentage = totalValue > 0 ? (data.value / totalValue) * 100 : 0;
        
        html += `
            <div style="background: var(--bg-light); padding: 15px; border-radius: 8px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <div>
                        <strong>${categoryNames[category] || category}</strong>
                        <div style="font-size: 0.85em; color: var(--text-secondary);">
                            ${data.holdings} holding(s)
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 1.2em; font-weight: 600;">
                            ${formatMoney(data.value)}
                        </div>
                        <div style="font-size: 0.85em; color: var(--text-secondary);">
                            ${percentage.toFixed(1)}% of portfolio
                        </div>
                    </div>
                </div>
                <div style="width: 100%; height: 8px; background: var(--bg-dark); border-radius: 4px; overflow: hidden;">
                    <div style="background: var(--secondary-color); height: 100%; width: ${percentage}%;"></div>
                </div>
                <div style="margin-top: 8px; font-size: 0.85em;">
                    Profit/Loss: <span style="color: ${data.profit >= 0 ? 'var(--success-color)' : 'var(--danger-color)'};">
                        ${data.profit >= 0 ? '+' : ''}${formatMoney(data.profit)}
                    </span>
                </div>
            </div>
        `;
    });
    
    html += '</div></div>';
    
    content.innerHTML = html;
}

// Display Portfolio Category
function displayPortfolioCategory(content, marketType) {
    const holdings = gameState.player.portfolio[marketType] || [];
    const market = gameState.markets[marketType];
    
    if (holdings.length === 0) {
        content.innerHTML = `<p style="color: var(--text-secondary); text-align: center; padding: 40px;">No ${marketType} holdings.</p>`;
        return;
    }
    
    let html = '';
    
    holdings.forEach(holding => {
        const asset = market?.find(a => a.symbol === holding.symbol);
        if (!asset) return;
        
        const currentValue = asset.price * holding.quantity;
        const cost = holding.avgPrice * holding.quantity;
        const profit = currentValue - cost;
        const profitPercent = cost > 0 ? (profit / cost) * 100 : 0;
        const priceChange = asset.price - holding.avgPrice;
        const priceChangePercent = holding.avgPrice > 0 ? (priceChange / holding.avgPrice) * 100 : 0;
        
        html += `
            <div style="background: var(--bg-dark); padding: 20px; border-radius: 10px; margin-bottom: 15px; border-left: 4px solid ${profit >= 0 ? 'var(--success-color)' : 'var(--danger-color)'};">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px;">
                    <div>
                        <div style="font-size: 1.2em; font-weight: 600;">${asset.name} (${asset.symbol})</div>
                        <div style="font-size: 0.9em; color: var(--text-secondary); margin-top: 3px;">
                            Quantity: ${holding.quantity.toFixed(4)} ${asset.unit || 'shares'}
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 1.3em; font-weight: 600; color: var(--secondary-color);">
                            ${formatMoney(currentValue)}
                        </div>
                        <div style="font-size: 0.85em; color: var(--text-secondary);">Current Value</div>
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                    <div>
                        <div style="font-size: 0.85em; color: var(--text-secondary);">Avg. Purchase Price</div>
                        <div style="font-size: 1em; font-weight: 600;">
                            ${formatMoney(holding.avgPrice)}
                        </div>
                    </div>
                    <div>
                        <div style="font-size: 0.85em; color: var(--text-secondary);">Current Price</div>
                        <div style="font-size: 1em; font-weight: 600;">
                            ${formatMoney(asset.price)}
                        </div>
                    </div>
                    <div>
                        <div style="font-size: 0.85em; color: var(--text-secondary);">Price Change</div>
                        <div style="font-size: 1em; font-weight: 600; color: ${priceChange >= 0 ? 'var(--success-color)' : 'var(--danger-color)'};">
                            ${priceChange >= 0 ? '+' : ''}${priceChangePercent.toFixed(2)}%
                        </div>
                    </div>
                    <div>
                        <div style="font-size: 0.85em; color: var(--text-secondary);">Profit/Loss</div>
                        <div style="font-size: 1em; font-weight: 600; color: ${profit >= 0 ? 'var(--success-color)' : 'var(--danger-color)'};">
                            ${profit >= 0 ? '+' : ''}${formatMoney(profit)}<br>
                            <span style="font-size: 0.85em;">(${profitPercent >= 0 ? '+' : ''}${profitPercent.toFixed(2)}%)</span>
                        </div>
                    </div>
                </div>
                
                <div style="display: flex; gap: 10px;">
                    <button class="btn-primary" onclick="openSellModal('${marketType}', '${asset.symbol}'); closeModalById('portfolio-management-modal');">
                        Sell
                    </button>
                    <button class="btn-secondary" onclick="openBuyModal('${marketType}', '${asset.symbol}'); closeModalById('portfolio-management-modal');">
                        Buy More
                    </button>
                </div>
            </div>
        `;
    });
    
    content.innerHTML = html;
}

// Make functions globally available
window.openPortfolioManagementModal = openPortfolioManagementModal;
window.displayPortfolioManagement = displayPortfolioManagement;

