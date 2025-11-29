// Skill Tree System
const skillTreeSystem = {
    skills: {},
    learningQueue: [], // Skills currently being learned
    unlockedSkills: [] // IDs of unlocked skills
};

// Skill Categories
const skillCategories = {
    finance: {
        name: 'Finance & Investment',
        icon: '💰',
        color: 'var(--success-color)'
    },
    business: {
        name: 'Business & Management',
        icon: '💼',
        color: 'var(--primary-color)'
    },
    technology: {
        name: 'Technology & Digital',
        icon: '💻',
        color: 'var(--secondary-color)'
    },
    communication: {
        name: 'Communication & Negotiation',
        icon: '🤝',
        color: 'var(--warning-color)'
    },
    leadership: {
        name: 'Leadership & Strategy',
        icon: '👑',
        color: 'var(--danger-color)'
    }
};

// Skill Definitions with Prerequisites
const skillDefinitions = [
    // Finance & Investment Skills
    {
        id: 'basic_budgeting',
        name: 'Basic Budgeting',
        category: 'finance',
        description: 'Learn to manage your personal finances effectively.',
        cost: 500,
        turnsToLearn: 1,
        prerequisites: [],
        effects: {
            expenseReduction: 0.05,
            financialHealthBonus: 5
        },
        jobRelevance: ['entry', 'junior']
    },
    {
        id: 'investment_fundamentals',
        name: 'Investment Fundamentals',
        category: 'finance',
        description: 'Understand the basics of investing in stocks, bonds, and other assets.',
        cost: 1000,
        turnsToLearn: 2,
        prerequisites: ['basic_budgeting'],
        effects: {
            investingSkill: 10,
            investmentReturnBonus: 0.05
        },
        jobRelevance: ['junior', 'mid']
    },
    {
        id: 'advanced_investing',
        name: 'Advanced Investing',
        category: 'finance',
        description: 'Master complex investment strategies and portfolio management.',
        cost: 3000,
        turnsToLearn: 3,
        prerequisites: ['investment_fundamentals'],
        effects: {
            investingSkill: 15,
            investmentReturnBonus: 0.10,
            portfolioOptimization: true
        },
        jobRelevance: ['mid', 'senior']
    },
    {
        id: 'financial_analysis',
        name: 'Financial Analysis',
        category: 'finance',
        description: 'Analyze financial statements and market trends with precision.',
        cost: 5000,
        turnsToLearn: 4,
        prerequisites: ['advanced_investing'],
        effects: {
            marketAnalysisSkill: 20,
            tradingAccuracy: 0.15,
            marketInsight: true
        },
        jobRelevance: ['senior', 'executive']
    },
    {
        id: 'risk_management',
        name: 'Risk Management',
        category: 'finance',
        description: 'Identify and mitigate financial risks effectively.',
        cost: 4000,
        turnsToLearn: 3,
        prerequisites: ['investment_fundamentals'],
        effects: {
            riskManagementSkill: 20,
            lossReduction: 0.20
        },
        jobRelevance: ['mid', 'senior']
    },
    
    // Business & Management Skills
    {
        id: 'business_basics',
        name: 'Business Basics',
        category: 'business',
        description: 'Learn fundamental business operations and management.',
        cost: 1500,
        turnsToLearn: 2,
        prerequisites: [],
        effects: {
            businessSkill: 10,
            businessIncomeBonus: 0.10
        },
        jobRelevance: ['entry', 'junior']
    },
    {
        id: 'project_management',
        name: 'Project Management',
        category: 'business',
        description: 'Manage projects efficiently and deliver results on time.',
        cost: 2500,
        turnsToLearn: 3,
        prerequisites: ['business_basics'],
        effects: {
            businessSkill: 15,
            efficiencyBonus: 0.15
        },
        jobRelevance: ['junior', 'mid']
    },
    {
        id: 'strategic_planning',
        name: 'Strategic Planning',
        category: 'business',
        description: 'Develop long-term business strategies and execute them effectively.',
        cost: 6000,
        turnsToLearn: 4,
        prerequisites: ['project_management'],
        effects: {
            businessSkill: 25,
            businessIncomeBonus: 0.25,
            strategicThinking: true
        },
        jobRelevance: ['senior', 'executive']
    },
    {
        id: 'operations_management',
        name: 'Operations Management',
        category: 'business',
        description: 'Optimize business operations for maximum efficiency.',
        cost: 4000,
        turnsToLearn: 3,
        prerequisites: ['business_basics'],
        effects: {
            businessSkill: 15,
            costReduction: 0.10
        },
        jobRelevance: ['mid', 'senior']
    },
    
    // Technology & Digital Skills
    {
        id: 'digital_literacy',
        name: 'Digital Literacy',
        category: 'technology',
        description: 'Master essential digital tools and technologies.',
        cost: 1000,
        turnsToLearn: 2,
        prerequisites: [],
        effects: {
            efficiencyBonus: 0.10,
            techSkill: 10
        },
        jobRelevance: ['entry', 'junior']
    },
    {
        id: 'data_analysis',
        name: 'Data Analysis',
        category: 'technology',
        description: 'Analyze data to make informed business decisions.',
        cost: 3000,
        turnsToLearn: 3,
        prerequisites: ['digital_literacy'],
        effects: {
            marketAnalysisSkill: 15,
            decisionMakingBonus: 0.15,
            techSkill: 15
        },
        jobRelevance: ['junior', 'mid']
    },
    {
        id: 'ai_automation',
        name: 'AI & Automation',
        category: 'technology',
        description: 'Leverage AI and automation to improve productivity.',
        cost: 8000,
        turnsToLearn: 5,
        prerequisites: ['data_analysis'],
        effects: {
            efficiencyBonus: 0.30,
            techSkill: 25,
            automationBonus: true
        },
        jobRelevance: ['senior', 'executive']
    },
    
    // Communication & Negotiation Skills
    {
        id: 'effective_communication',
        name: 'Effective Communication',
        category: 'communication',
        description: 'Communicate clearly and persuasively.',
        cost: 800,
        turnsToLearn: 1,
        prerequisites: [],
        effects: {
            negotiationSkill: 10,
            relationshipBonus: 0.10
        },
        jobRelevance: ['entry', 'junior']
    },
    {
        id: 'advanced_negotiation',
        name: 'Advanced Negotiation',
        category: 'communication',
        description: 'Master the art of negotiation for better deals.',
        cost: 3500,
        turnsToLearn: 3,
        prerequisites: ['effective_communication'],
        effects: {
            negotiationSkill: 20,
            dealBonus: 0.20
        },
        jobRelevance: ['mid', 'senior']
    },
    {
        id: 'public_speaking',
        name: 'Public Speaking',
        category: 'communication',
        description: 'Present ideas confidently to large audiences.',
        cost: 2000,
        turnsToLearn: 2,
        prerequisites: ['effective_communication'],
        effects: {
            leadershipSkill: 10,
            influenceBonus: 0.15
        },
        jobRelevance: ['junior', 'mid']
    },
    
    // Leadership & Strategy Skills
    {
        id: 'team_leadership',
        name: 'Team Leadership',
        category: 'leadership',
        description: 'Lead and motivate teams effectively.',
        cost: 5000,
        turnsToLearn: 4,
        prerequisites: ['public_speaking', 'project_management'],
        effects: {
            leadershipSkill: 20,
            teamProductivityBonus: 0.20
        },
        jobRelevance: ['senior', 'executive']
    },
    {
        id: 'executive_leadership',
        name: 'Executive Leadership',
        category: 'leadership',
        description: 'Lead organizations at the highest level.',
        cost: 10000,
        turnsToLearn: 6,
        prerequisites: ['team_leadership', 'strategic_planning'],
        effects: {
            leadershipSkill: 30,
            incomeMultiplier: 1.5,
            executiveBonus: true
        },
        jobRelevance: ['executive']
    },
    {
        id: 'crisis_management',
        name: 'Crisis Management',
        category: 'leadership',
        description: 'Navigate and resolve crises effectively.',
        cost: 6000,
        turnsToLearn: 4,
        prerequisites: ['team_leadership'],
        effects: {
            leadershipSkill: 20,
            crisisResilience: 0.30
        },
        jobRelevance: ['senior', 'executive']
    }
];

// Initialize Skill Tree
function initializeSkillTree() {
    skillTreeSystem.skills = {};
    skillTreeSystem.learningQueue = [];
    skillTreeSystem.unlockedSkills = [];
    
    // Initialize all skills
    skillDefinitions.forEach(skill => {
        skillTreeSystem.skills[skill.id] = {
            ...skill,
            unlocked: false,
            learned: false,
            learningProgress: 0,
            turnsRemaining: 0
        };
    });
    
    // Unlock basic skills (no prerequisites)
    skillDefinitions.forEach(skill => {
        if (skill.prerequisites.length === 0) {
            skillTreeSystem.unlockedSkills.push(skill.id);
            skillTreeSystem.skills[skill.id].unlocked = true;
        }
    });
}

// Check if skill prerequisites are met
function canUnlockSkill(skillId) {
    const skill = skillTreeSystem.skills[skillId];
    if (!skill) return false;
    if (skill.unlocked) return true;
    
    // Check all prerequisites are learned
    return skill.prerequisites.every(prereqId => {
        const prereq = skillTreeSystem.skills[prereqId];
        return prereq && prereq.learned;
    });
}

// Unlock skills when prerequisites are met
function checkSkillUnlocks() {
    skillDefinitions.forEach(skill => {
        if (!skillTreeSystem.skills[skill.id].unlocked && canUnlockSkill(skill.id)) {
            skillTreeSystem.unlockedSkills.push(skill.id);
            skillTreeSystem.skills[skill.id].unlocked = true;
        }
    });
}

// Start learning a skill
function startLearningSkill(skillId) {
    const skill = skillTreeSystem.skills[skillId];
    if (!skill) {
        if (typeof showToast === 'function') {
            showToast('Skill not found', 'error');
        }
        return false;
    }
    
    if (!skill.unlocked) {
        if (typeof showToast === 'function') {
            showToast('Skill is locked. Complete prerequisites first.', 'error');
        }
        return false;
    }
    
    if (skill.learned) {
        if (typeof showToast === 'function') {
            showToast('You already know this skill', 'error');
        }
        return false;
    }
    
    if (skillTreeSystem.learningQueue.find(s => s.id === skillId)) {
        if (typeof showToast === 'function') {
            showToast('Already learning this skill', 'error');
        }
        return false;
    }
    
    if (gameState.player.cash < skill.cost) {
        if (typeof showToast === 'function') {
            showToast(`Insufficient funds. Need ${formatMoney(skill.cost)}`, 'error');
        }
        return false;
    }
    
    // Pay for skill
    gameState.player.cash -= skill.cost;
    
    // Add to learning queue
    skillTreeSystem.learningQueue.push({
        id: skillId,
        turnsRemaining: skill.turnsToLearn,
        startTurn: gameState.turn
    });
    
    skillTreeSystem.skills[skillId].turnsRemaining = skill.turnsToLearn;
    skillTreeSystem.skills[skillId].learningProgress = 0;
    
    // Log transaction
    if (typeof logTransaction === 'function') {
        logTransaction('expense', `Started learning: ${skill.name}`, -skill.cost, {
            expenseType: 'education',
            skillId: skillId,
            turnsToLearn: skill.turnsToLearn
        });
    }
    
    if (typeof showToast === 'function') {
        showToast(`Started learning ${skill.name}. Will complete in ${skill.turnsToLearn} turn(s).`, 'success');
    }
    
    return true;
}

// Process skill learning each turn
function processSkillLearning() {
    skillTreeSystem.learningQueue.forEach((learning, index) => {
        learning.turnsRemaining--;
        const skill = skillTreeSystem.skills[learning.id];
        if (skill) {
            skill.turnsRemaining = learning.turnsRemaining;
            skill.learningProgress = ((skill.turnsToLearn - learning.turnsRemaining) / skill.turnsToLearn) * 100;
        }
        
        if (learning.turnsRemaining <= 0) {
            // Skill learned!
            completeSkillLearning(learning.id);
            skillTreeSystem.learningQueue.splice(index, 1);
        }
    });
    
    // Check for new skill unlocks
    checkSkillUnlocks();
}

// Complete skill learning
function completeSkillLearning(skillId) {
    const skill = skillTreeSystem.skills[skillId];
    if (!skill) return;
    
    skill.learned = true;
    skill.learningProgress = 100;
    skill.turnsRemaining = 0;
    
    // Apply skill effects
    applySkillEffects(skill);
    
    // Check for new unlocks
    checkSkillUnlocks();
    
    if (typeof showToast === 'function') {
        showToast(`🎓 Skill learned: ${skill.name}!`, 'success', 4000);
    }
    
    addStory(`🎓 You've successfully learned ${skill.name}! ${skill.description}`);
    
    // Update display
    if (typeof updateDisplay === 'function') {
        updateDisplay();
    }
}

// Apply skill effects to player
function applySkillEffects(skill) {
    if (!skill.effects) return;
    
    // Apply to player attributes
    if (skill.effects.investingSkill && typeof playerAttributes !== 'undefined') {
        playerAttributes.skills.investing = Math.min(100, 
            playerAttributes.skills.investing + skill.effects.investingSkill);
    }
    if (skill.effects.marketAnalysisSkill && typeof playerAttributes !== 'undefined') {
        playerAttributes.skills.marketAnalysis = Math.min(100, 
            playerAttributes.skills.marketAnalysis + skill.effects.marketAnalysisSkill);
    }
    if (skill.effects.negotiationSkill && typeof playerAttributes !== 'undefined') {
        playerAttributes.skills.negotiation = Math.min(100, 
            playerAttributes.skills.negotiation + skill.effects.negotiationSkill);
    }
    if (skill.effects.riskManagementSkill && typeof playerAttributes !== 'undefined') {
        playerAttributes.skills.riskManagement = Math.min(100, 
            playerAttributes.skills.riskManagement + skill.effects.riskManagementSkill);
    }
    if (skill.effects.businessSkill && typeof playerAttributes !== 'undefined') {
        playerAttributes.skills.business = Math.min(100, 
            playerAttributes.skills.business + skill.effects.businessSkill);
    }
    if (skill.effects.leadershipSkill && typeof playerAttributes !== 'undefined') {
        // Add leadership as a new skill if it doesn't exist
        if (!playerAttributes.skills.leadership) {
            playerAttributes.skills.leadership = 0;
        }
        playerAttributes.skills.leadership = Math.min(100, 
            playerAttributes.skills.leadership + skill.effects.leadershipSkill);
    }
    if (skill.effects.techSkill && typeof playerAttributes !== 'undefined') {
        if (!playerAttributes.skills.technology) {
            playerAttributes.skills.technology = 0;
        }
        playerAttributes.skills.technology = Math.min(100, 
            playerAttributes.skills.technology + skill.effects.techSkill);
    }
    
    // Store skill effects for later use
    if (!gameState.player.skillEffects) {
        gameState.player.skillEffects = {};
    }
    gameState.player.skillEffects[skill.id] = skill.effects;
}

// Get skill score for job applications (sum of relevant skills)
function getSkillScoreForJob(jobRelevance) {
    let score = 0;
    
    Object.keys(skillTreeSystem.skills).forEach(skillId => {
        const skill = skillTreeSystem.skills[skillId];
        if (skill.learned && skill.jobRelevance) {
            // Check if skill is relevant for this job level
            if (jobRelevance.some(level => skill.jobRelevance.includes(level))) {
                // Add skill value (based on cost and complexity)
                score += skill.cost / 100; // Higher cost = more valuable
            }
        }
    });
    
    // Also add player attribute skills
    if (typeof playerAttributes !== 'undefined') {
        score += (playerAttributes.skills.business || 0) * 0.5;
        score += (playerAttributes.skills.negotiation || 0) * 0.3;
        score += (playerAttributes.skills.leadership || 0) * 0.5;
        score += (playerAttributes.skills.technology || 0) * 0.3;
    }
    
    return Math.round(score);
}

// Display Skill Tree Modal
function openSkillTreeModal() {
    const modal = document.getElementById('skill-tree-modal');
    if (!modal) {
        // Create modal if it doesn't exist
        createSkillTreeModal();
    }
    
    // Use modal manager
    if (typeof openModal === 'function') {
        if (!openModal('skill-tree-modal')) return;
    } else {
        modal.classList.add('active');
    }
    
    displaySkillTree();
}

// Create Skill Tree Modal (if not in HTML)
function createSkillTreeModal() {
    const modal = document.createElement('div');
    modal.id = 'skill-tree-modal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 1000px; max-height: 90vh;">
            <span class="close" onclick="closeModalById('skill-tree-modal')">&times;</span>
            <h2>🌳 Skill Tree</h2>
            <div id="skill-tree-content" style="max-height: 70vh; overflow-y: auto;"></div>
        </div>
    `;
    document.body.appendChild(modal);
}

// Display Skill Tree
function displaySkillTree(selectedCategory = null) {
    const content = document.getElementById('skill-tree-content');
    if (!content) return;
    
    // Group skills by category
    const skillsByCategory = {};
    Object.keys(skillCategories).forEach(cat => {
        skillsByCategory[cat] = [];
    });
    
    skillDefinitions.forEach(skill => {
        if (skillsByCategory[skill.category]) {
            skillsByCategory[skill.category].push(skill);
        }
    });
    
    // Category navigation
    let html = `
        <div style="margin-bottom: 20px;">
            <div class="bank-tabs" style="display: flex; gap: 10px; flex-wrap: wrap;">
    `;
    
    Object.keys(skillCategories).forEach(catKey => {
        const category = skillCategories[catKey];
        const skills = skillsByCategory[catKey];
        const isActive = selectedCategory === catKey || (!selectedCategory && catKey === Object.keys(skillCategories)[0]);
        const newUnlocked = skills.filter(s => {
            const skillData = skillTreeSystem.skills[s.id];
            return skillData && skillData.unlocked && !skillData.learned && !skillTreeSystem.learningQueue.find(l => l.id === s.id);
        }).length;
        
        html += `
            <button class="bank-tab-btn ${isActive ? 'active' : ''}" 
                    onclick="displaySkillTree('${catKey}')"
                    style="position: relative;">
                ${category.icon} ${category.name}
                ${newUnlocked > 0 ? `<span style="position: absolute; top: -5px; right: -5px; background: var(--success-color); color: white; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 0.7em; font-weight: bold;">${newUnlocked}</span>` : ''}
            </button>
        `;
    });
    
    html += `
            </div>
        </div>
        <div style="max-height: 60vh; overflow-y: auto;">
    `;
    
    // Display selected category (or first category if none selected)
    const displayCategory = selectedCategory || Object.keys(skillCategories)[0];
    const category = skillCategories[displayCategory];
    const skills = skillsByCategory[displayCategory];
    
    if (skills.length === 0) {
        html += '<p style="color: var(--text-secondary);">No skills in this category.</p>';
    } else {
        // Display skills in a single horizontal row (scrollable)
        html += `
            <div style="display: flex; gap: 15px; overflow-x: auto; padding-bottom: 10px; min-height: 300px;">
        `;
        
        skills.forEach(skill => {
            const skillData = skillTreeSystem.skills[skill.id];
            const isUnlocked = skillData.unlocked;
            const isLearned = skillData.learned;
            const isLearning = skillTreeSystem.learningQueue.find(s => s.id === skill.id);
            const canAfford = gameState.player.cash >= skill.cost;
            
            let statusClass = '';
            let statusText = '';
            let buttonHtml = '';
            
            if (isLearned) {
                statusClass = 'positive';
                statusText = '✅ Learned';
            } else if (isLearning) {
                statusClass = 'warning';
                statusText = `⏳ ${skillData.turnsRemaining} turn(s)`;
            } else if (!isUnlocked) {
                statusClass = 'negative';
                statusText = '🔒 Locked';
            } else {
                statusClass = '';
                statusText = '🔓 Available';
                buttonHtml = `
                    <button class="btn-primary small" 
                            onclick="startLearningSkill('${skill.id}'); displaySkillTree('${displayCategory}');" 
                            ${!canAfford ? 'disabled style="opacity: 0.5;"' : ''}
                            style="width: 100%; margin-top: 5px;">
                        Learn (${formatMoney(skill.cost)}, ${skill.turnsToLearn} turn(s))
                    </button>
                `;
            }
            
            html += `
                <div style="background: var(--bg-light); padding: 15px; border-radius: 8px; border: 2px solid ${isUnlocked ? category.color : 'var(--border-color)'}; min-width: 280px; max-width: 280px; display: flex; flex-direction: column;">
                    <div style="flex: 1;">
                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                            <div style="flex: 1;">
                                <strong style="font-size: 1em;">${skill.name}</strong>
                                <div style="font-size: 0.8em; color: var(--text-secondary); margin-top: 5px;">
                                    ${skill.description}
                                </div>
                            </div>
                        </div>
                        <div style="font-size: 0.85em; color: var(--${statusClass === 'positive' ? 'success' : statusClass === 'warning' ? 'warning' : statusClass === 'negative' ? 'danger' : 'text-secondary'}-color); margin-bottom: 8px;">
                            ${statusText}
                        </div>
                        ${skill.prerequisites.length > 0 ? `
                            <div style="font-size: 0.75em; color: var(--text-secondary); margin-bottom: 8px; padding: 5px; background: var(--bg-dark); border-radius: 4px;">
                                <strong>Requires:</strong><br>
                                ${skill.prerequisites.map(p => {
                                    const prereq = skillTreeSystem.skills[p];
                                    return prereq ? `${prereq.learned ? '✅' : '❌'} ${prereq.name}` : p;
                                }).join('<br>')}
                            </div>
                        ` : ''}
                        ${isLearning ? `
                            <div style="margin-top: 8px;">
                                <div style="background: var(--bg-dark); height: 8px; border-radius: 4px; overflow: hidden;">
                                    <div style="background: ${category.color}; height: 100%; width: ${skillData.learningProgress}%; transition: width 0.3s;"></div>
                                </div>
                                <div style="font-size: 0.75em; color: var(--text-secondary); margin-top: 3px;">
                                    ${skillData.learningProgress.toFixed(0)}% complete
                                </div>
                            </div>
                        ` : ''}
                    </div>
                    ${buttonHtml}
                </div>
            `;
        });
        
        html += '</div>';
    }
    
    html += '</div>';
    
    content.innerHTML = html;
}

// Make functions globally available
window.initializeSkillTree = initializeSkillTree;
window.startLearningSkill = startLearningSkill;
window.processSkillLearning = processSkillLearning;
window.openSkillTreeModal = openSkillTreeModal;
window.getSkillScoreForJob = getSkillScoreForJob;
window.skillTreeSystem = skillTreeSystem;

