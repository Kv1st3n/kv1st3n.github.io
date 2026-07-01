let currentBalance = 100000;
let stockPrice = 500;
let currentOption = [1, 5, 10, 100];
let currentOptionChoice = currentOption[0]; // Defaults to 1 share
let ownedShares = 0;

export function initFinance() {
    const windowEl = document.getElementById('prog-finance-app');

    if (!windowEl) {
        return;
    }
    console.log("Finance App System Initialized...");

    setupFinanceListener(windowEl);

    setInterval(() => {
        simulatedMarketTick();
        updateFinanceUI(windowEl);
    }, 1500);
}

function setupFinanceListener(windowEl) {
    const buyBtn = windowEl.querySelector('.buy-btn');
    const sellBtn = windowEl.querySelector('.sell-btn');
    const amountSelect = windowEl.querySelector('.stock-amount-select');

    if (buyBtn) {
        buyBtn.addEventListener('click', () => buyMarketStock(windowEl));
    }

    if (sellBtn) {
        sellBtn.addEventListener('click', () => sellMarketStock(windowEl));
    }

    if (amountSelect) {
        amountSelect.addEventListener('change', (e) => {
            currentOptionChoice = parseInt(e.target.value);
            console.log("Selected amount altered to:", currentOptionChoice);
        });
    }
}

function simulatedMarketTick() {
    stockPrice += (Math.random() - 0.5) * 5;
    if (stockPrice < 1) {
        stockPrice = 1;
    }
}

// choose amount to buy / sell 1, 5, 10, 100

function buyMarketStock(windowEl) {

    const totalCost = stockPrice * currentOptionChoice;

    if (currentBalance >= totalCost) {
        currentBalance -= totalCost;
        ownedShares += currentOptionChoice;
        // perform buy
        console.log(`Bought ${currentOptionChoice} shares for $${totalCost.toFixed(2)}`);
    } else {
        console.log("Insufficient funds for transaction!");
    }
    updateFinanceUI(windowEl);
}

function sellMarketStock(windowEl) {

    if (ownedShares >= currentOptionChoice) {
        ownedShares -= currentOptionChoice;

        const totalEarnings = currentOptionChoice * stockPrice;

        currentBalance += totalEarnings;
        console.log(`Sold ${currentOptionChoice} shares for $${totalEarnings.toFixed(2)}`);
    } else {
        console.log("Not enough shares to complete sale!");
    }
    updateFinanceUI(windowEl);
}

function updateFinanceUI(windowEl) {
    const balanceDisplay = windowEl.querySelector('.ui-balance');
    const priceDisplay = windowEl.querySelector('.ui-stock-price');
    const portfolioDisplay = windowEl.querySelector('.ui-owned-shares');

    if (balanceDisplay) {
        balanceDisplay.textContent = currentBalance.toFixed(2);
    }

    if (priceDisplay) {
        priceDisplay.textContent = stockPrice.toFixed(2);
    }

    if (portfolioDisplay) {
        portfolioDisplay.textContent = ownedShares;
    }
}