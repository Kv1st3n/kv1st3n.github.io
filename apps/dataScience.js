let dataPoints = [];

export function initDataScience() {
    const windowEl = document.getElementById('prog-data-science');

    if (!windowEl) {
        return;
    }

    console.log("Data Science Tool Initialized...");

    // regression
    const userInput = windowEl.querySelector('#userInput');
    const analyzeBtn = windowEl.querySelector('#analyzeData');
    const clearBtn = windowEl.querySelector('#clearDataPoint');
    const randomizeBtn = windowEl.querySelector('#randomizeDataPoint');
    const undoBtn = windowEl.querySelector('#undoDataPoint');
    const displayOutput = windowEl.querySelector('#analysisOutput');

    // kmeans
    const kmeansInput = windowEl.querySelector('#kmeansInput');
    const clustersInput = windowEl.querySelector('#clustersInput');
    const addPoints = windowEl.querySelector('#addPoints');
    const runBtn = windowEl.querySelector("#runKMeans");
    const clearPoints = windowEl.querySelector('#clearPoints');

    let kmeansPoints = [];
    let clusterCount;
    let clusterCentroids = [];
    // regression

    dataPoints = [];
    updateOutput(displayOutput);

    analyzeBtn.addEventListener('click', () => {

        if (!userInput.value.trim()) {
            alert("Please type a coordinate first!"); 
            return;
        }

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

    // kmeans
    addPoints.addEventListener('click', () => {
        const rawValue = kmeansInput.value.trim();
        const rawClusters = clustersInput.value.trim();

        if (!rawValue) {
            alert("Please enter amount of points (whole numbers).");
            return;
        }

        if (!rawClusters) {
            alert("Please enter an amount of clusters (whole numbers).");
            return;
        }

        const count = parseInt(rawValue, 10);
        clusterCount = parseInt(rawClusters, 10);

        if (isNaN(count) || count <= 0) {
            alert("Please enter a whole number greater than 0 for points.");
            return;
        }

        if (isNaN(clusterCount) || clusterCount <= 0) {
            alert("Please enter a whole number greater than 0 for clusters.");
            return;
        }

        kmeansPoints = generateRandomPointsForKmeans(count);
        clusterCentroids = initializeCentroids(kmeansPoints, clusterCount);
        kmeansInput.value = '';
        clustersInput.value = '';

        const initialGroups = {0: kmeansPoints};
        drawPoints(initialGroups, clusterCentroids);
    });

    runBtn.addEventListener('click', () => {
        drawPoints(kmeansPoints, clusterCount);
    });

    clearPoints.addEventListener('click', () => {
        if (kmeansPoints.length === 0 || clusterCenters.length === 0) {
            alert("Please generate data points first!");
            return;
        }

        const result = runKMeansIteration(kmeansPoints, clusterCenters);

        clusterCenters = result.newCenters;
        
        drawPoints(result.grouped, clusterCenters);
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

function generateRandomPoints(count, noiseScale = 1, minSlope = 0.5, slopeRange = 2) {
    const points = [];
    const trueSlope = (Math.random() * slopeRange) + minSlope;
    const trueIntercept = (Math.random() * 5);
 
    for (let i = 0; i < count; i++) {
        const x = i + 1;
        const noise = (Math.random() - 0.5) * 2 * noiseScale;
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
    let ssRes = 0;

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
function getDistance(point1, point2) {
    const dx = point1.x - point2.x;
    const dy = point1.y - point2.y;

    return Math.sqrt(dx * dx + dy * dy);
}

// initalize k-amount of random points, each being unique and random
// points is the list of kmeanspoints, k is the amount of centroids
function initializeCentroids(points, k) {
    const shuffledPoints = [...points].sort(() => 0.5 - Math.random());
    return shuffledPoints.slice(0, k).map(p => ({ x: p.x, y: p.y }));
}

function runKMeansIteration(points, centers) {

    const grouped = Object.groupBy(points, (point) => {
        let closestCenterIndex = 0;
        let minDistance = Infinity;

        centers.forEach((center, index) => {
            const dist = getDistance(point, center);
            if (dist < minDistance) {
                minDistance = dist;
                closestCenterIndex = index;
            }
        });

        return closestCenterIndex;
    });

    const newCenters = centers.map((oldCenter, centerIndex) => {
        const pointsInCluster = grouped[centerIndex];
        
        if (!pointsInCluster || pointsInCluster.length === 0) {
            return { ...oldCenter };
        }

        const sumX = pointsInCluster.reduce((sum, p) => sum + p.x, 0);
        const sumY = pointsInCluster.reduce((sum, p) => sum + p.y, 0);

        return {
            x: sumX / pointsInCluster.length,
            y: sumY / pointsInCluster.length
        };
    });

    return { grouped, newCenters };
    // group by the points with the centers, (i.e. the initialized centroids at first)
    // then iteratively update the center point, compare with getDistance, etc
}

function generateRandomPointsForKmeans(count) {
    const canvas = document.getElementById('kMeansChart');
    const points = [];

    for (let i = 0; i < count; i++) {
        points.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height
        });
    }

    return points;
}

function drawPoints(groupedPoints, centers) {
    const canvas = document.getElementById('kMeansChart');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const k = centers.length;

    // split the points into different groups
    Object.keys(groupedPoints).forEach((groupIndex) => {
        const points = groupedPoints[groupIndex];
        const hue = (groupIndex * (360 / k));
        
        ctx.fillStyle = `hsl(${hue}, 85%, 55%)`;
        points.forEach(point => {
            ctx.beginPath();
            ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
            ctx.fill();
        });
    });

    centers.forEach((center, index) => {
        const hue = (index * (360 / k));
        
        ctx.strokeStyle = '#000000';
        ctx.fillStyle = `hsl(${hue}, 100%, 40%)`;
        ctx.lineWidth = 3;

        ctx.beginPath();
        // Draw a larger circle with a black border for the center
        ctx.arc(center.x, center.y, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    });
}

function clearCanvas() {
    const canvas = document.getElementById('kMeansChart');
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);
}


