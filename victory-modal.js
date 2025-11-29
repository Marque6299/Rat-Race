// Victory Modal System
function showVictoryModal() {
    const modal = document.getElementById('action-modal');
    const modalBody = document.getElementById('modal-body');
    if (!modal || !modalBody) return;
    
    // Use modal manager
    if (typeof openModal === 'function') {
        openModal('action-modal');
    } else {
        modal.classList.add('active');
    }
    
    const achievementProgress = typeof getAchievementProgress === 'function' ? getAchievementProgress() : { unlocked: 0, total: 0 };
    const milestoneProgress = typeof getMilestoneProgress === 'function' ? getMilestoneProgress() : { progress: 0 };
    
    // Calculate passive income
    const propertyIncome = gameState.player.properties.reduce((sum, prop) => sum + (prop.monthlyIncome || 0), 0);
    const businessIncome = (typeof opportunitiesSystem !== 'undefined' && opportunitiesSystem.playerBusinesses) ?
        opportunitiesSystem.playerBusinesses.reduce((sum, biz) => sum + (biz.monthlyIncome || 0), 0) : 0;
    const investmentIncome = gameState.player.monthlyStats.investmentReturns || 0;
    const totalPassiveIncome = propertyIncome + businessIncome + investmentIncome;
    
    // Count learned skills
    let learnedSkillsCount = 0;
    if (typeof skillTreeSystem !== 'undefined') {
        Object.keys(skillTreeSystem.skills).forEach(skillId => {
            if (skillTreeSystem.skills[skillId].learned) {
                learnedSkillsCount++;
            }
        });
    }
    
    modalBody.innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <div style="font-size: 4em; margin-bottom: 20px;">🎉</div>
            <h2 style="color: var(--success-color); margin-bottom: 10px;">CONGRATULATIONS!</h2>
            <h3 style="margin-bottom: 20px;">You've Escaped the Rat Race!</h3>
            <p style="font-size: 1.1em; margin-bottom: 30px; color: var(--text-secondary);">
                You've built wealth and achieved financial freedom!
            </p>
            
            <div style="background: var(--bg-dark); padding: 20px; border-radius: 10px; margin-bottom: 20px; text-align: left;">
                <h4 style="margin-top: 0;">Final Statistics:</h4>
                <div class="stat-grid">
                    <div class="stat-item">
                        <label>Final Net Worth:</label>
                        <span class="money" style="font-size: 1.2em;">${formatMoney(gameState.player.netWorth)}</span>
                    </div>
                    <div class="stat-item">
                        <label>Final Cash:</label>
                        <span class="money">${formatMoney(gameState.player.cash)}</span>
                    </div>
                    <div class="stat-item">
                        <label>Financial Health:</label>
                        <span>${Math.round(gameState.player.financialHealth)}%</span>
                    </div>
                    <div class="stat-item">
                        <label>Years Played:</label>
                        <span>${gameState.year - 2024}</span>
                    </div>
                    <div class="stat-item">
                        <label>Achievements:</label>
                        <span>${achievementProgress.unlocked}/${achievementProgress.total}</span>
                    </div>
                    <div class="stat-item">
                        <label>Credit Score:</label>
                        <span>${bankSystem?.creditScore || 'N/A'}</span>
                    </div>
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 20px;">
                <button class="btn-primary" onclick="continueAfterVictory()" style="width: 100%; padding: 15px; font-size: 1.1em;">
                    Continue Playing
                </button>
                <button class="btn-secondary" onclick="newGameAfterVictory()" style="width: 100%; padding: 15px; font-size: 1.1em;">
                    Start New Game
                </button>
            </div>
        </div>
    `;
    
    document.getElementById('modal-title').textContent = 'Victory!';
    document.getElementById('modal-confirm').style.display = 'none';
    document.getElementById('modal-cancel').style.display = 'none';
}

function continueAfterVictory() {
    closeModal();
    if (typeof showToast === 'function') {
        showToast('Continue your journey to even greater wealth!', 'success', 3000);
    }
    addStory('You continue your financial journey, aiming for even greater heights!');
}

function newGameAfterVictory() {
    if (confirm('Are you sure you want to start a new game? Your current progress will be lost.')) {
        // Clear game state
        location.reload();
    }
}

// Make functions globally available
window.showVictoryModal = showVictoryModal;
window.continueAfterVictory = continueAfterVictory;
window.newGameAfterVictory = newGameAfterVictory;

