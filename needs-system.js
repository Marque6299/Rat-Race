// Needs and Wants System
const needsSystem = {
    // Basic Needs
    needs: [
        {
            id: 'housing',
            name: 'Housing',
            type: 'need',
            cost: 800,
            priority: 'critical',
            unmetTurns: 0,
            maxUnmetTurns: 3,
            healthImpact: -5,
            moodImpact: -3,
            description: 'You need a place to live. Rent or own a property.',
            satisfied: false
        },
        {
            id: 'food',
            name: 'Food',
            type: 'need',
            cost: 300,
            priority: 'critical',
            unmetTurns: 0,
            maxUnmetTurns: 2,
            healthImpact: -8,
            moodImpact: -2,
            description: 'You need food to survive.',
            satisfied: false
        },
        {
            id: 'clothing',
            name: 'Clothing',
            type: 'need',
            cost: 100,
            priority: 'high',
            unmetTurns: 0,
            maxUnmetTurns: 6,
            healthImpact: -2,
            moodImpact: -1,
            description: 'You need basic clothing.',
            satisfied: false
        },
        {
            id: 'transportation',
            name: 'Transportation',
            type: 'need',
            cost: 400,
            priority: 'high',
            unmetTurns: 0,
            maxUnmetTurns: 4,
            healthImpact: -1,
            moodImpact: -2,
            description: 'You need transportation (car or public transit).',
            satisfied: false
        },
        {
            id: 'healthcare',
            name: 'Healthcare',
            type: 'need',
            cost: 200,
            priority: 'medium',
            unmetTurns: 0,
            maxUnmetTurns: 8,
            healthImpact: -3,
            moodImpact: -1,
            description: 'Basic healthcare and insurance.',
            satisfied: false
        }
    ],

    // Wants (Luxuries)
    wants: [
        {
            id: 'entertainment',
            name: 'Entertainment',
            type: 'want',
            cost: 150,
            priority: 'low',
            unmetTurns: 0,
            maxUnmetTurns: 10,
            healthImpact: 0,
            moodImpact: -1,
            description: 'Movies, games, hobbies - things that make you happy.',
            satisfied: false
        },
        {
            id: 'vacation',
            name: 'Vacation',
            type: 'want',
            cost: 2000,
            priority: 'low',
            unmetTurns: 0,
            maxUnmetTurns: 20,
            healthImpact: 0,
            moodImpact: -2,
            description: 'A nice vacation to relax and recharge.',
            satisfied: false
        },
        {
            id: 'luxury_items',
            name: 'Luxury Items',
            type: 'want',
            cost: 500,
            priority: 'low',
            unmetTurns: 0,
            maxUnmetTurns: 15,
            healthImpact: 0,
            moodImpact: -1,
            description: 'Nice things that you desire.',
            satisfied: false
        }
    ],

    // Random Expenses
    randomExpenses: [
        { name: 'Car Repair', cost: 500, chance: 0.15 },
        { name: 'Medical Bill', cost: 300, chance: 0.12 },
        { name: 'Home Repair', cost: 400, chance: 0.10 },
        { name: 'Unexpected Bill', cost: 200, chance: 0.20 },
        { name: 'Emergency Expense', cost: 600, chance: 0.08 },
        { name: 'Appliance Replacement', cost: 350, chance: 0.10 },
        { name: 'Insurance Premium', cost: 250, chance: 0.15 }
    ]
};

// Initialize player needs/wants
function initializeNeedsWants() {
    gameState.player.needs = needsSystem.needs.map(need => ({ ...need }));
    gameState.player.wants = needsSystem.wants.map(want => ({ ...want }));
    gameState.player.physicalHealth = 100;
    gameState.player.mood = 100;
    gameState.player.rent = 800; // Monthly rent
    gameState.player.ownsHouse = false;
    gameState.player.ownsCar = false;
}

// Check if needs are satisfied
function checkNeedsSatisfaction() {
    // Check housing
    const housingNeed = gameState.player.needs.find(n => n.id === 'housing');
    if (housingNeed) {
        housingNeed.satisfied = gameState.player.ownsHouse || 
                                gameState.player.properties.some(p => p.name.includes('House') || p.name.includes('Apartment'));
        if (!housingNeed.satisfied) {
            // Pay rent
            if (gameState.player.cash >= gameState.player.rent) {
                gameState.player.cash -= gameState.player.rent;
                gameState.player.monthlyStats.expenses += gameState.player.rent;
                housingNeed.satisfied = true;
            } else {
                housingNeed.unmetTurns++;
            }
        } else {
            housingNeed.unmetTurns = 0;
        }
    }

    // Check transportation
    const transportNeed = gameState.player.needs.find(n => n.id === 'transportation');
    if (transportNeed) {
        transportNeed.satisfied = gameState.player.ownsCar;
        if (!transportNeed.satisfied) {
            // Pay for public transport
            if (gameState.player.cash >= transportNeed.cost) {
                gameState.player.cash -= transportNeed.cost;
                gameState.player.monthlyStats.expenses += transportNeed.cost;
                transportNeed.satisfied = true;
            } else {
                transportNeed.unmetTurns++;
            }
        } else {
            transportNeed.unmetTurns = 0;
        }
    }

    // Check other needs (food, clothing, healthcare)
    gameState.player.needs.forEach(need => {
        if (need.id !== 'housing' && need.id !== 'transportation') {
            if (gameState.player.cash >= need.cost) {
                gameState.player.cash -= need.cost;
                gameState.player.monthlyStats.expenses += need.cost;
                need.satisfied = true;
                need.unmetTurns = 0;
            } else {
                need.satisfied = false;
                need.unmetTurns++;
            }
        }
    });
}

// Apply health and mood impacts from unmet needs
function applyNeedsImpacts() {
    let healthChange = 0;
    let moodChange = 0;

    // Check unmet needs
    gameState.player.needs.forEach(need => {
        if (!need.satisfied) {
            need.unmetTurns++;
            if (need.unmetTurns <= need.maxUnmetTurns) {
                healthChange += need.healthImpact;
                moodChange += need.moodImpact;
            } else {
                // Critical - double impact
                healthChange += need.healthImpact * 2;
                moodChange += need.moodImpact * 2;
            }
        }
    });

    // Check unmet wants (less severe, but accumulate over time)
    gameState.player.wants.forEach(want => {
        if (!want.satisfied) {
            want.unmetTurns++;
            if (want.unmetTurns > 5) {
                moodChange += want.moodImpact;
            }
        } else {
            want.unmetTurns = 0;
        }
    });

    // Apply changes
    gameState.player.physicalHealth = Math.max(0, Math.min(100, gameState.player.physicalHealth + healthChange));
    gameState.player.mood = Math.max(0, Math.min(100, gameState.player.mood + moodChange));

    // Natural recovery if needs are met
    if (gameState.player.needs.every(n => n.satisfied)) {
        gameState.player.physicalHealth = Math.min(100, gameState.player.physicalHealth + 1);
    }
    if (gameState.player.mood < 100 && gameState.player.needs.every(n => n.satisfied)) {
        gameState.player.mood = Math.min(100, gameState.player.mood + 0.5);
    }
}

// Process random expenses
function processRandomExpenses() {
    needsSystem.randomExpenses.forEach(expense => {
        if (Math.random() < expense.chance) {
            if (gameState.player.cash >= expense.cost) {
                gameState.player.cash -= expense.cost;
                gameState.player.monthlyStats.expenses += expense.cost;
                
                // Log expense
                if (typeof logTransaction === 'function') {
                    logTransaction('expense', `Unexpected expense: ${expense.name}`, -expense.cost, {
                        expenseType: 'unexpected',
                        expenseName: expense.name
                    });
                }
                
                // Log event
                if (typeof logEvent === 'function') {
                    logEvent('negative', 'Unexpected Expense', expense.name, {
                        amount: expense.cost
                    });
                }
                
                addStory(`💸 Unexpected expense: ${expense.name} - ${formatMoney(expense.cost)}`);
            } else {
                addStory(`⚠️ Couldn't afford ${expense.name}. This may cause problems.`);
                gameState.player.mood = Math.max(0, gameState.player.mood - 5);
                
                // Log event
                if (typeof logEvent === 'function') {
                    logEvent('negative', 'Couldn\'t Afford Expense', `Couldn't afford ${expense.name}`, {
                        expenseName: expense.name,
                        amount: expense.cost
                    });
                }
            }
        }
    });
}

// Update needs/wants display
function updateNeedsDisplay() {
    // Physical Health
    const physicalHealthBar = document.getElementById('physical-health-bar');
    physicalHealthBar.style.width = gameState.player.physicalHealth + '%';
    physicalHealthBar.className = 'health-fill ' + 
        (gameState.player.physicalHealth >= 70 ? '' : 
         gameState.player.physicalHealth >= 40 ? 'medium' : 'poor');
    document.getElementById('physical-health-score').textContent = Math.round(gameState.player.physicalHealth) + '%';

    // Mood
    const moodBar = document.getElementById('mood-bar');
    moodBar.style.width = gameState.player.mood + '%';
    moodBar.className = 'health-fill ' + 
        (gameState.player.mood >= 70 ? '' : 
         gameState.player.mood >= 40 ? 'medium' : 'poor');
    document.getElementById('mood-score').textContent = Math.round(gameState.player.mood) + '%';

    // Needs List
    const needsList = document.getElementById('needs-list');
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

    // Wants List
    const wantsList = document.getElementById('wants-list');
    wantsList.innerHTML = gameState.player.wants.map(want => {
        const statusIcon = want.satisfied ? '✅' : '💭';
        const unmetText = !want.satisfied && want.unmetTurns > 5 ? 
            `<br><span style="color: var(--warning-color);">Unmet for ${want.unmetTurns} turns - affecting mood</span>` : '';
        return `
            <div class="bad-habit-item" style="margin-bottom: 8px; border-color: var(--secondary-color);">
                <strong>${statusIcon} ${want.name}</strong>
                <div style="font-size: 0.85em; margin-top: 5px;">
                    ${want.description}<br>
                    Cost: ${formatMoney(want.cost)}${unmetText}
                    ${!want.satisfied ? `<br><button class="market-btn" onclick="satisfyWant('${want.id}')" style="margin-top: 5px;">Satisfy</button>` : ''}
                </div>
            </div>
        `;
    }).join('');
}

// Satisfy a want
function satisfyWant(wantId) {
    const want = gameState.player.wants.find(w => w.id === wantId);
    if (!want) return;

    if (gameState.player.cash >= want.cost) {
        gameState.player.cash -= want.cost;
        want.satisfied = true;
        want.unmetTurns = 0;
        gameState.player.mood = Math.min(100, gameState.player.mood + 5);
        addStory(`😊 You satisfied your want: ${want.name}. You feel happier!`);
        updateNeedsDisplay();
        updateDisplay();
    } else {
        addStory(`You don't have enough money to satisfy ${want.name}.`);
    }
}

// These functions are now handled by opportunities-system.js
// Keeping for backwards compatibility but they're deprecated

// Buy a car
function buyCar() {
    const carOptions = [
        { name: 'Used Car', price: 5000, description: 'A reliable used car' },
        { name: 'Economy Car', price: 15000, description: 'A new economy car' },
        { name: 'Mid-Range Car', price: 30000, description: 'A comfortable mid-range car' },
        { name: 'Luxury Car', price: 60000, description: 'A luxury vehicle' }
    ];
    
    const modal = document.getElementById('action-modal');
    const modalBody = document.getElementById('modal-body');
    
    modalBody.innerHTML = `
        <p>Choose a car to purchase:</p>
        <div style="margin-top: 20px;">
            ${carOptions.map((car, index) => `
                <div style="background: var(--bg-dark); padding: 15px; margin-bottom: 10px; border-radius: 8px; border: 2px solid var(--border-color); cursor: pointer;" 
                     onclick="selectCar(${index})" id="car-${index}">
                    <strong>${car.name}</strong><br>
                    <div style="font-size: 0.9em; margin-top: 5px;">
                        ${car.description}<br>
                        Price: ${formatMoney(car.price)}
                    </div>
                </div>
            `).join('')}
        </div>
        <input type="hidden" id="selected-car" value="">
    `;
    
    document.getElementById('modal-title').textContent = 'Buy Car';
    modal.classList.add('active');
    
    window.selectCar = (index) => {
        document.querySelectorAll('[id^="car-"]').forEach(el => {
            el.style.borderColor = 'var(--border-color)';
        });
        document.getElementById(`car-${index}`).style.borderColor = 'var(--secondary-color)';
        document.getElementById('selected-car').value = index;
    };
    
    document.getElementById('modal-confirm').onclick = () => {
        const index = parseInt(document.getElementById('selected-car').value);
        if (index >= 0 && index < carOptions.length) {
            purchaseCar(carOptions[index]);
        } else {
            addStory('Please select a car.');
        }
    };
}

function purchaseCar(car) {
    if (gameState.player.cash < car.price) {
        addStory(`You don't have enough cash. You need ${formatMoney(car.price)}.`);
        closeModal();
        return;
    }
    
    gameState.player.cash -= car.price;
    gameState.player.ownsCar = true;
    
    // Satisfy transportation need
    const transportNeed = gameState.player.needs?.find(n => n.id === 'transportation');
    if (transportNeed) {
        transportNeed.satisfied = true;
        transportNeed.unmetTurns = 0;
    }
    
    addStory(`You purchased ${car.name} for ${formatMoney(car.price)}. You now have transportation!`);
    closeModal();
    updateNeedsDisplay();
    if (typeof updateDisplay === 'function') {
        updateDisplay();
    }
}

