import {
  calculateTyreSpecs,
  calculateDiameterDiffPct,
  calculateSpeedometer100,
  calculateClearanceChangeMm,
} from '../lib/tyreCalculator.js';

import { getCandidateTyres } from '../lib/standardTyres.js';
import { screenCandidateFitment } from '../lib/fitmentScreening.js';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
  } else {
    failedTests++;
    console.error(`[FAIL] ${testName} - ${details}`);
  }
}

console.log('==================================================');
console.log('SECTION 1: INDEPENDENT CALCULATION VERIFICATION');
console.log('==================================================');

// Independent formula implementation
function independentCalc(w, ar, r) {
  const sidewall = (w * ar) / 100;
  const rimMm = r * 25.4;
  const overallDia = rimMm + 2 * sidewall;
  const circumference = Math.PI * overallDia;
  const revsPerKm = 1000000 / circumference;
  return { sidewall, rimMm, overallDia, circumference, revsPerKm };
}

function independentDiff(newDia, oeDia) {
  const diffPct = ((newDia - oeDia) / oeDia) * 100;
  const speedometer100 = 100 * (newDia / oeDia);
  const clearanceChangeMm = (newDia - oeDia) / 2;
  return { diffPct, speedometer100, clearanceChangeMm };
}

// Check TyreSpecs calculation accuracy for sample sizes
const testSizes = [
  { width: 215, aspectRatio: 60, rimDiameter: 17 },
  { width: 225, aspectRatio: 55, rimDiameter: 17 },
  { width: 205, aspectRatio: 55, rimDiameter: 16 },
  { width: 195, aspectRatio: 65, rimDiameter: 15 },
  { width: 245, aspectRatio: 45, rimDiameter: 18 },
  { width: 175, aspectRatio: 65, rimDiameter: 14 },
];

testSizes.forEach(size => {
  const appSpecs = calculateTyreSpecs(size);
  const ind = independentCalc(size.width, size.aspectRatio, size.rimDiameter);

  assert(Math.abs(appSpecs.sidewallHeight - ind.sidewall) < 0.05, `Sidewall calc for ${size.width}/${size.aspectRatio} R${size.rimDiameter}`, `App: ${appSpecs.sidewallHeight}, Ind: ${ind.sidewall}`);
  assert(Math.abs(appSpecs.rimDiameterMm - ind.rimMm) < 0.05, `Rim Mm calc for R${size.rimDiameter}`, `App: ${appSpecs.rimDiameterMm}, Ind: ${ind.rimMm}`);
  assert(Math.abs(appSpecs.overallDiameter - ind.overallDia) < 0.1, `Overall Dia calc for ${size.width}/${size.aspectRatio} R${size.rimDiameter}`, `App: ${appSpecs.overallDiameter}, Ind: ${ind.overallDia}`);
  assert(Math.abs(appSpecs.circumference - ind.circumference) < 0.2, `Circumference calc for ${size.width}/${size.aspectRatio} R${size.rimDiameter}`, `App: ${appSpecs.circumference}, Ind: ${ind.circumference}`);
  assert(Math.abs(appSpecs.revsPerKm - ind.revsPerKm) < 0.2, `Revs/km calc for ${size.width}/${size.aspectRatio} R${size.rimDiameter}`, `App: ${appSpecs.revsPerKm}, Ind: ${ind.revsPerKm}`);
});

console.log('\n==================================================');
console.log('SECTION 2: MANDATORY KNOWN TEST CASE (215/60 R17 vs 225/55 R17)');
console.log('==================================================');

const oeSize = { width: 215, aspectRatio: 60, rimDiameter: 17 };
const newSize = { width: 225, aspectRatio: 55, rimDiameter: 17 };

const oeSpecs = calculateTyreSpecs(oeSize);
const newSpecs = calculateTyreSpecs(newSize);

const oeInd = independentCalc(215, 60, 17);
const newInd = independentCalc(225, 55, 17);
const diffInd = independentDiff(newInd.overallDia, oeInd.overallDia);

console.log('OE Specs (Calculated vs Expected):');
console.log(`- OE Sidewall: ${oeSpecs.sidewallHeight} mm (Expected ~ 129.0 mm, Ind: ${oeInd.sidewall.toFixed(2)} mm)`);
console.log(`- OE Rim Dia: ${oeSpecs.rimDiameterMm} mm (Expected ~ 431.8 mm, Ind: ${oeInd.rimMm.toFixed(2)} mm)`);
console.log(`- OE Overall Dia: ${oeSpecs.overallDiameter} mm (Expected ~ 689.8 mm, Ind: ${oeInd.overallDia.toFixed(2)} mm)`);
console.log(`- OE Circumference: ${oeSpecs.circumference} mm (Expected ~ 2167.1 mm, Ind: ${oeInd.circumference.toFixed(2)} mm)`);

console.log('\nNew Specs (Calculated vs Expected):');
console.log(`- New Sidewall: ${newSpecs.sidewallHeight} mm (Expected ~ 123.75 mm, Ind: ${newInd.sidewall.toFixed(2)} mm)`);
console.log(`- New Overall Dia: ${newSpecs.overallDiameter} mm (Expected ~ 679.3 mm, Ind: ${newInd.overallDia.toFixed(2)} mm)`);
console.log(`- New Circumference: ${newSpecs.circumference} mm (Expected ~ 2134.1 mm, Ind: ${newInd.circumference.toFixed(2)} mm)`);

const diffPct = calculateDiameterDiffPct(newSpecs.overallDiameter, oeSpecs.overallDiameter);
const speed100 = calculateSpeedometer100(newSpecs.overallDiameter, oeSpecs.overallDiameter);
const clearance = calculateClearanceChangeMm(newSpecs.overallDiameter, oeSpecs.overallDiameter);

console.log(`- Diameter Diff: ${diffPct}% (Expected ~ -1.52%, Ind: ${diffInd.diffPct.toFixed(2)}%)`);
console.log(`- Speed @ 100km/h: ${speed100} km/h (Expected ~ 98.48 km/h, Ind: ${diffInd.speedometer100.toFixed(2)} km/h)`);
console.log(`- Ride Height Change: ${clearance} mm (Ind: ${diffInd.clearanceChangeMm.toFixed(2)} mm)`);

assert(Math.abs(oeSpecs.sidewallHeight - 129.0) < 0.1, 'OE Sidewall 129.0 mm');
assert(Math.abs(newSpecs.sidewallHeight - 123.75) < 0.1, 'New Sidewall 123.75 mm');
assert(Math.abs(oeSpecs.overallDiameter - 689.8) < 0.2, 'OE Overall Dia 689.8 mm');
assert(Math.abs(newSpecs.overallDiameter - 679.3) < 0.2, 'New Overall Dia 679.3 mm');
assert(Math.abs(diffPct - (-1.5)) < 0.2, 'Diameter diff ~ -1.52%');
assert(Math.abs(speed100 - 98.48) < 0.2, 'Speedometer @ 100 ~ 98.48 km/h');

console.log('\n==================================================');
console.log('SECTION 3: TESTING 20+ TYRE COMBINATIONS');
console.log('==================================================');

const audit20Sizes = [
  '215/60 R17', '215/60 R16', '205/55 R16', '225/55 R17', '195/65 R15',
  '225/45 R17', '185/65 R15', '205/60 R16', '225/60 R16', '235/55 R16',
  '215/65 R16', '245/45 R18', '175/65 R14', '195/55 R16', '215/55 R17',
  '225/50 R17', '235/45 R18', '245/40 R18', '255/45 R18', '265/35 R18'
];

audit20Sizes.forEach(sizeStr => {
  const parts = sizeStr.split(/[\/\sR]+/);
  const w = parseInt(parts[0]);
  const ar = parseInt(parts[1]);
  const r = parseInt(parts[2]);

  const specs = calculateTyreSpecs({ width: w, aspectRatio: ar, rimDiameter: r });
  const ind = independentCalc(w, ar, r);

  assert(!isNaN(specs.overallDiameter) && specs.overallDiameter > 0, `Calculation non-NaN for ${sizeStr}`);
  assert(Math.abs(specs.overallDiameter - ind.overallDia) < 0.2, `Overall Dia matching independent formula for ${sizeStr}`);

  const candidates = getCandidateTyres(specs);
  assert(candidates.allCandidates.length > 0, `Candidate generation producing results for ${sizeStr}`);
});

console.log('\n==================================================');
console.log('SECTION 4: BOUNDARY TESTING AROUND ±2.0% TARGET');
console.log('==================================================');

// Base OE: 664.4 mm (215/60 R16)
const refDia = 664.4;

// Test boundary diffs
const boundaryDiffs = [
  { diff: 0.0, expectTarget: true },
  { diff: 1.99, expectTarget: true },
  { diff: 2.00, expectTarget: true },
  { diff: 2.01, expectTarget: false },
  { diff: -1.99, expectTarget: true },
  { diff: -2.00, expectTarget: true },
  { diff: -2.01, expectTarget: false },
  { diff: 2.99, expectExtended: true },
  { diff: 3.00, expectExtended: true },
  { diff: 3.01, expectExtended: false },
];

boundaryDiffs.forEach(b => {
  const newDia = refDia * (1 + b.diff / 100);
  const candSpecs = { width: 215, aspectRatio: 60, rimDiameterInches: 16, overallDiameter: newDia, sizeString: 'TestSize' };
  const origSpecs = { width: 215, aspectRatio: 60, rimDiameterInches: 16, overallDiameter: refDia, sizeString: '215/60 R16' };

  const screening = screenCandidateFitment(candSpecs, origSpecs);

  if (b.expectTarget !== undefined) {
    assert(screening.isWithinTarget === b.expectTarget, `Boundary target check for diff ${b.diff}%`, `Got ${screening.isWithinTarget}, expected ${b.expectTarget}`);
  }
  if (b.expectExtended !== undefined) {
    assert(screening.isWithinExtended === b.expectExtended, `Boundary extended check for diff ${b.diff}%`, `Got ${screening.isWithinExtended}, expected ${b.expectExtended}`);
  }
});

console.log('\n==================================================');
console.log('SECTION 5: MM <-> INCH CONVERSION SANITY & ROUNDTRIP');
console.log('==================================================');

const origMm = { width: 215, aspectRatio: 60, rimDiameter: 16 };
const origSpecsMm = calculateTyreSpecs(origMm);

// Convert width to IN
const widthIn = origSpecsMm.width / 25.4;
// Convert back to MM
const roundtripMm = widthIn * 25.4;

const roundtripSpecs = calculateTyreSpecs({ width: roundtripMm, aspectRatio: 60, rimDiameter: 16 });

assert(Math.abs(origSpecsMm.overallDiameter - roundtripSpecs.overallDiameter) < 0.0001, 'MM -> IN -> MM lossless roundtrip overall diameter');

console.log('\n==================================================');
console.log('SECTION 6: INVALID INPUT & EDGE CASES TESTING');
console.log('==================================================');

const invalidInputs = [
  { width: 0, aspectRatio: 60, rimDiameter: 16 },
  { width: -215, aspectRatio: 60, rimDiameter: 16 },
  { width: 'abc', aspectRatio: 60, rimDiameter: 16 },
  { width: null, aspectRatio: null, rimDiameter: null },
  { width: 9999, aspectRatio: 999, rimDiameter: 999 },
];

invalidInputs.forEach((inv, i) => {
  const specs = calculateTyreSpecs(inv);
  assert(!isNaN(specs.overallDiameter), `Invalid input #${i+1} does not produce NaN overallDiameter`);
  assert(isFinite(specs.overallDiameter), `Invalid input #${i+1} does not produce Infinity overallDiameter`);
  assert(!isNaN(specs.revsPerKm), `Invalid input #${i+1} does not produce NaN revsPerKm`);
  assert(isFinite(specs.revsPerKm), `Invalid input #${i+1} does not produce Infinity revsPerKm`);
});

console.log('\n==================================================');
console.log('SECTION 7: SECTION 18 BOUNDARY & PERCENTAGE WIDTH TESTS');
console.log('==================================================');

const boundaryCases = [
  { dia: 0.0, widthPct: 0.0, expectStatus: 'GREEN', desc: 'Dia 0%, Width 0%' },
  { dia: 1.5, widthPct: 5.0, expectStatus: 'GREEN', desc: 'Dia 1.5%, Width 5%' },
  { dia: 2.0, widthPct: 10.0, expectStatus: 'GREEN', desc: 'Dia 2.0%, Width 10%' },
  { dia: 2.01, widthPct: 5.0, expectStatus: 'YELLOW', desc: 'Dia 2.01%, Width 5%' },
  { dia: 1.5, widthPct: 10.01, expectStatus: 'YELLOW', desc: 'Dia 1.5%, Width 10.01%' },
  { dia: 3.0, widthPct: 5.0, expectStatus: 'YELLOW', desc: 'Dia 3.0%, Width 5%' },
  { dia: 3.01, widthPct: 5.0, expectStatus: 'RED', desc: 'Dia 3.01%, Width 5%' },
  { dia: 1.0, widthPct: 15.0, expectStatus: 'YELLOW', desc: 'Dia 1.0%, Width 15%' },
  { dia: 1.0, widthPct: 15.01, expectStatus: 'RED', desc: 'Dia 1.0%, Width 15.01%' },
  { dia: 2.5, widthPct: 12.0, expectStatus: 'YELLOW', desc: 'Dia 2.5%, Width 12%' },
  { dia: 3.5, widthPct: 5.0, expectStatus: 'RED', desc: 'Dia 3.5%, Width 5%' },
  { dia: 1.0, widthPct: 18.0, expectStatus: 'RED', desc: 'Dia 1%, Width 18%' },
  { dia: 4.0, widthPct: 20.0, expectStatus: 'RED', desc: 'Dia 4%, Width 20%' },
  { dia: -2.01, widthPct: 5.0, expectStatus: 'YELLOW', desc: 'Dia -2.01%, Width 5%' },
  { dia: -3.01, widthPct: 5.0, expectStatus: 'RED', desc: 'Dia -3.01%, Width 5%' },
];

const baseOEWidth = 200;
const baseOEDia = 650.0;

boundaryCases.forEach((bc, idx) => {
  const newDia = baseOEDia * (1 + bc.dia / 100);
  const newWidth = baseOEWidth * (1 + bc.widthPct / 100);
  const candSpecs = {
    width: newWidth,
    aspectRatio: 55,
    rimDiameterInches: 16,
    overallDiameter: newDia,
    sizeString: `Test-${bc.dia}-${bc.widthPct}`,
  };
  const origSpecs = {
    width: baseOEWidth,
    aspectRatio: 55,
    rimDiameterInches: 16,
    overallDiameter: baseOEDia,
    sizeString: '200/55 R16',
  };

  const screening = screenCandidateFitment(candSpecs, origSpecs);
  assert(
    screening.statusColor === bc.expectStatus,
    `Boundary test #${idx + 1} (${bc.desc})`,
    `Got ${screening.statusColor}, Expected ${bc.expectStatus}`
  );
});

console.log('\n==================================================');
console.log('SECTION 8: VEHICLE / OEM FITMENT VERIFICATION TESTS');
console.log('==================================================');

const mockVehicleCreta = {
  make: "Hyundai",
  model: "Creta",
  variant: "SX / SX Tech / SX(O)",
  year: "2020-2024",
  oemTyre: { width: 215, aspectRatio: 60, rim: 17 },
  approvedSizes: ["215/60 R17", "215/55 R18"],
  loadIndex: 96,
  speedRating: "H",
  rimWidthMin: 6.0,
  rimWidthMax: 7.5,
};

const cretaOESpecs = calculateTyreSpecs({ width: 215, aspectRatio: 60, rimDiameter: 17 });
const cretaApprovedCand = calculateTyreSpecs({ width: 215, aspectRatio: 55, rimDiameter: 18 });
const cretaNonApprovedMathClose = calculateTyreSpecs({ width: 225, aspectRatio: 55, rimDiameter: 17 });

const screeningApproved = screenCandidateFitment(cretaApprovedCand, cretaOESpecs, mockVehicleCreta);
assert(
  screeningApproved.statusColor === 'GREEN',
  'Vehicle OEM listed size with green dimensions classified as GREEN',
  `Got ${screeningApproved.statusColor}`
);
assert(
  screeningApproved.isManufacturerApproved === true,
  'isManufacturerApproved is true for OEM listed size',
  `Got ${screeningApproved.isManufacturerApproved}`
);
assert(
  screeningApproved.statusHeading === 'Close calculated alternative',
  'statusHeading is "Close calculated alternative"',
  `Got ${screeningApproved.statusHeading}`
);

const screeningMathClose = screenCandidateFitment(cretaNonApprovedMathClose, cretaOESpecs, mockVehicleCreta);
assert(
  screeningMathClose.statusColor === 'GREEN',
  'Non-OEM but mathematically close candidate classified as GREEN',
  `Got ${screeningMathClose.statusColor}`
);
assert(
  screeningMathClose.isManufacturerApproved === false,
  'isManufacturerApproved is false for non-OEM listed candidate',
  `Got ${screeningMathClose.isManufacturerApproved}`
);
assert(
  screeningMathClose.statusHeading === 'Close calculated alternative',
  'statusHeading is "Close calculated alternative"',
  `Got ${screeningMathClose.statusHeading}`
);

console.log('\n==================================================');
console.log('SECTION 9: CATEGORY VS STATUS INDEPENDENCE TESTS');
console.log('==================================================');

const oeCategoryTest = calculateTyreSpecs({ width: 215, aspectRatio: 60, rimDiameter: 16 });
const candidatesCategory = getCandidateTyres(oeCategoryTest);

const sameRimItems = candidatesCategory.sameRim;
const upsizeItems = candidatesCategory.upsize;
const downsizeItems = candidatesCategory.downsize;

sameRimItems.forEach(item => {
  assert(item.rimDiameter === 16, `Same Rim candidate ${item.sizeString} has R16`);
  assert(item.category === 'SAMERIM', `Same Rim candidate ${item.sizeString} category is SAMERIM`);
});

upsizeItems.forEach(item => {
  assert(item.rimDiameter > 16, `Upsize candidate ${item.sizeString} has rim > 16 (R${item.rimDiameter})`);
  assert(item.category === 'UPSIZE', `Upsize candidate ${item.sizeString} category is UPSIZE`);
});

downsizeItems.forEach(item => {
  assert(item.rimDiameter < 16, `Downsize candidate ${item.sizeString} has rim < 16 (R${item.rimDiameter})`);
  assert(item.category === 'DOWNSIZE', `Downsize candidate ${item.sizeString} category is DOWNSIZE`);
});

console.log('\n==================================================');
console.log(`SUMMARY: Total Tests: ${totalTests} | Passed: ${passedTests} | Failed: ${failedTests}`);
console.log('==================================================');

