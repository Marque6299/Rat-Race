// Loan Payment Modal
function openLoanPaymentModal(loanName, principal, loanIndex) {
    const modal = document.getElementById('action-modal');
    const modalBody = document.getElementById('modal-body');
    if (!modal || !modalBody) return;
    
    const loan = gameState.player.loans[loanIndex];
    if (!loan) return;
    
    // Use modal manager - allow stacking
    if (typeof openModal === 'function') {
        openModal('action-modal', false, true);
    } else {
        modal.classList.add('active');
    }
    
    const monthlyInterest = principal * loan.interestRate / 12;
    const minPayment = Math.max(principal * 0.02, monthlyInterest + 100);
    const canPayEarly = loan.terms?.allowEarlyPayoff !== false;
    
    modalBody.innerHTML = `
        <div style="background: var(--bg-dark); padding: 15px; border-radius: 10px; margin-bottom: 20px;">
            <h3 style="margin-top: 0;">${loanName}</h3>
            <div class="stat-grid">
                <div class="stat-item">
                    <label>Remaining Principal:</label>
                    <span class="money">${formatMoney(principal)}</span>
                </div>
                <div class="stat-item">
                    <label>Interest Rate:</label>
                    <span>${(loan.interestRate * 100).toFixed(2)}% APR</span>
                </div>
                <div class="stat-item">
                    <label>Monthly Payment:</label>
                    <span>~${formatMoney(minPayment)}</span>
                </div>
                <div class="stat-item">
                    <label>Your Cash:</label>
                    <span class="money">${formatMoney(gameState.player.cash)}</span>
                </div>
            </div>
        </div>
        
        <div class="modal-form-group">
            <label>Payment Amount ($):</label>
            <input type="number" id="loan-payment-amount" min="0" max="${principal}" step="100" value="${Math.min(principal, gameState.player.cash)}">
            <div style="margin-top: 10px; display: flex; gap: 10px;">
                <button class="btn-secondary" onclick="setLoanPaymentAmount(${minPayment})" style="flex: 1;">
                    Min Payment (${formatMoney(minPayment)})
                </button>
                <button class="btn-secondary" onclick="setLoanPaymentAmount(${principal})" style="flex: 1;">
                    Pay Full (${formatMoney(principal)})
                </button>
            </div>
        </div>
        
        <div id="loan-payment-preview" style="margin-top: 10px; padding: 10px; background: var(--bg-dark); border-radius: 8px; color: var(--text-secondary);"></div>
        
        ${!canPayEarly ? `
            <div style="margin-top: 15px; padding: 10px; background: rgba(239, 68, 68, 0.1); border-left: 4px solid var(--danger-color); border-radius: 8px;">
                <strong>⚠️ Early Payoff Not Allowed</strong><br>
                This loan does not allow early payoff. You can only make the minimum monthly payment.
            </div>
        ` : ''}
    `;
    
    document.getElementById('modal-title').textContent = `Pay Off: ${loanName}`;
    
    const amountInput = document.getElementById('loan-payment-amount');
    const updatePreview = () => {
        const amount = parseFloat(amountInput.value) || 0;
        const remaining = principal - amount;
        const preview = document.getElementById('loan-payment-preview');
        if (preview) {
            preview.innerHTML = `
                <strong>Payment Preview:</strong><br>
                Payment Amount: ${formatMoney(amount)}<br>
                Remaining Principal: ${formatMoney(Math.max(0, remaining))}<br>
                ${amount >= principal ? '<span style="color: var(--success-color);">Loan will be fully paid off!</span>' : ''}
            `;
        }
    };
    
    amountInput.addEventListener('input', updatePreview);
    updatePreview();
    
    // Set payment amount helper
    window.setLoanPaymentAmount = (amount) => {
        amountInput.value = Math.min(amount, principal, gameState.player.cash);
        updatePreview();
    };
    
    document.getElementById('modal-confirm').onclick = () => {
        const amount = parseFloat(amountInput.value) || 0;
        processLoanPayment(loanIndex, amount);
    };
    document.getElementById('modal-confirm').textContent = 'Make Payment';
    document.getElementById('modal-confirm').style.display = 'block';
    document.getElementById('modal-cancel').style.display = 'block';
}

function processLoanPayment(loanIndex, amount) {
    const loan = gameState.player.loans[loanIndex];
    if (!loan) {
        if (typeof showToast === 'function') {
            showToast('Loan not found', 'error');
        }
        closeModal();
        return;
    }
    
    if (amount <= 0) {
        if (typeof showToast === 'function') {
            showToast('Please enter a valid amount', 'error');
        }
        return;
    }
    
    if (amount > loan.principal) {
        amount = loan.principal; // Cap at principal
    }
    
    if (gameState.player.cash < amount) {
        if (typeof showToast === 'function') {
            showToast('Insufficient cash', 'error');
        }
        return;
    }
    
    const canPayEarly = loan.terms?.allowEarlyPayoff !== false;
    const monthlyInterest = loan.principal * loan.interestRate / 12;
    const minPayment = Math.max(loan.principal * 0.02, monthlyInterest + 100);
    
    // Check if early payoff is allowed
    if (!canPayEarly && amount > minPayment) {
        if (typeof showToast === 'function') {
            showToast('This loan does not allow early payoff. Maximum payment: ' + formatMoney(minPayment), 'error');
        }
        return;
    }
    
    gameState.player.cash -= amount;
    loan.principal -= amount;
    
    // Log transaction
    if (typeof logTransaction === 'function') {
        logTransaction('loan', `Loan payment: ${loan.name}`, -amount, {
            loanName: loan.name,
            remainingPrincipal: loan.principal,
            isFullPayoff: loan.principal < 1
        });
    }
    
    // Record payment in credit history
    if (typeof bankSystem !== 'undefined') {
        bankSystem.creditHistory.push({
            turn: gameState.turn,
            type: 'payment',
            amount: amount
        });
    }
    
    if (loan.principal < 1) {
        // Loan paid off
        const index = gameState.player.loans.indexOf(loan);
        gameState.player.loans.splice(index, 1);
        if (typeof showToast === 'function') {
            showToast(`Loan ${loan.name} paid off completely!`, 'success');
        }
        addStory(`🎉 You paid off ${loan.name} completely!`);
    } else {
        if (typeof showToast === 'function') {
            showToast(`Paid ${formatMoney(amount)} towards ${loan.name}`, 'success');
        }
        addStory(`You made a payment of ${formatMoney(amount)} towards ${loan.name}.`);
    }
    
    closeModal();
    updateDisplay();
    
    // Refresh loans modal if open
    if (typeof displayBankContent === 'function') {
        displayBankContent('loans');
    }
    if (typeof openLoansModal === 'function') {
        // Refresh loans modal content
        const content = document.getElementById('loans-modal-content');
        if (content) {
            // Trigger refresh by closing and reopening
            setTimeout(() => {
                openLoansModal();
            }, 100);
        }
    }
}

// Make functions globally available
window.openLoanPaymentModal = openLoanPaymentModal;
window.processLoanPayment = processLoanPayment;

