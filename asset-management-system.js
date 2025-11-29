// Asset Management System with Property Deterioration
const assetManagementSystem = {
    propertyScenarios: []
};

// Property Deterioration Profiles
const deteriorationProfiles = {
    excellent: {
        name: 'Excellent',
        deteriorationRate: 0.002, // 0.2% per turn
        maintenanceCost: 0.01, // 1% of value
        renovationCost: 0.15, // 15% of value
        valueMultiplier: 1.1
    },
    good: {
        name: 'Good',
        deteriorationRate: 0.003, // 0.3% per turn
        maintenanceCost: 0.012, // 1.2% of value
        renovationCost: 0.18, // 18% of value
        valueMultiplier: 1.0
    },
    fair: {
        name: 'Fair',
        deteriorationRate: 0.005, // 0.5% per turn
        maintenanceCost: 0.015, // 1.5% of value
        renovationCost: 0.22, // 22% of value
        valueMultiplier: 0.9
    },
    poor: {
        name: 'Poor',
        deteriorationRate: 0.008, // 0.8% per turn
        maintenanceCost: 0.02, // 2% of value
        renovationCost: 0.28, // 28% of value
        valueMultiplier: 0.75
    },
    critical: {
        name: 'Critical',
        deteriorationRate: 0.012, // 1.2% per turn
        maintenanceCost: 0.025, // 2.5% of value
        renovationCost: 0.35, // 35% of value
        valueMultiplier: 0.6
    }
};

// Get Deterioration Profile from Condition
function getDeteriorationProfile(condition) {
    if (condition >= 90) return deteriorationProfiles.excellent;
    if (condition >= 75) return deteriorationProfiles.good;
    if (condition >= 60) return deteriorationProfiles.fair;
    if (condition >= 40) return deteriorationProfiles.poor;
    return deteriorationProfiles.critical;
}

// Property Scenarios (Random Events)
const propertyScenarios = [
    {
        type: 'positive',
        name: 'Property Value Surge',
        description: 'Property values in the area have increased significantly.',
        effect: { valueChange: 0.15, conditionChange: 0 },
        chance: 0.05
    },
    {
        type: 'positive',
        name: 'Neighborhood Improvement',
        description: 'Local improvements have increased property desirability.',
        effect: { valueChange: 0.08, conditionChange: 2 },
        chance: 0.08
    },
    {
        type: 'negative',
        name: 'Market Decline',
        description: 'Property values in the area have decreased.',
        effect: { valueChange: -0.12, conditionChange: 0 },
        chance: 0.06
    },
    {
        type: 'negative',
        name: 'Natural Disaster',
        description: 'A natural disaster has damaged the property.',
        effect: { valueChange: -0.20, conditionChange: -15 },
        chance: 0.02
    },
    {
        type: 'negative',
        name: 'Vandalism',
        description: 'Property has been vandalized.',
        effect: { valueChange: -0.05, conditionChange: -8 },
        chance: 0.04
    },
    {
        type: 'negative',
        name: 'Structural Issues',
        description: 'Structural problems discovered, requiring immediate attention.',
        effect: { valueChange: -0.10, conditionChange: -12 },
        chance: 0.03
    },
    {
        type: 'neutral',
        name: 'Market Stability',
        description: 'Property market remains stable.',
        effect: { valueChange: 0, conditionChange: 0 },
        chance: 0.72
    }
];

// Process Property Deterioration Each Turn
function processPropertyDeterioration() {
    gameState.player.properties.forEach(property => {
        if (!property.condition) property.condition = 100;
        if (!property.lastMaintenance) property.lastMaintenance = gameState.turn;
        if (!property.deteriorationProfile) {
            property.deteriorationProfile = getDeteriorationProfile(property.condition).name.toLowerCase();
        }
        
        const profile = deteriorationProfiles[property.deteriorationProfile] || deteriorationProfiles.good;
        const turnsSinceMaintenance = gameState.turn - property.lastMaintenance;
        
        // Increased deterioration if maintenance is skipped
        let deteriorationMultiplier = 1.0;
        if (turnsSinceMaintenance > 12) {
            deteriorationMultiplier = 1.5; // 50% faster deterioration
        }
        if (turnsSinceMaintenance > 24) {
            deteriorationMultiplier = 2.0; // 100% faster deterioration
        }
        if (turnsSinceMaintenance > 36) {
            deteriorationMultiplier = 3.0; // 200% faster deterioration
        }
        
        // Apply deterioration
        const deterioration = profile.deteriorationRate * deteriorationMultiplier * 100;
        property.condition = Math.max(0, property.condition - deterioration);
        
        // Update deterioration profile based on new condition
        const newProfile = getDeteriorationProfile(property.condition);
        property.deteriorationProfile = newProfile.name.toLowerCase();
        
        // Update property value based on condition
        const baseValue = property.originalValue || property.value;
        property.value = baseValue * newProfile.valueMultiplier * (property.condition / 100);
        
        // Check for random scenarios
        if (Math.random() < 0.15) { // 15% chance per turn
            triggerPropertyScenario(property);
        }
    });
}

// Trigger Property Scenario
function triggerPropertyScenario(property) {
    const scenario = propertyScenarios[Math.floor(Math.random() * propertyScenarios.length)];
    
    // Apply scenario effects
    property.value = Math.max(property.value * 0.5, property.value * (1 + scenario.effect.valueChange));
    property.condition = Math.max(0, Math.min(100, property.condition + scenario.effect.conditionChange));
    
    // Update profile
    const newProfile = getDeteriorationProfile(property.condition);
    property.deteriorationProfile = newProfile.name.toLowerCase();
    
    // Log scenario
    assetManagementSystem.propertyScenarios.push({
        propertyId: property.name,
        scenario: scenario.name,
        turn: gameState.turn,
        effect: scenario.effect
    });
    
    addStory(`🏠 ${scenario.name}: ${scenario.description} (${property.name})`);
}

// Perform Maintenance on Property
function performPropertyMaintenance(propertyIndex) {
    const property = gameState.player.properties[propertyIndex];
    if (!property) return false;
    
    const profile = deteriorationProfiles[property.deteriorationProfile] || deteriorationProfiles.good;
    const maintenanceCost = property.value * profile.maintenanceCost;
    
    if (gameState.player.cash < maintenanceCost) {
        if (typeof showToast === 'function') {
            showToast(`Insufficient funds. Need ${formatMoney(maintenanceCost)}`, 'error');
        }
        return false;
    }
    
    // Pay for maintenance
    gameState.player.cash -= maintenanceCost;
    
    // Improve condition
    const conditionImprovement = Math.min(15, 100 - property.condition);
    property.condition = Math.min(100, property.condition + conditionImprovement);
    property.lastMaintenance = gameState.turn;
    
    // Update profile
    const newProfile = getDeteriorationProfile(property.condition);
    property.deteriorationProfile = newProfile.name.toLowerCase();
    
    // Update value
    const baseValue = property.originalValue || property.value;
    property.value = baseValue * newProfile.valueMultiplier * (property.condition / 100);
    
    // Log transaction
    if (typeof logTransaction === 'function') {
        logTransaction('expense', `Maintenance: ${property.name}`, -maintenanceCost, {
            expenseType: 'property_maintenance',
            propertyName: property.name,
            conditionAfter: property.condition
        });
    }
    
    if (typeof showToast === 'function') {
        showToast(`Maintenance completed on ${property.name}. Condition improved to ${property.condition.toFixed(0)}%`, 'success');
    }
    
    addStory(`🔧 Performed maintenance on ${property.name}. Condition: ${property.condition.toFixed(0)}%`);
    
    if (typeof updateDisplay === 'function') {
        updateDisplay();
    }
    
    return true;
}

// Renovate Property
function renovateProperty(propertyIndex) {
    const property = gameState.player.properties[propertyIndex];
    if (!property) return false;
    
    const profile = deteriorationProfiles[property.deteriorationProfile] || deteriorationProfiles.good;
    const renovationCost = property.value * profile.renovationCost;
    
    if (gameState.player.cash < renovationCost) {
        if (typeof showToast === 'function') {
            showToast(`Insufficient funds. Need ${formatMoney(renovationCost)}`, 'error');
        }
        return false;
    }
    
    // Pay for renovation
    gameState.player.cash -= renovationCost;
    
    // Significant condition improvement
    property.condition = Math.min(100, property.condition + 30);
    property.lastMaintenance = gameState.turn;
    
    // Upgrade to better profile
    const newProfile = getDeteriorationProfile(property.condition);
    property.deteriorationProfile = newProfile.name.toLowerCase();
    
    // Increase base value
    if (!property.originalValue) property.originalValue = property.value;
    property.originalValue *= 1.1; // 10% value increase from renovation
    property.value = property.originalValue * newProfile.valueMultiplier * (property.condition / 100);
    
    // Log transaction
    if (typeof logTransaction === 'function') {
        logTransaction('expense', `Renovation: ${property.name}`, -renovationCost, {
            expenseType: 'property_renovation',
            propertyName: property.name,
            conditionAfter: property.condition,
            valueIncrease: property.originalValue * 0.1
        });
    }
    
    if (typeof showToast === 'function') {
        showToast(`Renovation completed on ${property.name}. Condition: ${property.condition.toFixed(0)}%, Value increased!`, 'success');
    }
    
    addStory(`🏗️ Renovated ${property.name}. Condition: ${property.condition.toFixed(0)}%, Property value increased!`);
    
    if (typeof updateDisplay === 'function') {
        updateDisplay();
    }
    
    return true;
}

// Sell Property
function sellPropertyFromAssetManagement(propertyIndex) {
    const property = gameState.player.properties[propertyIndex];
    if (!property) return false;
    
    // Calculate sale value (current market value)
    const saleValue = property.value;
    
    // Add cash
    gameState.player.cash += saleValue;
    
    // Remove property
    gameState.player.properties.splice(propertyIndex, 1);
    
    // Log transaction
    if (typeof logTransaction === 'function') {
        logTransaction('property', `Sold property: ${property.name}`, saleValue, {
            propertyName: property.name,
            condition: property.condition,
            saleValue: saleValue
        });
    }
    
    if (typeof showToast === 'function') {
        showToast(`Sold ${property.name} for ${formatMoney(saleValue)}`, 'success');
    }
    
    addStory(`💰 Sold ${property.name} for ${formatMoney(saleValue)}.`);
    
    if (typeof updateDisplay === 'function') {
        updateDisplay();
    }
    
    return true;
}

// Display Asset Management Dashboard
function openAssetManagementModal() {
    const modal = document.getElementById('asset-management-modal');
    if (!modal) {
        createAssetManagementModal();
    }
    
    // Use modal manager
    if (typeof openModal === 'function') {
        if (!openModal('asset-management-modal')) return;
    } else {
        modal.classList.add('active');
    }
    
    displayAssetManagement();
}

// Create Asset Management Modal
function createAssetManagementModal() {
    const modal = document.createElement('div');
    modal.id = 'asset-management-modal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 1000px; max-height: 90vh;">
            <span class="close" onclick="closeModalById('asset-management-modal')">&times;</span>
            <h2>🏠 Asset Management Dashboard</h2>
            <div id="asset-management-content" style="max-height: 75vh; overflow-y: auto;"></div>
        </div>
    `;
    document.body.appendChild(modal);
}

// Display Asset Management
function displayAssetManagement() {
    const content = document.getElementById('asset-management-content');
    if (!content) return;
    
    if (gameState.player.properties.length === 0) {
        content.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 40px;">You don\'t own any properties yet.</p>';
        return;
    }
    
    let html = '';
    
    gameState.player.properties.forEach((property, index) => {
        const profile = deteriorationProfiles[property.deteriorationProfile] || deteriorationProfiles.good;
        const turnsSinceMaintenance = property.lastMaintenance ? gameState.turn - property.lastMaintenance : 0;
        const maintenanceNeeded = turnsSinceMaintenance > 12;
        const urgentMaintenance = turnsSinceMaintenance > 24;
        
        const conditionColor = property.condition >= 75 ? 'var(--success-color)' :
                              property.condition >= 50 ? 'var(--warning-color)' : 'var(--danger-color)';
        
        html += `
            <div style="background: var(--bg-dark); padding: 20px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid ${conditionColor};">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px;">
                    <div>
                        <h3 style="margin: 0 0 5px 0;">${property.name}</h3>
                        <div style="font-size: 0.9em; color: var(--text-secondary);">
                            ${property.type || 'Property'}
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 1.3em; font-weight: 600; color: var(--secondary-color);">
                            ${formatMoney(property.value)}
                        </div>
                        <div style="font-size: 0.85em; color: var(--text-secondary);">Current Value</div>
                    </div>
                </div>
                
                <!-- Condition and Deterioration -->
                <div style="background: var(--bg-light); padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-bottom: 10px;">
                        <div>
                            <div style="font-size: 0.85em; color: var(--text-secondary); margin-bottom: 5px;">Condition</div>
                            <div style="font-size: 1.2em; font-weight: 600; color: ${conditionColor};">
                                ${property.condition.toFixed(0)}%
                            </div>
                            <div style="width: 100%; height: 8px; background: var(--bg-dark); border-radius: 4px; margin-top: 5px; overflow: hidden;">
                                <div style="background: ${conditionColor}; height: 100%; width: ${property.condition}%;"></div>
                            </div>
                        </div>
                        <div>
                            <div style="font-size: 0.85em; color: var(--text-secondary); margin-bottom: 5px;">Deterioration Profile</div>
                            <div style="font-size: 1em; font-weight: 600; text-transform: capitalize;">
                                ${property.deteriorationProfile || 'Good'}
                            </div>
                            <div style="font-size: 0.75em; color: var(--text-secondary); margin-top: 3px;">
                                Rate: ${((profile.deteriorationRate * 100).toFixed(2))}%/turn
                            </div>
                        </div>
                        <div>
                            <div style="font-size: 0.85em; color: var(--text-secondary); margin-bottom: 5px;">Last Maintenance</div>
                            <div style="font-size: 1em; font-weight: 600;">
                                ${turnsSinceMaintenance} turn(s) ago
                            </div>
                            ${maintenanceNeeded ? `
                                <div style="font-size: 0.75em; color: ${urgentMaintenance ? 'var(--danger-color)' : 'var(--warning-color)'}; margin-top: 3px;">
                                    ${urgentMaintenance ? '⚠️ Urgent' : '⚠️ Needed'}
                                </div>
                            ` : ''}
                        </div>
                    </div>
                    
                    ${property.monthlyIncome ? `
                        <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--border-color);">
                            <div style="font-size: 0.85em; color: var(--text-secondary);">Monthly Income</div>
                            <div style="font-size: 1.1em; font-weight: 600; color: var(--success-color);">
                                ${formatMoney(property.monthlyIncome)}
                            </div>
                        </div>
                    ` : ''}
                </div>
                
                <!-- Actions -->
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px;">
                    <button class="btn-secondary" onclick="performPropertyMaintenance(${index}); displayAssetManagement();">
                        🔧 Maintenance<br>
                        <span style="font-size: 0.8em;">${formatMoney(property.value * profile.maintenanceCost)}</span>
                    </button>
                    <button class="btn-primary" onclick="renovateProperty(${index}); displayAssetManagement();">
                        🏗️ Renovate<br>
                        <span style="font-size: 0.8em;">${formatMoney(property.value * profile.renovationCost)}</span>
                    </button>
                    <button class="btn-secondary" onclick="if(confirm('Sell this property for ${formatMoney(property.value)}?')) { sellPropertyFromAssetManagement(${index}); displayAssetManagement(); }">
                        💰 Sell<br>
                        <span style="font-size: 0.8em;">${formatMoney(property.value)}</span>
                    </button>
                </div>
            </div>
        `;
    });
    
    content.innerHTML = html;
}

// Make functions globally available
window.processPropertyDeterioration = processPropertyDeterioration;
window.performPropertyMaintenance = performPropertyMaintenance;
window.renovateProperty = renovateProperty;
window.sellPropertyFromAssetManagement = sellPropertyFromAssetManagement;
window.openAssetManagementModal = openAssetManagementModal;
window.displayAssetManagement = displayAssetManagement;
window.assetManagementSystem = assetManagementSystem;

