// Opportunities and Business System
const opportunitiesSystem = {
    currentOpportunities: {
        businesses: [],
        auctions: [],
        properties: [],
        quickInvestments: []
    },
    playerBusinesses: []
};

// Business Types
const businessOpportunities = [
    {
        type: 'create',
        name: 'Start a Small Business',
        category: 'Retail',
        investment: 5000,
        monthlyIncome: 800,
        risk: 'low',
        description: 'Open a small retail shop. Low investment, steady income.'
    },
    {
        type: 'create',
        name: 'Tech Startup',
        category: 'Technology',
        investment: 25000,
        monthlyIncome: 2000,
        risk: 'medium',
        description: 'Launch a tech startup. Higher risk, higher potential returns.'
    },
    {
        type: 'create',
        name: 'Restaurant',
        category: 'Food & Beverage',
        investment: 50000,
        monthlyIncome: 5000,
        risk: 'medium',
        description: 'Open a restaurant. Requires significant investment but good returns.'
    },
    {
        type: 'create',
        name: 'Manufacturing Company',
        category: 'Manufacturing',
        investment: 200000,
        monthlyIncome: 15000,
        risk: 'high',
        description: 'Start a manufacturing business. High investment, high returns.'
    },
    {
        type: 'create',
        name: 'Real Estate Development',
        category: 'Real Estate',
        investment: 500000,
        monthlyIncome: 40000,
        risk: 'high',
        description: 'Enter real estate development. Massive investment, massive returns.'
    },
    {
        type: 'buy',
        name: 'Buy Existing Business',
        category: 'Various',
        investment: 100000,
        monthlyIncome: 8000,
        risk: 'medium',
        description: 'Purchase an established business. Lower risk than starting new.'
    }
];

// Generate Random Opportunities
function generateOpportunities() {
    // Clear old opportunities
    opportunitiesSystem.currentOpportunities = {
        businesses: [],
        auctions: [],
        properties: [],
        quickInvestments: []
    };

    // Business Opportunities (30% chance each turn)
    if (Math.random() < 0.3) {
        const numBusinesses = 1 + Math.floor(Math.random() * 2);
        for (let i = 0; i < numBusinesses; i++) {
            const business = { ...businessOpportunities[Math.floor(Math.random() * businessOpportunities.length)] };
            // Vary investment slightly
            business.investment = business.investment * (0.9 + Math.random() * 0.2);
            business.id = `business_${Date.now()}_${i}`;
            opportunitiesSystem.currentOpportunities.businesses.push(business);
        }
    }

    // Auction Opportunities (20% chance)
    if (Math.random() < 0.2) {
        generateAuctions();
    }

    // Property Market Opportunities (25% chance)
    if (Math.random() < 0.25) {
        generatePropertyMarket();
    }

    // Quick Investment Opportunities (always available)
    generateQuickInvestments();
}

// Generate Auctions
function generateAuctions() {
    const auctionTypes = [
        { name: 'Property Auction', item: 'Commercial Property', basePrice: 300000, description: 'Foreclosed commercial property at auction' },
        { name: 'Asset Auction', item: 'Stock Portfolio', basePrice: 50000, description: 'Diversified stock portfolio from bankrupt investor' },
        { name: 'Business Auction', item: 'Small Business', basePrice: 40000, description: 'Business being sold at auction' },
        { name: 'Luxury Auction', item: 'Luxury Assets', basePrice: 100000, description: 'High-value assets auction' }
    ];

    const numAuctions = 1 + Math.floor(Math.random() * 2);
    for (let i = 0; i < numAuctions; i++) {
        const auctionType = auctionTypes[Math.floor(Math.random() * auctionTypes.length)];
        const discount = 0.7 + Math.random() * 0.2; // 70-90% of base price
        const auction = {
            id: `auction_${Date.now()}_${i}`,
            name: auctionType.name,
            item: auctionType.item,
            startingBid: auctionType.basePrice * discount,
            currentBid: auctionType.basePrice * discount,
            description: auctionType.description,
            timeLeft: 3 + Math.floor(Math.random() * 5), // 3-7 turns
            baseValue: auctionType.basePrice
        };
        opportunitiesSystem.currentOpportunities.auctions.push(auction);
    }
}

// Generate Property Market
function generatePropertyMarket() {
    // Small Properties
    const smallProperties = [
        { name: 'Studio Apartment', type: 'Small', price: 45000, income: 400, discount: 0.15, size: 'small' },
        { name: '1-Bedroom Condo', type: 'Small', price: 65000, income: 550, discount: 0.2, size: 'small' },
        { name: 'Small Townhouse', type: 'Small', price: 85000, income: 700, discount: 0.18, size: 'small' },
        { name: 'Fixer-Upper House', type: 'Small', price: 60000, income: 500, discount: 0.3, size: 'small' },
        { name: 'Mobile Home', type: 'Small', price: 35000, income: 300, discount: 0.25, size: 'small' },
        { name: 'Duplex Unit', type: 'Small', price: 75000, income: 650, discount: 0.22, size: 'small' }
    ];
    
    // Medium Properties
    const mediumProperties = [
        { name: '2-Bedroom House', type: 'Medium', price: 150000, income: 1200, discount: 0.2, size: 'medium' },
        { name: '3-Bedroom Home', type: 'Medium', price: 200000, income: 1500, discount: 0.18, size: 'medium' },
        { name: 'Apartment Building (4 units)', type: 'Medium', price: 280000, income: 2800, discount: 0.15, size: 'medium' },
        { name: 'Commercial Storefront', type: 'Medium', price: 180000, income: 2000, discount: 0.2, size: 'medium' },
        { name: 'Suburban Home', type: 'Medium', price: 220000, income: 1800, discount: 0.16, size: 'medium' },
        { name: 'Townhouse Complex (6 units)', type: 'Medium', price: 350000, income: 3600, discount: 0.12, size: 'medium' },
        { name: 'Office Space', type: 'Medium', price: 250000, income: 3000, discount: 0.18, size: 'medium' }
    ];
    
    // Large Properties
    const largeProperties = [
        { name: 'Luxury Mansion', type: 'Large', price: 800000, income: 8000, discount: 0.1, size: 'large' },
        { name: 'Apartment Complex (20 units)', type: 'Large', price: 1200000, income: 15000, discount: 0.12, size: 'large' },
        { name: 'Commercial Plaza', type: 'Large', price: 1500000, income: 20000, discount: 0.15, size: 'large' },
        { name: 'Industrial Warehouse', type: 'Large', price: 900000, income: 12000, discount: 0.18, size: 'large' },
        { name: 'Shopping Center', type: 'Large', price: 2000000, income: 30000, discount: 0.1, size: 'large' },
        { name: 'Hotel/Motel', type: 'Large', price: 1800000, income: 25000, discount: 0.12, size: 'large' },
        { name: 'Office Building', type: 'Large', price: 2500000, income: 40000, discount: 0.08, size: 'large' },
        { name: 'Resort Property', type: 'Large', price: 3000000, income: 50000, discount: 0.1, size: 'large' }
    ];
    
    const allProperties = [...smallProperties, ...mediumProperties, ...largeProperties];
    const numProperties = 2 + Math.floor(Math.random() * 4); // 2-5 properties
    
    for (let i = 0; i < numProperties; i++) {
        const propType = allProperties[Math.floor(Math.random() * allProperties.length)];
        const property = {
            id: `property_${Date.now()}_${i}`,
            name: propType.name,
            type: propType.type,
            size: propType.size,
            price: propType.price * (1 - propType.discount),
            originalPrice: propType.price,
            monthlyIncome: propType.income,
            discount: propType.discount,
            description: `${propType.name} (${propType.size.toUpperCase()}) - ${(propType.discount * 100).toFixed(0)}% below market value`
        };
        opportunitiesSystem.currentOpportunities.properties.push(property);
    }
}

// Generate Quick Investments
function generateQuickInvestments() {
    const quickOptions = [
        { name: 'Index Fund', amount: 1000, return: 0.08, description: 'Diversified index fund investment' },
        { name: 'Mutual Fund', amount: 2000, return: 0.06, description: 'Managed mutual fund' },
        { name: 'ETF', amount: 1500, return: 0.07, description: 'Exchange-traded fund' },
        { name: 'Savings Bond', amount: 500, return: 0.04, description: 'Government savings bond' }
    ];

    quickOptions.forEach(option => {
        opportunitiesSystem.currentOpportunities.quickInvestments.push({
            id: `quick_${option.name.toLowerCase().replace(' ', '_')}`,
            ...option
        });
    });
}

// Display Investment Opportunities
function displayInvestmentOpportunities() {
    const investmentDisplay = document.getElementById('investment-display');
    const typeSelect = document.getElementById('investment-type-select');
    if (!investmentDisplay || !typeSelect) return;
    
    const selectedType = typeSelect.value;

    let html = '';

    switch(selectedType) {
        case 'business':
            html = displayBusinessOpportunities();
            break;
        case 'auctions':
            html = displayAuctions();
            break;
        case 'properties':
            html = displayPropertyMarket();
            break;
        case 'quick':
            html = displayQuickInvestments();
            break;
    }

    investmentDisplay.innerHTML = html;

    // Update on change
    typeSelect.onchange = displayInvestmentOpportunities;
}

function displayBusinessOpportunities() {
    const businesses = opportunitiesSystem.currentOpportunities.businesses;
    
    if (businesses.length === 0) {
        return '<div style="padding: 20px; text-align: center; color: var(--text-secondary);">No business opportunities available this turn. Check again next turn!</div>';
    }

    return businesses.map(business => {
        const riskColor = business.risk === 'low' ? 'var(--success-color)' : 
                          business.risk === 'medium' ? 'var(--warning-color)' : 'var(--danger-color)';
        return `
            <div style="background: var(--bg-dark); padding: 20px; margin-bottom: 15px; border-radius: 10px; border-left: 4px solid ${riskColor};">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
                    <div>
                        <h3 style="margin: 0 0 5px 0;">${business.name}</h3>
                        <div style="font-size: 0.9em; color: var(--text-secondary);">${business.category}</div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 1.2em; font-weight: 600; color: var(--secondary-color);">${formatMoney(business.investment)}</div>
                        <div style="font-size: 0.85em; color: var(--text-secondary);">Investment Required</div>
                    </div>
                </div>
                <p style="margin: 10px 0; color: var(--text-secondary);">${business.description}</p>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 15px;">
                    <div>
                        <div style="font-size: 0.85em; color: var(--text-secondary);">Monthly Income</div>
                        <div style="font-size: 1.1em; font-weight: 600; color: var(--success-color);">${formatMoney(business.monthlyIncome)}</div>
                    </div>
                    <div>
                        <div style="font-size: 0.85em; color: var(--text-secondary);">Risk Level</div>
                        <div style="font-size: 1.1em; font-weight: 600; color: ${riskColor};">${business.risk.toUpperCase()}</div>
                    </div>
                </div>
                <button class="btn-primary" onclick="investInBusiness('${business.id}')" style="width: 100%; margin-top: 15px;">
                    ${business.type === 'create' ? 'Create Business' : 'Buy Business'}
                </button>
            </div>
        `;
    }).join('');
}

function displayAuctions() {
    const auctions = opportunitiesSystem.currentOpportunities.auctions;
    
    if (auctions.length === 0) {
        return '<div style="padding: 20px; text-align: center; color: var(--text-secondary);">No auctions available this turn. Check again next turn!</div>';
    }

    return auctions.map(auction => {
        const savings = auction.baseValue - auction.currentBid;
        return `
            <div style="background: var(--bg-dark); padding: 20px; margin-bottom: 15px; border-radius: 10px; border-left: 4px solid var(--warning-color);">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
                    <div>
                        <h3 style="margin: 0 0 5px 0;">${auction.name}</h3>
                        <div style="font-size: 0.9em; color: var(--text-secondary);">${auction.item}</div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 1.2em; font-weight: 600; color: var(--warning-color);">${formatMoney(auction.currentBid)}</div>
                        <div style="font-size: 0.85em; color: var(--text-secondary);">Current Bid</div>
                    </div>
                </div>
                <p style="margin: 10px 0; color: var(--text-secondary);">${auction.description}</p>
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-top: 15px;">
                    <div>
                        <div style="font-size: 0.85em; color: var(--text-secondary);">Market Value</div>
                        <div style="font-size: 1em; font-weight: 600;">${formatMoney(auction.baseValue)}</div>
                    </div>
                    <div>
                        <div style="font-size: 0.85em; color: var(--text-secondary);">You Save</div>
                        <div style="font-size: 1em; font-weight: 600; color: var(--success-color);">${formatMoney(savings)}</div>
                    </div>
                    <div>
                        <div style="font-size: 0.85em; color: var(--text-secondary);">Time Left</div>
                        <div style="font-size: 1em; font-weight: 600;">${auction.timeLeft} turns</div>
                    </div>
                </div>
                <div style="display: flex; gap: 10px; margin-top: 15px;">
                    <input type="number" id="bid-${auction.id}" placeholder="Your bid" min="${auction.currentBid * 1.05}" step="1000" 
                           style="flex: 1; padding: 10px; background: var(--bg-light); border: 2px solid var(--border-color); border-radius: 8px; color: var(--text-primary);">
                    <button class="btn-primary" onclick="placeBid('${auction.id}')">Place Bid</button>
                </div>
            </div>
        `;
    }).join('');
}

function displayPropertyMarket() {
    const properties = opportunitiesSystem.currentOpportunities.properties;
    
    if (properties.length === 0) {
        return '<div style="padding: 20px; text-align: center; color: var(--text-secondary);">No special property deals available this turn. Check again next turn!</div>';
    }

    return properties.map(property => {
        const savings = property.originalPrice - property.price;
        return `
            <div style="background: var(--bg-dark); padding: 20px; margin-bottom: 15px; border-radius: 10px; border-left: 4px solid var(--secondary-color);">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
                    <div>
                        <h3 style="margin: 0 0 5px 0;">${property.name}</h3>
                        <div style="font-size: 0.9em; color: var(--text-secondary);">${property.type}</div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 1.2em; font-weight: 600; color: var(--secondary-color);">${formatMoney(property.price)}</div>
                        <div style="font-size: 0.85em; color: var(--text-secondary);">Special Price</div>
                    </div>
                </div>
                <p style="margin: 10px 0; color: var(--text-secondary);">${property.description}</p>
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-top: 15px;">
                    <div>
                        <div style="font-size: 0.85em; color: var(--text-secondary);">Original Price</div>
                        <div style="font-size: 1em; font-weight: 600; text-decoration: line-through; color: var(--text-secondary);">${formatMoney(property.originalPrice)}</div>
                    </div>
                    <div>
                        <div style="font-size: 0.85em; color: var(--text-secondary);">You Save</div>
                        <div style="font-size: 1em; font-weight: 600; color: var(--success-color);">${formatMoney(savings)}</div>
                    </div>
                    <div>
                        <div style="font-size: 0.85em; color: var(--text-secondary);">Monthly Income</div>
                        <div style="font-size: 1em; font-weight: 600; color: var(--success-color);">${formatMoney(property.monthlyIncome)}</div>
                    </div>
                </div>
                <button class="btn-primary" onclick="buyPropertyOpportunity('${property.id}')" style="width: 100%; margin-top: 15px;">Buy Property</button>
            </div>
        `;
    }).join('');
}

function displayQuickInvestments() {
    const quick = opportunitiesSystem.currentOpportunities.quickInvestments;
    
    if (!quick || quick.length === 0) {
        return '<div style="padding: 20px; text-align: center; color: var(--text-secondary);">No quick investment opportunities available this turn. Check again next turn!</div>';
    }
    
    return quick.map(investment => {
        if (!investment) return '';
        
        const investmentAmount = investment.amount || investment.minInvestment || 0;
        const returnRate = investment.return || investment.annualReturn || 0;
        const annualReturn = investmentAmount * returnRate;
        const investmentName = investment.name || 'Investment Opportunity';
        const investmentDesc = investment.description || 'Quick investment opportunity';
        const investmentId = investment.id || `investment_${Date.now()}`;
        
        return `
            <div style="background: var(--bg-dark); padding: 20px; margin-bottom: 15px; border-radius: 10px; border-left: 4px solid var(--primary-color);">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
                    <div>
                        <h3 style="margin: 0 0 5px 0;">${investmentName}</h3>
                        <div style="font-size: 0.9em; color: var(--text-secondary);">${investmentDesc}</div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 1.2em; font-weight: 600; color: var(--primary-color);">${formatMoney(investmentAmount)}</div>
                        <div style="font-size: 0.85em; color: var(--text-secondary);">Minimum Investment</div>
                    </div>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 15px;">
                    <div>
                        <div style="font-size: 0.85em; color: var(--text-secondary);">Expected Annual Return</div>
                        <div style="font-size: 1.1em; font-weight: 600; color: var(--success-color);">${(returnRate * 100).toFixed(1)}%</div>
                    </div>
                    <div>
                        <div style="font-size: 0.85em; color: var(--text-secondary);">Annual Income</div>
                        <div style="font-size: 1.1em; font-weight: 600; color: var(--success-color);">${formatMoney(annualReturn)}</div>
                    </div>
                </div>
                <button class="btn-primary" onclick="quickInvest('${investmentId}')" style="width: 100%; margin-top: 15px;">Invest</button>
            </div>
        `;
    }).filter(html => html !== '').join('');
}

// Investment Actions
function investInBusiness(businessId) {
    const business = opportunitiesSystem.currentOpportunities.businesses.find(b => b.id === businessId);
    if (!business) return;

    if (gameState.player.cash < business.investment) {
        showToast(`Insufficient funds. You need ${formatMoney(business.investment)}.`, 'error');
        return;
    }

    gameState.player.cash -= business.investment;
    opportunitiesSystem.playerBusinesses.push({
        ...business,
        id: `player_business_${Date.now()}`,
        monthlyIncome: business.monthlyIncome * (0.9 + Math.random() * 0.2), // Vary income
        purchaseTurn: gameState.turn
    });

    // Log transaction
    if (typeof logTransaction === 'function') {
        logTransaction('investment', `${business.type === 'create' ? 'Created' : 'Bought'} ${business.name}`, -business.investment, {
            businessType: business.category,
            expectedMonthlyIncome: business.monthlyIncome,
            risk: business.risk
        });
    }

    showToast(`Successfully ${business.type === 'create' ? 'created' : 'bought'} ${business.name}!`, 'success');
    closeInvestmentModal();
    updateDisplay();
}

function placeBid(auctionId) {
    const auction = opportunitiesSystem.currentOpportunities.auctions.find(a => a.id === auctionId);
    if (!auction) return;

    const bidInput = document.getElementById(`bid-${auctionId}`);
    const bidAmount = parseFloat(bidInput.value);

    if (!bidAmount || bidAmount < auction.currentBid * 1.05) {
        showToast('Bid must be at least 5% higher than current bid.', 'error');
        return;
    }

    if (gameState.player.cash < bidAmount) {
        showToast('Insufficient funds for this bid.', 'error');
        return;
    }

    auction.currentBid = bidAmount;
    showToast(`Bid placed: ${formatMoney(bidAmount)}`, 'info');
    displayInvestmentOpportunities(); // Refresh display
}

function buyPropertyOpportunity(propertyId) {
    const property = opportunitiesSystem.currentOpportunities.properties.find(p => p.id === propertyId);
    if (!property) return;

    if (gameState.player.cash < property.price) {
        showToast(`Insufficient funds. You need ${formatMoney(property.price)}.`, 'error');
        return;
    }

    gameState.player.cash -= property.price;
    gameState.player.properties.push({
        name: property.name,
        value: property.price,
        monthlyIncome: property.monthlyIncome,
        upkeepRate: 0.015,
        deteriorationRate: 0.3,
        condition: 100
    });

    // Check if this satisfies housing need
    if (property.type.includes('House') || property.type.includes('Apartment')) {
        gameState.player.ownsHouse = true;
        const housingNeed = gameState.player.needs?.find(n => n.id === 'housing');
        if (housingNeed) {
            housingNeed.satisfied = true;
            housingNeed.unmetTurns = 0;
        }
    }

    // Log transaction
    if (typeof logTransaction === 'function') {
        logTransaction('property', `Purchased ${property.name}`, -property.price, {
            propertyType: property.type,
            monthlyIncome: property.monthlyIncome,
            discount: property.discount
        });
    }

    showToast(`Purchased ${property.name} for ${formatMoney(property.price)}!`, 'success');
    closeInvestmentModal();
    updateDisplay();
    if (typeof updateNeedsDisplay === 'function') {
        updateNeedsDisplay();
    }
}

function quickInvest(investmentId) {
    const investment = opportunitiesSystem.currentOpportunities.quickInvestments.find(i => i.id === investmentId);
    if (!investment) return;

    if (gameState.player.cash < investment.amount) {
        showToast(`Insufficient funds. You need ${formatMoney(investment.amount)}.`, 'error');
        return;
    }

    gameState.player.cash -= investment.amount;
    // Add to portfolio as a generic investment
    const monthlyReturn = (investment.amount * investment.return) / 12;
    gameState.player.monthlyIncome += monthlyReturn;

    // Log transaction
    if (typeof logTransaction === 'function') {
        logTransaction('investment', `Invested in ${investment.name}`, -investment.amount, {
            investmentType: investment.name,
            expectedReturn: investment.return,
            monthlyReturn: monthlyReturn
        });
    }

    showToast(`Invested ${formatMoney(investment.amount)} in ${investment.name}. Monthly income increased by ${formatMoney(monthlyReturn)}.`, 'success');
    closeInvestmentModal();
    updateDisplay();
}

// Modal Functions
function closeInvestmentModal() {
    if (typeof closeModalById === 'function') {
        closeModalById('investment-modal');
    } else {
        const modal = document.getElementById('investment-modal');
        if (modal) modal.classList.remove('active');
    }
}

function openInvestmentModal() {
    generateOpportunities();
    displayInvestmentOpportunities();
    
    // Use modal manager
    if (typeof openModal === 'function') {
        if (!openModal('investment-modal')) return;
    } else {
        const modal = document.getElementById('investment-modal');
        if (modal) modal.classList.add('active');
    }
}

function closeMarketsModal() {
    if (typeof closeModalById === 'function') {
        closeModalById('markets-modal');
    } else {
        const modal = document.getElementById('markets-modal');
        if (modal) modal.classList.remove('active');
    }
}

function openMarketsModal() {
    const modal = document.getElementById('markets-modal');
    if (!modal) return;
    
    // Use modal manager
    if (typeof openModal === 'function') {
        if (!openModal('markets-modal')) return;
    } else {
        modal.classList.add('active');
    }
    updateMarketDisplay();
    
    // Update market display when type changes
    const marketTypeSelect = document.getElementById('market-type-select');
    if (marketTypeSelect) {
        marketTypeSelect.onchange = () => {
            updateMarketDisplay();
        };
    }
}

// Toast Notification System
function showToast(message, type = 'info', duration) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    // Determine duration dynamically if not provided
    let autoDuration = duration;
    if (!autoDuration) {
        const baseDurations = {
            success: 3000,
            info: 3500,
            warning: 5000,
            error: 6000
        };
        autoDuration = baseDurations[type] || 3500;

        // Adjust based on message length
        const extraPerChar = 40; // ms per extra char over threshold
        const lengthThreshold = 60;
        if (message.length > lengthThreshold) {
            const lengthBonus = (message.length - lengthThreshold) * extraPerChar;
            autoDuration += Math.min(lengthBonus, 4000); // Cap bonus
        }

        // If message indicates a restriction or critical warning, extend duration
        const restrictionRegex = /(insufficient|limit|maximum|max|cannot|can't|already|restriction|unable|reached|denied|forbidden)/i;
        if (restrictionRegex.test(message) || type === 'error' || type === 'warning') {
            autoDuration += 1500;
        }
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    container.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Remove after duration
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => container.removeChild(toast), 300);
    }, autoDuration);
}

