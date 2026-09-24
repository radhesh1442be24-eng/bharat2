import { DIAMETER_TARGET_PERCENT, MAX_EXTENDED_DIFFERENCE_PERCENT } from './constants.js';
import {
  calculateDiameterDiffPct,
  calculateSpeedometer100,
  calculateClearanceChangeMm,
} from './tyreCalculator.js';
import {
  compareSpeedRatings,
  compareLoadIndex,
  getRecommendedRimWidthRange,
} from './tyreTechnicalData.js';

/**
 * Executes 7-Stage Fitment Screening & Result Classification on a candidate tyre size.
 *
 * @param {Object} candidateSpecs - Computed physical specs of candidate tyre
 * @param {Object} originalSpecs - Computed physical specs of original/OEM tyre
 * @param {Object|null} oemVehicleData - Optional vehicle OEM details (loadIndex, speedRating, rimWidthMin, rimWidthMax, approvedSizes)
 */
export function screenCandidateFitment(candidateSpecs, originalSpecs, oemVehicleData = null) {
  const origDiameter = originalSpecs.overallDiameter;

  // ==================== STAGE 1 — DIAMETER ====================
  const diffPct = calculateDiameterDiffPct(candidateSpecs.overallDiameter, origDiameter);
  const absDiff = Math.abs(diffPct);
  const isWithinTarget = absDiff <= (DIAMETER_TARGET_PERCENT + 1e-9); // ±2.0%
  const isWithinExtended = absDiff <= (MAX_EXTENDED_DIFFERENCE_PERCENT + 1e-9); // ±3.0%

  // ==================== STAGE 2 — WIDTH ====================
  const widthDiff = candidateSpecs.width - originalSpecs.width;
  let widthClassification = 'same_width';
  let widthLabel = 'Same width';

  if (widthDiff > 0) {
    widthClassification = 'wider';
    widthLabel = `Wider by ${widthDiff} mm`;
  } else if (widthDiff < 0) {
    widthClassification = 'narrower';
    widthLabel = `Narrower by ${Math.abs(widthDiff)} mm`;
  }

  // ==================== STAGE 3 — RIM ====================
  let rimCategory = 'SAMERIM';
  let rimLabel = `Same rim (R${candidateSpecs.rimDiameterInches})`;

  if (candidateSpecs.rimDiameterInches < originalSpecs.rimDiameterInches) {
    rimCategory = 'DOWNSIZE';
    rimLabel = `Downsize rim (R${candidateSpecs.rimDiameterInches})`;
  } else if (candidateSpecs.rimDiameterInches > originalSpecs.rimDiameterInches) {
    rimCategory = 'UPSIZE';
    rimLabel = `Upsize rim (R${candidateSpecs.rimDiameterInches})`;
  }

  // ==================== STAGE 4 — RIM WIDTH COMPATIBILITY ====================
  const recRimRange = getRecommendedRimWidthRange(
    candidateSpecs.width,
    candidateSpecs.aspectRatio,
    candidateSpecs.rimDiameterInches
  );

  let rimWidthStatus = 'UNKNOWN'; // 'PASS' | 'FAIL' | 'UNKNOWN'
  let rimWidthLabel = 'Rim-width compatibility: Verify';

  if (oemVehicleData && oemVehicleData.rimWidthMin && oemVehicleData.rimWidthMax) {
    const oemRimMin = oemVehicleData.rimWidthMin;
    const oemRimMax = oemVehicleData.rimWidthMax;
    // Check overlap of recommended candidate rim width with OEM rim width
    if (recRimRange.min <= oemRimMax && recRimRange.max >= oemRimMin) {
      rimWidthStatus = 'PASS';
      rimWidthLabel = `Rim width compatible (${oemRimMin}"-${oemRimMax}")`;
    } else {
      rimWidthStatus = 'FAIL';
      rimWidthLabel = `Rim width mismatch for OEM rim (${oemRimMin}"-${oemRimMax}")`;
    }
  }

  // ==================== STAGE 5 — LOAD INDEX ====================
  let loadStatus = 'UNKNOWN'; // 'PASS' | 'FAIL' | 'UNKNOWN'
  let loadLabel = 'Load rating: Verify';

  const candLoad = candidateSpecs.loadIndex ?? null;
  const oemLoad = oemVehicleData?.loadIndex ?? null;

  if (candLoad !== null && oemLoad !== null) {
    const isLoadOk = compareLoadIndex(candLoad, oemLoad);
    if (isLoadOk === true) {
      loadStatus = 'PASS';
      loadLabel = `Load index ${candLoad} >= ${oemLoad} OEM`;
    } else if (isLoadOk === false) {
      loadStatus = 'FAIL';
      loadLabel = `Load index ${candLoad} below ${oemLoad} OEM requirement`;
    }
  }

  // ==================== STAGE 6 — SPEED RATING ====================
  let speedStatus = 'UNKNOWN'; // 'PASS' | 'FAIL' | 'UNKNOWN'
  let speedLabel = 'Speed rating: Verify';

  const candSpeed = candidateSpecs.speedRating ?? null;
  const oemSpeed = oemVehicleData?.speedRating ?? null;

  if (candSpeed !== null && oemSpeed !== null) {
    const isSpeedOk = compareSpeedRatings(candSpeed, oemSpeed);
    if (isSpeedOk === true) {
      speedStatus = 'PASS';
      speedLabel = `Speed rating ${candSpeed} >= ${oemSpeed} OEM`;
    } else if (isSpeedOk === false) {
      speedStatus = 'FAIL';
      speedLabel = `Speed rating ${candSpeed} below ${oemSpeed} OEM rating`;
    }
  }

  // ==================== STAGE 7 — VEHICLE-SPECIFIC FITMENT ====================
  let vehicleFitmentStatus = 'UNKNOWN'; // 'PASS' | 'UNKNOWN'
  let vehicleFitmentLabel = 'Calculated alternative — verify vehicle fitment before purchase.';

  if (oemVehicleData && Array.isArray(oemVehicleData.approvedSizes)) {
    if (oemVehicleData.approvedSizes.includes(candidateSpecs.sizeString)) {
      vehicleFitmentStatus = 'PASS';
      vehicleFitmentLabel = 'Verified OEM approved size for vehicle.';
    }
  }

  // ==================== RESULT CLASSIFICATION ====================
  // GREEN: "Close calculated alternative"
  // YELLOW: "Possible alternative — verify fitment"
  // RED: "Not recommended"

  let statusColor = 'YELLOW';
  let statusHeading = 'Possible alternative — verify fitment';

  const isExtremeWidth = widthDiff > 30 || widthDiff < -20;
  const isHardFail =
    !isWithinExtended ||
    loadStatus === 'FAIL' ||
    speedStatus === 'FAIL' ||
    rimWidthStatus === 'FAIL' ||
    isExtremeWidth;

  if (isHardFail) {
    statusColor = 'RED';
    statusHeading = 'Not recommended';
  } else if (
    isWithinTarget &&
    widthDiff >= -10 &&
    widthDiff <= 20 &&
    loadStatus !== 'FAIL' &&
    speedStatus !== 'FAIL' &&
    rimWidthStatus !== 'FAIL'
  ) {
    statusColor = 'GREEN';
    statusHeading = 'Close calculated alternative';
  } else {
    statusColor = 'YELLOW';
    statusHeading = 'Possible alternative — verify fitment';
  }

  // Concise reasons list for display
  const reasons = [];

  // Diameter reason
  if (isWithinTarget) {
    reasons.push(`Within ±${DIAMETER_TARGET_PERCENT.toFixed(1)}% diameter`);
  } else {
    reasons.push(`Diameter diff ${diffPct > 0 ? '+' : ''}${diffPct.toFixed(1)}% (Limit ±${DIAMETER_TARGET_PERCENT.toFixed(1)}%)`);
  }

  // Rim reason
  reasons.push(rimLabel);

  // Width reason
  reasons.push(widthLabel);

  // Rim width compatibility reason
  reasons.push(rimWidthLabel);

  // Load rating reason
  reasons.push(loadLabel);

  // Speed rating reason
  reasons.push(speedLabel);

  // Vehicle-specific fitment notice
  reasons.push(vehicleFitmentLabel);

  const speedometer100 = calculateSpeedometer100(candidateSpecs.overallDiameter, origDiameter);
  const clearanceChangeMm = calculateClearanceChangeMm(candidateSpecs.overallDiameter, origDiameter);

  return {
    diffPct,
    absDiff,
    isWithinTarget,
    isWithinExtended,
    widthDiff,
    widthClassification,
    rimCategory,
    rimWidthStatus,
    loadStatus,
    speedStatus,
    vehicleFitmentStatus,
    statusColor,
    statusHeading,
    reasons,
    speedometer100,
    clearanceChangeMm,
    recommendedRimRange: recRimRange,
  };
}
