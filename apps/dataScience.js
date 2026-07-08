

export function initDataScience() {
    const windowEl = document.getElementById('prog-data-science');

    if (!windowEl) {
        return;
    }

    console.log("Data Science Tool Initialized...");

}

function simpleLinearRegression() {
    let x;
    let intercept;
    let slope;
    let epsilon;

    let y = intercept + (slope * x) + epsilon;

}

// takes in two arrays
function leastSumOfSquares(y, yHat) {

    const N = yHat.length();

    if (N === 0) {
        return {slope: 0, intercept: 0, predict: (yHat) => 0};
    }



}

// user puts in x-amount of points (an integer) and how many clusters, also ask for how many runs / iterations
// then proceed to do kMeans
function kMeans() {

}


