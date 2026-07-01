let currentBalance = 100000;
let stockPrice = 500;
let currentOption = [1, 5, 10, 100];
let currentOptionChoice = currentOption[0]; // Defaults to 1 share
let ownedShares = 0;

let priceHistory = [500]; 
const MAX_POINTS = 30;

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
        drawFinanceChart();
    }, 1500);
}

function setupFinanceListener(windowEl) {
    const buyBtn = windowEl.querySelector('.buy-btn');
    const sellBtn = windowEl.querySelector('.sell-btn');
    const amountSelect = windowEl.querySelector('.stock-amount-select');

    if (buyBtn) {
        buyBtn.addEventListener('pointerdown', () => buyMarketStock(windowEl));
    }

    if (sellBtn) {
        sellBtn.addEventListener('pointerdown', () => sellMarketStock(windowEl));
    }

    if (amountSelect) {
        amountSelect.addEventListener('change', (e) => {
            currentOptionChoice = parseInt(e.target.value);
            console.log("Selected amount altered to:", currentOptionChoice);
        });
    }
}


// expand with more randomness, for market crash or exceeding growth
function simulatedMarketTick() {
    stockPrice += (Math.random() - 0.5) * 7;
    if (stockPrice < 1) {
        stockPrice = 1;
    }

    priceHistory.push(stockPrice);
    if (priceHistory.length > MAX_POINTS) {
        priceHistory.shift();
    }
}

function drawFinanceChart() {
    const canvas = document.getElementById('financeChart');

    if (!canvas) {
        return;
    }

    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#003300';
    ctx.lineWidth = 1;
    for (let i = 20; i < canvas.width; i += 20) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
    }
    for (let i = 20; i < canvas.height; i += 20) {
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
    }

    if (priceHistory.length < 2) {
        return;
    }

    const minPrice = Math.min(...priceHistory) * 0.95;
    const maxPrice = Math.max(...priceHistory) * 1.05;
    const priceRange = maxPrice - minPrice || 1;

    ctx.strokeStyle = '#55FF55';
    ctx.lineWidth = 2;
    ctx.shadowBlur = 4;
    ctx.shadowColor = '#55FF55';
    ctx.beginPath();

    const xSpacing = canvas.width / (MAX_POINTS - 1);

    priceHistory.forEach((price, index) => {
        const x = index * xSpacing;
        const y = canvas.height - ((price - minPrice) / priceRange) * canvas.height;

        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.stroke();
    ctx.shadowBlur = 0;
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