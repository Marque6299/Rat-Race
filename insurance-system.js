// Insurance System
const insuranceSystem = {
    policies: {
        health: null,
        property: [],
        liability: null,
        life: null,
        disability: null
    },
    
    // Insurance history
    claimsHistory: [],
    
    // Premiums paid
    totalPremiums: 0
};

// Insurance Policy Types
const insuranceTypes = {
    health: {
        name: 'Health Insurance',
        icon: '🏥',
        basePremium: 300,
        coverage: {
            medical: 0.8, // 80% coverage
            emergency: 0.9,
            preventive: 1.0
        },
        deductible: 2000,
        maxOutOfPocket: 5000
    },
    property: {
        name: 'Property Insurance',
        icon: '🏠',
        basePremium: 150,
        coverage: {
            damage: 0.9,
            theft: 0.8,
            liability: 1.0
        },
        deductible: 1000,
        perProperty: true
    },
    liability: {
        name: 'Liability Insurance',
        icon: '🛡️',
        basePremium: 200,
        coverage: {
            general: 500000,
            business: 1000000
        },
        deductible: 500
    },
    life: {
        name: 'Life Insurance',
        icon: '💼',
        basePremium: 100,
        coverage: {
            deathBenefit: 100000
        },
        term: 20 // years
    },
    disability: {
        name: 'Disability Insurance',
        icon: '♿',
        basePremium: 150,
        coverage: {
            incomeReplacement: 0.6, // 60% of income
            maxBenefit: 5000
        },
        waitingPeriod: 3 // months
    }
};

// Purchase Insurance Policy
function purchaseInsurance(type, options = {}) {
    const insuranceType = insuranceTypes[type];
    if (!insuranceType) return false;
    
    // Calculate premium based on coverage and risk
    let premium = insuranceType.basePremium;
    
    // Adjust for player's risk factors
    if (gameState.player.financialHealth < 50) premium *= 1.2;
    if (gameState.player.properties && gameState.player.properties.length > 5) premium *= 1.1;
    
    // Property insurance is per property
    if (type === 'property' && options.propertyId) {
        const property = gameState.player.properties.find(p => p.id === options.propertyId);
        if (property) {
            premium = property.value * 0.001; // 0.1% of property value annually
            premium = premium / 12; // Monthly
        }
    }
    
    if (gameState.player.cash < premium) {
        if (typeof showToast === 'function') {
            showToast('Insufficient funds to purchase insurance', 'error', 3000);
        }
        return false;
    }
    
    const policy = {
        id: `insurance_${type}_${Date.now()}`,
        type: type,
        name: insuranceType.name,
        icon: insuranceType.icon,
        premium: premium,
        coverage: { ...insuranceType.coverage },
        deductible: insuranceType.deductible,
        purchased: gameState.turn,
        expires: gameState.turn + 12, // 1 year
        propertyId: options.propertyId || null
    };
    
    // Store policy
    if (type === 'property' && options.propertyId) {
        if (!insuranceSystem.policies.property) {
            insuranceSystem.policies.property = [];
        }
        insuranceSystem.policies.property.push(policy);
    } else {
        insuranceSystem.policies[type] = policy;
    }
    
    gameState.player.cash -= premium;
    insuranceSystem.totalPremiums += premium;
    
    addStory(`🛡️ Purchased ${insuranceType.name} for ${formatMoney(premium)}/month.`);
    
    if (typeof logTransaction === 'function') {
        logTransaction('expense', `Insurance Premium: ${insuranceType.name}`, premium, {
            type: 'insurance',
            insuranceType: type
        });
    }
    
    return true;
}

// Process Insurance Claims
function processInsuranceClaim(type, amount, details = {}) {
    const policy = type === 'property' && details.propertyId ?
        insuranceSystem.policies.property.find(p => p.propertyId === details.propertyId) :
        insuranceSystem.policies[type];
    
    if (!policy || gameState.turn > policy.expires) {
        // No insurance or expired
        gameState.player.cash -= amount;
        addStory(`💸 Uninsured expense: ${formatMoney(amount)}. Consider purchasing insurance.`);
        return { covered: false, amount: amount, payout: 0 };
    }
    
    // Apply deductible
    const afterDeductible = Math.max(0, amount - policy.deductible);
    
    // Calculate coverage
    let coverageRate = 0.8; // Default
    if (type === 'health') {
        coverageRate = details.emergency ? policy.coverage.emergency : policy.coverage.medical;
    } else if (type === 'property') {
        coverageRate = policy.coverage.damage;
    }
    
    const payout = afterDeductible * coverageRate;
    const playerPays = amount - payout;
    
    gameState.player.cash -= playerPays;
    
    // Record claim
    insuranceSystem.claimsHistory.push({
        turn: gameState.turn,
        type: type,
        amount: amount,
        payout: payout,
        playerPays: playerPays,
        policyId: policy.id
    });
    
    addStory(`🛡️ Insurance claim processed: ${formatMoney(payout)} covered, you pay ${formatMoney(playerPays)}.`);
    
    return { covered: true, amount: amount, payout: payout, playerPays: playerPays };
}

// Process Monthly Insurance Premiums
function processInsurancePremiums() {
    let totalPremiums = 0;
    
    // Health insurance
    if (insuranceSystem.policies.health && gameState.turn <= insuranceSystem.policies.health.expires) {
        totalPremiums += insuranceSystem.policies.health.premium;
    }
    
    // Property insurance
    if (insuranceSystem.policies.property) {
        insuranceSystem.policies.property.forEach(policy => {
            if (gameState.turn <= policy.expires) {
                totalPremiums += policy.premium;
            }
        });
    }
    
    // Liability insurance
    if (insuranceSystem.policies.liability && gameState.turn <= insuranceSystem.policies.liability.expires) {
        totalPremiums += insuranceSystem.policies.liability.premium;
    }
    
    // Life insurance
    if (insuranceSystem.policies.life && gameState.turn <= insuranceSystem.policies.life.expires) {
        totalPremiums += insuranceSystem.policies.life.premium;
    }
    
    // Disability insurance
    if (insuranceSystem.policies.disability && gameState.turn <= insuranceSystem.policies.disability.expires) {
        totalPremiums += insuranceSystem.policies.disability.premium;
    }
    
    if (totalPremiums > 0) {
        gameState.player.cash -= totalPremiums;
        insuranceSystem.totalPremiums += totalPremiums;
        
        if (typeof logTransaction === 'function') {
            logTransaction('expense', 'Insurance Premiums', totalPremiums, {
                type: 'insurance',
                monthly: true
            });
        }
    }
    
    return totalPremiums;
}

// Check if Property is Insured
function isPropertyInsured(propertyId) {
    return insuranceSystem.policies.property?.some(p => 
        p.propertyId === propertyId && gameState.turn <= p.expires
    ) || false;
}

// Get Insurance Summary
function getInsuranceSummary() {
    const activePolicies = [];
    let totalMonthlyPremiums = 0;
    
    Object.keys(insuranceSystem.policies).forEach(type => {
        if (type === 'property') {
            insuranceSystem.policies.property?.forEach(policy => {
                if (gameState.turn <= policy.expires) {
                    activePolicies.push(policy);
                    totalMonthlyPremiums += policy.premium;
                }
            });
        } else if (insuranceSystem.policies[type] && gameState.turn <= insuranceSystem.policies[type].expires) {
            activePolicies.push(insuranceSystem.policies[type]);
            totalMonthlyPremiums += insuranceSystem.policies[type].premium;
        }
    });
    
    return {
        activePolicies: activePolicies,
        totalPremiums: totalMonthlyPremiums,
        totalPaid: insuranceSystem.totalPremiums,
        claimsCount: insuranceSystem.claimsHistory.length,
        totalClaimsPaid: insuranceSystem.claimsHistory.reduce((sum, c) => sum + c.payout, 0)
    };
}

// Make functions globally available
window.insuranceSystem = insuranceSystem;
window.purchaseInsurance = purchaseInsurance;
window.processInsuranceClaim = processInsuranceClaim;
window.processInsurancePremiums = processInsurancePremiums;
window.isPropertyInsured = isPropertyInsured;
window.getInsuranceSummary = getInsuranceSummary;
window.insuranceTypes = insuranceTypes;

