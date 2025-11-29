// Active Effects Modal System
function openActiveEffectsModal() {
    const modal = document.getElementById('active-effects-modal');
    if (!modal) {
        createActiveEffectsModal();
    }
    
    // Use modal manager
    if (typeof openModal === 'function') {
        if (!openModal('active-effects-modal')) return;
    } else {
        modal.classList.add('active');
    }
    
    displayActiveEffects();
}

// Create Active Effects Modal
function createActiveEffectsModal() {
    const modal = document.createElement('div');
    modal.id = 'active-effects-modal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 900px; max-height: 90vh;">
            <span class="close" onclick="closeModalById('active-effects-modal')">&times;</span>
            <h2>📊 Active Effects</h2>
            <p style="color: var(--text-secondary); margin-bottom: 20px;">
                Events and effects currently influencing your game. Some details are hidden to keep you thinking!
            </p>
            <div id="active-effects-modal-content" style="max-height: 70vh; overflow-y: auto;"></div>
        </div>
    `;
    document.body.appendChild(modal);
}

// Display Active Effects
function displayActiveEffects() {
    const content = document.getElementById('active-effects-modal-content');
    if (!content) return;
    
    if (typeof eventTrackingSystem === 'undefined' || !eventTrackingSystem.activeEvents || eventTrackingSystem.activeEvents.length === 0) {
        content.innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--text-secondary);">
                <div style="font-size: 3em; margin-bottom: 15px;">✨</div>
                <p style="font-size: 1.1em;">No active effects at the moment.</p>
                <p style="font-size: 0.9em; margin-top: 10px;">Events and their effects will appear here when they occur.</p>
            </div>
        `;
        return;
    }
    
    // Group effects by type (good, bad, moderate)
    const goodEffects = [];
    const badEffects = [];
    const moderateEffects = [];
    
    eventTrackingSystem.activeEvents.forEach(effect => {
        // Determine effect intensity
        const intensity = Math.abs(effect.value);
        let category = 'moderate';
        
        if (effect.isPositive) {
            if (intensity >= 0.15) {
                category = 'good';
            } else if (intensity >= 0.05) {
                category = 'moderate';
            } else {
                category = 'moderate';
            }
            goodEffects.push({ effect, category });
        } else {
            if (intensity >= 0.15) {
                category = 'bad';
            } else if (intensity >= 0.05) {
                category = 'moderate';
            } else {
                category = 'moderate';
            }
            badEffects.push({ effect, category });
        }
    });
    
    let html = '';
    
    // Good Effects Section
    if (goodEffects.length > 0) {
        html += `
            <div style="margin-bottom: 25px;">
                <h3 style="margin-bottom: 15px; color: var(--success-color); display: flex; align-items: center; gap: 10px;">
                    <span>✅</span> Positive Effects (${goodEffects.length})
                </h3>
                <div style="display: grid; gap: 12px;">
        `;
        
        goodEffects.forEach(({ effect, category }) => {
            html += createEffectCard(effect, category);
        });
        
        html += `
                </div>
            </div>
        `;
    }
    
    // Bad Effects Section
    if (badEffects.length > 0) {
        html += `
            <div style="margin-bottom: 25px;">
                <h3 style="margin-bottom: 15px; color: var(--danger-color); display: flex; align-items: center; gap: 10px;">
                    <span>⚠️</span> Negative Effects (${badEffects.length})
                </h3>
                <div style="display: grid; gap: 12px;">
        `;
        
        badEffects.forEach(({ effect, category }) => {
            html += createEffectCard(effect, category);
        });
        
        html += `
                </div>
            </div>
        `;
    }
    
    // Moderate/Neutral Effects (if any)
    if (moderateEffects.length > 0) {
        html += `
            <div style="margin-bottom: 25px;">
                <h3 style="margin-bottom: 15px; color: var(--warning-color); display: flex; align-items: center; gap: 10px;">
                    <span>⚖️</span> Moderate Effects (${moderateEffects.length})
                </h3>
                <div style="display: grid; gap: 12px;">
        `;
        
        moderateEffects.forEach(({ effect, category }) => {
            html += createEffectCard(effect, category);
        });
        
        html += `
                </div>
            </div>
        `;
    }
    
    content.innerHTML = html;
}

// Create Effect Card
function createEffectCard(effect, category) {
    const timeRemaining = effect.duration > 0 ? `${effect.duration} turn(s) remaining` : 'Permanent';
    const progress = effect.originalDuration > 0 ? 
        ((effect.originalDuration - effect.duration) / effect.originalDuration * 100) : 100;
    
    // Determine tag color and text
    let tagColor, tagText, tagIcon;
    if (effect.isPositive) {
        if (category === 'good') {
            tagColor = 'var(--success-color)';
            tagText = 'Good';
            tagIcon = '✅';
        } else {
            tagColor = 'var(--secondary-color)';
            tagText = 'Moderate';
            tagIcon = '⚖️';
        }
    } else {
        if (category === 'bad') {
            tagColor = 'var(--danger-color)';
            tagText = 'Bad';
            tagIcon = '⚠️';
        } else {
            tagColor = 'var(--warning-color)';
            tagText = 'Moderate';
            tagIcon = '⚖️';
        }
    }
    
    // Get effect hint (some details hidden)
    const hint = getEffectHint(effect);
    
    return `
        <div style="background: var(--bg-dark); padding: 15px; border-radius: 10px; border-left: 4px solid ${effect.isPositive ? 'var(--success-color)' : 'var(--danger-color)'};">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
                <div style="flex: 1;">
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 5px;">
                        <span style="font-size: 1.2em;">${effect.isPositive ? '✅' : '⚠️'}</span>
                        <div style="font-weight: 600; font-size: 1.05em;">${effect.description}</div>
                    </div>
                    <div style="font-size: 0.85em; color: var(--text-secondary); margin-left: 32px; margin-bottom: 8px;">
                        ${hint}
                    </div>
                </div>
                <div style="background: ${tagColor}; color: white; padding: 4px 10px; border-radius: 12px; font-size: 0.75em; font-weight: 600; white-space: nowrap; margin-left: 10px;">
                    ${tagIcon} ${tagText}
                </div>
            </div>
            
            <div style="background: var(--bg-light); padding: 10px; border-radius: 8px; margin-bottom: 10px;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.9em;">
                    <div>
                        <div style="color: var(--text-secondary); font-size: 0.85em; margin-bottom: 3px;">Affects</div>
                        <div style="font-weight: 600;">${formatEffectTarget(effect.target)}</div>
                    </div>
                    <div>
                        <div style="color: var(--text-secondary); font-size: 0.85em; margin-bottom: 3px;">Time Remaining</div>
                        <div style="font-weight: 600; color: ${effect.duration > 0 ? 'var(--primary-color)' : 'var(--text-secondary)'};">
                            ${timeRemaining}
                        </div>
                    </div>
                </div>
            </div>
            
            ${effect.originalDuration > 0 ? `
                <div style="margin-top: 10px;">
                    <div style="display: flex; justify-content: space-between; font-size: 0.85em; color: var(--text-secondary); margin-bottom: 5px;">
                        <span>Progress</span>
                        <span>${Math.round(progress)}% complete</span>
                    </div>
                    <div style="height: 6px; background: var(--bg-light); border-radius: 3px; overflow: hidden;">
                        <div style="background: ${effect.isPositive ? 'var(--success-color)' : 'var(--danger-color)'}; height: 100%; width: ${progress}%; transition: width 0.3s;"></div>
                    </div>
                </div>
            ` : ''}
        </div>
    `;
}

// Get Effect Hint (with some hidden details)
function getEffectHint(effect) {
    if (effect.visible) {
        // Show full details
        const valuePercent = Math.abs(effect.value * 100).toFixed(1);
        return `Directly affects ${formatEffectTarget(effect.target)} by ${valuePercent}%`;
    } else {
        // Show hints only
        const hints = [
            `Something is influencing ${formatEffectTarget(effect.target)}...`,
            `Market forces are at work on ${formatEffectTarget(effect.target)}`,
            `An unseen influence affects ${formatEffectTarget(effect.target)}`,
            `Changes are happening with ${formatEffectTarget(effect.target)}`,
            `${formatEffectTarget(effect.target)} is being affected by external factors`
        ];
        return hints[Math.floor(Math.random() * hints.length)];
    }
}

// Format Effect Target
function formatEffectTarget(target) {
    // Capitalize and format target names
    if (target === 'all') return 'All Assets';
    if (target.includes('_')) {
        return target.split('_').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }
    return target.charAt(0).toUpperCase() + target.slice(1);
}

// Make functions globally available
window.openActiveEffectsModal = openActiveEffectsModal;
window.displayActiveEffects = displayActiveEffects;
window.createActiveEffectsModal = createActiveEffectsModal;

