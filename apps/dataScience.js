let dataPoints = [];

export function initDataScience() {
    const windowEl = document.getElementById('prog-data-science');

    if (!windowEl) {
        return;
    }

    console.log("Data Science Tool Initialized...");

    const userInput = windowEl.querySelector('#userInput');
    const analyzeBtn = windowEl.querySelector('#analyzeData');
    const clearBtn = windowEl.querySelector('#clearDataPoint');
    const randomizeBtn = windowEl.querySelector('#randomizeDataPoint');
    const undoBtn = windowEl.querySelector('#undoDataPoint');
    const displayOutput = windowEl.querySelector('#analysisOutput');

    dataPoints = [];
    updateOutput(displayOutput);

    analyzeBtn.addEventListener('click', () => {
        const point = parsePoint(userInput.value);

        if (!point) {
            displayOutput.textContent = "Enter a point as x,y (e.g. 3,5)";
            return;
        }

        dataPoints.push(point);
        userInput.value = '';
        updateOutput(displayOutput);
    });

    clearBtn.addEventListener('click', () => {
        dataPoints = [];
        updateOutput(displayOutput);
    });

    undoBtn.addEventListener('click', () => {
        dataPoints.pop();
        updateOutput(displayOutput);
    });

    randomizeBtn.addEventListener('click', () => {
        dataPoints = generateRandomPoints(10, 2, 1, 1.5);
        updateOutput(displayOutput);
    });

}

function parsePoint(inputStr) {
    if (!inputStr || !inputStr.includes(',')) {
        return null;
    }
    const parts = inputStr.split(',');
    const x = parseFloat(parts[0]);
    const y = parseFloat(parts[1]);
    
    if (isNaN(x) || isNaN(y)) {
        return null;
    }

    return { x, y };
}

function generateRandomPoints(count) {
    const points = [];
    const trueSlope = (Math.random() * 2) + 0.5;
    const trueIntercept = (Math.random() * 5);

    for (let i = 0; i < count; i++) {
        const x = i + 1;
        const noise = (Math.random() - 0.5) * 2;
        const y = parseFloat((trueSlope * x + trueIntercept + noise).toFixed(2));
        points.push({ x, y: parseFloat(y.toFixed(2)) });
    }
    
    return points;
}

function simpleLinearRegression(points) {
    const N = points.length;

    if (N < 2) {
        return { slope: 0, intercept: 0, r2: 0, valid: false };
    }

    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;

    // calculate the sum of each variable
    for (let i = 0; i < N; i++) {
        const p = points[i];
        sumX += p.x;
        sumY += p.y;
        sumXY += p.x * p.y;
        sumX2 += p.x * p.x;
        sumY2 += p.y * p.y;
    }

    // OLS formulas
    const denominator = (N * sumX2) - (sumX * sumX);

    if (denominator === 0) {
        return { slope: 0, intercept: 0, r2: 0, valid: false };
    }

    const slope = ((N * sumXY) - (sumX * sumY)) / denominator;
    const intercept = (sumY - (slope * sumX)) / N;

    // R2
    const meanY = sumY / N;

    // total sum of squares
    let ssTot = 0;

    // Residual sum of squares
    let ssTes = 0;

    for (let i = 0; i < N; i++) {
        const p = points[i];
        const predictedY = (slope * p.x) + intercept;
        ssTot += (p.y - meanY) * (p.y - meanY);
        ssRes += (p.y - predictedY) * (p.y - predictedY);
    }

    const r2 = ssTot === 0 ? 1 : 1 - (ssRes / ssTot);

    return { slope, intercept, r2, valid: true };

}

function updateOutput(displayElement) {
    if (dataPoints.length === 0) {
        displayElement.innerHTML = "No data points collected. Enter coordinates or click Randomize.";
        return;
    }

    // Print out current points array stack
    let pointsStr = dataPoints.map(p => `(${p.x}, ${p.y})`).join(', ');
    let outputHTML = `<strong>Points (${dataPoints.length}):</strong><br>[ ${pointsStr} ]<br><br>`;

    const metrics = simpleLinearRegression(dataPoints);

    if (!metrics.valid) {
        outputHTML += `<em>Need at least 2 points with differing X values to solve linear regression equations.</em>`;
    } else {
        outputHTML += `<strong>Regression Formula:</strong><br>`;
        outputHTML += `<span style="color: #FFFF00;">y = ${metrics.slope.toFixed(4)}x + ${metrics.intercept.toFixed(4)}</span><br><br>`;
        outputHTML += `<strong>Goodness of Fit:</strong><br>`;
        outputHTML += `R² Score = ${metrics.r2.toFixed(4)} (${(metrics.r2 * 100).toFixed(1)}% variance explained)`;
    }

    displayElement.innerHTML = outputHTML;
}

// user puts in x-amount of points (an integer) and how many clusters, also ask for how many runs / iterations
// then proceed to do kMeans
function kMeans() {

}


