const SAVE_STORAGE_KEY = 'ratRaceSaveV1';
let saveTimeoutHandle = null;

function getSerializableState() {
    const state = {
        version: '2.0',
        timestamp: new Date().toISOString(),
        game: gameState,
        bank: typeof bankSystem !== 'undefined' ? bankSystem : null,
        ai: typeof aiSystem !== 'undefined' ? aiSystem : null,
        opportunities: typeof opportunitiesSystem !== 'undefined' ? {
            playerBusinesses: opportunitiesSystem.playerBusinesses,
            currentOpportunities: opportunitiesSystem.currentOpportunities
        } : null,
        logs: typeof logsSystem !== 'undefined' ? logsSystem : null,
        playerAttributes: typeof playerAttributes !== 'undefined' ? playerAttributes : null,
        achievements: typeof achievementsSystem !== 'undefined' ? {
            achievements: achievementsSystem.achievements,
            milestones: achievementsSystem.milestones,
            unlockedAchievements: achievementsSystem.unlockedAchievements,
            reachedMilestones: achievementsSystem.reachedMilestones
        } : null,
        marketEconomics: typeof marketEconomics !== 'undefined' ? marketEconomics : null,
        expandedEvents: typeof expandedEvents !== 'undefined' ? {
            events: expandedEvents.events,
            offers: expandedEvents.offers,
            incidents: expandedEvents.incidents,
            activeOffers: expandedEvents.activeOffers,
            activeIncidents: expandedEvents.activeIncidents
        } : null,
        turnSummary: typeof turnSummary !== 'undefined' ? {
            lastTurn: turnSummary.lastTurn,
            summaryData: turnSummary.summaryData
        } : null,
        skillTree: typeof skillTreeSystem !== 'undefined' ? skillTreeSystem : null,
        jobMarket: typeof jobMarketSystem !== 'undefined' ? jobMarketSystem : null,
        quickInvestments: typeof quickInvestmentsSystem !== 'undefined' ? quickInvestmentsSystem : null,
        assetManagement: typeof assetManagementSystem !== 'undefined' ? assetManagementSystem : null,
        npcContacts: typeof npcContactsSystem !== 'undefined' ? npcContactsSystem : null,
        eventTracking: typeof eventTrackingSystem !== 'undefined' ? {
            activeEvents: eventTrackingSystem.activeEvents,
            eventHistory: eventTrackingSystem.eventHistory,
            hiddenEffects: eventTrackingSystem.hiddenEffects
        } : null,
        badgeSystem: typeof badgeSystem !== 'undefined' ? badgeSystem : null,
        metadata: {
            playerName: gameState.player.name,
            turn: gameState.turn,
            year: gameState.year,
            netWorth: gameState.player.netWorth,
            cash: gameState.player.cash,
            financialHealth: gameState.player.financialHealth,
            characterId: gameState.player.characterId || null
        }
    };
    return state;
}

function encodeState(state) {
    const json = JSON.stringify(state);
    return btoa(unescape(encodeURIComponent(json)));
}

function decodeState(encoded) {
    const json = decodeURIComponent(escape(atob(encoded)));
    return JSON.parse(json);
}

function saveGameStateToStorage() {
    if (!window.localStorage) return;
    try {
        const state = getSerializableState();
        const encoded = encodeState(state);
        localStorage.setItem(SAVE_STORAGE_KEY, encoded);
        localStorage.setItem(`${SAVE_STORAGE_KEY}_time`, Date.now().toString());
    } catch (error) {
        console.error('Failed to save game state:', error);
    }
}

function scheduleSave() {
    if (!window.localStorage) return;
    if (saveTimeoutHandle) {
        clearTimeout(saveTimeoutHandle);
    }
    saveTimeoutHandle = setTimeout(saveGameStateToStorage, 500);
}

function loadGameStateFromStorage() {
    if (!window.localStorage) return null;
    const encoded = localStorage.getItem(SAVE_STORAGE_KEY);
    if (!encoded) return null;
    try {
        return decodeState(encoded);
    } catch (error) {
        console.error('Failed to parse saved game state:', error);
        return null;
    }
}

function clearSavedGame() {
    if (!window.localStorage) return;
    localStorage.removeItem(SAVE_STORAGE_KEY);
    localStorage.removeItem(`${SAVE_STORAGE_KEY}_time`);
}

function deepMerge(target, source) {
    Object.keys(source).forEach(key => {
        const value = source[key];
        if (Array.isArray(value)) {
            target[key] = JSON.parse(JSON.stringify(value));
        } else if (value && typeof value === 'object') {
            if (!target[key] || typeof target[key] !== 'object') {
                target[key] = {};
            }
            deepMerge(target[key], value);
        } else {
            target[key] = value;
        }
    });
}

function applyLoadedState(state) {
    if (!state) return;
    
    // Load core game state
    if (state.game) {
        deepMerge(gameState, state.game);
    }
    
    // Load bank system
    if (state.bank && typeof bankSystem !== 'undefined') {
        deepMerge(bankSystem, state.bank);
    }
    
    // Load AI system
    if (state.ai && typeof aiSystem !== 'undefined') {
        deepMerge(aiSystem, state.ai);
    }
    
    // Load opportunities
    if (state.opportunities && typeof opportunitiesSystem !== 'undefined') {
        opportunitiesSystem.playerBusinesses = state.opportunities.playerBusinesses || [];
        opportunitiesSystem.currentOpportunities = state.opportunities.currentOpportunities || {
            businesses: [],
            auctions: [],
            properties: [],
            quickInvestments: []
        };
    }
    
    // Load logs (complete history)
    if (state.logs && typeof logsSystem !== 'undefined') {
        deepMerge(logsSystem, state.logs);
    }
    
    // Load player attributes
    if (state.playerAttributes && typeof playerAttributes !== 'undefined') {
        deepMerge(playerAttributes, state.playerAttributes);
    }
    
    // Load achievements
    if (state.achievements && typeof achievementsSystem !== 'undefined') {
        if (state.achievements.achievements) {
            achievementsSystem.achievements = state.achievements.achievements;
        }
        if (state.achievements.milestones) {
            achievementsSystem.milestones = state.achievements.milestones;
        }
        if (state.achievements.unlockedAchievements) {
            achievementsSystem.unlockedAchievements = state.achievements.unlockedAchievements;
        }
        if (state.achievements.reachedMilestones) {
            achievementsSystem.reachedMilestones = state.achievements.reachedMilestones;
        }
    }
    
    // Load market economics
    if (state.marketEconomics && typeof marketEconomics !== 'undefined') {
        deepMerge(marketEconomics, state.marketEconomics);
    }
    
    // Load expanded events
    if (state.expandedEvents && typeof expandedEvents !== 'undefined') {
        if (state.expandedEvents.events) {
            expandedEvents.events = state.expandedEvents.events;
        }
        if (state.expandedEvents.offers) {
            expandedEvents.offers = state.expandedEvents.offers;
        }
        if (state.expandedEvents.incidents) {
            expandedEvents.incidents = state.expandedEvents.incidents;
        }
        if (state.expandedEvents.activeOffers) {
            expandedEvents.activeOffers = state.expandedEvents.activeOffers;
        }
        if (state.expandedEvents.activeIncidents) {
            expandedEvents.activeIncidents = state.expandedEvents.activeIncidents;
        }
    }
    
    // Load turn summary
    if (state.turnSummary && typeof turnSummary !== 'undefined') {
        if (state.turnSummary.lastTurn !== undefined) {
            turnSummary.lastTurn = state.turnSummary.lastTurn;
        }
        if (state.turnSummary.summaryData) {
            turnSummary.summaryData = state.turnSummary.summaryData;
        }
    }
    
    // Load skill tree
    if (state.skillTree && typeof skillTreeSystem !== 'undefined') {
        deepMerge(skillTreeSystem, state.skillTree);
    }
    
    // Load job market
    if (state.jobMarket && typeof jobMarketSystem !== 'undefined') {
        deepMerge(jobMarketSystem, state.jobMarket);
        // Restore player income from job
        if (jobMarketSystem.playerJob) {
            gameState.player.monthlyIncome = jobMarketSystem.playerJob.baseSalary;
        }
    }
    
    // Load quick investments
    if (state.quickInvestments && typeof quickInvestmentsSystem !== 'undefined') {
        deepMerge(quickInvestmentsSystem, state.quickInvestments);
    }
    
    // Load asset management
    if (state.assetManagement && typeof assetManagementSystem !== 'undefined') {
        deepMerge(assetManagementSystem, state.assetManagement);
    }
    
    // Load NPC contacts
    if (state.npcContacts && typeof npcContactsSystem !== 'undefined') {
        deepMerge(npcContactsSystem, state.npcContacts);
    }
    
    // Load event tracking
    if (state.eventTracking && typeof eventTrackingSystem !== 'undefined') {
        // Restore active events, history, and hidden effects
        if (state.eventTracking.activeEvents) {
            eventTrackingSystem.activeEvents = JSON.parse(JSON.stringify(state.eventTracking.activeEvents));
        }
        if (state.eventTracking.eventHistory) {
            eventTrackingSystem.eventHistory = JSON.parse(JSON.stringify(state.eventTracking.eventHistory));
        }
        if (state.eventTracking.hiddenEffects) {
            eventTrackingSystem.hiddenEffects = JSON.parse(JSON.stringify(state.eventTracking.hiddenEffects));
        }
        
        // Re-apply active effects that were saved (reset applied flag to re-apply)
        if (eventTrackingSystem.activeEvents && eventTrackingSystem.activeEvents.length > 0) {
            eventTrackingSystem.activeEvents.forEach(effect => {
                // Reset applied flag so effects can be properly restored
                effect.applied = false;
                if (typeof applyEventEffect === 'function') {
                    applyEventEffect(effect);
                }
            });
        }
    }
    
    // Load badge system
    if (state.badgeSystem && typeof badgeSystem !== 'undefined') {
        deepMerge(badgeSystem, state.badgeSystem);
    }
    
    // Restore character selection if available
    if (state.metadata && state.metadata.characterId && gameState.player) {
        gameState.player.characterId = state.metadata.characterId;
    } else if (state.game && state.game.player && state.game.player.characterId) {
        gameState.player.characterId = state.game.player.characterId;
    }
    
    // Update badges after loading (to show correct counts)
    if (typeof updateBadges === 'function') {
        updateBadges();
    }
    
    // Initialize property deterioration profiles if missing
    if (gameState.player.properties) {
        gameState.player.properties.forEach(property => {
            if (!property.condition) property.condition = 100;
            if (!property.lastMaintenance) property.lastMaintenance = gameState.turn;
            if (!property.originalValue) property.originalValue = property.value;
            if (!property.deteriorationProfile) {
                property.deteriorationProfile = 'good';
            }
        });
    }
}

function generateSaveKey() {
    const textarea = document.getElementById('exported-save-key');
    if (!textarea) return;
    const state = getSerializableState();
    const encoded = encodeState(state);
    textarea.value = encoded;
    textarea.select();
}

// Download save file
function downloadSaveFile() {
    try {
        const state = getSerializableState();
        const json = JSON.stringify(state, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const filename = `ratrace_save_${gameState.player.name || 'player'}_turn${gameState.turn}_${Date.now()}.json`;
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        if (typeof showToast === 'function') {
            showToast('Save file downloaded successfully', 'success');
        }
    } catch (error) {
        console.error('Failed to download save file:', error);
        if (typeof showToast === 'function') {
            showToast('Failed to download save file', 'error');
        }
    }
}

// Load save file
function loadSaveFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const json = e.target.result;
            const state = JSON.parse(json);
            
            // Validate save file structure
            if (!state.game || !state.game.player) {
                throw new Error('Invalid save file format');
            }
            
            applyLoadedState(state);
            saveGameStateToStorage();
            enterGameFromLoad();
            
            if (typeof showToast === 'function') {
                showToast('Game loaded from file successfully', 'success', 5000);
            }
        } catch (error) {
            console.error('Failed to load save file:', error);
            if (typeof showToast === 'function') {
                showToast('Failed to load save file. Please check the file format.', 'error', 5000);
            }
        }
    };
    reader.readAsText(file);
}

// Open instructions page with auto-save
function openInstructionsPage() {
    // Auto-save before opening instructions
    saveGameStateToStorage();
    
    // Also save to a special key for instructions page
    const state = getSerializableState();
    const encoded = encodeState(state);
    if (window.localStorage) {
        localStorage.setItem('ratrace_instructions_save', encoded);
        localStorage.setItem('ratrace_instructions_save_time', Date.now().toString());
    }
    
    // Open instructions in new tab
    window.open('instructions.html', '_blank');
    
    if (typeof showToast === 'function') {
        showToast('Game saved. Opening instructions...', 'success', 2000);
    }
}

function copySaveKey() {
    const textarea = document.getElementById('exported-save-key');
    if (!textarea || !textarea.value) return;
    textarea.select();
    document.execCommand('copy');
    if (typeof showToast === 'function') {
        showToast('Save key copied to clipboard', 'success');
    }
}

function openSaveKeyModal() {
    const modal = document.getElementById('savekey-modal');
    if (!modal) return;
    
    // Use modal manager
    if (typeof openModal === 'function') {
        if (!openModal('savekey-modal')) return;
    } else {
        modal.classList.add('active');
    }
    
    const textarea = document.getElementById('exported-save-key');
    if (textarea) textarea.value = '';
    
    // Generate save key
    generateSaveKey();
}

// Make functions globally available
window.openInstructionsPage = openInstructionsPage;
window.downloadSaveFile = downloadSaveFile;
window.loadSaveFile = loadSaveFile;

function loadGameFromKeyInput() {
    const textarea = document.getElementById('import-save-key');
    if (!textarea || !textarea.value.trim()) return;
    loadGameFromKey(textarea.value.trim(), true);
}

function loadGameFromKey(key, closeModals = false) {
    try {
        const state = decodeState(key);
        applyLoadedState(state);
        saveGameStateToStorage();
        enterGameFromLoad();
        if (closeModals) {
            document.querySelectorAll('.modal').forEach(modal => modal.classList.remove('active'));
        }
        if (typeof showToast === 'function') {
            showToast('Game loaded from key successfully', 'success', 5000);
        }
    } catch (error) {
        console.error('Invalid save key:', error);
        if (typeof showToast === 'function') {
            showToast('Invalid save key. Please try again.', 'error', 5000);
        }
    }
}

function enterGameFromLoad() {
    const overlay = document.getElementById('start-overlay');
    if (overlay) overlay.classList.remove('active');
    const charScreen = document.getElementById('character-creation');
    const gameScreen = document.getElementById('game-screen');
    if (charScreen) charScreen.classList.remove('active');
    if (gameScreen) gameScreen.classList.add('active');

    if (typeof updateDisplay === 'function') {
        updateDisplay();
    }
    if (typeof updateNeedsDisplay === 'function') {
        updateNeedsDisplay();
    }
    if (typeof updateAIDisplay === 'function') {
        updateAIDisplay();
    }
}

function initializeStartOverlay() {
    const overlay = document.getElementById('start-overlay');
    if (!overlay) return;

    // Check if returning from instructions page
    if (window.sessionStorage) {
        const savedState = sessionStorage.getItem('ratrace_load_from_instructions');
        if (savedState) {
            try {
                const state = decodeState(savedState);
                applyLoadedState(state);
                enterGameFromLoad();
                overlay.classList.remove('active');
                sessionStorage.removeItem('ratrace_load_from_instructions');
                if (typeof showToast === 'function') {
                    showToast('Game loaded from instructions page', 'success', 3000);
                }
                return; // Skip normal initialization
            } catch (error) {
                console.error('Failed to load from instructions:', error);
                sessionStorage.removeItem('ratrace_load_from_instructions');
            }
        }
    }

    const continueBtn = document.getElementById('start-continue-btn');
    const continueNote = document.getElementById('start-continue-note');
    const keyPanel = document.getElementById('start-key-panel');
    const keyBtn = document.getElementById('start-key-btn');
    const newBtn = document.getElementById('start-new-btn');
    const loadKeyBtn = document.getElementById('load-key-btn');

    const hasSave = !!localStorage.getItem(SAVE_STORAGE_KEY);
    if (continueBtn) {
        continueBtn.disabled = !hasSave;
    }
    if (continueNote) {
        continueNote.textContent = hasSave ? 'Saved progress found.' : 'No saved progress found.';
    }
    if (continueBtn && hasSave) {
        continueBtn.addEventListener('click', () => {
            const state = loadGameStateFromStorage();
            if (state) {
                applyLoadedState(state);
                enterGameFromLoad();
                overlay.classList.remove('active');
            }
        });
    }
    if (newBtn) {
        newBtn.addEventListener('click', () => {
            clearSavedGame();
            overlay.classList.remove('active');
        });
    }
    if (keyBtn && keyPanel && loadKeyBtn) {
        keyBtn.addEventListener('click', () => {
            keyPanel.classList.toggle('active');
        });
        loadKeyBtn.addEventListener('click', () => {
            const input = document.getElementById('start-key-input');
            if (!input || !input.value.trim()) {
                if (typeof showToast === 'function') {
                    showToast('Please paste a valid key', 'error', 4000);
                }
                return;
            }
            loadGameFromKey(input.value.trim());
            overlay.classList.remove('active');
        });
    }
}

window.addEventListener('beforeunload', saveGameStateToStorage);
window.addEventListener('DOMContentLoaded', initializeStartOverlay);

