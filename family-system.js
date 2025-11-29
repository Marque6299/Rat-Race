// Family and Relationships System
const familySystem = {
    spouse: null,
    children: [],
    familyExpenses: 0,
    familyIncome: 0,
    relationshipStatus: 'single', // single, dating, engaged, married, divorced, widowed
    
    // Family events history
    familyHistory: [],
    
    // Support payments (alimony, child support)
    supportPayments: {
        alimony: 0,
        childSupport: 0
    }
};

// Spouse Types
const spouseTypes = {
    high_earner: {
        name: 'High Earner',
        monthlyIncome: () => 5000 + Math.random() * 5000,
        description: 'Your spouse has a high-paying career.',
        traits: ['ambitious', 'career-focused']
    },
    entrepreneur: {
        name: 'Entrepreneur',
        monthlyIncome: () => 2000 + Math.random() * 4000,
        description: 'Your spouse runs their own business.',
        traits: ['risk-taker', 'independent']
    },
    professional: {
        name: 'Professional',
        monthlyIncome: () => 4000 + Math.random() * 3000,
        description: 'Your spouse is a skilled professional.',
        traits: ['stable', 'educated']
    },
    homemaker: {
        name: 'Homemaker',
        monthlyIncome: () => 0,
        description: 'Your spouse manages the household.',
        traits: ['supportive', 'frugal'],
        expenseReduction: 0.15
    },
    student: {
        name: 'Student',
        monthlyIncome: () => 500 + Math.random() * 1000,
        description: 'Your spouse is pursuing education.',
        traits: ['ambitious', 'future-focused'],
        educationExpense: 1000
    }
};

// Child Age Stages
const childStages = {
    infant: { age: 0, monthlyCost: 500, educationCost: 0 },
    toddler: { age: 1, monthlyCost: 600, educationCost: 0 },
    preschool: { age: 3, monthlyCost: 800, educationCost: 200 },
    elementary: { age: 5, monthlyCost: 700, educationCost: 300 },
    middle: { age: 11, monthlyCost: 800, educationCost: 500 },
    highschool: { age: 14, monthlyCost: 900, educationCost: 600 },
    college: { age: 18, monthlyCost: 1200, educationCost: 2000 }
};

// Meet Potential Spouse (Random Event)
function meetPotentialSpouse() {
    if (familySystem.relationshipStatus !== 'single' && familySystem.relationshipStatus !== 'divorced') {
        return null;
    }
    
    const spouseTypeKeys = Object.keys(spouseTypes);
    const typeKey = spouseTypeKeys[Math.floor(Math.random() * spouseTypeKeys.length)];
    const spouseType = spouseTypes[typeKey];
    
    const potentialSpouse = {
        id: `spouse_${Date.now()}`,
        name: generateSpouseName(),
        type: typeKey,
        ...spouseType,
        relationship: 50 + Math.random() * 30, // 50-80
        met: gameState.turn
    };
    
    return potentialSpouse;
}

// Generate Spouse Name
function generateSpouseName() {
    const firstNames = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Avery', 'Quinn', 'Sage', 'River'];
    return firstNames[Math.floor(Math.random() * firstNames.length)];
}

// Marry Spouse
function marrySpouse(spouse) {
    if (familySystem.spouse) {
        if (typeof showToast === 'function') {
            showToast('You are already married!', 'error', 3000);
        }
        return false;
    }
    
    familySystem.spouse = {
        ...spouse,
        married: gameState.turn,
        relationship: spouse.relationship || 70
    };
    
    familySystem.relationshipStatus = 'married';
    
    // Add spouse income
    if (spouse.monthlyIncome) {
        const income = typeof spouse.monthlyIncome === 'function' ? spouse.monthlyIncome() : spouse.monthlyIncome;
        familySystem.familyIncome += income;
        gameState.player.monthlyIncome += income;
    }
    
    // Apply expense reduction if homemaker
    if (spouse.expenseReduction) {
        gameState.player.monthlyExpenses *= (1 - spouse.expenseReduction);
    }
    
    addStory(`💍 You got married to ${spouse.name}! ${spouse.description}`);
    
    familySystem.familyHistory.push({
        turn: gameState.turn,
        event: 'marriage',
        spouse: spouse.name,
        type: spouse.type
    });
    
    return true;
}

// Have Child
function haveChild() {
    if (familySystem.relationshipStatus !== 'married' && !familySystem.spouse) {
        if (typeof showToast === 'function') {
            showToast('You need to be married to have children', 'error', 3000);
        }
        return false;
    }
    
    const child = {
        id: `child_${Date.now()}`,
        name: generateChildName(),
        age: 0,
        stage: 'infant',
        monthlyCost: childStages.infant.monthlyCost,
        educationCost: 0,
        birthTurn: gameState.turn
    };
    
    familySystem.children.push(child);
    
    addStory(`👶 Congratulations! You had a child: ${child.name}!`);
    
    familySystem.familyHistory.push({
        turn: gameState.turn,
        event: 'child_birth',
        childName: child.name
    });
    
    return child;
}

// Generate Child Name
function generateChildName() {
    const names = ['Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Ethan', 'Sophia', 'Mason', 'Isabella', 'James'];
    return names[Math.floor(Math.random() * names.length)];
}

// Process Children Aging
function processChildrenAging() {
    familySystem.children.forEach(child => {
        // Age children every 12 turns (1 year)
        if (gameState.turn % 12 === 0 && gameState.turn > child.birthTurn) {
            const yearsOld = Math.floor((gameState.turn - child.birthTurn) / 12);
            child.age = yearsOld;
            
            // Update stage based on age
            if (yearsOld < 1) {
                child.stage = 'infant';
            } else if (yearsOld < 3) {
                child.stage = 'toddler';
            } else if (yearsOld < 5) {
                child.stage = 'preschool';
            } else if (yearsOld < 11) {
                child.stage = 'elementary';
            } else if (yearsOld < 14) {
                child.stage = 'middle';
            } else if (yearsOld < 18) {
                child.stage = 'highschool';
            } else {
                child.stage = 'college';
            }
            
            const stageData = childStages[child.stage];
            child.monthlyCost = stageData.monthlyCost;
            child.educationCost = stageData.educationCost;
        }
    });
}

// Calculate Family Expenses
function calculateFamilyExpenses() {
    let expenses = 0;
    
    // Spouse expenses (if homemaker, reduces overall expenses)
    if (familySystem.spouse && familySystem.spouse.educationExpense) {
        expenses += familySystem.spouse.educationExpense;
    }
    
    // Children expenses
    familySystem.children.forEach(child => {
        expenses += child.monthlyCost;
        if (child.educationCost > 0) {
            expenses += child.educationCost;
        }
    });
    
    // Support payments
    expenses += familySystem.supportPayments.alimony;
    expenses += familySystem.supportPayments.childSupport;
    
    familySystem.familyExpenses = expenses;
    return expenses;
}

// Divorce
function divorce() {
    if (!familySystem.spouse) {
        if (typeof showToast === 'function') {
            showToast('You are not married!', 'error', 3000);
        }
        return false;
    }
    
    // Calculate divorce settlement
    const netWorth = gameState.player.netWorth;
    const settlement = netWorth * 0.3; // 30% of net worth
    
    gameState.player.cash -= settlement;
    gameState.player.netWorth -= settlement;
    
    // Alimony (if spouse had lower income)
    if (familySystem.familyIncome > 0) {
        familySystem.supportPayments.alimony = familySystem.familyIncome * 0.2; // 20% of combined income
    }
    
    // Child support
    if (familySystem.children.length > 0) {
        familySystem.supportPayments.childSupport = familySystem.children.length * 500;
    }
    
    // Remove spouse income
    if (familySystem.spouse.monthlyIncome) {
        const income = typeof familySystem.spouse.monthlyIncome === 'function' ? 
            familySystem.spouse.monthlyIncome() : familySystem.spouse.monthlyIncome;
        gameState.player.monthlyIncome -= income;
        familySystem.familyIncome -= income;
    }
    
    addStory(`💔 You got divorced. Settlement: ${formatMoney(settlement)}. Alimony: ${formatMoney(familySystem.supportPayments.alimony)}/month.`);
    
    familySystem.familyHistory.push({
        turn: gameState.turn,
        event: 'divorce',
        settlement: settlement,
        alimony: familySystem.supportPayments.alimony,
        childSupport: familySystem.supportPayments.childSupport
    });
    
    familySystem.relationshipStatus = 'divorced';
    familySystem.spouse = null;
    
    return true;
}

// Process Family Each Turn
function processFamilyTurn() {
    // Process children aging
    processChildrenAging();
    
    // Calculate and apply family expenses
    const familyExpenses = calculateFamilyExpenses();
    if (familyExpenses > 0) {
        gameState.player.cash -= familyExpenses;
        gameState.player.monthlyStats.expenses += familyExpenses;
        gameState.player.monthlyStats.expensesOther += familyExpenses;
    }
    
    // Process support payments
    const supportTotal = familySystem.supportPayments.alimony + familySystem.supportPayments.childSupport;
    if (supportTotal > 0) {
        gameState.player.cash -= supportTotal;
        gameState.player.monthlyStats.expenses += supportTotal;
        gameState.player.monthlyStats.expensesOther += supportTotal;
    }
    
    // Random family events
    if (Math.random() < 0.05) { // 5% chance
        triggerFamilyEvent();
    }
}

// Trigger Random Family Event
function triggerFamilyEvent() {
    const events = [
        {
            type: 'positive',
            title: '🎉 Family Celebration',
            description: 'Your family had a wonderful celebration together.',
            effect: () => {
                if (familySystem.spouse) {
                    familySystem.spouse.relationship = Math.min(100, familySystem.spouse.relationship + 5);
                }
                gameState.player.mood = Math.min(100, (gameState.player.mood || 100) + 5);
            }
        },
        {
            type: 'negative',
            title: '🏥 Family Medical Expense',
            description: 'A family member needed medical care.',
            effect: () => {
                const cost = 1000 + Math.random() * 2000;
                gameState.player.cash -= cost;
                gameState.player.monthlyStats.expenses += cost;
            }
        },
        {
            type: 'positive',
            title: '🎓 Child Achievement',
            description: 'Your child achieved something great!',
            effect: () => {
                gameState.player.mood = Math.min(100, (gameState.player.mood || 100) + 3);
            }
        }
    ];
    
    const event = events[Math.floor(Math.random() * events.length)];
    addStory(`${event.title}: ${event.description}`);
    event.effect();
}

// Get Family Summary
function getFamilySummary() {
    return {
        relationshipStatus: familySystem.relationshipStatus,
        spouse: familySystem.spouse,
        children: familySystem.children,
        familyExpenses: familySystem.familyExpenses,
        familyIncome: familySystem.familyIncome,
        supportPayments: familySystem.supportPayments,
        history: familySystem.familyHistory
    };
}

// Make functions globally available
window.familySystem = familySystem;
window.meetPotentialSpouse = meetPotentialSpouse;
window.marrySpouse = marrySpouse;
window.haveChild = haveChild;
window.divorce = divorce;
window.processFamilyTurn = processFamilyTurn;
window.calculateFamilyExpenses = calculateFamilyExpenses;
window.getFamilySummary = getFamilySummary;

