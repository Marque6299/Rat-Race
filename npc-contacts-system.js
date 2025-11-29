// NPC Contacts System with Relationships and Events
const npcContactsSystem = {
    contacts: [],
    relationships: {}, // contactId -> relationship level (-100 to 100)
    contactHistory: []
};

// Contact Types
const contactTypes = {
    corporate_contact: {
        name: 'Corporate Contact',
        icon: '🏢',
        description: 'Connections within major corporations',
        canHelp: ['job_referral', 'business_deal', 'market_insight'],
        canThreaten: ['competition', 'hostile_takeover']
    },
    government_official: {
        name: 'Government Official',
        icon: '🏛️',
        description: 'Political and regulatory connections',
        canHelp: ['regulatory_favor', 'contract_opportunity', 'tax_benefit'],
        canThreaten: ['audit', 'regulation', 'investigation']
    },
    corporate_head: {
        name: 'Corporate Head',
        icon: '👔',
        description: 'CEOs and executives of major companies',
        canHelp: ['major_deal', 'partnership', 'investment_opportunity'],
        canThreaten: ['market_manipulation', 'hostile_action']
    },
    law_enforcement: {
        name: 'Law Enforcement',
        icon: '👮',
        description: 'Police and regulatory enforcement',
        canHelp: ['protection', 'information', 'legal_advantage'],
        canThreaten: ['investigation', 'arrest', 'seizure']
    },
    business_bureau: {
        name: 'Business Bureau',
        icon: '📋',
        description: 'Business registration and compliance',
        canHelp: ['business_license', 'compliance_help', 'market_data'],
        canThreaten: ['fines', 'license_revocation']
    },
    trader: {
        name: 'Trader',
        icon: '📈',
        description: 'Professional market traders',
        canHelp: ['trading_tips', 'market_access', 'insider_info'],
        canThreaten: ['market_manipulation', 'competition']
    },
    merchant: {
        name: 'Merchant',
        icon: '🛒',
        description: 'Business owners and suppliers',
        canHelp: ['discounts', 'supply_deals', 'business_opportunities'],
        canThreaten: ['price_gouging', 'supply_cutoff']
    },
    collector: {
        name: 'Collector',
        icon: '🎨',
        description: 'Collectors of rare assets',
        canHelp: ['rare_assets', 'valuation', 'auction_access'],
        canThreaten: ['competition', 'price_inflation']
    },
    blackmarket: {
        name: 'Black Market Contact',
        icon: '🌑',
        description: 'Underground market connections',
        canHelp: ['illegal_deals', 'hidden_assets', 'off_books_income'],
        canThreaten: ['exposure', 'legal_trouble', 'extortion']
    },
    loan_shark: {
        name: 'Loan Shark',
        icon: '💰',
        description: 'Private lenders with flexible terms',
        canHelp: ['quick_loans', 'no_credit_check'],
        canThreaten: ['extortion', 'threats', 'debt_trap']
    },
    investor: {
        name: 'Investor',
        icon: '💼',
        description: 'Investment professionals and capital providers',
        canHelp: ['investment_opportunities', 'capital_injection', 'business_growth'],
        canThreaten: ['hostile_takeover', 'market_manipulation', 'competition']
    }
};

// NPC Contact Definitions
const npcContactDefinitions = [
    // Corporate Contacts
    {
        id: 'corp_exec_1',
        name: 'Sarah Chen',
        type: 'corporate_contact',
        company: 'TechCorp Industries',
        description: 'VP of Finance at a major tech corporation',
        relationship: 0,
        corporation: 'corp_1',
        events: ['job_offer', 'investment_tip', 'competition_warning']
    },
    {
        id: 'corp_exec_2',
        name: 'Marcus Johnson',
        type: 'corporate_contact',
        company: 'Global Financial Group',
        description: 'Senior Director of Investments',
        relationship: 0,
        corporation: 'corp_2',
        events: ['market_insight', 'partnership_offer', 'hostile_action']
    },
    
    // Government Officials
    {
        id: 'gov_official_1',
        name: 'Senator Patricia Williams',
        type: 'government_official',
        company: 'Federal Government',
        description: 'Influential senator with regulatory connections',
        relationship: 0,
        events: ['regulatory_favor', 'contract_opportunity', 'audit_threat']
    },
    {
        id: 'gov_official_2',
        name: 'Agent Robert Kim',
        type: 'law_enforcement',
        company: 'Financial Crimes Unit',
        description: 'Federal agent investigating financial crimes',
        relationship: 0,
        events: ['protection_offer', 'investigation_warning', 'legal_help']
    },
    
    // Business Bureau
    {
        id: 'bureau_rep',
        name: 'Linda Martinez',
        type: 'business_bureau',
        company: 'Business Registration Bureau',
        description: 'Bureau representative handling business licenses',
        relationship: 0,
        events: ['license_help', 'compliance_warning', 'market_data']
    },
    
    // Traders
    {
        id: 'trader_1',
        name: 'James "The Wolf" Thompson',
        type: 'trader',
        company: 'Independent Trading',
        description: 'Legendary day trader with insider connections',
        relationship: 0,
        events: ['trading_tip', 'market_manipulation', 'insider_info']
    },
    {
        id: 'trader_2',
        name: 'Elena Volkov',
        type: 'trader',
        company: 'Volkov Trading',
        description: 'Crypto and forex specialist',
        relationship: 0,
        events: ['crypto_opportunity', 'forex_tip', 'market_competition']
    },
    
    // Merchants
    {
        id: 'merchant_1',
        name: 'Ahmed Al-Rashid',
        type: 'merchant',
        company: 'Al-Rashid Imports',
        description: 'International trade merchant',
        relationship: 0,
        events: ['supply_deal', 'import_opportunity', 'price_gouging']
    },
    
    // Collectors
    {
        id: 'collector_1',
        name: 'Victoria Sterling',
        type: 'collector',
        company: 'Sterling Collections',
        description: 'Rare asset collector and appraiser',
        relationship: 0,
        events: ['rare_asset_offer', 'valuation_service', 'auction_access']
    },
    
    // Black Market
    {
        id: 'blackmarket_1',
        name: 'Shadow',
        type: 'blackmarket',
        company: 'Underground Network',
        description: 'Mysterious black market contact',
        relationship: 0,
        events: ['illegal_deal', 'hidden_asset', 'extortion_threat']
    },
    
    // Corporate Heads
    {
        id: 'ceo_1',
        name: 'Richard Blackstone',
        type: 'corporate_head',
        company: 'MegaCorp Industries',
        description: 'CEO of MegaCorp Industries',
        relationship: 0,
        corporation: 'corp_1',
        events: ['major_partnership', 'hostile_takeover', 'market_domination']
    },
    {
        id: 'ceo_2',
        name: 'Isabella Rodriguez',
        type: 'corporate_head',
        company: 'Global Financial Group',
        description: 'CEO of Global Financial Group',
        relationship: 0,
        corporation: 'corp_2',
        events: ['investment_opportunity', 'market_manipulation', 'strategic_alliance']
    },
    
    // Loan Sharks (Hidden Agenda: Extortion)
    {
        id: 'loanshark_1',
        name: 'Vincent "The Collector" Moretti',
        type: 'loan_shark',
        company: 'Private Lending',
        description: 'Offers quick loans with "flexible" terms. Seems friendly but has a reputation.',
        relationship: 0,
        hiddenAgenda: 'extortion',
        agendaDescription: 'Uses high-interest loans to trap borrowers, then uses threats and intimidation to collect',
        events: ['loan_offer', 'payment_demand', 'threat']
    },
    {
        id: 'loanshark_2',
        name: 'Dmitri Volkov',
        type: 'loan_shark',
        company: 'Express Capital',
        description: 'Fast cash lender with "no questions asked" policy.',
        relationship: 0,
        hiddenAgenda: 'debt_trap',
        agendaDescription: 'Lures borrowers with easy terms, then dramatically increases rates and uses illegal collection methods',
        events: ['loan_offer', 'rate_increase', 'collection_threat']
    },
    
    // Fraudulent Investors (Hidden Agenda: Ponzi Scheme)
    {
        id: 'fraud_investor_1',
        name: 'Charles "Chuck" Wellington',
        type: 'investor',
        company: 'Wellington Capital Partners',
        description: 'Successful investor offering exclusive high-return opportunities.',
        relationship: 0,
        hiddenAgenda: 'ponzi_scheme',
        agendaDescription: 'Runs a Ponzi scheme, using new investor money to pay old investors, will eventually collapse',
        events: ['investment_offer', 'high_return_promise', 'scheme_collapse']
    },
    {
        id: 'fraud_investor_2',
        name: 'Dr. Sarah Mitchell',
        type: 'investor',
        company: 'Quantum Investment Group',
        description: 'Ph.D. in finance, offers "guaranteed" high returns through proprietary algorithms.',
        relationship: 0,
        hiddenAgenda: 'investment_fraud',
        agendaDescription: 'Uses fake credentials and fabricated returns to attract investors, money disappears',
        events: ['investment_offer', 'guaranteed_returns', 'fraud_exposure']
    },
    
    // Scammers (Hidden Agenda: Identity Theft / Phishing)
    {
        id: 'scammer_1',
        name: 'Robert "Bob" Johnson',
        type: 'merchant',
        company: 'Global Trading Solutions',
        description: 'International trader offering amazing deals on various assets.',
        relationship: 0,
        hiddenAgenda: 'identity_theft',
        agendaDescription: 'Collects personal and financial information to commit identity theft and drain accounts',
        events: ['deal_offer', 'information_request', 'account_compromise']
    },
    {
        id: 'scammer_2',
        name: 'Priya Patel',
        type: 'trader',
        company: 'Elite Trading Network',
        description: 'Claims insider connections and offers "exclusive" trading opportunities.',
        relationship: 0,
        hiddenAgenda: 'phishing',
        agendaDescription: 'Uses fake trading platforms to steal login credentials and funds',
        events: ['trading_offer', 'platform_access', 'credential_theft']
    },
    
    // Corporate Espionage (Hidden Agenda: Steal Business Secrets)
    {
        id: 'spy_1',
        name: 'Alexander Chen',
        type: 'corporate_contact',
        company: 'Strategic Consulting Group',
        description: 'Business consultant offering to help optimize your operations.',
        relationship: 0,
        hiddenAgenda: 'corporate_espionage',
        agendaDescription: 'Gathers business intelligence and trade secrets to sell to competitors',
        events: ['consultation_offer', 'information_gathering', 'secret_leak']
    },
    {
        id: 'spy_2',
        name: 'Natalia Volkov',
        type: 'corporate_head',
        company: 'International Business Solutions',
        description: 'Offers strategic partnerships and joint ventures.',
        relationship: 0,
        hiddenAgenda: 'hostile_takeover',
        agendaDescription: 'Gathers information about your businesses to plan a hostile takeover',
        events: ['partnership_offer', 'due_diligence', 'takeover_attempt']
    },
    
    // Financial Scheme Operators (Hidden Agenda: Pyramid Scheme)
    {
        id: 'scheme_operator_1',
        name: 'Michael "Mike" Thompson',
        type: 'merchant',
        company: 'Prosperity Network',
        description: 'Offers a "revolutionary" multi-level marketing opportunity.',
        relationship: 0,
        hiddenAgenda: 'pyramid_scheme',
        agendaDescription: 'Runs a pyramid scheme that requires recruiting others, most participants lose money',
        events: ['mlm_offer', 'recruitment_pitch', 'scheme_collapse']
    },
    {
        id: 'scheme_operator_2',
        name: 'Jennifer Martinez',
        type: 'trader',
        company: 'Crypto Wealth Academy',
        description: 'Offers cryptocurrency trading courses and "guaranteed" investment strategies.',
        relationship: 0,
        hiddenAgenda: 'crypto_scam',
        agendaDescription: 'Sells worthless courses and fake crypto investments, keeps all money',
        events: ['course_offer', 'crypto_investment', 'scam_exposure']
    },
    
    // Hostile Takeover Specialists (Hidden Agenda: Acquire Your Assets)
    {
        id: 'hostile_takeover_1',
        name: 'Richard "The Shark" Blackstone',
        type: 'corporate_head',
        company: 'Blackstone Acquisition Corp',
        description: 'Aggressive investor looking for acquisition opportunities.',
        relationship: 0,
        hiddenAgenda: 'hostile_takeover',
        agendaDescription: 'Plans to acquire your businesses and properties at below-market prices through manipulation',
        events: ['acquisition_offer', 'market_manipulation', 'hostile_bid']
    },
    {
        id: 'hostile_takeover_2',
        name: 'Victoria "Vicky" Sterling',
        type: 'corporate_contact',
        company: 'Sterling Holdings',
        description: 'Investment firm specializing in distressed asset purchases.',
        relationship: 0,
        hiddenAgenda: 'asset_stripping',
        agendaDescription: 'Intentionally causes financial distress to acquire assets cheaply, then strips them for value',
        events: ['distressed_offer', 'financial_pressure', 'asset_seizure']
    },
    
    // Legitimate but Risky Investors (No Hidden Agenda, but High Risk)
    {
        id: 'risky_investor_1',
        name: 'David "Risk" Mitchell',
        type: 'investor',
        company: 'High-Risk Capital',
        description: 'Venture capitalist specializing in high-risk, high-reward investments.',
        relationship: 0,
        hiddenAgenda: null,
        agendaDescription: 'Legitimate but very risky investments - may lose everything',
        events: ['venture_offer', 'high_risk_investment', 'potential_loss']
    },
    {
        id: 'risky_investor_2',
        name: 'Amanda Foster',
        type: 'investor',
        company: 'Emerging Markets Fund',
        description: 'Focuses on emerging market opportunities with volatile returns.',
        relationship: 0,
        hiddenAgenda: null,
        agendaDescription: 'Legitimate investments in volatile markets - high risk of loss',
        events: ['emerging_market_offer', 'volatile_investment', 'market_crash']
    }
];

// Initialize NPC Contacts
function initializeNPCContacts() {
    npcContactsSystem.contacts = [];
    npcContactsSystem.relationships = {};
    npcContactsSystem.contactHistory = [];
    
    // Create contacts
    npcContactDefinitions.forEach(contactDef => {
        const contact = {
            ...contactDef,
            relationship: contactDef.relationship || 0,
            lastInteraction: null,
            eventHistory: [],
            available: true
        };
        npcContactsSystem.contacts.push(contact);
        npcContactsSystem.relationships[contact.id] = contact.relationship;
    });
}

// Get Contact by ID
function getContact(contactId) {
    return npcContactsSystem.contacts.find(c => c.id === contactId);
}

// Update Relationship
function updateRelationship(contactId, change) {
    const contact = getContact(contactId);
    if (!contact) return;
    
    contact.relationship = Math.max(-100, Math.min(100, contact.relationship + change));
    npcContactsSystem.relationships[contactId] = contact.relationship;
}

// Get Relationship Level
function getRelationshipLevel(relationship) {
    if (relationship >= 80) return { level: 'Allied', color: 'var(--success-color)' };
    if (relationship >= 50) return { level: 'Friendly', color: 'var(--secondary-color)' };
    if (relationship >= 20) return { level: 'Positive', color: 'var(--primary-color)' };
    if (relationship >= -20) return { level: 'Neutral', color: 'var(--text-secondary)' };
    if (relationship >= -50) return { level: 'Negative', color: 'var(--warning-color)' };
    return { level: 'Hostile', color: 'var(--danger-color)' };
}

// Process Contact Events Each Turn
function processContactEvents() {
    npcContactsSystem.contacts.forEach(contact => {
        if (!contact.available) return;
        
        // Process hidden agendas for contacts with them
        if (contact.hiddenAgenda && contact.relationship > 0) {
            processHiddenAgenda(contact);
        }
        
        // Chance for contact to initiate event based on relationship
        const eventChance = Math.abs(contact.relationship) / 200; // Higher relationship = more events
        if (Math.random() < eventChance * 0.1) { // 10% of relationship-based chance
            triggerContactEvent(contact);
        }
    });
}

// Process Hidden Agenda (unknown to player)
function processHiddenAgenda(contact) {
    if (!contact.hiddenAgenda) return;
    
    // Track interactions with this contact
    if (!contact.interactionCount) contact.interactionCount = 0;
    if (!contact.agendaProgress) contact.agendaProgress = 0;
    
    // Increase agenda progress based on relationship and interactions
    contact.agendaProgress += Math.abs(contact.relationship) / 50;
    contact.interactionCount++;
    
    // Trigger agenda effect when threshold is reached
    const threshold = 50 + (contact.interactionCount * 5);
    
    if (contact.agendaProgress >= threshold && !contact.agendaTriggered) {
        executeHiddenAgenda(contact);
        contact.agendaTriggered = true;
    }
}

// Execute Hidden Agenda Effect
function executeHiddenAgenda(contact) {
    switch(contact.hiddenAgenda) {
        case 'extortion':
        case 'debt_trap':
            // Loan shark demands payment or increases rates
            const extortionAmount = gameState.player.cash * 0.15;
            if (gameState.player.cash >= extortionAmount) {
                gameState.player.cash -= extortionAmount;
                addStory(`⚠️ ${contact.name} demanded ${formatMoney(extortionAmount)} as "protection money". You had no choice but to pay.`);
                gameState.player.financialHealth = Math.max(0, gameState.player.financialHealth - 10);
                updateRelationship(contact.id, -30);
            } else {
                // Can't pay - severe consequences
                gameState.player.financialHealth = Math.max(0, gameState.player.financialHealth - 20);
                addStory(`🚨 ${contact.name} is threatening you for non-payment. Your financial health has been severely impacted.`);
                updateRelationship(contact.id, -50);
            }
            break;
            
        case 'ponzi_scheme':
        case 'investment_fraud':
            // Investment scheme collapses
            const investedAmount = gameState.player.cash * 0.2; // Assume 20% was invested
            gameState.player.cash -= investedAmount;
            addStory(`💥 ${contact.name}'s investment scheme collapsed! You lost ${formatMoney(investedAmount)}. It was a Ponzi scheme all along!`);
            gameState.player.financialHealth = Math.max(0, gameState.player.financialHealth - 15);
            updateRelationship(contact.id, -100);
            contact.available = false; // Contact disappears
            break;
            
        case 'identity_theft':
        case 'phishing':
            // Identity theft or account compromise
            const stolenAmount = gameState.player.cash * 0.25;
            gameState.player.cash -= stolenAmount;
            addStory(`🔒 Your accounts were compromised! ${contact.name} stole ${formatMoney(stolenAmount)} using your stolen information.`);
            gameState.player.financialHealth = Math.max(0, gameState.player.financialHealth - 12);
            updateRelationship(contact.id, -100);
            contact.available = false;
            break;
            
        case 'corporate_espionage':
            // Business secrets leaked to competitors
            if (typeof opportunitiesSystem !== 'undefined' && opportunitiesSystem.playerBusinesses.length > 0) {
                const business = opportunitiesSystem.playerBusinesses[Math.floor(Math.random() * opportunitiesSystem.playerBusinesses.length)];
                business.monthlyIncome *= 0.7; // Competitors gained advantage
                addStory(`🕵️ ${contact.name} leaked your business secrets to competitors! ${business.name} income decreased by 30%.`);
            }
            gameState.player.financialHealth = Math.max(0, gameState.player.financialHealth - 8);
            updateRelationship(contact.id, -80);
            break;
            
        case 'hostile_takeover':
        case 'asset_stripping':
            // Attempt to acquire player assets
            if (gameState.player.properties.length > 0) {
                const property = gameState.player.properties[Math.floor(Math.random() * gameState.player.properties.length)];
                const lowballOffer = property.value * 0.5;
                addStory(`⚠️ ${contact.name} made a hostile takeover attempt on ${property.name}. They offered ${formatMoney(lowballOffer)} (50% of value).`);
                // Player can choose to accept or fight (for now, just warn)
                gameState.player.financialHealth = Math.max(0, gameState.player.financialHealth - 10);
                updateRelationship(contact.id, -60);
            }
            break;
            
        case 'pyramid_scheme':
        case 'crypto_scam':
            // Scheme collapses
            const schemeLoss = gameState.player.cash * 0.3;
            gameState.player.cash -= schemeLoss;
            addStory(`💸 ${contact.name}'s scheme was exposed as a fraud! You lost ${formatMoney(schemeLoss)}.`);
            gameState.player.financialHealth = Math.max(0, gameState.player.financialHealth - 18);
            updateRelationship(contact.id, -100);
            contact.available = false;
            break;
    }
    
    // Log the agenda exposure
    npcContactsSystem.contactHistory.push({
        contactId: contact.id,
        eventType: 'hidden_agenda_exposed',
        turn: gameState.turn,
        agenda: contact.hiddenAgenda,
        relationship: contact.relationship
    });
}

// Trigger Contact Event
function triggerContactEvent(contact) {
    if (!contact.events || contact.events.length === 0) return;
    
    const eventType = contact.events[Math.floor(Math.random() * contact.events.length)];
    const relationship = contact.relationship;
    
    // Positive events for positive relationships, negative for negative
    if (relationship > 0 && eventType.includes('offer') || eventType.includes('tip') || eventType.includes('help')) {
        executePositiveContactEvent(contact, eventType);
    } else if (relationship < 0 && (eventType.includes('threat') || eventType.includes('warning') || eventType.includes('hostile'))) {
        executeNegativeContactEvent(contact, eventType);
    } else if (Math.random() < 0.3) {
        // Neutral events can happen regardless
        executeNeutralContactEvent(contact, eventType);
    }
}

// Execute Positive Contact Event
function executePositiveContactEvent(contact, eventType) {
    const contactType = contactTypes[contact.type];
    
    switch(eventType) {
        case 'job_offer':
            if (typeof jobMarketSystem !== 'undefined' && jobMarketSystem.availableJobs.length < 5) {
                // Add a special job opportunity
                const specialJob = {
                    id: `special_${contact.id}_${Date.now()}`,
                    title: 'Senior Position',
                    company: contact.company,
                    level: 'senior',
                    baseSalary: 8000 + Math.random() * 2000,
                    requirements: {
                        minSkillScore: 200,
                        skills: []
                    },
                    description: `${contact.name} referred you for a position at ${contact.company}.`,
                    experienceGain: { business: 15 }
                };
                jobMarketSystem.availableJobs.push(specialJob);
                addStory(`💼 ${contact.name} referred you for a job opportunity at ${contact.company}!`);
                updateRelationship(contact.id, 5);
            }
            break;
            
        case 'investment_tip':
            const tipAmount = 5000 + Math.random() * 10000;
            gameState.player.cash += tipAmount;
            addStory(`💰 ${contact.name} shared an investment tip that earned you ${formatMoney(tipAmount)}!`);
            updateRelationship(contact.id, 3);
            break;
            
        case 'market_insight':
            // Boost market performance temporarily
            if (typeof marketEconomics !== 'undefined') {
                marketEconomics.indicators.marketSentiment = Math.min(1, marketEconomics.indicators.marketSentiment + 0.1);
            }
            addStory(`📊 ${contact.name} shared valuable market insights. Market sentiment improved!`);
            updateRelationship(contact.id, 2);
            break;
            
        case 'trading_tip':
            // Boost trading skill temporarily
            if (typeof playerAttributes !== 'undefined') {
                playerAttributes.skills.trading = Math.min(100, playerAttributes.skills.trading + 5);
            }
            addStory(`📈 ${contact.name} gave you trading advice. Your trading skill improved!`);
            updateRelationship(contact.id, 2);
            break;
            
        case 'partnership_offer':
            const partnershipIncome = 2000 + Math.random() * 3000;
            gameState.player.monthlyIncome += partnershipIncome;
            addStory(`🤝 ${contact.name} offered a partnership. Monthly income increased by ${formatMoney(partnershipIncome)}!`);
            updateRelationship(contact.id, 10);
            break;
    }
    
    contact.lastInteraction = gameState.turn;
    npcContactsSystem.contactHistory.push({
        contactId: contact.id,
        eventType: eventType,
        turn: gameState.turn,
        relationship: contact.relationship
    });
}

// Execute Negative Contact Event
function executeNegativeContactEvent(contact, eventType) {
    switch(eventType) {
        case 'hostile_action':
            // Market manipulation against player
            if (typeof gameState.markets !== 'undefined') {
                const marketTypes = Object.keys(gameState.markets);
                const marketType = marketTypes[Math.floor(Math.random() * marketTypes.length)];
                gameState.markets[marketType].forEach(asset => {
                    asset.price *= 0.95; // 5% drop
                });
                addStory(`⚠️ ${contact.name} from ${contact.company} manipulated ${marketType} markets against you!`);
            }
            updateRelationship(contact.id, -5);
            break;
            
        case 'investigation_warning':
            // Threat of investigation
            addStory(`⚠️ ${contact.name} warned you about a potential investigation. Be careful with your finances.`);
            gameState.player.financialHealth = Math.max(0, gameState.player.financialHealth - 5);
            updateRelationship(contact.id, -3);
            break;
            
        case 'competition_warning':
            // Increased competition
            addStory(`⚠️ ${contact.name} is competing with you more aggressively.`);
            updateRelationship(contact.id, -2);
            break;
            
        case 'extortion_threat':
            const extortionAmount = gameState.player.cash * 0.1;
            if (gameState.player.cash >= extortionAmount) {
                gameState.player.cash -= extortionAmount;
                addStory(`💸 ${contact.name} extorted ${formatMoney(extortionAmount)} from you!`);
                updateRelationship(contact.id, -10);
            }
            break;
    }
    
    contact.lastInteraction = gameState.turn;
    npcContactsSystem.contactHistory.push({
        contactId: contact.id,
        eventType: eventType,
        turn: gameState.turn,
        relationship: contact.relationship
    });
}

// Execute Neutral Contact Event
function executeNeutralContactEvent(contact, eventType) {
    addStory(`💬 ${contact.name} reached out. Relationship status: ${getRelationshipLevel(contact.relationship).level}`);
    contact.lastInteraction = gameState.turn;
}

// Interact with Contact
function interactWithContact(contactId, action) {
    const contact = getContact(contactId);
    if (!contact) return;
    
    switch(action) {
        case 'gift':
            const giftAmount = 1000;
            if (gameState.player.cash >= giftAmount) {
                gameState.player.cash -= giftAmount;
                updateRelationship(contactId, 5);
                addStory(`🎁 You gave ${contact.name} a gift worth ${formatMoney(giftAmount)}. Relationship improved!`);
            }
            break;
            
        case 'request_help':
            if (contact.relationship >= 50) {
                // Contact helps
                const helpAmount = 2000 + Math.random() * 3000;
                gameState.player.cash += helpAmount;
                updateRelationship(contactId, -2); // Slight relationship cost
                addStory(`🤝 ${contact.name} helped you with ${formatMoney(helpAmount)}.`);
            } else {
                addStory(`${contact.name} declined to help. Improve your relationship first.`);
            }
            break;
            
        case 'threaten':
            // Risky action - can backfire
            if (Math.random() < 0.5) {
                updateRelationship(contactId, -15);
                addStory(`⚠️ Your threat backfired. ${contact.name} is now hostile.`);
            } else {
                // Threat works
                const threatBenefit = 1000 + Math.random() * 2000;
                gameState.player.cash += threatBenefit;
                updateRelationship(contactId, -10);
                addStory(`💰 Your threat worked. You gained ${formatMoney(threatBenefit)}, but ${contact.name} is angry.`);
            }
            break;
    }
    
    contact.lastInteraction = gameState.turn;
}

// Display Contacts Modal
function openContactsModal() {
    const modal = document.getElementById('contacts-modal');
    if (!modal) {
        createContactsModal();
    }
    
    // Use modal manager
    if (typeof openModal === 'function') {
        if (!openModal('contacts-modal')) return;
    } else {
        modal.classList.add('active');
    }
    
    displayContacts();
}

// Create Contacts Modal
function createContactsModal() {
    const modal = document.createElement('div');
    modal.id = 'contacts-modal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 1000px; max-height: 90vh;">
            <span class="close" onclick="closeModalById('contacts-modal')">&times;</span>
            <h2>📇 Contacts & Relationships</h2>
            <div style="margin-bottom: 20px;">
                <div class="bank-tabs">
                    <button class="bank-tab-btn active" data-tab="all">All Contacts</button>
                    <button class="bank-tab-btn" data-tab="friendly">Friendly</button>
                    <button class="bank-tab-btn" data-tab="hostile">Hostile</button>
                    <button class="bank-tab-btn" data-tab="corporate">Corporate</button>
                </div>
            </div>
            <div id="contacts-content" style="max-height: 65vh; overflow-y: auto;"></div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Tab switching
    document.querySelectorAll('.bank-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.bank-tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            displayContacts(btn.dataset.tab);
        });
    });
}

// Display Contacts
function displayContacts(filter = 'all') {
    const content = document.getElementById('contacts-content');
    if (!content) return;
    
    let contacts = npcContactsSystem.contacts;
    
    // Apply filter
    if (filter === 'friendly') {
        contacts = contacts.filter(c => c.relationship >= 20);
    } else if (filter === 'hostile') {
        contacts = contacts.filter(c => c.relationship < -20);
    } else if (filter === 'corporate') {
        contacts = contacts.filter(c => c.corporation);
    }
    
    if (contacts.length === 0) {
        content.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 40px;">No contacts match this filter.</p>';
        return;
    }
    
    let html = '';
    
    contacts.forEach(contact => {
        const contactType = contactTypes[contact.type];
        const relationship = getRelationshipLevel(contact.relationship);
        const turnsSinceInteraction = contact.lastInteraction ? gameState.turn - contact.lastInteraction : null;
        
        // Show hidden agenda warning only if it's been exposed
        const agendaWarning = contact.agendaTriggered && contact.hiddenAgenda ? 
            `<div style="background: var(--danger-color); color: white; padding: 10px; border-radius: 8px; margin-bottom: 10px; font-size: 0.85em;">
                ⚠️ WARNING: ${contact.name}'s hidden agenda has been exposed: ${contact.agendaDescription || contact.hiddenAgenda}
            </div>` : '';
        
        html += `
            <div style="background: var(--bg-dark); padding: 20px; border-radius: 10px; margin-bottom: 15px; border-left: 4px solid ${relationship.color};">
                ${agendaWarning}
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px;">
                    <div>
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 5px;">
                            <span style="font-size: 1.5em;">${contactType.icon}</span>
                            <div>
                                <h3 style="margin: 0;">${contact.name}</h3>
                                <div style="font-size: 0.85em; color: var(--text-secondary);">
                                    ${contactType.name} • ${contact.company}
                                </div>
                            </div>
                        </div>
                        <p style="margin: 8px 0; color: var(--text-secondary); font-size: 0.9em;">${contact.description}</p>
                        ${contact.hiddenAgenda && !contact.agendaTriggered ? 
                            `<p style="margin: 5px 0; color: var(--text-secondary); font-size: 0.8em; font-style: italic;">
                                ⚠️ Something seems off about this contact, but you can't put your finger on it...
                            </p>` : ''}
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 1.1em; font-weight: 600; color: ${relationship.color};">
                            ${relationship.level}
                        </div>
                        <div style="font-size: 0.85em; color: var(--text-secondary);">
                            ${contact.relationship >= 0 ? '+' : ''}${contact.relationship}
                        </div>
                    </div>
                </div>
                
                <div style="background: var(--bg-light); padding: 10px; border-radius: 8px; margin-bottom: 15px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div style="font-size: 0.85em; color: var(--text-secondary);">Relationship</div>
                        <div style="flex: 1; height: 6px; background: var(--bg-dark); border-radius: 3px; margin: 0 10px; overflow: hidden;">
                            <div style="background: ${relationship.color}; height: 100%; width: ${((contact.relationship + 100) / 200) * 100}%;"></div>
                        </div>
                        <div style="font-size: 0.85em; font-weight: 600;">${contact.relationship}</div>
                    </div>
                </div>
                
                ${contact.corporation ? `
                    <div style="font-size: 0.85em; color: var(--text-secondary); margin-bottom: 10px;">
                        🔗 Connected to: ${typeof aiSystem !== 'undefined' && aiSystem.corporations.find(c => c.id === contact.corporation) ? 
                            aiSystem.corporations.find(c => c.id === contact.corporation).name : 'Corporation'}
                    </div>
                ` : ''}
                
                <div style="display: flex; gap: 10px;">
                    <button class="btn-secondary small" onclick="interactWithContact('${contact.id}', 'gift'); displayContacts('${filter}');">
                        🎁 Gift ($1,000)
                    </button>
                    ${contact.relationship >= 50 ? `
                        <button class="btn-primary small" onclick="interactWithContact('${contact.id}', 'request_help'); displayContacts('${filter}');">
                            🤝 Request Help
                        </button>
                    ` : ''}
                    ${contact.relationship < -30 ? `
                        <button class="btn-secondary small" onclick="if(confirm('Threaten this contact? This is risky!')) { interactWithContact('${contact.id}', 'threaten'); displayContacts('${filter}'); }" style="background: var(--danger-color);">
                            ⚠️ Threaten
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    });
    
    content.innerHTML = html;
}

// Make functions globally available
window.initializeNPCContacts = initializeNPCContacts;
window.processContactEvents = processContactEvents;
window.interactWithContact = interactWithContact;
window.openContactsModal = openContactsModal;
window.displayContacts = displayContacts;
window.npcContactsSystem = npcContactsSystem;

