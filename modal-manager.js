// Modal Manager System - Handles modal hierarchy and prevents conflicts
const modalManager = {
    activeModals: [],
    modalStack: [],
    zIndexBase: 1000,
    
    // Modal priority levels (higher = more important, stays on top)
    priorities: {
        'savekey-modal': 100,
        'action-modal': 90,
        'turn-summary-modal': 85,
        'logs-modal': 95, // High priority to display over other modals
        'player-profile-modal': 75, // Profile modal priority
        'markets-modal': 80,
        'investment-modal': 80,
        'bank-modal': 70,
        'portfolio-modal': 60,
        'loans-modal': 60,
        'properties-modal': 60,
        'needs-modal': 60,
        'habits-modal': 60,
        'monthly-details-modal': 60,
        'start-overlay': 200 // Highest priority
    },
    
    // Modal groups - only one modal per group can be open
    groups: {
        'main-actions': ['action-modal', 'markets-modal', 'investment-modal'],
        'banking': ['bank-modal', 'loans-modal'],
        'info': ['portfolio-modal', 'properties-modal', 'needs-modal', 'habits-modal', 'monthly-details-modal'],
        // logs-modal removed from groups so it can stack over any modal
        'system': ['savekey-modal', 'start-overlay', 'turn-summary-modal']
    }
};

// Get modal group for a modal ID
function getModalGroup(modalId) {
    for (const [group, modals] of Object.entries(modalManager.groups)) {
        if (modals.includes(modalId)) {
            return group;
        }
    }
    return null;
}

// Check if modal can be opened (check for conflicts)
function canOpenModal(modalId) {
    const group = getModalGroup(modalId);
    
    // Check if a modal from the same group is already open
    if (group) {
        const groupModals = modalManager.groups[group];
        const hasOpenGroupModal = modalManager.activeModals.some(id => groupModals.includes(id));
        if (hasOpenGroupModal && !modalManager.activeModals.includes(modalId)) {
            return { canOpen: false, reason: `Another ${group} modal is already open` };
        }
    }
    
    return { canOpen: true };
}

// Open modal with hierarchy management
function openModal(modalId, force = false, allowStacking = false) {
    const modal = document.getElementById(modalId);
    if (!modal) {
        console.warn(`Modal ${modalId} not found`);
        return false;
    }
    
    // Check if already open
    if (modalManager.activeModals.includes(modalId) && !force) {
        return true; // Already open, no need to reopen
    }
    
    // Check for conflicts
    if (!force && !allowStacking) {
        const check = canOpenModal(modalId);
        if (!check.canOpen) {
            if (typeof showToast === 'function') {
                showToast(check.reason, 'warning', 3000);
            }
            return false;
        }
    }
    
    // Close conflicting modals in the same group (unless stacking is allowed)
    const group = getModalGroup(modalId);
    if (group && !force && !allowStacking) {
        const groupModals = modalManager.groups[group];
        groupModals.forEach(id => {
            if (id !== modalId && modalManager.activeModals.includes(id)) {
                closeModalById(id, true); // Close silently
            }
        });
    }
    
    // Add to active modals
    if (!modalManager.activeModals.includes(modalId)) {
        modalManager.activeModals.push(modalId);
    }
    
    // Add to stack
    modalManager.modalStack.push({
        id: modalId,
        priority: modalManager.priorities[modalId] || 50,
        timestamp: Date.now()
    });
    
    // Sort stack by priority (higher priority on top)
    modalManager.modalStack.sort((a, b) => b.priority - a.priority);
    
    // Update z-index for all modals
    updateModalZIndexes();
    
    // Show modal
    modal.classList.add('active');
    
    // Prevent body scroll when modal is open
    if (modalManager.activeModals.length === 1) {
        document.body.style.overflow = 'hidden';
    }
    
    return true;
}

// Close modal
function closeModalById(modalId, silent = false) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    // Remove from active modals
    modalManager.activeModals = modalManager.activeModals.filter(id => id !== modalId);
    
    // Remove from stack
    modalManager.modalStack = modalManager.modalStack.filter(m => m.id !== modalId);
    
    // Hide modal
    modal.classList.remove('active');
    
    // Update z-indexes
    updateModalZIndexes();
    
    // Restore body scroll if no modals open
    if (modalManager.activeModals.length === 0) {
        document.body.style.overflow = '';
    }
    
    if (!silent && typeof showToast === 'function') {
        // Optional: show close notification for debugging
        // showToast(`Closed ${modalId}`, 'info', 1000);
    }
}

// Close all modals
function closeAllModals(except = []) {
    const toClose = modalManager.activeModals.filter(id => !except.includes(id));
    toClose.forEach(id => closeModalById(id, true));
}

// Close top modal (for ESC key)
function closeTopModal() {
    if (modalManager.modalStack.length === 0) return;
    
    const topModal = modalManager.modalStack[0];
    closeModalById(topModal.id);
}

// Update z-indexes based on stack order and priority
function updateModalZIndexes() {
    modalManager.modalStack.forEach((modal, index) => {
        const element = document.getElementById(modal.id);
        if (element) {
            const priority = modalManager.priorities[modal.id] || 50;
            // Higher priority modals get higher z-index, with stack order as tiebreaker
            const zIndex = modalManager.zIndexBase + priority + (modalManager.modalStack.length - index);
            element.style.zIndex = zIndex;
            
            // Extra boost for logs modal to ensure it's always on top
            if (modal.id === 'logs-modal') {
                element.style.zIndex = zIndex + 50;
            }
        }
    });
}

// Initialize modal manager
function initializeModalManager() {
    // Close modals when clicking outside (only for top modal)
    document.addEventListener('click', (e) => {
        if (modalManager.modalStack.length === 0) return;
        
        const topModal = modalManager.modalStack[0];
        const modal = document.getElementById(topModal.id);
        
        if (modal && e.target === modal) {
            // Only close if clicking the backdrop (not content)
            const modalContent = modal.querySelector('.modal-content');
            if (modalContent && !modalContent.contains(e.target)) {
                closeTopModal();
            }
        }
    });
    
    // ESC key closes top modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalManager.modalStack.length > 0) {
            // Don't close start overlay with ESC
            const topModal = modalManager.modalStack[0];
            if (topModal.id !== 'start-overlay') {
                closeTopModal();
                e.preventDefault();
            }
        }
    });
    
    // Setup close buttons for all modals
    document.querySelectorAll('.modal .close').forEach(closeBtn => {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const modal = closeBtn.closest('.modal');
            if (modal) {
                closeModalById(modal.id);
            }
        });
    });
}

// Expose functions globally
window.openModal = openModal;
window.closeModalById = closeModalById;
window.closeAllModals = closeAllModals;
window.closeTopModal = closeTopModal;

// Override existing closeModal function
const originalCloseModal = typeof closeModal !== 'undefined' ? closeModal : null;
window.closeModal = function() {
    closeModalById('action-modal');
};

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeModalManager);
} else {
    initializeModalManager();
}

