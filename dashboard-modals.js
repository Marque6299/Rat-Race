// Dashboard Modal Functions
function closeModalById(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function openPortfolioModal() {
    const modal = document.getElementById('portfolio-modal');
    const content = document.getElementById('portfolio-modal-content');
    
    if (!modal || !content) return;
    
    // Add logs button
    const existingButton = document.getElementById('portfolio-logs-btn');
    if (!existingButton) {
        const buttonContainer = document.createElement('div');
        buttonContainer.style.marginTop = '20px';
        buttonContainer.innerHTML = '<button class="btn-primary" onclick="openLogsModal(); closeModalById(\'portfolio-modal\');" style="width: 100%;">View Financial Logs</button>';
        content.appendChild(buttonContainer);
    }
    
    // Get portfolio values
    const stocksValue = getPortfolioValue('stocks');
    const bondsValue = getPortfolioValue('bonds');
    const forexValue = getPortfolioValue('forex');
    const commoditiesValue = getPortfolioValue('commodities');
    const cryptoValue = getPortfolioValue('crypto');
    const totalValue = stocksValue + bondsValue + forexValue + commoditiesValue + cryptoValue;
    
    // Get holdings details
    let holdingsHtml = '<div style="margin-top: 20px;"><h4>Holdings:</h4>';
    
    Object.keys(gameState.player.portfolio).forEach(marketType => {
        const holdings = gameState.player.portfolio[marketType];
        if (holdings.length > 0) {
            holdingsHtml += `<div style="margin-top: 15px;"><strong>${marketType.charAt(0).toUpperCase() + marketType.slice(1)}:</strong>`;
            holdings.forEach(holding => {
                const asset = gameState.markets[marketType]?.find(a => a.symbol === holding.symbol);
                if (asset) {
                    const currentValue = asset.price * holding.quantity;
                    const costBasis = holding.avgPrice * holding.quantity;
                    const profit = currentValue - costBasis;
                    const profitPercent = ((profit / costBasis) * 100) || 0;
                    const profitClass = profit >= 0 ? 'positive' : 'negative';
                    
                    holdingsHtml += `
                        <div style="background: var(--bg-dark); padding: 10px; margin-top: 8px; border-radius: 6px;">
                            <div style="display: flex; justify-content: space-between;">
                                <div>
                                    <strong>${asset.name} (${holding.symbol})</strong><br>
                                    <span style="font-size: 0.85em; color: var(--text-secondary);">
                                        ${holding.quantity.toFixed(4)} ${asset.unit || 'shares'}
                                    </span>
                                </div>
                                <div style="text-align: right;">
                                    <div>${formatMoney(currentValue)}</div>
                                    <div style="font-size: 0.85em; color: var(--${profitClass === 'positive' ? 'success' : 'danger'}-color);">
                                        ${profit >= 0 ? '+' : ''}${formatMoney(profit)} (${profitPercent.toFixed(2)}%)
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                }
            });
            holdingsHtml += '</div>';
        }
    });
    
    holdingsHtml += '</div>';
    
    content.innerHTML = `
        <div class="stat-grid" style="margin-bottom: 20px;">
            <div class="stat-item">
                <label>Stocks:</label>
                <span class="money">${formatMoney(stocksValue)}</span>
            </div>
            <div class="stat-item">
                <label>Bonds:</label>
                <span class="money">${formatMoney(bondsValue)}</span>
            </div>
            <div class="stat-item">
                <label>Forex:</label>
                <span class="money">${formatMoney(forexValue)}</span>
            </div>
            <div class="stat-item">
                <label>Commodities:</label>
                <span class="money">${formatMoney(commoditiesValue)}</span>
            </div>
            <div class="stat-item">
                <label>Crypto:</label>
                <span class="money">${formatMoney(cryptoValue)}</span>
            </div>
            <div class="stat-item" style="border-top: 2px solid var(--border-color); padding-top: 10px; margin-top: 5px;">
                <label><strong>Total Portfolio Value:</strong></label>
                <span class="money" style="font-size: 1.2em;">${formatMoney(totalValue)}</span>
            </div>
        </div>
        ${holdingsHtml}
        <div style="margin-top: 20px;">
            <button class="btn-primary" onclick="openLogsModal(); closeModalById('portfolio-modal');" style="width: 100%;">View Financial Logs</button>
        </div>
    `;
    
    modal.classList.add('active');
}

function openLoansModal() {
    const modal = document.getElementById('loans-modal');
    const content = document.getElementById('loans-modal-content');
    
    if (!modal || !content) return;
    
    if (gameState.player.loans.length === 0) {
        content.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--text-secondary);">No active loans</div>';
    } else {
        content.innerHTML = gameState.player.loans.map(loan => {
            const monthlyInterest = loan.principal * loan.interestRate / 12;
            const minPayment = Math.max(loan.principal * 0.02, monthlyInterest + 100);
            return `
                <div style="background: var(--bg-dark); padding: 15px; margin-bottom: 10px; border-radius: 8px; border-left: 4px solid var(--warning-color);">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
                        <div>
                            <strong>${loan.name}</strong>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-size: 1.2em; font-weight: 600; color: var(--warning-color);">${formatMoney(loan.principal)}</div>
                            <div style="font-size: 0.85em; color: var(--text-secondary);">Remaining</div>
                        </div>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.9em;">
                        <div>
                            <div style="color: var(--text-secondary);">Interest Rate</div>
                            <div>${(loan.interestRate * 100).toFixed(2)}% APR</div>
                        </div>
                        <div>
                            <div style="color: var(--text-secondary);">Monthly Payment</div>
                            <div>~${formatMoney(minPayment)}</div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    modal.classList.add('active');
}

function openPropertiesModal() {
    const modal = document.getElementById('properties-modal');
    const content = document.getElementById('properties-modal-content');
    
    if (!modal || !content) return;
    
    if (gameState.player.properties.length === 0) {
        content.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--text-secondary);">No properties owned</div>';
    } else {
        content.innerHTML = gameState.player.properties.map(property => {
            return `
                <div style="background: var(--bg-dark); padding: 15px; margin-bottom: 10px; border-radius: 8px; border-left: 4px solid var(--secondary-color);">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
                        <div>
                            <strong>${property.name}</strong>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-size: 1.2em; font-weight: 600; color: var(--secondary-color);">${formatMoney(property.value)}</div>
                            <div style="font-size: 0.85em; color: var(--text-secondary);">Value</div>
                        </div>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; font-size: 0.9em;">
                        <div>
                            <div style="color: var(--text-secondary);">Condition</div>
                            <div>${Math.round(property.condition)}%</div>
                        </div>
                        <div>
                            <div style="color: var(--text-secondary);">Monthly Income</div>
                            <div style="color: var(--success-color);">${formatMoney(property.monthlyIncome || 0)}</div>
                        </div>
                        <div>
                            <div style="color: var(--text-secondary);">Monthly Upkeep</div>
                            <div style="color: var(--danger-color);">${formatMoney(property.value * property.upkeepRate / 12)}</div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    modal.classList.add('active');
}

function openNeedsModal() {
    const modal = document.getElementById('needs-modal');
    const content = document.getElementById('needs-modal-content');
    
    if (!modal || !content) return;
    
    if (typeof updateNeedsDisplay === 'function') {
        // Get needs and wants HTML
        let html = '<div style="margin-bottom: 20px;"><h4>Needs:</h4>';
        html += '<div id="needs-modal-list"></div></div>';
        html += '<div><h4>Wants:</h4>';
        html += '<div id="wants-modal-list"></div></div>';
        html += '<div style="margin-top: 20px;"><button class="btn-primary" onclick="buyCar(); closeModalById(\'needs-modal\');">Buy Car</button></div>';
        
        content.innerHTML = html;
        
        // Populate needs and wants
        if (gameState.player.needs) {
            const needsList = document.getElementById('needs-modal-list');
            needsList.innerHTML = gameState.player.needs.map(need => {
                const statusClass = need.satisfied ? 'positive' : (need.unmetTurns > need.maxUnmetTurns ? 'negative' : '');
                const statusIcon = need.satisfied ? '✅' : (need.unmetTurns > need.maxUnmetTurns ? '🔴' : '⚠️');
                return `
                    <div class="bad-habit-item ${statusClass}" style="margin-bottom: 8px; ${need.satisfied ? 'border-color: var(--success-color);' : ''}">
                        <strong>${statusIcon} ${need.name}</strong>
                        <div style="font-size: 0.85em; margin-top: 5px;">
                            ${need.description}<br>
                            Cost: ${formatMoney(need.cost)}/month<br>
                            ${!need.satisfied && need.unmetTurns > 0 ? 
                                `<span style="color: var(--danger-color);">Unmet for ${need.unmetTurns} turn(s)</span>` : 
                                'Satisfied'}
                        </div>
                    </div>
                `;
            }).join('');
        }
        
        if (gameState.player.wants) {
            const wantsList = document.getElementById('wants-modal-list');
            wantsList.innerHTML = gameState.player.wants.map(want => {
                const statusIcon = want.satisfied ? '✅' : '💭';
                return `
                    <div class="bad-habit-item" style="margin-bottom: 8px; border-color: var(--secondary-color);">
                        <strong>${statusIcon} ${want.name}</strong>
                        <div style="font-size: 0.85em; margin-top: 5px;">
                            ${want.description}<br>
                            Cost: ${formatMoney(want.cost)}
                            ${!want.satisfied ? `<br><button class="market-btn" onclick="satisfyWant('${want.id}'); closeModalById('needs-modal');" style="margin-top: 5px;">Satisfy</button>` : ''}
                        </div>
                    </div>
                `;
            }).join('');
        }
    } else {
        content.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--text-secondary);">Needs system not initialized</div>';
    }
    
    modal.classList.add('active');
}

function openHabitsModal() {
    const modal = document.getElementById('habits-modal');
    const content = document.getElementById('habits-modal-content');
    
    if (!modal || !content) return;
    
    if (gameState.player.badHabits.length === 0) {
        content.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--success-color);">✅ No bad habits! You\'re doing great!</div>';
    } else {
        content.innerHTML = gameState.player.badHabits.map(habit => 
            `<div class="bad-habit-item" style="margin-bottom: 10px;">
                <strong>${habit.name}</strong><br>
                <div style="font-size: 0.9em; margin-top: 5px; color: var(--text-secondary);">${habit.description}</div>
            </div>`
        ).join('');
    }
    
    modal.classList.add('active');
}

function openMonthlyDetailsModal() {
    const modal = document.getElementById('monthly-details-modal');
    const content = document.getElementById('monthly-details-content');
    
    if (!modal || !content) return;
    
    const stats = gameState.player.monthlyStats;
    
    content.innerHTML = `
        <div class="stat-grid">
            <div class="stat-item">
                <label>Income:</label>
                <span class="money positive">${formatMoney(stats.income)}</span>
            </div>
            <div class="stat-item">
                <label>Expenses:</label>
                <span class="money negative">${formatMoney(stats.expenses)}</span>
            </div>
            <div class="stat-item">
                <label>Taxes:</label>
                <span class="money negative">${formatMoney(stats.taxes)}</span>
            </div>
            <div class="stat-item">
                <label>Loan Payments:</label>
                <span class="money negative">${formatMoney(stats.loanPayments)}</span>
            </div>
            <div class="stat-item">
                <label>Property Upkeep:</label>
                <span class="money negative">${formatMoney(stats.propertyUpkeep)}</span>
            </div>
            <div class="stat-item">
                <label>Investment Returns:</label>
                <span class="money positive">${formatMoney(stats.investmentReturns)}</span>
            </div>
            <div class="stat-item" style="border-top: 2px solid var(--border-color); padding-top: 10px; margin-top: 5px;">
                <label><strong>Net Change:</strong></label>
                <span class="money" style="font-size: 1.2em; color: ${stats.netChange >= 0 ? 'var(--success-color)' : 'var(--danger-color)'};">
                    ${formatMoney(stats.netChange)}
                </span>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
}

