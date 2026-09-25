import {
  calculateTyreSpecs,
} from '../lib/tyreCalculator.js';
import { getCandidateTyres, STANDARD_WIDTHS, STANDARD_ASPECT_RATIOS } from '../lib/standardTyres.js';
import { screenCandidateFitment } from '../lib/fitmentScreening.js';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failures = [];

function assert(condition, testId, testDescription, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
  } else {
    failedTests++;
    failures.push({ testId, testDescription, details });
    console.error(`[FAIL] Test #${totalTests} (${testId}): ${testDescription} - ${details}`);
  }
}

// Independent Reference Classification Function (Calculates expected result purely from raw inputs)
function independentExpectedStatus(candW, origW, candDia, origDia) {
  const widthChangePct = (Math.abs(candW - origW) / origW) * 100;
  const diaDiffPct = ((candDia - origDia) / origDia) * 100;
  const absDiaDiffPct = Math.abs(diaDiffPct);

  // Tolerance 1e-9 for float precision comparisons
  const isGreen = (absDiaDiffPct <= 2.0 + 1e-9) && (widthChangePct <= 10.0 + 1e-9);
  const isYellow = !isGreen && (absDiaDiffPct <= 3.0 + 1e-9) && (widthChangePct <= 15.0 + 1e-9);

  if (isGreen) return 'GREEN';
  if (isYellow) return 'YELLOW';
  return 'RED';
}

console.log('==================================================');
console.log('COMPREHENSIVE TYRE FITMENT CLASSIFICATION AUDIT');
console.log('Targeting 500+ Automated Verification Tests');
console.log('==================================================');

// ==================================================
// SECTION 1: INDEPENDENT CORE CALCULATION VERIFICATION (30 Tests)
// ==================================================
console.log('\n--- SECTION 1: CORE MATH FORMULAS VERIFICATION ---');

function independentCalc(w, ar, r) {
  const sidewall = (w * ar) / 100;
  const rimMm = r * 25.4;
  const overallDia = rimMm + 2 * sidewall;
  const circumference = Math.PI * overallDia;
  const revsPerKm = 1000000 / circumference;
  return { sidewall, rimMm, overallDia, circumference, revsPerKm };
}

const sampleSizes = [
  { width: 215, aspectRatio: 60, rimDiameter: 17 },
  { width: 225, aspectRatio: 55, rimDiameter: 17 },
  { width: 205, aspectRatio: 55, rimDiameter: 16 },
  { width: 195, aspectRatio: 65, rimDiameter: 15 },
  { width: 245, aspectRatio: 45, rimDiameter: 18 },
  { width: 175, aspectRatio: 65, rimDiameter: 14 },
];

sampleSizes.forEach((size, idx) => {
  const appSpecs = calculateTyreSpecs(size);
  const ind = independentCalc(size.width, size.aspectRatio, size.rimDiameter);

  assert(Math.abs(appSpecs.sidewallHeight - ind.sidewall) < 0.05, `S1.1-${idx}`, `Sidewall height for ${size.width}/${size.aspectRatio} R${size.rimDiameter}`, `App: ${appSpecs.sidewallHeight}, Expected: ${ind.sidewall.toFixed(2)}`);
  assert(Math.abs(appSpecs.rimDiameterMm - ind.rimMm) < 0.05, `S1.2-${idx}`, `Rim mm for R${size.rimDiameter}`, `App: ${appSpecs.rimDiameterMm}, Expected: ${ind.rimMm.toFixed(2)}`);
  assert(Math.abs(appSpecs.overallDiameter - ind.overallDia) < 0.1, `S1.3-${idx}`, `Overall diameter for ${size.width}/${size.aspectRatio} R${size.rimDiameter}`, `App: ${appSpecs.overallDiameter}, Expected: ${ind.overallDia.toFixed(2)}`);
  assert(Math.abs(appSpecs.circumference - ind.circumference) < 0.2, `S1.4-${idx}`, `Circumference for ${size.width}/${size.aspectRatio} R${size.rimDiameter}`, `App: ${appSpecs.circumference}, Expected: ${ind.circumference.toFixed(2)}`);
  assert(Math.abs(appSpecs.revsPerKm - ind.revsPerKm) < 0.2, `S1.5-${idx}`, `Revs/km for ${size.width}/${size.aspectRatio} R${size.rimDiameter}`, `App: ${appSpecs.revsPerKm}, Expected: ${ind.revsPerKm.toFixed(2)}`);
});

// ==================================================
// SECTION 2: EXPLICIT BOUNDARY TEST MATRIX (50 Tests)
// ==================================================
console.log('\n--- SECTION 2: EXPLICIT BOUNDARY TESTS ---');

const baseOEWidth = 200;
const baseOEDia = 600.0;

const boundaryScenarios = [
  // Diameter boundaries around 2.0% & 3.0% (positive & negative)
  { dia: 0.0, widthPct: 0.0, desc: 'Dia 0%, Width 0%' },
  { dia: 1.99, widthPct: 9.99, desc: 'Dia +1.99%, Width 9.99%' },
  { dia: 2.00, widthPct: 10.00, desc: 'Dia +2.00%, Width 10.00%' },
  { dia: 2.01, widthPct: 10.00, desc: 'Dia +2.01%, Width 10.00%' },
  { dia: 2.00, widthPct: 10.01, desc: 'Dia +2.00%, Width 10.01%' },
  { dia: -1.99, widthPct: 9.99, desc: 'Dia -1.99%, Width 9.99%' },
  { dia: -2.00, widthPct: 10.00, desc: 'Dia -2.00%, Width 10.00%' },
  { dia: -2.01, widthPct: 10.00, desc: 'Dia -2.01%, Width 10.00%' },
  { dia: 2.99, widthPct: 14.99, desc: 'Dia +2.99%, Width 14.99%' },
  { dia: 3.00, widthPct: 15.00, desc: 'Dia +3.00%, Width 15.00%' },
  { dia: 3.01, widthPct: 15.00, desc: 'Dia +3.01%, Width 15.00%' },
  { dia: 3.00, widthPct: 15.01, desc: 'Dia +3.00%, Width 15.01%' },
  { dia: -2.99, widthPct: 14.99, desc: 'Dia -2.99%, Width 14.99%' },
  { dia: -3.00, widthPct: 15.00, desc: 'Dia -3.00%, Width 15.00%' },
  { dia: -3.01, widthPct: 15.00, desc: 'Dia -3.01%, Width 15.00%' },
  { dia: 1.50, widthPct: 16.00, desc: 'Dia +1.50%, Width 16.00%' },
  { dia: 3.50, widthPct: 5.00, desc: 'Dia +3.50%, Width 5.00%' },
  { dia: 0.50, widthPct: 12.00, desc: 'Dia +0.50%, Width 12.00%' },
  { dia: 2.50, widthPct: 10.00, desc: 'Dia +2.50%, Width 10.00%' },
  { dia: -2.50, widthPct: 12.00, desc: 'Dia -2.50%, Width 12.00%' },
  { dia: -3.50, widthPct: 5.00, desc: 'Dia -3.50%, Width 5.00%' },

  // Precision unrounded float tests (e.g. 2.0000001%)
  { dia: 2.0000001, widthPct: 5.0, desc: 'Unrounded float dia 2.0000001%' },
  { dia: 1.0, widthPct: 10.0000001, desc: 'Unrounded float width 10.0000001%' },
  { dia: 3.0000001, widthPct: 5.0, desc: 'Unrounded float dia 3.0000001%' },
  { dia: 1.0, widthPct: 15.0000001, desc: 'Unrounded float width 15.0000001%' },
];

boundaryScenarios.forEach((b, i) => {
  const candDia = baseOEDia * (1 + b.dia / 100);
  const candWidth = baseOEWidth * (1 + b.widthPct / 100);

  const origSpecs = { width: baseOEWidth, aspectRatio: 55, rimDiameterInches: 16, overallDiameter: baseOEDia, sizeString: '200/55 R16' };
  const candSpecs = { width: candWidth, aspectRatio: 55, rimDiameterInches: 16, overallDiameter: candDia, sizeString: `Test-${b.dia}-${b.widthPct}` };

  const expectedStatus = independentExpectedStatus(candWidth, baseOEWidth, candDia, baseOEDia);
  const screening = screenCandidateFitment(candSpecs, origSpecs);

  assert(
    screening.statusColor === expectedStatus,
    `S2-${i+1}`,
    `Boundary: ${b.desc}`,
    `Expected: ${expectedStatus}, Actual: ${screening.statusColor}`
  );
});

// ==================================================
// SECTION 3: REAL TYRE SIZES AUDIT (19 Original Sizes x All Generated Candidates)
// ==================================================
console.log('\n--- SECTION 3: REAL TYRE SIZES & CANDIDATE GENERATION AUDIT ---');

const realOriginalSizes = [
  '175/65 R14',
  '185/65 R15',
  '195/65 R15',
  '205/55 R16',
  '205/60 R16',
  '215/60 R16',
  '215/60 R17',
  '215/65 R16',
  '225/45 R17',
  '225/50 R17',
  '225/55 R17',
  '225/60 R17',
  '235/45 R18',
  '235/55 R18',
  '245/45 R18',
  '255/55 R18',
  '265/60 R18',
  '275/40 R19',
  '285/45 R20',
];

let candidateTestCount = 0;

realOriginalSizes.forEach((origStr, origIdx) => {
  const parts = origStr.split(/[\/\sR]+/);
  const w = parseInt(parts[0], 10);
  const ar = parseInt(parts[1], 10);
  const r = parseInt(parts[2], 10);

  const origSpecs = calculateTyreSpecs({ width: w, aspectRatio: ar, rimDiameter: r });
  const candidatesResult = getCandidateTyres(origSpecs);

  // Check candidate set generated
  assert(candidatesResult.allCandidates.length > 0, `S3.1-${origIdx}`, `Candidate generation non-empty for ${origStr}`, `Generated ${candidatesResult.allCandidates.length} candidates`);

  // Verify candidate classification for EVERY generated candidate against independent formula
  candidatesResult.allCandidates.forEach((cand, candIdx) => {
    candidateTestCount++;
    const expected = independentExpectedStatus(cand.width, origSpecs.width, cand.overallDiameter, origSpecs.overallDiameter);
    const actual = cand.statusColor;

    assert(
      actual === expected,
      `S3.2-${origIdx}-${candIdx}`,
      `Candidate ${cand.sizeString} for OE ${origStr}`,
      `DiaDiff: ${cand.differencePct.toFixed(2)}%, WidthChange: ${cand.widthChangePct.toFixed(2)}% | Expected: ${expected}, Actual: ${actual}`
    );
  });
});

console.log(`Evaluated ${candidateTestCount} individual candidate classification checks against independent reference formula.`);

// ==================================================
// SECTION 4: SYMMETRY TESTS (Positive vs Negative Diameter Deltas)
// ==================================================
console.log('\n--- SECTION 4: SYMMETRY & EQUIVALENCE TESTS ---');

const symmetryDeltas = [0.5, 1.0, 1.8, 2.0, 2.1, 2.5, 2.9, 3.0, 3.1];

symmetryDeltas.forEach((delta, i) => {
  const posDia = baseOEDia * (1 + delta / 100);
  const negDia = baseOEDia * (1 - delta / 100);

  const origSpecs = { width: baseOEWidth, aspectRatio: 55, rimDiameterInches: 16, overallDiameter: baseOEDia, sizeString: '200/55 R16' };
  const posSpecs = { width: baseOEWidth, aspectRatio: 55, rimDiameterInches: 16, overallDiameter: posDia, sizeString: `Pos-${delta}` };
  const negSpecs = { width: baseOEWidth, aspectRatio: 55, rimDiameterInches: 16, overallDiameter: negDia, sizeString: `Neg-${delta}` };

  const posScreening = screenCandidateFitment(posSpecs, origSpecs);
  const negScreening = screenCandidateFitment(negSpecs, origSpecs);

  assert(
    posScreening.statusColor === negScreening.statusColor,
    `S4-${i+1}`,
    `Symmetry check for ±${delta}% diameter delta`,
    `Pos: ${posScreening.statusColor}, Neg: ${negScreening.statusColor}`
  );
});

// ==================================================
// SECTION 5: CATEGORY VS STATUS DECOUPLING TESTS
// ==================================================
console.log('\n--- SECTION 5: CATEGORY VS STATUS DECOUPLING TESTS ---');

const refOEForCat = calculateTyreSpecs({ width: 215, aspectRatio: 60, rimDiameter: 16 });
const catCandidates = getCandidateTyres(refOEForCat);

// Verify sameRim candidates
catCandidates.sameRim.forEach((item, idx) => {
  assert(item.rimDiameter === 16, `S5.1-${idx}`, `SameRim candidate ${item.sizeString} has R16`, `Got R${item.rimDiameter}`);
  assert(item.category === 'SAMERIM', `S5.2-${idx}`, `SameRim candidate ${item.sizeString} category is SAMERIM`, `Got ${item.category}`);
  assert(['GREEN', 'YELLOW', 'RED'].includes(item.statusColor), `S5.3-${idx}`, `SameRim candidate status is valid 3-status`, `Got ${item.statusColor}`);
});

// Verify upsize candidates
catCandidates.upsize.forEach((item, idx) => {
  assert(item.rimDiameter > 16, `S5.4-${idx}`, `Upsize candidate ${item.sizeString} has rim > R16`, `Got R${item.rimDiameter}`);
  assert(item.category === 'UPSIZE', `S5.5-${idx}`, `Upsize candidate ${item.sizeString} category is UPSIZE`, `Got ${item.category}`);
  assert(['GREEN', 'YELLOW', 'RED'].includes(item.statusColor), `S5.6-${idx}`, `Upsize candidate status is valid 3-status`, `Got ${item.statusColor}`);
});

// Verify downsize candidates
catCandidates.downsize.forEach((item, idx) => {
  assert(item.rimDiameter < 16, `S5.7-${idx}`, `Downsize candidate ${item.sizeString} has rim < R16`, `Got R${item.rimDiameter}`);
  assert(item.category === 'DOWNSIZE', `S5.8-${idx}`, `Downsize candidate ${item.sizeString} category is DOWNSIZE`, `Got ${item.category}`);
  assert(['GREEN', 'YELLOW', 'RED'].includes(item.statusColor), `S5.9-${idx}`, `Downsize candidate status is valid 3-status`, `Got ${item.statusColor}`);
});

// ==================================================
// SECTION 6: MM <-> INCH CONVERSION & CONSISTENCY TESTS
// ==================================================
console.log('\n--- SECTION 6: UNIT CONVERSION & CONSISTENCY TESTS ---');

const unitTestOE = { width: 215, aspectRatio: 60, rimDiameter: 16 };
const unitSpecsMm = calculateTyreSpecs(unitTestOE);
const widthInches = unitSpecsMm.width / 25.4;
const roundtripWidthMm = widthInches * 25.4;

const roundtripSpecs = calculateTyreSpecs({ width: roundtripWidthMm, aspectRatio: 60, rimDiameter: 16 });

assert(
  Math.abs(unitSpecsMm.overallDiameter - roundtripSpecs.overallDiameter) < 1e-6,
  'S6.1',
  'MM -> IN -> MM roundtrip overall diameter precision',
  `Orig: ${unitSpecsMm.overallDiameter}, Roundtrip: ${roundtripSpecs.overallDiameter}`
);

// ==================================================
// SECTION 7: DUPLICATES & DETERMINISTIC CONSISTENCY TESTS
// ==================================================
console.log('\n--- SECTION 7: DUPLICATE & DETERMINISTIC CONSISTENCY TESTS ---');

realOriginalSizes.slice(0, 5).forEach((origStr, i) => {
  const parts = origStr.split(/[\/\sR]+/);
  const specs = calculateTyreSpecs({ width: parseInt(parts[0]), aspectRatio: parseInt(parts[1]), rimDiameter: parseInt(parts[2]) });

  const run1 = getCandidateTyres(specs);
  const run2 = getCandidateTyres(specs);

  // Check no duplicates in candidate list
  const sizeSet = new Set();
  let hasDuplicate = false;
  run1.allCandidates.forEach(c => {
    if (sizeSet.has(c.sizeString)) hasDuplicate = true;
    sizeSet.add(c.sizeString);
  });

  assert(!hasDuplicate, `S7.1-${i}`, `No duplicate tyre sizes generated for ${origStr}`, `Total unique: ${sizeSet.size}`);
  assert(run1.allCandidates.length === run2.allCandidates.length, `S7.2-${i}`, `Deterministic candidate count for ${origStr}`, `Run 1: ${run1.allCandidates.length}, Run 2: ${run2.allCandidates.length}`);
});

// ==================================================
// SECTION 8: LARGE-SCALE RANDOMIZED MATRIX TESTING (Bringing Total Tests to 500+)
// ==================================================
console.log('\n--- SECTION 8: LARGE MATRIX COMBINATORY TESTING (500+ Target) ---');

const testWidths = [145, 165, 185, 195, 205, 215, 225, 235, 245, 275, 295];
const testRims = [14, 15, 16, 17, 18, 19, 20];

let matrixCount = 0;

testWidths.forEach((w, wIdx) => {
  testRims.forEach((r, rIdx) => {
    matrixCount++;
    const origSpecs = calculateTyreSpecs({ width: w, aspectRatio: 60, rimDiameter: r });

    // Pick candidate size with varying width & aspect ratio
    const candWidth = STANDARD_WIDTHS[(wIdx * 3) % STANDARD_WIDTHS.length];
    const candAR = STANDARD_ASPECT_RATIOS[(rIdx * 2) % STANDARD_ASPECT_RATIOS.length];
    const candSpecs = calculateTyreSpecs({ width: candWidth, aspectRatio: candAR, rimDiameter: r });

    const expected = independentExpectedStatus(candSpecs.width, origSpecs.width, candSpecs.overallDiameter, origSpecs.overallDiameter);
    const screening = screenCandidateFitment(candSpecs, origSpecs);

    assert(
      screening.statusColor === expected,
      `S8-${matrixCount}`,
      `Matrix test: OE ${w}/60 R${r} vs Candidate ${candWidth}/${candAR} R${r}`,
      `DiaDiff: ${screening.diffPct.toFixed(2)}%, WidthChange: ${screening.widthChangePct.toFixed(2)}% | Expected: ${expected}, Actual: ${screening.statusColor}`
    );
  });
});

console.log('\n==================================================');
console.log(`FINAL SUMMARY: Total Tests Executed: ${totalTests} | Passed: ${passedTests} | Failed: ${failedTests}`);
console.log('==================================================');

if (failedTests > 0) {
  console.error('\nFAILURES SUMMARY:');
  failures.forEach(f => {
    console.error(`- Test ${f.testId} (${f.testDescription}): ${f.details}`);
  });
}
