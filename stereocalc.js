const getElement = id => document.getElementById(id);
function calculate() {
    // define 3D display (in mm)
    const Z = parseFloat(getElement('viewingDistance').value);
    const N = parseFloat(getElement('nearDepthBudget').value);
    const F = parseFloat(getElement('farDepthBudget').value);
    const W = parseFloat(getElement('screenWidth').value);
    const X = parseFloat(getElement('screenWidthResolution').value);

    // define the viewer
    const E = parseFloat(getElement('eyeSeparation').value);

    // calculate screen disparities
    const dN = getdN(N, E, Z);
    getElement('nearDisparity').textContent = dN.toFixed(2);
    const dF = getdF(F, E, Z);
    getElement('farDisparity').textContent = dF.toFixed(2);
    const R = getR(dN, dF);
    getElement('disparityRatio').textContent = R.toFixed(2);

    // define the scene
    const Nc = parseFloat(getElement('nearestObject').value);
    const Fc = parseFloat(getElement('furthestObject').value);
    const Aa = getAa(N, F, Fc, Nc);
    getElement('depthAspectRatio').textContent = Aa.toFixed(2);

    // cyclopian (Centre) camera Setup
    const FL = parseFloat(getElement('focalLength').value);
    const C = parseFloat(getElement('sensorWidth').value);
    const theta = getTheta(FL, C);
    getElement('TAN').textContent = theta.toFixed(4);
    const FoV = getFoV(FL, C);
    getElement('fieldOfView').textContent = FoV.toFixed(2);
    const Zc = getZc(R, Nc, Fc);
    getElement('virtualScreenDistanceInScene').textContent = Zc.toFixed(2);
    const Wc = getWc(Zc, theta);
    getElement('virtualScreenWidth').textContent = Wc.toFixed(2);

    // camera separation
    const A = getA(Zc, theta, dN, Nc, W);
    getElement('cameraSeparation').textContent = A.toFixed(2);
    const Crop = getCrop(A, Wc);
    getElement('croppingPercentage').textContent = (Crop * 100).toFixed(2) + '%';
    const Cpix = getCpix(Crop, X);
    getElement('croppingPixels').textContent = Math.round(Cpix);
    const Cout = getCout(Cpix, X);
    getElement('croppingTo').textContent = Math.round(Cout);
}

// calculation functions
const getdN = (N, E, Z) => (N * E) / (Z - N);
const getdF = (F, E, Z) => (F * E) / (Z + F);
const getR = (dN, dF) => dN / dF;
const getAa = (N, F, Fc, Nc) => (N + F) / (Fc - Nc);
const getTheta = (FL, C) => (C / 2) / FL;
const getFoV = (FL, C) => 2 * (Math.atan((C/2) / FL) * (180 / Math.PI));
const getZc = (R, Nc, Fc) => (R + 1) / ((1 / Nc) + (R / Fc));
const getWc = (Zc, theta) => 2 * Zc * theta;
const getA = (Zc, theta, dN, Nc, W) => (2 * Zc * theta * dN * Nc) / (W * (Zc - Nc) + dN * Nc);
const getCrop = (A, Wc) => A / (Wc + A);
const getCpix = (Crop, X) => Crop * X;
const getCout = (Cpix, X) => X - Cpix;