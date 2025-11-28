const SAVE_STORAGE_KEY = 'ratRaceSaveV1';
let saveTimeoutHandle = null;

function getSerializableState() {
    const state = {
        game: gameState,
        bank: typeof bankSystem !== 'undefined' ? bankSystem : null,
        ai: typeof aiSystem !== 'undefined' ? aiSystem : null,
        opportunities: typeof opportunitiesSystem !== 'undefined' ? {
            playerBusinesses: opportunitiesSystem.playerBusinesses,
            currentOpportunities: opportunitiesSystem.currentOpportunities
        } : null,
        logs: typeof logsSystem !== 'undefined' ? logsSystem : null
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
    if (state.game) {
        deepMerge(gameState, state.game);
    }
    if (state.bank && typeof bankSystem !== 'undefined') {
        deepMerge(bankSystem, state.bank);
    }
    if (state.ai && typeof aiSystem !== 'undefined') {
        deepMerge(aiSystem, state.ai);
    }
    if (state.opportunities && typeof opportunitiesSystem !== 'undefined') {
        opportunitiesSystem.playerBusinesses = state.opportunities.playerBusinesses || [];
        opportunitiesSystem.currentOpportunities = state.opportunities.currentOpportunities || {
            businesses: [],
            auctions: [],
            properties: [],
            quickInvestments: []
        };
    }
    if (state.logs && typeof logsSystem !== 'undefined') {
        deepMerge(logsSystem, state.logs);
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
    const textarea = document.getElementById('exported-save-key');
    if (textarea) textarea.value = '';
    modal.classList.add('active');
}

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

