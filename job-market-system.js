// Job Market System
const jobMarketSystem = {
    availableJobs: [],
    playerJob: null,
    jobHistory: []
};

// Job Definitions
const jobDefinitions = [
    // Entry Level Jobs
    {
        id: 'cashier',
        title: 'Cashier',
        company: 'Retail Store',
        level: 'entry',
        baseSalary: 2000,
        requirements: {
            minSkillScore: 0,
            skills: []
        },
        description: 'Basic retail position. Low pay but easy to get.',
        experienceGain: { business: 5 }
    },
    {
        id: 'data_entry',
        title: 'Data Entry Clerk',
        company: 'Office Services',
        level: 'entry',
        baseSalary: 2200,
        requirements: {
            minSkillScore: 10,
            skills: ['digital_literacy']
        },
        description: 'Entry-level office work. Requires basic computer skills.',
        experienceGain: { technology: 5 }
    },
    {
        id: 'customer_service',
        title: 'Customer Service Rep',
        company: 'Call Center',
        level: 'entry',
        baseSalary: 2400,
        requirements: {
            minSkillScore: 15,
            skills: ['effective_communication']
        },
        description: 'Handle customer inquiries. Good communication skills needed.',
        experienceGain: { communication: 5 }
    },
    
    // Junior Level Jobs
    {
        id: 'junior_analyst',
        title: 'Junior Financial Analyst',
        company: 'Finance Corp',
        level: 'junior',
        baseSalary: 3500,
        requirements: {
            minSkillScore: 50,
            skills: ['basic_budgeting', 'investment_fundamentals']
        },
        description: 'Analyze financial data and assist with investment decisions.',
        experienceGain: { investing: 10, marketAnalysis: 5 }
    },
    {
        id: 'junior_developer',
        title: 'Junior Developer',
        company: 'Tech Startup',
        level: 'junior',
        baseSalary: 4000,
        requirements: {
            minSkillScore: 60,
            skills: ['digital_literacy', 'data_analysis']
        },
        description: 'Develop software applications. Tech skills required.',
        experienceGain: { technology: 10 }
    },
    {
        id: 'sales_rep',
        title: 'Sales Representative',
        company: 'Sales Corp',
        level: 'junior',
        baseSalary: 3000,
        requirements: {
            minSkillScore: 40,
            skills: ['effective_communication']
        },
        description: 'Sell products and services. Commission-based income possible.',
        experienceGain: { negotiation: 10, communication: 5 }
    },
    
    // Mid Level Jobs
    {
        id: 'financial_analyst',
        title: 'Financial Analyst',
        company: 'Investment Bank',
        level: 'mid',
        baseSalary: 5500,
        requirements: {
            minSkillScore: 150,
            skills: ['investment_fundamentals', 'risk_management']
        },
        description: 'Analyze markets and provide investment recommendations.',
        experienceGain: { investing: 15, marketAnalysis: 10, riskManagement: 5 }
    },
    {
        id: 'project_manager',
        title: 'Project Manager',
        company: 'Consulting Firm',
        level: 'mid',
        baseSalary: 6000,
        requirements: {
            minSkillScore: 180,
            skills: ['project_management', 'effective_communication']
        },
        description: 'Lead projects and coordinate teams.',
        experienceGain: { business: 15, negotiation: 10 }
    },
    {
        id: 'business_analyst',
        title: 'Business Analyst',
        company: 'Corporation',
        level: 'mid',
        baseSalary: 5800,
        requirements: {
            minSkillScore: 160,
            skills: ['business_basics', 'data_analysis']
        },
        description: 'Analyze business processes and recommend improvements.',
        experienceGain: { business: 15, marketAnalysis: 10 }
    },
    
    // Senior Level Jobs
    {
        id: 'senior_analyst',
        title: 'Senior Financial Analyst',
        company: 'Investment Firm',
        level: 'senior',
        baseSalary: 8500,
        requirements: {
            minSkillScore: 300,
            skills: ['advanced_investing', 'financial_analysis', 'risk_management']
        },
        description: 'Lead financial analysis and investment strategy.',
        experienceGain: { investing: 20, marketAnalysis: 15, riskManagement: 10 }
    },
    {
        id: 'senior_manager',
        title: 'Senior Manager',
        company: 'Corporation',
        level: 'senior',
        baseSalary: 9000,
        requirements: {
            minSkillScore: 320,
            skills: ['strategic_planning', 'team_leadership']
        },
        description: 'Manage departments and strategic initiatives.',
        experienceGain: { business: 20, leadership: 15 }
    },
    {
        id: 'director',
        title: 'Director',
        company: 'Corporation',
        level: 'senior',
        baseSalary: 12000,
        requirements: {
            minSkillScore: 400,
            skills: ['strategic_planning', 'team_leadership', 'crisis_management']
        },
        description: 'Direct major business units and strategic direction.',
        experienceGain: { business: 25, leadership: 20 }
    },
    
    // Executive Level Jobs
    {
        id: 'vp_finance',
        title: 'VP of Finance',
        company: 'Corporation',
        level: 'executive',
        baseSalary: 18000,
        requirements: {
            minSkillScore: 600,
            skills: ['financial_analysis', 'strategic_planning', 'executive_leadership']
        },
        description: 'Lead finance department at executive level.',
        experienceGain: { investing: 25, leadership: 25, business: 20 }
    },
    {
        id: 'ceo',
        title: 'Chief Executive Officer',
        company: 'Corporation',
        level: 'executive',
        baseSalary: 25000,
        requirements: {
            minSkillScore: 800,
            skills: ['executive_leadership', 'strategic_planning', 'crisis_management']
        },
        description: 'Lead entire organization. Highest level position.',
        experienceGain: { leadership: 30, business: 30 }
    }
];

// Initialize Job Market
function initializeJobMarket() {
    jobMarketSystem.availableJobs = [];
    jobMarketSystem.playerJob = null;
    jobMarketSystem.jobHistory = [];
    
    // Start player with entry-level job
    const startingJob = {
        ...jobDefinitions.find(j => j.id === 'cashier'),
        startTurn: 1,
        experience: 0,
        promotionEligible: false
    };
    jobMarketSystem.playerJob = startingJob;
    gameState.player.monthlyIncome = startingJob.baseSalary;
    
    // Generate available jobs
    generateAvailableJobs();
}

// Generate Available Jobs
function generateAvailableJobs() {
    jobMarketSystem.availableJobs = [];
    
    // Always show some jobs at each level
    const levels = ['entry', 'junior', 'mid', 'senior', 'executive'];
    
    levels.forEach(level => {
        const jobsAtLevel = jobDefinitions.filter(j => j.level === level);
        if (jobsAtLevel.length > 0) {
            // Show 1-2 jobs per level
            const numJobs = 1 + Math.floor(Math.random() * 2);
            for (let i = 0; i < numJobs && i < jobsAtLevel.length; i++) {
                const job = { ...jobsAtLevel[Math.floor(Math.random() * jobsAtLevel.length)] };
                job.id = `${job.id}_${Date.now()}_${i}`;
                jobMarketSystem.availableJobs.push(job);
            }
        }
    });
}

// Check if player meets job requirements
function meetsJobRequirements(job) {
    const skillScore = getSkillScoreForJob(job.level);
    
    // Check minimum skill score
    if (skillScore < job.requirements.minSkillScore) {
        return { meets: false, reason: `Insufficient skills. Need ${job.requirements.minSkillScore}, have ${skillScore}` };
    }
    
    // Check required skills
    const missingSkills = job.requirements.skills.filter(skillId => {
        const skill = skillTreeSystem.skills[skillId];
        return !skill || !skill.learned;
    });
    
    if (missingSkills.length > 0) {
        const skillNames = missingSkills.map(id => skillTreeSystem.skills[id]?.name || id);
        return { meets: false, reason: `Missing required skills: ${skillNames.join(', ')}` };
    }
    
    return { meets: true };
}

// Apply for Job
function applyForJob(jobId) {
    const job = jobMarketSystem.availableJobs.find(j => j.id === jobId);
    if (!job) {
        if (typeof showToast === 'function') {
            showToast('Job not found', 'error');
        }
        return false;
    }
    
    const requirements = meetsJobRequirements(job);
    if (!requirements.meets) {
        if (typeof showToast === 'function') {
            showToast(requirements.reason, 'error');
        }
        return false;
    }
    
    // Calculate success chance (based on skill score vs requirements)
    const skillScore = getSkillScoreForJob(job.level);
    const requiredScore = job.requirements.minSkillScore;
    const excessScore = skillScore - requiredScore;
    const successChance = Math.min(0.95, 0.5 + (excessScore / 200));
    
    if (Math.random() < successChance) {
        // Job application successful!
        acceptJob(job);
        return true;
    } else {
        // Application rejected
        if (typeof showToast === 'function') {
            showToast(`Application rejected. Try improving your skills.`, 'error');
        }
        addStory(`Your application for ${job.title} at ${job.company} was rejected.`);
        return false;
    }
}

// Accept Job
function acceptJob(job) {
    // Add old job to history
    if (jobMarketSystem.playerJob) {
        jobMarketSystem.jobHistory.push({
            ...jobMarketSystem.playerJob,
            endTurn: gameState.turn,
            reason: 'Resigned'
        });
    }
    
    // Set new job
    const newJob = {
        ...job,
        startTurn: gameState.turn,
        experience: 0,
        promotionEligible: false
    };
    jobMarketSystem.playerJob = newJob;
    gameState.player.monthlyIncome = newJob.baseSalary;
    
    // Remove from available jobs
    const index = jobMarketSystem.availableJobs.findIndex(j => j.id === job.id);
    if (index > -1) {
        jobMarketSystem.availableJobs.splice(index, 1);
    }
    
    if (typeof showToast === 'function') {
        showToast(`🎉 Congratulations! You got the job: ${newJob.title} at ${newJob.company}`, 'success', 5000);
    }
    
    addStory(`🎉 You accepted the position of ${newJob.title} at ${newJob.company}. Your monthly salary is now ${formatMoney(newJob.baseSalary)}.`);
    
    // Log transaction
    if (typeof logTransaction === 'function') {
        logTransaction('job', `Started new job: ${newJob.title}`, 0, {
            jobId: newJob.id,
            salary: newJob.baseSalary,
            level: newJob.level
        });
    }
    
    if (typeof updateDisplay === 'function') {
        updateDisplay();
    }
}

// Process Job Each Turn
function processJobTurn() {
    if (!jobMarketSystem.playerJob) return;
    
    const job = jobMarketSystem.playerJob;
    job.experience++;
    
    // Gain experience in relevant skills
    if (job.experienceGain) {
        Object.keys(job.experienceGain).forEach(skill => {
            if (typeof gainExperience === 'function') {
                gainExperience(skill, job.experienceGain[skill]);
            }
        });
    }
    
    // Check for automatic promotion (based on experience and skills)
    if (job.experience >= 12 && !job.promotionEligible) {
        job.promotionEligible = true;
        addStory(`💼 You've gained enough experience at ${job.title}. You're now eligible for promotion!`);
    }
    
    // Check for job loss (low performance - based on skills vs requirements)
    if (job.experience > 6) {
        const skillScore = getSkillScoreForJob(job.level);
        const requiredScore = job.requirements.minSkillScore;
        
        // If skills are significantly below requirements, risk of job loss
        if (skillScore < requiredScore * 0.7 && Math.random() < 0.1) {
            loseJob('Performance issues - skills below requirements');
            return;
        }
    }
    
    // Check for automatic promotion (rare, based on high performance)
    if (job.experience >= 18 && Math.random() < 0.15) {
        attemptAutomaticPromotion();
    }
}

// Request Promotion
function requestPromotion() {
    if (!jobMarketSystem.playerJob) {
        if (typeof showToast === 'function') {
            showToast('You are not currently employed', 'error');
        }
        return false;
    }
    
    const currentJob = jobMarketSystem.playerJob;
    
    if (!currentJob.promotionEligible && currentJob.experience < 12) {
        if (typeof showToast === 'function') {
            showToast('You need more experience before requesting promotion', 'error');
        }
        return false;
    }
    
    // Find next level job
    const currentLevel = currentJob.level;
    const levelProgression = ['entry', 'junior', 'mid', 'senior', 'executive'];
    const currentIndex = levelProgression.indexOf(currentLevel);
    
    if (currentIndex >= levelProgression.length - 1) {
        if (typeof showToast === 'function') {
            showToast('You are already at the highest level!', 'info');
        }
        return false;
    }
    
    const nextLevel = levelProgression[currentIndex + 1];
    const availablePromotions = jobDefinitions.filter(j => j.level === nextLevel);
    
    if (availablePromotions.length === 0) {
        if (typeof showToast === 'function') {
            showToast('No promotion opportunities available at this time', 'info');
        }
        return false;
    }
    
    // Select a promotion opportunity
    const promotionJob = availablePromotions[Math.floor(Math.random() * availablePromotions.length)];
    
    // Check if player meets requirements
    const requirements = meetsJobRequirements(promotionJob);
    if (!requirements.meets) {
        if (typeof showToast === 'function') {
            showToast(`Promotion denied: ${requirements.reason}`, 'error');
        }
        addStory(`Your promotion request was denied. ${requirements.reason}`);
        return false;
    }
    
    // Calculate promotion success (based on experience and skills)
    const experienceBonus = Math.min(0.3, currentJob.experience / 60);
    const skillScore = getSkillScoreForJob(promotionJob.level);
    const requiredScore = promotionJob.requirements.minSkillScore;
    const skillBonus = Math.min(0.4, (skillScore - requiredScore) / 200);
    const successChance = 0.5 + experienceBonus + skillBonus;
    
    if (Math.random() < successChance) {
        // Promotion successful!
        acceptJob(promotionJob);
        addStory(`🎉 Promotion approved! You've been promoted to ${promotionJob.title}!`);
        return true;
    } else {
        if (typeof showToast === 'function') {
            showToast('Promotion request denied. Keep building your skills and experience.', 'error');
        }
        addStory(`Your promotion request was denied. Keep working hard and improving your skills.`);
        return false;
    }
}

// Attempt Automatic Promotion
function attemptAutomaticPromotion() {
    if (!jobMarketSystem.playerJob) return;
    
    const currentJob = jobMarketSystem.playerJob;
    const currentLevel = currentJob.level;
    const levelProgression = ['entry', 'junior', 'mid', 'senior', 'executive'];
    const currentIndex = levelProgression.indexOf(currentLevel);
    
    if (currentIndex >= levelProgression.length - 1) return;
    
    const nextLevel = levelProgression[currentIndex + 1];
    const availablePromotions = jobDefinitions.filter(j => j.level === nextLevel);
    
    if (availablePromotions.length === 0) return;
    
    const promotionJob = availablePromotions[Math.floor(Math.random() * availablePromotions.length)];
    const requirements = meetsJobRequirements(promotionJob);
    
    if (requirements.meets) {
        acceptJob(promotionJob);
        addStory(`🎉 Automatic promotion! Your excellent performance earned you a promotion to ${promotionJob.title}!`);
    }
}

// Lose Job
function loseJob(reason) {
    if (!jobMarketSystem.playerJob) return;
    
    const job = jobMarketSystem.playerJob;
    jobMarketSystem.jobHistory.push({
        ...job,
        endTurn: gameState.turn,
        reason: reason
    });
    
    jobMarketSystem.playerJob = null;
    gameState.player.monthlyIncome = 0;
    
    if (typeof showToast === 'function') {
        showToast(`⚠️ You lost your job: ${reason}`, 'error', 6000);
    }
    
    addStory(`⚠️ You lost your job as ${job.title}. Reason: ${reason}. You need to find a new job!`);
    
    // Generate new jobs
    generateAvailableJobs();
    
    if (typeof updateDisplay === 'function') {
        updateDisplay();
    }
}

// Display Job Market Modal
function openJobMarketModal() {
    const modal = document.getElementById('job-market-modal');
    if (!modal) {
        createJobMarketModal();
    }
    
    // Use modal manager
    if (typeof openModal === 'function') {
        if (!openModal('job-market-modal')) return;
    } else {
        modal.classList.add('active');
    }
    
    displayJobMarket();
}

// Create Job Market Modal
function createJobMarketModal() {
    const modal = document.createElement('div');
    modal.id = 'job-market-modal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 900px; max-height: 90vh;">
            <span class="close" onclick="closeModalById('job-market-modal')">&times;</span>
            <h2>💼 Job Market</h2>
            <div id="job-market-content" style="max-height: 75vh; overflow-y: auto;"></div>
        </div>
    `;
    document.body.appendChild(modal);
}

// Display Job Market
function displayJobMarket() {
    const content = document.getElementById('job-market-content');
    if (!content) return;
    
    let html = '';
    
    // Current Job Section
    if (jobMarketSystem.playerJob) {
        const job = jobMarketSystem.playerJob;
        html += `
            <div style="background: var(--bg-dark); padding: 20px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid var(--success-color);">
                <h3 style="margin-top: 0;">Current Position</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                    <div>
                        <div style="font-size: 1.2em; font-weight: 600;">${job.title}</div>
                        <div style="color: var(--text-secondary);">${job.company}</div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 1.2em; font-weight: 600; color: var(--success-color);">
                            ${formatMoney(job.baseSalary)}/month
                        </div>
                        <div style="color: var(--text-secondary); font-size: 0.9em;">
                            Level: ${job.level.charAt(0).toUpperCase() + job.level.slice(1)}
                        </div>
                    </div>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.9em; margin-bottom: 15px;">
                    <div>
                        <div style="color: var(--text-secondary);">Experience:</div>
                        <div>${job.experience} month(s)</div>
                    </div>
                    <div>
                        <div style="color: var(--text-secondary);">Promotion Eligible:</div>
                        <div>${job.promotionEligible ? '✅ Yes' : '❌ Not yet'}</div>
                    </div>
                </div>
                <div style="display: flex; gap: 10px;">
                    <button class="btn-primary" onclick="requestPromotion()" 
                            ${!job.promotionEligible ? 'disabled style="opacity: 0.5;"' : ''}>
                        Request Promotion
                    </button>
                    <button class="btn-secondary" onclick="resignFromJob()">
                        Resign
                    </button>
                </div>
            </div>
        `;
    } else {
        html += `
            <div style="background: var(--bg-dark); padding: 20px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid var(--warning-color);">
                <h3 style="margin-top: 0;">⚠️ Currently Unemployed</h3>
                <p>You need to find a job to earn income. Apply for available positions below.</p>
            </div>
        `;
    }
    
    // Available Jobs Section
    html += '<h3 style="margin-bottom: 15px;">Available Positions</h3>';
    
    if (jobMarketSystem.availableJobs.length === 0) {
        html += '<p style="color: var(--text-secondary);">No jobs available at this time. Check again next turn.</p>';
    } else {
        // Group by level
        const jobsByLevel = {};
        jobMarketSystem.availableJobs.forEach(job => {
            if (!jobsByLevel[job.level]) {
                jobsByLevel[job.level] = [];
            }
            jobsByLevel[job.level].push(job);
        });
        
        const levelOrder = ['entry', 'junior', 'mid', 'senior', 'executive'];
        levelOrder.forEach(level => {
            if (!jobsByLevel[level] || jobsByLevel[level].length === 0) return;
            
            html += `<h4 style="margin-top: 20px; margin-bottom: 10px; text-transform: capitalize;">${level} Level</h4>`;
            
            jobsByLevel[level].forEach(job => {
                const requirements = meetsJobRequirements(job);
                const skillScore = getSkillScoreForJob(job.level);
                const canApply = requirements.meets;
                
                html += `
                    <div style="background: var(--bg-dark); padding: 20px; border-radius: 10px; margin-bottom: 15px; border-left: 4px solid ${canApply ? 'var(--success-color)' : 'var(--danger-color)'};">
                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
                            <div>
                                <div style="font-size: 1.1em; font-weight: 600;">${job.title}</div>
                                <div style="color: var(--text-secondary);">${job.company}</div>
                            </div>
                            <div style="text-align: right;">
                                <div style="font-size: 1.2em; font-weight: 600; color: var(--success-color);">
                                    ${formatMoney(job.baseSalary)}/month
                                </div>
                            </div>
                        </div>
                        <p style="margin: 10px 0; color: var(--text-secondary);">${job.description}</p>
                        <div style="background: var(--bg-light); padding: 10px; border-radius: 8px; margin-bottom: 10px; font-size: 0.9em;">
                            <div style="margin-bottom: 5px;"><strong>Requirements:</strong></div>
                            <div>Minimum Skill Score: ${job.requirements.minSkillScore} (Your score: ${skillScore})</div>
                            ${job.requirements.skills.length > 0 ? `
                                <div style="margin-top: 5px;">
                                    Required Skills: ${job.requirements.skills.map(id => {
                                        const skill = skillTreeSystem.skills[id];
                                        const learned = skill && skill.learned;
                                        return `<span style="color: ${learned ? 'var(--success-color)' : 'var(--danger-color)'};">${skill ? skill.name : id} ${learned ? '✅' : '❌'}</span>`;
                                    }).join(', ')}
                                </div>
                            ` : ''}
                        </div>
                        <div style="color: ${canApply ? 'var(--success-color)' : 'var(--danger-color)'}; margin-bottom: 10px;">
                            ${canApply ? '✅ You meet the requirements!' : `❌ ${requirements.reason}`}
                        </div>
                        <button class="btn-primary" onclick="applyForJob('${job.id}')" 
                                ${!canApply ? 'disabled style="opacity: 0.5;"' : ''}
                                style="width: 100%;">
                            Apply for Position
                        </button>
                    </div>
                `;
            });
        });
    }
    
    content.innerHTML = html;
}

// Resign from Job
function resignFromJob() {
    if (!jobMarketSystem.playerJob) return;
    
    if (confirm('Are you sure you want to resign from your current job?')) {
        loseJob('Resigned');
        generateAvailableJobs();
        displayJobMarket();
    }
}

// Make functions globally available
window.initializeJobMarket = initializeJobMarket;
window.applyForJob = applyForJob;
window.requestPromotion = requestPromotion;
window.processJobTurn = processJobTurn;
window.openJobMarketModal = openJobMarketModal;
window.resignFromJob = resignFromJob;
window.jobMarketSystem = jobMarketSystem;

