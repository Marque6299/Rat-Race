// Comprehensive Tax System
const taxSystem = {
    // Tax brackets (progressive income tax)
    incomeTaxBrackets: [
        { min: 0, max: 10000, rate: 0.10 },
        { min: 10000, max: 40000, rate: 0.15 },
        { min: 40000, max: 85000, rate: 0.22 },
        { min: 85000, max: 163000, rate: 0.24 },
        { min: 163000, max: 207000, rate: 0.32 },
        { min: 207000, max: 518000, rate: 0.35 },
        { min: 518000, max: Infinity, rate: 0.37 }
    ],
    
    // Capital gains tax rates
    capitalGainsRates: {
        shortTerm: 0.22, // Held less than 1 year
        longTerm: 0.15   // Held 1+ years
    },
    
    // Deductions and credits
    deductions: {
        mortgageInterest: 0,
        propertyTax: 0,
        charitableContributions: 0,
        businessExpenses: 0,
        educationExpenses: 0,
        medicalExpenses: 0,
        standardDeduction: 12950 // Standard deduction amount
    },
    
    // Tax-advantaged accounts
    taxAdvantagedAccounts: {
        retirement: {
            contribution: 0,
            maxContribution: 22500,
            balance: 0,
            type: '401k' // or IRA
        }
    },
    
    // Tax history
    taxHistory: [],
    
    // Current year totals
    currentYear: {
        totalIncome: 0,
        taxableIncome: 0,
        totalTaxes: 0,
        deductions: 0,
        credits: 0
    }
};

// Calculate Income Tax (Progressive)
function calculateIncomeTax(income) {
    let tax = 0;
    let remainingIncome = income;
    
    for (const bracket of taxSystem.incomeTaxBrackets) {
        if (remainingIncome <= 0) break;
        
        const bracketIncome = Math.min(remainingIncome, bracket.max - bracket.min);
        tax += bracketIncome * bracket.rate;
        remainingIncome -= bracketIncome;
    }
    
    return tax;
}

// Calculate Capital Gains Tax
function calculateCapitalGainsTax(gains, holdingPeriod) {
    const rate = holdingPeriod >= 12 ? taxSystem.capitalGainsRates.longTerm : taxSystem.capitalGainsRates.shortTerm;
    return gains * rate;
}

// Calculate Total Deductions
function calculateTotalDeductions() {
    const itemized = Object.values(taxSystem.deductions).reduce((sum, val) => sum + val, 0);
    return Math.max(itemized, taxSystem.deductions.standardDeduction);
}

// Calculate Annual Taxes
function calculateAnnualTaxes() {
    const income = taxSystem.currentYear.totalIncome;
    const deductions = calculateTotalDeductions();
    const taxableIncome = Math.max(0, income - deductions);
    
    const incomeTax = calculateIncomeTax(taxableIncome);
    const capitalGainsTax = taxSystem.currentYear.capitalGains * taxSystem.capitalGainsRates.longTerm;
    
    const totalTax = incomeTax + capitalGainsTax - taxSystem.currentYear.credits;
    
    taxSystem.currentYear.totalTaxes = Math.max(0, totalTax);
    taxSystem.currentYear.taxableIncome = taxableIncome;
    taxSystem.currentYear.deductions = deductions;
    
    return taxSystem.currentYear.totalTaxes;
}

// Process Monthly Taxes (simplified for monthly gameplay)
function processMonthlyTaxes() {
    // Calculate monthly portion of annual tax
    const monthlyIncome = gameState.player.monthlyStats.income || 0;
    const monthlyTaxRate = 0.15; // Simplified monthly rate (will be reconciled annually)
    
    // Add deductions for mortgage interest and property tax
    let monthlyDeductions = 0;
    if (gameState.player.properties && gameState.player.properties.length > 0) {
        gameState.player.properties.forEach(property => {
            if (property.mortgageInterest) {
                monthlyDeductions += property.mortgageInterest;
            }
            if (property.propertyTax) {
                monthlyDeductions += property.propertyTax / 12; // Annual to monthly
            }
        });
    }
    
    const taxableIncome = Math.max(0, monthlyIncome - (monthlyDeductions / 12));
    const monthlyTax = taxableIncome * monthlyTaxRate;
    
    // Track for annual reconciliation
    taxSystem.currentYear.totalIncome += monthlyIncome;
    taxSystem.currentYear.deductions += monthlyDeductions;
    
    return monthlyTax;
}

// Process Capital Gains on Sold Assets
function processCapitalGainsTax(salePrice, costBasis, holdingPeriod) {
    const gain = salePrice - costBasis;
    if (gain <= 0) return 0; // No tax on losses
    
    const tax = calculateCapitalGainsTax(gain, holdingPeriod);
    taxSystem.currentYear.capitalGains += gain;
    
    return tax;
}

// Annual Tax Reconciliation (at end of year)
function reconcileAnnualTaxes() {
    const annualTax = calculateAnnualTaxes();
    const monthlyTaxesPaid = taxSystem.taxHistory
        .filter(h => h.year === gameState.year - 1)
        .reduce((sum, h) => sum + h.monthlyTaxes, 0);
    
    const difference = annualTax - monthlyTaxesPaid;
    
    if (difference > 0) {
        // Owe more taxes
        gameState.player.cash -= difference;
        addStory(`📊 Annual tax reconciliation: You owe an additional ${formatMoney(difference)} in taxes.`);
    } else if (difference < 0) {
        // Tax refund
        gameState.player.cash += Math.abs(difference);
        addStory(`💰 Tax refund! You received ${formatMoney(Math.abs(difference))} back.`);
    }
    
    // Record in history
    taxSystem.taxHistory.push({
        year: gameState.year - 1,
        totalIncome: taxSystem.currentYear.totalIncome,
        taxableIncome: taxSystem.currentYear.taxableIncome,
        totalTaxes: annualTax,
        deductions: taxSystem.currentYear.deductions,
        monthlyTaxes: monthlyTaxesPaid,
        finalAmount: difference
    });
    
    // Reset for new year
    taxSystem.currentYear = {
        totalIncome: 0,
        taxableIncome: 0,
        totalTaxes: 0,
        deductions: 0,
        credits: 0,
        capitalGains: 0
    };
}

// Add Tax Deduction
function addTaxDeduction(type, amount) {
    if (taxSystem.deductions[type] !== undefined) {
        taxSystem.deductions[type] += amount;
    }
}

// Contribute to Retirement Account
function contributeToRetirement(amount) {
    const account = taxSystem.taxAdvantagedAccounts.retirement;
    const maxContribution = account.maxContribution - account.contribution;
    const contribution = Math.min(amount, maxContribution, gameState.player.cash);
    
    if (contribution > 0) {
        gameState.player.cash -= contribution;
        account.contribution += contribution;
        account.balance += contribution;
        addTaxDeduction('retirement', contribution);
        addStory(`💰 Contributed ${formatMoney(contribution)} to retirement account. Tax deduction applied.`);
        return true;
    }
    return false;
}

// Get Tax Summary
function getTaxSummary() {
    const monthlyTax = processMonthlyTaxes();
    const annualProjected = calculateAnnualTaxes();
    const ytdTaxes = taxSystem.taxHistory
        .filter(h => h.year === gameState.year)
        .reduce((sum, h) => sum + h.monthlyTaxes, 0) + monthlyTax;
    
    return {
        monthlyTax: monthlyTax,
        annualProjected: annualProjected,
        ytdTaxes: ytdTaxes,
        currentYearIncome: taxSystem.currentYear.totalIncome,
        currentYearDeductions: taxSystem.currentYear.deductions,
        retirementBalance: taxSystem.taxAdvantagedAccounts.retirement.balance,
        taxBracket: getCurrentTaxBracket(taxSystem.currentYear.totalIncome)
    };
}

// Get Current Tax Bracket
function getCurrentTaxBracket(income) {
    for (let i = taxSystem.incomeTaxBrackets.length - 1; i >= 0; i--) {
        if (income > taxSystem.incomeTaxBrackets[i].min) {
            return {
                rate: taxSystem.incomeTaxBrackets[i].rate,
                bracket: i + 1
            };
        }
    }
    return { rate: 0.10, bracket: 1 };
}

// Make functions globally available
window.taxSystem = taxSystem;
window.calculateIncomeTax = calculateIncomeTax;
window.calculateCapitalGainsTax = calculateCapitalGainsTax;
window.processMonthlyTaxes = processMonthlyTaxes;
window.processCapitalGainsTax = processCapitalGainsTax;
window.reconcileAnnualTaxes = reconcileAnnualTaxes;
window.addTaxDeduction = addTaxDeduction;
window.contributeToRetirement = contributeToRetirement;
window.getTaxSummary = getTaxSummary;
window.getCurrentTaxBracket = getCurrentTaxBracket;

