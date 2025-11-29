// Badge/Hint System for Gameplay Events
const badgeSystem = {
    badges: {
        newOffers: 0,
        newJobs: 0,
        newOpportunities: 0,
        newSkills: 0,
        propertyIssues: 0,
        businessAlerts: 0,
        loanAlerts: 0,
        activeEffects: 0
    }
};

// Check for new items and update badges
function updateBadges() {
    badgeSystem.badges.newOffers = 0;
    badgeSystem.badges.newJobs = 0;
    badgeSystem.badges.newOpportunities = 0;
    badgeSystem.badges.newSkills = 0;
    badgeSystem.badges.propertyIssues = 0;
    badgeSystem.badges.businessAlerts = 0;
    badgeSystem.badges.loanAlerts = 0;
    badgeSystem.badges.activeEffects = 0;
    
    // Check for new offers
    if (typeof expandedEvents !== 'undefined' && expandedEvents.activeOffers) {
        badgeSystem.badges.newOffers = expandedEvents.activeOffers.length;
    }
    
    // Check for new jobs
    if (typeof jobMarketSystem !== 'undefined' && jobMarketSystem.availableJobs) {
        badgeSystem.badges.newJobs = jobMarketSystem.availableJobs.length;
    }
    
    // Check for new opportunities
    if (typeof opportunitiesSystem !== 'undefined' && opportunitiesSystem.currentOpportunities) {
        const opps = opportunitiesSystem.currentOpportunities;
        badgeSystem.badges.newOpportunities = 
            (opps.businesses?.length || 0) + 
            (opps.auctions?.length || 0) + 
            (opps.properties?.length || 0);
    }
    
    // Check for new unlockable skills
    if (typeof skillTreeSystem !== 'undefined' && skillTreeSystem.unlockedSkills) {
        const newSkills = skillTreeSystem.unlockedSkills.filter(skillId => {
            const skill = skillTreeSystem.skills[skillId];
            return skill && skill.unlocked && !skill.learned && 
                   !skillTreeSystem.learningQueue.find(l => l.id === skillId);
        });
        badgeSystem.badges.newSkills = newSkills.length;
    }
    
    // Check for property issues (low condition, maintenance needed)
    if (gameState.player.properties) {
        badgeSystem.badges.propertyIssues = gameState.player.properties.filter(prop => {
            return prop.condition < 50 || (prop.lastMaintenance && 
                   (gameState.turn - prop.lastMaintenance) > 12);
        }).length;
    }
    
    // Check for business alerts
    if (typeof opportunitiesSystem !== 'undefined' && opportunitiesSystem.playerBusinesses) {
        // Could add business performance alerts here
        badgeSystem.badges.businessAlerts = 0;
    }
    
    // Check for loan alerts (high debt, missed payments)
    if (gameState.player.loans) {
        const totalDebt = gameState.player.loans.reduce((sum, loan) => sum + loan.principal, 0);
        if (totalDebt > gameState.player.monthlyIncome * 12) {
            badgeSystem.badges.loanAlerts = gameState.player.loans.length;
        }
    }
    
    // Check for active effects
    if (typeof eventTrackingSystem !== 'undefined' && eventTrackingSystem.activeEvents) {
        badgeSystem.badges.activeEffects = eventTrackingSystem.activeEvents.length;
    }
    
    // Update UI badges
    updateBadgeUI();
}

// Update badge UI on navigation buttons
function updateBadgeUI() {
    // Job Market badge
    const jobBtn = document.querySelector('[onclick*="openJobMarketModal"]');
    if (jobBtn && badgeSystem.badges.newJobs > 0) {
        addBadgeToButton(jobBtn, badgeSystem.badges.newJobs);
    } else if (jobBtn) {
        removeBadgeFromButton(jobBtn);
    }
    
    // Skill Tree badge
    const skillBtn = document.querySelector('[onclick*="openSkillTreeModal"]');
    if (skillBtn && badgeSystem.badges.newSkills > 0) {
        addBadgeToButton(skillBtn, badgeSystem.badges.newSkills);
    } else if (skillBtn) {
        removeBadgeFromButton(skillBtn);
    }
    
    // Investment Opportunities badge
    const investBtn = document.querySelector('[onclick*="openInvestmentModal"]');
    if (investBtn && badgeSystem.badges.newOpportunities > 0) {
        addBadgeToButton(investBtn, badgeSystem.badges.newOpportunities);
    } else if (investBtn) {
        removeBadgeFromButton(investBtn);
    }
    
    // Active Effects badge
    const effectsBtn = document.querySelector('[onclick*="openActiveEffectsModal"]');
    if (effectsBtn && badgeSystem.badges.activeEffects > 0) {
        addBadgeToButton(effectsBtn, badgeSystem.badges.activeEffects);
    } else if (effectsBtn) {
        removeBadgeFromButton(effectsBtn);
    }
    
    // Properties badge (for asset management)
    const propBtn = document.querySelector('[onclick*="openPropertiesModal"]');
    if (propBtn && badgeSystem.badges.propertyIssues > 0) {
        addBadgeToButton(propBtn, badgeSystem.badges.propertyIssues, 'warning');
    } else if (propBtn) {
        removeBadgeFromButton(propBtn);
    }
}

// Add badge to button
function addBadgeToButton(button, count, type = 'info') {
    if (!button) return;
    
    // Remove existing badge
    removeBadgeFromButton(button);
    
    // Add badge
    button.style.position = 'relative';
    const badge = document.createElement('span');
    badge.className = 'badge-notification';
    badge.style.cssText = `
        position: absolute;
        top: -5px;
        right: -5px;
        background: ${type === 'warning' ? 'var(--warning-color)' : 'var(--success-color)'};
        color: white;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.7em;
        font-weight: bold;
        z-index: 10;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    `;
    badge.textContent = count > 9 ? '9+' : count;
    button.appendChild(badge);
}

// Remove badge from button
function removeBadgeFromButton(button) {
    if (!button) return;
    const badge = button.querySelector('.badge-notification');
    if (badge) {
        badge.remove();
    }
}

// Make functions globally available
window.updateBadges = updateBadges;
window.badgeSystem = badgeSystem;

