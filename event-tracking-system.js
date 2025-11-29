// Event Tracking System - Tracks all events and their effects on gameplay
const eventTrackingSystem = {
    activeEvents: [], // Currently active events with durations
    eventHistory: [], // All events that have occurred
    hiddenEffects: {} // Effects hidden from player (for mystery)
};

// Event Effect Types
const effectTypes = {
    MARKET_PRICE: 'market_price',
    MARKET_SENTIMENT: 'market_sentiment',
    PROPERTY_VALUE: 'property_value',
    BUSINESS_INCOME: 'business_income',
    PLAYER_ATTRIBUTE: 'player_attribute',
    INTEREST_RATE: 'interest_rate',
    INFLATION: 'inflation',
    CREDIT_SCORE: 'credit_score',
    SKILL_BOOST: 'skill_boost',
    PASSIVE_INCOME: 'passive_income'
};

// Create Event Effect
function createEventEffect(eventId, effectType, target, value, duration, isPositive, visible = true, description = '') {
    return {
        id: `effect_${eventId}_${Date.now()}`,
        eventId: eventId,
        effectType: effectType,
        target: target, // What is affected (e.g., 'stocks', 'property_1', 'player_luck')
        value: value, // Effect value (percentage, absolute, etc.)
        duration: duration, // Turns remaining
        originalDuration: duration,
        isPositive: isPositive, // true = good, false = bad
        visible: visible, // Whether player can see full details
        description: description || getEffectDescription(effectType, target, value, isPositive, visible),
        applied: false,
        turnApplied: gameState.turn
    };
}

// Get Effect Description (with hidden details)
function getEffectDescription(effectType, target, value, isPositive, visible) {
    const sign = isPositive ? '+' : '-';
    const icon = isPositive ? '✅' : '⚠️';
    
    if (!visible) {
        // Hide some details - keep player guessing
        const hiddenDescriptions = [
            `${icon} Something is affecting ${target}...`,
            `${icon} Market forces are at work`,
            `${icon} An unseen influence is present`,
            `${icon} Changes are happening behind the scenes`
        ];
        return hiddenDescriptions[Math.floor(Math.random() * hiddenDescriptions.length)];
    }
    
    switch(effectType) {
        case effectTypes.MARKET_PRICE:
            return `${icon} ${target} prices ${isPositive ? 'increased' : 'decreased'} by ${Math.abs(value * 100).toFixed(1)}%`;
        case effectTypes.MARKET_SENTIMENT:
            return `${icon} Market sentiment ${isPositive ? 'improved' : 'worsened'} for ${target}`;
        case effectTypes.PROPERTY_VALUE:
            return `${icon} Property value ${isPositive ? 'increased' : 'decreased'} by ${Math.abs(value * 100).toFixed(1)}%`;
        case effectTypes.BUSINESS_INCOME:
            return `${icon} Business income ${isPositive ? 'increased' : 'decreased'} by ${Math.abs(value * 100).toFixed(1)}%`;
        case effectTypes.PLAYER_ATTRIBUTE:
            return `${icon} Your ${target} ${isPositive ? 'increased' : 'decreased'} by ${Math.abs(value)}`;
        case effectTypes.INTEREST_RATE:
            return `${icon} Interest rates ${isPositive ? 'decreased' : 'increased'} by ${Math.abs(value * 100).toFixed(1)}%`;
        case effectTypes.INFLATION:
            return `${icon} Inflation ${isPositive ? 'decreased' : 'increased'} by ${Math.abs(value * 100).toFixed(1)}%`;
        case effectTypes.CREDIT_SCORE:
            return `${icon} Credit score ${isPositive ? 'increased' : 'decreased'} by ${Math.abs(value)}`;
        case effectTypes.SKILL_BOOST:
            return `${icon} ${target} skill ${isPositive ? 'boosted' : 'reduced'} by ${Math.abs(value)}`;
        case effectTypes.PASSIVE_INCOME:
            return `${icon} Passive income ${isPositive ? 'increased' : 'decreased'} by ${Math.abs(value * 100).toFixed(1)}%`;
        default:
            return `${icon} Effect on ${target}: ${sign}${Math.abs(value)}`;
    }
}

// Apply Event Effect
function applyEventEffect(effect) {
    if (effect.applied && effect.applied === true) return; // Already applied (check for boolean)
    
    switch(effect.effectType) {
        case effectTypes.MARKET_PRICE:
            applyMarketPriceEffect(effect);
            break;
        case effectTypes.MARKET_SENTIMENT:
            applyMarketSentimentEffect(effect);
            break;
        case effectTypes.PROPERTY_VALUE:
            applyPropertyValueEffect(effect);
            break;
        case effectTypes.BUSINESS_INCOME:
            applyBusinessIncomeEffect(effect);
            break;
        case effectTypes.PLAYER_ATTRIBUTE:
            applyPlayerAttributeEffect(effect);
            break;
        case effectTypes.INTEREST_RATE:
            applyInterestRateEffect(effect);
            break;
        case effectTypes.INFLATION:
            applyInflationEffect(effect);
            break;
        case effectTypes.CREDIT_SCORE:
            applyCreditScoreEffect(effect);
            break;
        case effectTypes.SKILL_BOOST:
            applySkillBoostEffect(effect);
            break;
        case effectTypes.PASSIVE_INCOME:
            applyPassiveIncomeEffect(effect);
            break;
    }
    
    effect.applied = true;
}

// Apply Market Price Effect
function applyMarketPriceEffect(effect) {
    if (!gameState.markets || !gameState.markets[effect.target]) return;
    
    gameState.markets[effect.target].forEach(asset => {
        const multiplier = effect.isPositive ? (1 + effect.value) : (1 - effect.value);
        asset.price *= multiplier;
        
        // Store original price for reversal
        if (!asset.eventPriceModifiers) asset.eventPriceModifiers = [];
        asset.eventPriceModifiers.push({
            effectId: effect.id,
            multiplier: multiplier
        });
    });
}

// Apply Market Sentiment Effect
function applyMarketSentimentEffect(effect) {
    if (typeof marketEconomics !== 'undefined' && marketEconomics.indicators) {
        const change = effect.isPositive ? effect.value : -effect.value;
        marketEconomics.indicators.marketSentiment = Math.max(0, Math.min(1, 
            marketEconomics.indicators.marketSentiment + change
        ));
    }
}

// Apply Property Value Effect
function applyPropertyValueEffect(effect) {
    if (effect.target === 'all') {
        gameState.player.properties.forEach(property => {
            const multiplier = effect.isPositive ? (1 + effect.value) : (1 - effect.value);
            property.value *= multiplier;
            if (property.originalValue) property.originalValue *= multiplier;
        });
    } else {
        const property = gameState.player.properties.find(p => p.id === effect.target);
        if (property) {
            const multiplier = effect.isPositive ? (1 + effect.value) : (1 - effect.value);
            property.value *= multiplier;
            if (property.originalValue) property.originalValue *= multiplier;
        }
    }
}

// Apply Business Income Effect
function applyBusinessIncomeEffect(effect) {
    if (typeof opportunitiesSystem === 'undefined' || !opportunitiesSystem.playerBusinesses) return;
    
    if (effect.target === 'all') {
        opportunitiesSystem.playerBusinesses.forEach(business => {
            const multiplier = effect.isPositive ? (1 + effect.value) : (1 - effect.value);
            business.monthlyIncome *= multiplier;
        });
    } else {
        const business = opportunitiesSystem.playerBusinesses.find(b => b.id === effect.target);
        if (business) {
            const multiplier = effect.isPositive ? (1 + effect.value) : (1 - effect.value);
            business.monthlyIncome *= multiplier;
        }
    }
}

// Apply Player Attribute Effect
function applyPlayerAttributeEffect(effect) {
    if (typeof playerAttributes === 'undefined') return;
    
    if (effect.target === 'luck') {
        playerAttributes.luck = Math.max(0, Math.min(100, 
            playerAttributes.luck + (effect.isPositive ? effect.value : -effect.value)
        ));
    } else if (playerAttributes.skills && playerAttributes.skills[effect.target]) {
        playerAttributes.skills[effect.target] = Math.max(0, Math.min(100,
            playerAttributes.skills[effect.target] + (effect.isPositive ? effect.value : -effect.value)
        ));
    }
}

// Apply Interest Rate Effect
function applyInterestRateEffect(effect) {
    if (typeof marketEconomics !== 'undefined' && marketEconomics.indicators) {
        const change = effect.isPositive ? -effect.value : effect.value;
        marketEconomics.indicators.interestRate = Math.max(0, 
            marketEconomics.indicators.interestRate + change
        );
    }
}

// Apply Inflation Effect
function applyInflationEffect(effect) {
    if (typeof marketEconomics !== 'undefined' && marketEconomics.indicators) {
        const change = effect.isPositive ? -effect.value : effect.value;
        marketEconomics.indicators.inflation = Math.max(0,
            marketEconomics.indicators.inflation + change
        );
    }
}

// Apply Credit Score Effect
function applyCreditScoreEffect(effect) {
    if (typeof bankSystem !== 'undefined' && bankSystem.creditScore) {
        const change = effect.isPositive ? effect.value : -effect.value;
        bankSystem.creditScore = Math.max(300, Math.min(850,
            bankSystem.creditScore + change
        ));
    }
}

// Apply Skill Boost Effect
function applySkillBoostEffect(effect) {
    if (typeof playerAttributes === 'undefined' || !playerAttributes.skills) return;
    
    if (playerAttributes.skills[effect.target]) {
        playerAttributes.skills[effect.target] = Math.max(0, Math.min(100,
            playerAttributes.skills[effect.target] + (effect.isPositive ? effect.value : -effect.value)
        ));
    }
}

// Apply Passive Income Effect
function applyPassiveIncomeEffect(effect) {
    // This is a multiplier that affects all passive income sources
    if (!gameState.player.passiveIncomeMultiplier) {
        gameState.player.passiveIncomeMultiplier = 1;
    }
    
    const multiplier = effect.isPositive ? (1 + effect.value) : (1 - effect.value);
    gameState.player.passiveIncomeMultiplier *= multiplier;
}

// Remove Event Effect (when duration expires)
function removeEventEffect(effect) {
    // Reverse the effect
    switch(effect.effectType) {
        case effectTypes.MARKET_PRICE:
            removeMarketPriceEffect(effect);
            break;
        case effectTypes.MARKET_SENTIMENT:
            // Sentiment naturally returns, no reversal needed
            break;
        case effectTypes.PROPERTY_VALUE:
            // Property values don't reverse, they stay at new level
            break;
        case effectTypes.BUSINESS_INCOME:
            // Business income doesn't reverse
            break;
        case effectTypes.PLAYER_ATTRIBUTE:
            // Attributes may or may not reverse depending on effect
            break;
        case effectTypes.INTEREST_RATE:
            // Interest rates naturally adjust
            break;
        case effectTypes.INFLATION:
            // Inflation naturally adjusts
            break;
        case effectTypes.CREDIT_SCORE:
            // Credit score changes are permanent
            break;
        case effectTypes.SKILL_BOOST:
            // Skill boosts may be temporary or permanent
            break;
        case effectTypes.PASSIVE_INCOME:
            removePassiveIncomeEffect(effect);
            break;
    }
}

// Remove Market Price Effect
function removeMarketPriceEffect(effect) {
    if (!gameState.markets || !gameState.markets[effect.target]) return;
    
    gameState.markets[effect.target].forEach(asset => {
        if (asset.eventPriceModifiers) {
            const modifierIndex = asset.eventPriceModifiers.findIndex(m => m.effectId === effect.id);
            if (modifierIndex !== -1) {
                // Reverse the multiplier
                const multiplier = asset.eventPriceModifiers[modifierIndex].multiplier;
                asset.price /= multiplier;
                asset.eventPriceModifiers.splice(modifierIndex, 1);
            }
        }
    });
}

// Remove Passive Income Effect
function removePassiveIncomeEffect(effect) {
    if (!gameState.player.passiveIncomeMultiplier) return;
    
    const multiplier = effect.isPositive ? (1 + effect.value) : (1 - effect.value);
    gameState.player.passiveIncomeMultiplier /= multiplier;
}

// Register Event with Effects
function registerEvent(eventId, eventName, effects, visibleEffects = true) {
    const event = {
        id: eventId,
        name: eventName,
        effects: effects,
        turnStarted: gameState.turn,
        visibleEffects: visibleEffects // Whether to show effect details to player
    };
    
    // Apply all effects
    effects.forEach(effect => {
        applyEventEffect(effect);
        eventTrackingSystem.activeEvents.push(effect);
    });
    
    eventTrackingSystem.eventHistory.push(event);
    
    return event;
}

// Process Event Effects Each Turn
function processEventEffects() {
    const expiredEffects = [];
    
    eventTrackingSystem.activeEvents.forEach((effect, index) => {
        if (effect.duration > 0) {
            effect.duration--;
            
            if (effect.duration === 0) {
                // Effect expired
                removeEventEffect(effect);
                expiredEffects.push(index);
            }
        }
    });
    
    // Remove expired effects (in reverse order to maintain indices)
    expiredEffects.reverse().forEach(index => {
        const effect = eventTrackingSystem.activeEvents[index];
        if (effect.visible) {
            addStory(`⏱️ ${effect.description} has ended.`);
        }
        eventTrackingSystem.activeEvents.splice(index, 1);
    });
}

// Get Active Effects Display
function getActiveEffectsDisplay() {
    const visibleEffects = eventTrackingSystem.activeEvents.filter(e => e.visible);
    
    if (visibleEffects.length === 0) {
        return '<p style="color: var(--text-secondary);">No active event effects.</p>';
    }
    
    let html = '<div style="display: grid; gap: 10px;">';
    
    visibleEffects.forEach(effect => {
        const timeRemaining = effect.duration > 0 ? `${effect.duration} turn(s)` : 'Permanent';
        const progress = effect.originalDuration > 0 ? 
            ((effect.originalDuration - effect.duration) / effect.originalDuration * 100) : 100;
        
        html += `
            <div style="background: var(--bg-dark); padding: 12px; border-radius: 8px; border-left: 3px solid ${effect.isPositive ? 'var(--success-color)' : 'var(--danger-color)'};">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                    <div style="flex: 1;">
                        <div style="font-weight: 600; margin-bottom: 3px;">${effect.description}</div>
                        <div style="font-size: 0.85em; color: var(--text-secondary);">
                            Affects: ${effect.target} • Type: ${effect.effectType.replace('_', ' ')}
                        </div>
                    </div>
                    <div style="text-align: right; font-size: 0.85em; color: var(--text-secondary);">
                        ${timeRemaining}
                    </div>
                </div>
                ${effect.originalDuration > 0 ? `
                    <div style="height: 4px; background: var(--bg-light); border-radius: 2px; overflow: hidden;">
                        <div style="background: ${effect.isPositive ? 'var(--success-color)' : 'var(--danger-color)'}; height: 100%; width: ${progress}%;"></div>
                    </div>
                ` : ''}
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

// Make functions globally available
window.eventTrackingSystem = eventTrackingSystem;
window.createEventEffect = createEventEffect;
window.registerEvent = registerEvent;
window.processEventEffects = processEventEffects;
window.getActiveEffectsDisplay = getActiveEffectsDisplay;
window.effectTypes = effectTypes;

