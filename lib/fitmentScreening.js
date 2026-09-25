import {
  DIAMETER_TARGET_PERCENT,
  MAX_EXTENDED_DIFFERENCE_PERCENT,
  WIDTH_TARGET_PERCENT,
  MAX_EXTENDED_WIDTH_PERCENT,
} from './constants.js';
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
 * Clearly separates:
 * 1. Calculated Dimensional Compatibility (Size-Only mode: Green / Yellow / Red)
 * 2. Verified Vehicle Fitment (OEM Approved mode: Manufacturer Approved)
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
  const isWithinTargetDia = absDiff <= (DIAMETER_TARGET_PERCENT + 1e-9); // ±2.0%
  const isWithinExtendedDia = absDiff <= (MAX_EXTENDED_DIFFERENCE_PERCENT + 1e-9); // ±3.0%

  // ==================== STAGE 2 — WIDTH ====================
  const widthDiff = candidateSpecs.width - originalSpecs.width;
  const widthChangePct = (Math.abs(candidateSpecs.width - originalSpecs.width) / originalSpecs.width) * 100;
  const isWithinTargetWidth = widthChangePct <= (WIDTH_TARGET_PERCENT + 1e-9); // <= 10.0%
  const isWithinExtendedWidth = widthChangePct <= (MAX_EXTENDED_WIDTH_PERCENT + 1e-9); // <= 15.0%

  let widthClassification = 'same_width';

  if (widthDiff > 0) {
    widthClassification = 'wider';
  } else if (widthDiff < 0) {
    widthClassification = 'narrower';
  }

  // Target & Extended dimensional validity
  const isWithinTarget = isWithinTargetDia && isWithinTargetWidth;
  const isWithinExtended = isWithinExtendedDia && isWithinExtendedWidth;

  // ==================== STAGE 3 — RIM ====================
  let rimCategory = 'SAMERIM';
  let rimLabel = `Same rim (R${candidateSpecs.rimDiameterInches})`;

  if (candidateSpecs.rimDiameterInches < originalSpecs.rimDiameterInches) {
    rimCategory = 'DOWNSIZE';
    const rDelta = originalSpecs.rimDiameterInches - candidateSpecs.rimDiameterInches;
    rimLabel = `Downsize rim (-${rDelta}" to R${candidateSpecs.rimDiameterInches})`;
  } else if (candidateSpecs.rimDiameterInches > originalSpecs.rimDiameterInches) {
    rimCategory = 'UPSIZE';
    const rDelta = candidateSpecs.rimDiameterInches - originalSpecs.rimDiameterInches;
    rimLabel = `Upsize rim (+${rDelta}" to R${candidateSpecs.rimDiameterInches})`;
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

  // ==================== STAGE 7 — VERIFIED VEHICLE / OEM FITMENT ====================
  let isManufacturerApproved = false;

  if (oemVehicleData) {
    if (Array.isArray(oemVehicleData.approvedSizes) && oemVehicleData.approvedSizes.includes(candidateSpecs.sizeString)) {
      isManufacturerApproved = true;
    } else if (oemVehicleData.oemTyre) {
      const oemSizeStr = `${oemVehicleData.oemTyre.width}/${oemVehicleData.oemTyre.aspectRatio} R${oemVehicleData.oemTyre.rim}`;
      if (candidateSpecs.sizeString === oemSizeStr) {
        isManufacturerApproved = true;
      }
    }
  }

  let vehicleFitmentStatus = isManufacturerApproved ? 'PASS' : 'UNKNOWN';
  let vehicleFitmentLabel = isManufacturerApproved
    ? 'Listed/approved for this vehicle'
    : 'Calculated alternative — verify vehicle fitment before purchase.';

  // ==================== RESULT CLASSIFICATION ====================
  // 1. Green: Close calculated alternative (dia <= 2% AND width <= 10%)
  // 2. Yellow: Possible alternative — verify fitment (dia <= 3% AND width <= 15%)
  // 3. Red: Outside calculated range (dia > 3% OR width > 15% OR mechanical fail)

  let status = 'YELLOW';
  let statusColor = 'YELLOW';
  let statusHeading = 'Possible alternative — verify fitment';
  let statusDescription = 'Dimensionally possible; professional fitment verification required';

  if (
    loadStatus === 'FAIL' ||
    speedStatus === 'FAIL' ||
    rimWidthStatus === 'FAIL' ||
    absDiff > (MAX_EXTENDED_DIFFERENCE_PERCENT + 1e-9) ||
    widthChangePct > (MAX_EXTENDED_WIDTH_PERCENT + 1e-9)
  ) {
    status = 'RED';
    statusColor = 'RED';
    statusHeading = 'Outside calculated range';
    statusDescription = 'Significant dimensional difference';
  } else if (
    absDiff <= (DIAMETER_TARGET_PERCENT + 1e-9) &&
    widthChangePct <= (WIDTH_TARGET_PERCENT + 1e-9)
  ) {
    status = 'GREEN';
    statusColor = 'GREEN';
    statusHeading = 'Close calculated alternative';
    statusDescription = 'Very close in calculated dimensions; verify vehicle fitment';
  } else if (
    absDiff <= (MAX_EXTENDED_DIFFERENCE_PERCENT + 1e-9) &&
    widthChangePct <= (MAX_EXTENDED_WIDTH_PERCENT + 1e-9)
  ) {
    status = 'YELLOW';
    statusColor = 'YELLOW';
    statusHeading = 'Possible alternative — verify fitment';
    statusDescription = 'Dimensionally possible; professional fitment verification required';
  } else {
    status = 'RED';
    statusColor = 'RED';
    statusHeading = 'Outside calculated range';
    statusDescription = 'Significant dimensional difference';
  }

  // Concise reasons list for display
  const reasons = [];

  if (isManufacturerApproved) {
    reasons.push('Verified manufacturer approved size for selected vehicle.');
  }

  // Diameter reason
  if (isWithinTargetDia) {
    reasons.push(`Overall diameter within ±${DIAMETER_TARGET_PERCENT.toFixed(1)}% target (${diffPct >= 0 ? '+' : ''}${diffPct.toFixed(2)}%)`);
  } else if (isWithinExtendedDia) {
    reasons.push(`Overall diameter within ±${MAX_EXTENDED_DIFFERENCE_PERCENT.toFixed(1)}% limit (${diffPct >= 0 ? '+' : ''}${diffPct.toFixed(2)}%)`);
  } else {
    reasons.push(`Overall diameter exceeds ±${MAX_EXTENDED_DIFFERENCE_PERCENT.toFixed(1)}% limit (${diffPct >= 0 ? '+' : ''}${diffPct.toFixed(2)}%)`);
  }

  // Width reason
  if (isWithinTargetWidth) {
    reasons.push(`Section width change within ${WIDTH_TARGET_PERCENT.toFixed(0)}% target (${widthDiff >= 0 ? '+' : ''}${widthDiff} mm, ${widthDiff >= 0 ? '+' : '-'}${widthChangePct.toFixed(1)}%)`);
  } else if (isWithinExtendedWidth) {
    reasons.push(`Section width change within ${MAX_EXTENDED_WIDTH_PERCENT.toFixed(0)}% limit (${widthDiff >= 0 ? '+' : ''}${widthDiff} mm, ${widthDiff >= 0 ? '+' : '-'}${widthChangePct.toFixed(1)}%)`);
  } else {
    reasons.push(`Section width change exceeds ${MAX_EXTENDED_WIDTH_PERCENT.toFixed(0)}% limit (${widthDiff >= 0 ? '+' : ''}${widthDiff} mm, ${widthDiff >= 0 ? '+' : '-'}${widthChangePct.toFixed(1)}%)`);
  }

  // Rim reason
  reasons.push(rimLabel);

  // Rim width compatibility reason
  reasons.push(rimWidthLabel);

  // Load rating reason
  if (candLoad !== null && oemLoad !== null) {
    reasons.push(loadLabel);
  }

  // Speed rating reason
  if (candSpeed !== null && oemSpeed !== null) {
    reasons.push(speedLabel);
  }

  // Vehicle-specific fitment notice
  reasons.push(vehicleFitmentLabel);

  const speedometer100 = calculateSpeedometer100(candidateSpecs.overallDiameter, origDiameter);
  const clearanceChangeMm = calculateClearanceChangeMm(candidateSpecs.overallDiameter, origDiameter);

  return {
    diffPct,
    absDiff,
    widthDiff,
    absWidthDiff: Math.abs(widthDiff),
    widthChangePct,
    sidewallDiffMm: candidateSpecs.sidewallHeight - originalSpecs.sidewallHeight,
    rimDiffInches: candidateSpecs.rimDiameterInches - originalSpecs.rimDiameterInches,
    circumferenceDiffPct: ((candidateSpecs.circumference - originalSpecs.circumference) / originalSpecs.circumference) * 100,
    isWithinTarget,
    isWithinExtended,
    isManufacturerApproved,
    widthClassification,
    rimCategory,
    rimWidthStatus,
    loadStatus,
    speedStatus,
    vehicleFitmentStatus,
    status,
    statusColor,
    statusHeading,
    statusDescription,
    reasons,
    speedometer100,
    clearanceChangeMm,
    recommendedRimRange: recRimRange,
  };
}

