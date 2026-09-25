import {
  calculateTyreSpecs,
} from './tyreCalculator.js';
import { screenCandidateFitment } from './fitmentScreening.js';

/**
 * Standard commercial tyre width presets (mm).
 */
export const STANDARD_WIDTHS = [
  135, 145, 155, 165, 175, 185, 195, 205, 215, 225, 235, 245, 255, 265, 275, 285, 295, 305, 315, 325, 335
];

/**
 * Standard commercial aspect ratio percentages (%).
 */
export const STANDARD_ASPECT_RATIOS = [
  25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85
];

/**
 * Validates whether a width, aspect ratio, and rim combination is realistic for passenger vehicles and light SUVs.
 */
function isRealisticPassengerSize(w, ar, r, origWidth) {
  // Enforce reasonable width delta (-40mm to +50mm relative to original width)
  if (w < origWidth - 40 || w > origWidth + 50) return false;
  // Sidewall height must be at least 40mm for rim protection and realistic safety
  const sidewall = (w * ar) / 100;
  if (sidewall < 40 || sidewall > 220) return false;
  return true;
}

/**
 * Generates comprehensive candidate tyre alternatives given original specs and optional vehicle OEM data.
 *
 * Clearly separates:
 * 1. Calculated Size Compatibility (Green / Yellow / Red)
 * 2. Verified Vehicle Fitment (Manufacturer Approved)
 *
 * @param {Object} original - Original tyre specs ({ width, aspectRatio, rimDiameterInches, overallDiameter, ... })
 * @param {Object|null} oemVehicleData - Optional vehicle OEM details
 */
export function getCandidateTyres(original, oemVehicleData = null) {
  const candidatesMap = new Map();

  const minRim = Math.max(12, original.rimDiameterInches - 2);
  const maxRim = Math.min(24, original.rimDiameterInches + 3);

  // 1. Generate candidate sizes from standard combinations
  for (let r = minRim; r <= maxRim; r++) {
    for (const w of STANDARD_WIDTHS) {
      for (const ar of STANDARD_ASPECT_RATIOS) {
        // Skip exact original input
        if (
          w === original.width &&
          ar === original.aspectRatio &&
          r === original.rimDiameterInches
        ) {
          continue;
        }

        if (!isRealisticPassengerSize(w, ar, r, original.width)) continue;

        const specs = calculateTyreSpecs({ width: w, aspectRatio: ar, rimDiameter: r });

        // Screen fitment across 7 stages
        const screening = screenCandidateFitment(specs, original, oemVehicleData);

        // Include candidate in map with full classification (GREEN / YELLOW / RED)
        candidatesMap.set(specs.sizeString, {
          sizeString: specs.sizeString,
          width: specs.width,
          aspectRatio: specs.aspectRatio,
          rimDiameter: specs.rimDiameterInches,
          overallDiameter: specs.overallDiameter,
          sidewallHeight: specs.sidewallHeight,
          circumference: specs.circumference,
          revsPerKm: specs.revsPerKm,
          differencePct: screening.diffPct,
          absDiffPct: screening.absDiff,
          widthDiffMm: screening.widthDiff,
          widthChangePct: screening.widthChangePct,
          speedometer100: screening.speedometer100,
          clearanceChangeMm: screening.clearanceChangeMm,
          category: screening.rimCategory,
          isSameRim: screening.rimCategory === 'SAMERIM',
          isWithinTarget: screening.isWithinTarget,
          isWithinExtended: screening.isWithinExtended,
          isManufacturerApproved: screening.isManufacturerApproved,
          screening,
          status: screening.status,
          statusColor: screening.statusColor,
          statusHeading: screening.statusHeading,
          statusDescription: screening.statusDescription,
          reasons: screening.reasons,
        });
      }
    }
  }

  // 2. Ensure all verified vehicle OEM approved sizes are included even if not in standard grid
  if (oemVehicleData && Array.isArray(oemVehicleData.approvedSizes)) {
    for (const approvedSizeStr of oemVehicleData.approvedSizes) {
      if (candidatesMap.has(approvedSizeStr)) continue;
      const match = approvedSizeStr.match(/^(\d+)\/(\d+)\s*R(\d+)$/i);
      if (match) {
        const w = parseInt(match[1], 10);
        const ar = parseInt(match[2], 10);
        const r = parseInt(match[3], 10);

        if (
          w === original.width &&
          ar === original.aspectRatio &&
          r === original.rimDiameterInches
        ) {
          continue;
        }

        const specs = calculateTyreSpecs({ width: w, aspectRatio: ar, rimDiameter: r });
        const screening = screenCandidateFitment(specs, original, oemVehicleData);

        candidatesMap.set(specs.sizeString, {
          sizeString: specs.sizeString,
          width: specs.width,
          aspectRatio: specs.aspectRatio,
          rimDiameter: specs.rimDiameterInches,
          overallDiameter: specs.overallDiameter,
          sidewallHeight: specs.sidewallHeight,
          circumference: specs.circumference,
          revsPerKm: specs.revsPerKm,
          differencePct: screening.diffPct,
          absDiffPct: screening.absDiff,
          widthDiffMm: screening.widthDiff,
          widthChangePct: screening.widthChangePct,
          speedometer100: screening.speedometer100,
          clearanceChangeMm: screening.clearanceChangeMm,
          category: screening.rimCategory,
          isSameRim: screening.rimCategory === 'SAMERIM',
          isWithinTarget: screening.isWithinTarget,
          isWithinExtended: screening.isWithinExtended,
          isManufacturerApproved: screening.isManufacturerApproved,
          screening,
          status: screening.status,
          statusColor: screening.statusColor,
          statusHeading: screening.statusHeading,
          statusDescription: screening.statusDescription,
          reasons: screening.reasons,
        });
      }
    }
  }

  const candidates = Array.from(candidatesMap.values());

  // Priority order:
  // 1. GREEN (Close calculated alternative)
  // 2. YELLOW (Possible alternative — verify fitment)
  // 3. RED (Outside calculated range)
  // Within each status group, sort by smallest absolute diameter difference % first, then width change %
  const colorPriority = {
    GREEN: 1,
    YELLOW: 2,
    RED: 3,
  };

  candidates.sort((a, b) => {
    const pA = colorPriority[a.statusColor] || 99;
    const pB = colorPriority[b.statusColor] || 99;
    if (pA !== pB) {
      return pA - pB;
    }
    if (Math.abs(a.absDiffPct - b.absDiffPct) > 1e-9) {
      return a.absDiffPct - b.absDiffPct;
    }
    return a.widthChangePct - b.widthChangePct;
  });

  // Filter mutually exclusive category arrays preserving color priority order
  const sameRim = candidates.filter((c) => c.category === 'SAMERIM');
  const downsize = candidates.filter((c) => c.category === 'DOWNSIZE');
  const upsize = candidates.filter((c) => c.category === 'UPSIZE');
  const similar = [...candidates];

  return {
    upsize,
    downsize,
    similar,
    sameRim,
    allCandidates: candidates,
  };
}

