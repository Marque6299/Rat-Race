// Business Balance Sheet System
function openBusinessBalanceSheetModal() {
    const modal = document.getElementById('business-balance-sheet-modal');
    if (!modal) {
        createBusinessBalanceSheetModal();
    }
    
    // Use modal manager
    if (typeof openModal === 'function') {
        if (!openModal('business-balance-sheet-modal')) return;
    } else {
        modal.classList.add('active');
    }
    
    displayBusinessBalanceSheets();
}

// Create Business Balance Sheet Modal
function createBusinessBalanceSheetModal() {
    const modal = document.createElement('div');
    modal.id = 'business-balance-sheet-modal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 1000px; max-height: 90vh;">
            <span class="close" onclick="closeModalById('business-balance-sheet-modal')">&times;</span>
            <h2>📊 Business Balance Sheets</h2>
            <div id="business-balance-sheet-content" style="max-height: 75vh; overflow-y: auto;"></div>
        </div>
    `;
    document.body.appendChild(modal);
}

// Display Business Balance Sheets
function displayBusinessBalanceSheets() {
    const content = document.getElementById('business-balance-sheet-content');
    if (!content) return;
    
    if (!opportunitiesSystem || !opportunitiesSystem.playerBusinesses || opportunitiesSystem.playerBusinesses.length === 0) {
        content.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 40px;">You don\'t own any businesses yet.</p>';
        return;
    }
    
    let html = '';
    
    opportunitiesSystem.playerBusinesses.forEach((business, index) => {
        // Calculate business metrics
        const monthlyIncome = business.monthlyIncome || 0;
        const investment = business.investment || 0;
        const totalIncome = monthlyIncome * (gameState.turn - (business.purchaseTurn || gameState.turn));
        const netProfit = totalIncome - investment;
        const roi = investment > 0 ? (netProfit / investment) * 100 : 0;
        const monthlyROI = investment > 0 ? (monthlyIncome / investment) * 100 : 0;
        
        // Business expenses (operating costs)
        const operatingCosts = investment * 0.02; // 2% of investment per month
        const netMonthlyIncome = monthlyIncome - operatingCosts;
        
        html += `
            <div style="background: var(--bg-dark); padding: 20px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid var(--primary-color);">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 20px;">
                    <div>
                        <h3 style="margin: 0 0 5px 0;">${business.name}</h3>
                        <div style="font-size: 0.9em; color: var(--text-secondary);">
                            ${business.category || 'Business'} • ${business.risk || 'Medium'} Risk
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 1.3em; font-weight: 600; color: var(--success-color);">
                            ${formatMoney(monthlyIncome)}/month
                        </div>
                        <div style="font-size: 0.85em; color: var(--text-secondary);">Monthly Income</div>
                    </div>
                </div>
                
                <!-- Balance Sheet -->
                <div style="background: var(--bg-light); padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                    <h4 style="margin-top: 0; margin-bottom: 15px;">Balance Sheet</h4>
                    
                    <!-- Assets -->
                    <div style="margin-bottom: 15px;">
                        <div style="font-weight: 600; margin-bottom: 8px; color: var(--success-color);">ASSETS</div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding-left: 15px;">
                            <div>
                                <div style="font-size: 0.9em; color: var(--text-secondary);">Initial Investment</div>
                                <div style="font-weight: 600;">${formatMoney(investment)}</div>
                            </div>
                            <div>
                                <div style="font-size: 0.9em; color: var(--text-secondary);">Accumulated Income</div>
                                <div style="font-weight: 600; color: var(--success-color);">${formatMoney(totalIncome)}</div>
                            </div>
                        </div>
                        <div style="border-top: 1px solid var(--border-color); margin-top: 10px; padding-top: 10px;">
                            <div style="display: flex; justify-content: space-between;">
                                <div style="font-weight: 600;">Total Assets</div>
                                <div style="font-weight: 600; font-size: 1.1em;">${formatMoney(investment + totalIncome)}</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Liabilities & Equity -->
                    <div>
                        <div style="font-weight: 600; margin-bottom: 8px; color: var(--warning-color);">LIABILITIES & EQUITY</div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding-left: 15px;">
                            <div>
                                <div style="font-size: 0.9em; color: var(--text-secondary);">Operating Costs</div>
                                <div style="font-weight: 600; color: var(--danger-color);">${formatMoney(operatingCosts)}/month</div>
                            </div>
                            <div>
                                <div style="font-size: 0.9em; color: var(--text-secondary);">Owner's Equity</div>
                                <div style="font-weight: 600;">${formatMoney(investment + netProfit)}</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Income Statement -->
                <div style="background: var(--bg-light); padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                    <h4 style="margin-top: 0; margin-bottom: 15px;">Income Statement (Monthly)</h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                        <div>
                            <div style="font-size: 0.9em; color: var(--text-secondary); margin-bottom: 5px;">Revenue</div>
                            <div style="font-size: 1.2em; font-weight: 600; color: var(--success-color);">
                                ${formatMoney(monthlyIncome)}
                            </div>
                        </div>
                        <div>
                            <div style="font-size: 0.9em; color: var(--text-secondary); margin-bottom: 5px;">Operating Expenses</div>
                            <div style="font-size: 1.2em; font-weight: 600; color: var(--danger-color);">
                                -${formatMoney(operatingCosts)}
                            </div>
                        </div>
                    </div>
                    <div style="border-top: 2px solid var(--border-color); margin-top: 15px; padding-top: 15px;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div style="font-weight: 600; font-size: 1.1em;">Net Income</div>
                            <div style="font-weight: 600; font-size: 1.3em; color: ${netMonthlyIncome >= 0 ? 'var(--success-color)' : 'var(--danger-color)'};">
                                ${formatMoney(netMonthlyIncome)}
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Performance Metrics -->
                <div style="background: var(--bg-light); padding: 15px; border-radius: 8px;">
                    <h4 style="margin-top: 0; margin-bottom: 15px;">Performance Metrics</h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px;">
                        <div>
                            <div style="font-size: 0.85em; color: var(--text-secondary); margin-bottom: 5px;">Total ROI</div>
                            <div style="font-size: 1.2em; font-weight: 600; color: ${roi >= 0 ? 'var(--success-color)' : 'var(--danger-color)'};">
                                ${roi >= 0 ? '+' : ''}${roi.toFixed(2)}%
                            </div>
                        </div>
                        <div>
                            <div style="font-size: 0.85em; color: var(--text-secondary); margin-bottom: 5px;">Monthly ROI</div>
                            <div style="font-size: 1.2em; font-weight: 600; color: ${monthlyROI >= 0 ? 'var(--success-color)' : 'var(--danger-color)'};">
                                ${monthlyROI >= 0 ? '+' : ''}${monthlyROI.toFixed(2)}%
                            </div>
                        </div>
                        <div>
                            <div style="font-size: 0.85em; color: var(--text-secondary); margin-bottom: 5px;">Net Profit</div>
                            <div style="font-size: 1.2em; font-weight: 600; color: ${netProfit >= 0 ? 'var(--success-color)' : 'var(--danger-color)'};">
                                ${formatMoney(netProfit)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    content.innerHTML = html;
}

// Make functions globally available
window.openBusinessBalanceSheetModal = openBusinessBalanceSheetModal;
window.displayBusinessBalanceSheets = displayBusinessBalanceSheets;

