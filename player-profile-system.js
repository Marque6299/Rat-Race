// Player Profile System
function openPlayerProfileModal() {
    try {
        // Ensure modal exists
        let modal = document.getElementById('player-profile-modal');
        if (!modal) {
            createPlayerProfileModal();
            modal = document.getElementById('player-profile-modal');
        }
        
        if (!modal) {
            console.error('Failed to create player profile modal');
            if (typeof showToast === 'function') {
                showToast('Failed to open player profile', 'error', 3000);
            }
            return;
        }
        
        // Use modal manager
        if (typeof openModal === 'function') {
            openModal('player-profile-modal');
        } else {
            modal.classList.add('active');
        }
        
        // Display profile content
        displayPlayerProfile();
    } catch (error) {
        console.error('Error opening player profile modal:', error);
        if (typeof showToast === 'function') {
            showToast('Error opening profile: ' + error.message, 'error', 3000);
        }
    }
}

// Make function globally available immediately (before other functions are defined)
window.openPlayerProfileModal = openPlayerProfileModal;

// Also add event listeners when DOM is ready
function attachProfileButtonListeners() {
    // Attach event listener to profile icon button
    const profileIconBtn = document.getElementById('profile-icon-btn');
    if (profileIconBtn) {
        profileIconBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            openPlayerProfileModal();
        });
    }
    
    // Attach event listener to profile header button
    const profileHeaderBtn = document.getElementById('profile-header-btn');
    if (profileHeaderBtn) {
        profileHeaderBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            openPlayerProfileModal();
        });
    }
}

// Attach listeners when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachProfileButtonListeners);
} else {
    // DOM already loaded, attach immediately
    setTimeout(attachProfileButtonListeners, 100);
}

// Also try to attach after game starts
if (typeof window !== 'undefined') {
    window.attachProfileButtonListeners = attachProfileButtonListeners;
}

// Create Player Profile Modal
function createPlayerProfileModal() {
    const modal = document.createElement('div');
    modal.id = 'player-profile-modal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 900px; max-height: 90vh;">
            <span class="close" onclick="closeModalById('player-profile-modal')">&times;</span>
            <h2>👤 Player Profile</h2>
            <div id="player-profile-content" style="flex: 1; overflow-y: auto; overflow-x: hidden;"></div>
        </div>
    `;
    document.body.appendChild(modal);
}

// Display Player Profile
function displayPlayerProfile() {
    const content = document.getElementById('player-profile-content');
    if (!content) return;
    
    const trait = traitEffects[gameState.player.trait] || {};
    const character = (typeof characterDefinitions !== 'undefined' && gameState.player.characterId) ? 
        characterDefinitions.find(c => c.id === gameState.player.characterId) : null;
    
    // Get learned skills
    const learnedSkills = [];
    if (typeof skillTreeSystem !== 'undefined') {
        Object.keys(skillTreeSystem.skills).forEach(skillId => {
            const skill = skillTreeSystem.skills[skillId];
            if (skill.learned) {
                learnedSkills.push(skill);
            }
        });
    }
    
    // Get player attributes
    const attributes = typeof playerAttributes !== 'undefined' ? playerAttributes : null;
    
    let html = `
        <div style="background: var(--bg-dark); padding: 20px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid var(--primary-color);">
            <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
                <div style="font-size: 3em;">${character ? character.icon : '👤'}</div>
                <div>
                    <h3 style="margin: 0 0 5px 0;">${gameState.player.name}</h3>
                    <div style="font-size: 0.9em; color: var(--text-secondary);">
                        ${character ? character.name : 'Player'}
                    </div>
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div>
                    <div style="font-size: 0.85em; color: var(--text-secondary); margin-bottom: 5px;">Trait</div>
                    <div style="font-weight: 600; text-transform: capitalize;">${gameState.player.trait || 'None'}</div>
                    <div style="font-size: 0.85em; color: var(--text-secondary); margin-top: 3px;">
                        ${trait.description || ''}
                    </div>
                </div>
                <div>
                    <div style="font-size: 0.85em; color: var(--text-secondary); margin-bottom: 5px;">Current Job</div>
                    <div style="font-weight: 600;">
                        ${typeof jobMarketSystem !== 'undefined' && jobMarketSystem.playerJob ? 
                            `${jobMarketSystem.playerJob.title} at ${jobMarketSystem.playerJob.company}` : 
                            'Unemployed'}
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Attributes -->
        ${attributes ? `
            <div style="background: var(--bg-dark); padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                <h3 style="margin-top: 0; margin-bottom: 15px;">📊 Attributes</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    <div>
                        <div style="font-size: 0.85em; color: var(--text-secondary); margin-bottom: 5px;">Luck</div>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <div style="flex: 1; height: 8px; background: var(--bg-light); border-radius: 4px; overflow: hidden;">
                                <div style="background: ${attributes.luck >= 70 ? 'var(--success-color)' : attributes.luck >= 40 ? 'var(--warning-color)' : 'var(--danger-color)'}; height: 100%; width: ${attributes.luck}%;"></div>
                            </div>
                            <div style="font-weight: 600; min-width: 50px; text-align: right;">${attributes.luck.toFixed(0)}%</div>
                        </div>
                    </div>
                </div>
                
                <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid var(--border-color);">
                    <h4 style="margin-top: 0; margin-bottom: 10px;">Skills</h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        ${Object.keys(attributes.skills).map(skillName => {
                            const skillValue = attributes.skills[skillName];
                            const skillDisplayName = skillName.charAt(0).toUpperCase() + skillName.slice(1).replace(/([A-Z])/g, ' $1');

                            return `
                                <div>
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
                                        <div style="font-size: 0.85em;">${skillDisplayName}</div>
                                        <div style="font-size: 0.85em; font-weight: 600;">${skillValue.toFixed(0)}</div>
                                    </div>
                                    <div style="height: 6px; background: var(--bg-light); border-radius: 3px; overflow: hidden;">
                                        <div style="background: var(--secondary-color); height: 100%; width: ${skillValue}%;"></div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
        ` : ''}
    `;
    
    html += `
        <!-- Learned Skills -->
        <div style="background: var(--bg-dark); padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <h3 style="margin-top: 0; margin-bottom: 15px;">🎓 Learned Skills (${learnedSkills.length})</h3>
            ${learnedSkills.length === 0 ? 
                '<p style="color: var(--text-secondary);">No skills learned yet. Visit the Skill Tree to start learning!</p>' :
                `<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px;">
                    ${learnedSkills.map(skill => {
                        const category = skillCategories[skill.category] || { icon: '📚', color: 'var(--text-primary)' };
                        return `
                            <div style="background: var(--bg-light); padding: 10px; border-radius: 8px; border-left: 3px solid ${category.color};">
                                <div style="font-weight: 600; font-size: 0.9em;">${category.icon} ${skill.name}</div>
                                <div style="font-size: 0.75em; color: var(--text-secondary); margin-top: 3px;">
                                    ${category.name}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>`
            }
        </div>
        
        <!-- Financial Summary -->
        <div style="background: var(--bg-dark); padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <h3 style="margin-top: 0; margin-bottom: 15px;">💰 Financial Summary</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px;">
                <div>
                    <div style="font-size: 0.85em; color: var(--text-secondary); margin-bottom: 5px;">Cash</div>
                    <div style="font-size: 1.2em; font-weight: 600; color: var(--secondary-color);">
                        ${formatMoney(gameState.player.cash)}
                    </div>
                </div>
                <div>
                    <div style="font-size: 0.85em; color: var(--text-secondary); margin-bottom: 5px;">Net Worth</div>
                    <div style="font-size: 1.2em; font-weight: 600;">
                        ${formatMoney(gameState.player.netWorth)}
                    </div>
                </div>
                <div>
                    <div style="font-size: 0.85em; color: var(--text-secondary); margin-bottom: 5px;">Financial Health</div>
                    <div style="font-size: 1.2em; font-weight: 600; color: ${gameState.player.financialHealth >= 70 ? 'var(--success-color)' : gameState.player.financialHealth >= 40 ? 'var(--warning-color)' : 'var(--danger-color)'};">
                        ${Math.round(gameState.player.financialHealth)}%
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Victory Progress -->
        <div style="background: var(--bg-dark); padding: 20px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid var(--primary-color);">
            <h3 style="margin-top: 0; margin-bottom: 15px;">🏆 Victory Progress</h3>
            ${getVictoryProgressHTML()}
        </div>
        
        <!-- Assets Summary -->
        <div style="background: var(--bg-dark); padding: 20px; border-radius: 10px;">
            <h3 style="margin-top: 0; margin-bottom: 15px;">📊 Assets Summary</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div>
                    <div style="font-size: 0.85em; color: var(--text-secondary); margin-bottom: 5px;">Properties</div>
                    <div style="font-size: 1.1em; font-weight: 600;">
                        ${gameState.player.properties.length} property/properties
                    </div>
                </div>
                <div>
                    <div style="font-size: 0.85em; color: var(--text-secondary); margin-bottom: 5px;">Businesses</div>
                    <div style="font-size: 1.1em; font-weight: 600;">
                        ${typeof opportunitiesSystem !== 'undefined' && opportunitiesSystem.playerBusinesses ? opportunitiesSystem.playerBusinesses.length : 0} business/businesses
                    </div>
                </div>
                <div>
                    <div style="font-size: 0.85em; color: var(--text-secondary); margin-bottom: 5px;">Portfolio Value</div>
                    <div style="font-size: 1.1em; font-weight: 600; color: var(--success-color);">
                        ${formatMoney(typeof getTotalPortfolioValue === 'function' ? getTotalPortfolioValue() : 0)}
                    </div>
                </div>
                <div>
                    <div style="font-size: 0.85em; color: var(--text-secondary); margin-bottom: 5px;">Active Loans</div>
                    <div style="font-size: 1.1em; font-weight: 600; color: ${gameState.player.loans.length > 0 ? 'var(--warning-color)' : 'var(--text-primary)'};">
                        ${gameState.player.loans.length} loan(s)
                    </div>
                </div>
            </div>
        </div>
    `;
    
    content.innerHTML = html;
}

// Get Victory Progress HTML
function getVictoryProgressHTML() {
    const victoryNetWorth = 50000000;
    const victoryHealth = 95;
    const minProperties = 10;
    const minBusinesses = 5;
    const minSkills = 25;
    const minTurnCount = 200;
    const minCreditScore = 800;
    const minPassiveIncome = 500000;
    
    // Calculate current values
    const propertyIncome = gameState.player.properties.reduce((sum, prop) => sum + (prop.monthlyIncome || 0), 0);
    const businessIncome = (typeof opportunitiesSystem !== 'undefined' && opportunitiesSystem.playerBusinesses) ?
        opportunitiesSystem.playerBusinesses.reduce((sum, biz) => sum + (biz.monthlyIncome || 0), 0) : 0;
    const investmentIncome = gameState.player.monthlyStats.investmentReturns || 0;
    const totalPassiveIncome = propertyIncome + businessIncome + investmentIncome;
    
    let learnedSkillsCount = 0;
    if (typeof skillTreeSystem !== 'undefined') {
        Object.keys(skillTreeSystem.skills).forEach(skillId => {
            if (skillTreeSystem.skills[skillId].learned) {
                learnedSkillsCount++;
            }
        });
    }
    
    const conditions = [
        { name: 'Net Worth ($50M+)', current: gameState.player.netWorth, required: victoryNetWorth, met: gameState.player.netWorth >= victoryNetWorth },
        { name: 'Financial Health (95%+)', current: gameState.player.financialHealth, required: victoryHealth, met: gameState.player.financialHealth >= victoryHealth },
        { name: 'Properties (10+)', current: gameState.player.properties.length, required: minProperties, met: gameState.player.properties.length >= minProperties },
        { name: 'Businesses (5+)', current: (typeof opportunitiesSystem !== 'undefined' && opportunitiesSystem.playerBusinesses) ? opportunitiesSystem.playerBusinesses.length : 0, required: minBusinesses, met: (typeof opportunitiesSystem !== 'undefined' && opportunitiesSystem.playerBusinesses) ? opportunitiesSystem.playerBusinesses.length >= minBusinesses : false },
        { name: 'Skills Learned (25+)', current: learnedSkillsCount, required: minSkills, met: learnedSkillsCount >= minSkills },
        { name: 'Turns Played (200+)', current: gameState.turn, required: minTurnCount, met: gameState.turn >= minTurnCount },
        { name: 'Credit Score (800+)', current: (typeof bankSystem !== 'undefined' && bankSystem.creditScore) ? bankSystem.creditScore : 0, required: minCreditScore, met: (typeof bankSystem !== 'undefined' && bankSystem.creditScore) ? bankSystem.creditScore >= minCreditScore : false },
        { name: 'Passive Income ($500k+/month)', current: totalPassiveIncome, required: minPassiveIncome, met: totalPassiveIncome >= minPassiveIncome }
    ];
    
    const metCount = conditions.filter(c => c.met).length;
    const totalCount = conditions.length;
    
    let html = `
        <div style="margin-bottom: 15px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <div style="font-weight: 600;">Overall Progress</div>
                <div style="font-weight: 600; color: ${metCount === totalCount ? 'var(--success-color)' : 'var(--primary-color)'};">
                    ${metCount}/${totalCount} Complete
                </div>
            </div>
            <div style="height: 8px; background: var(--bg-light); border-radius: 4px; overflow: hidden;">
                <div style="background: ${metCount === totalCount ? 'var(--success-color)' : 'var(--primary-color)'}; height: 100%; width: ${(metCount / totalCount) * 100}%;"></div>
            </div>
        </div>
        <div style="display: grid; grid-template-columns: 1fr; gap: 10px;">
    `;
    
    conditions.forEach(condition => {
        const percentage = Math.min(100, (condition.current / condition.required) * 100);
        const displayValue = condition.name.includes('Net Worth') || condition.name.includes('Passive Income') ? 
            formatMoney(condition.current) : 
            condition.name.includes('Financial Health') ? `${condition.current.toFixed(1)}%` :
            condition.current;
        const displayRequired = condition.name.includes('Net Worth') || condition.name.includes('Passive Income') ? 
            formatMoney(condition.required) : 
            condition.name.includes('Financial Health') ? `${condition.required}%` :
            condition.required;
        
        html += `
            <div style="background: var(--bg-light); padding: 10px; border-radius: 8px; border-left: 3px solid ${condition.met ? 'var(--success-color)' : 'var(--border-color)'};">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 0.9em;">
                    <div>${condition.met ? '✅' : '⏳'} ${condition.name}</div>
                    <div style="font-weight: 600; color: ${condition.met ? 'var(--success-color)' : 'var(--text-secondary)'};">
                        ${displayValue} / ${displayRequired}
                    </div>
                </div>
                <div style="height: 4px; background: var(--bg-dark); border-radius: 2px; overflow: hidden;">
                    <div style="background: ${condition.met ? 'var(--success-color)' : 'var(--primary-color)'}; height: 100%; width: ${percentage}%;"></div>
                </div>
            </div>
        `;
    });
    
    html += `</div>`;
    return html;
}

// Make functions globally available
window.openPlayerProfileModal = openPlayerProfileModal;
window.displayPlayerProfile = displayPlayerProfile;
window.createPlayerProfileModal = createPlayerProfileModal;
window.getVictoryProgressHTML = getVictoryProgressHTML;
window.attachProfileButtonListeners = attachProfileButtonListeners;
