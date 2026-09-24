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
 * @param {Object} original - Original tyre specs ({ width, aspectRatio, rimDiameterInches, overallDiameter, ... })
 * @param {Object|null} oemVehicleData - Optional vehicle OEM details
 */
export function getCandidateTyres(original, oemVehicleData = null) {
  const candidatesMap = new Map();

  const minRim = Math.max(12, original.rimDiameterInches - 2);
  const maxRim = Math.min(24, original.rimDiameterInches + 3);

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

        // Include candidate if within extended target window (up to ±3.0%)
        if (screening.isWithinExtended) {
          candidatesMap.set(specs.sizeString, {
            sizeString: specs.sizeString,
            width: specs.width,
            aspectRatio: specs.aspectRatio,
            rimDiameter: specs.rimDiameterInches,
            overallDiameter: specs.overallDiameter,
            circumference: specs.circumference,
            revsPerKm: specs.revsPerKm,
            differencePct: screening.diffPct,
            absDiffPct: screening.absDiff,
            speedometer100: screening.speedometer100,
            clearanceChangeMm: screening.clearanceChangeMm,
            category: screening.rimCategory,
            isSameRim: screening.rimCategory === 'SAMERIM',
            isWithinTarget: screening.isWithinTarget,
            isWithinExtended: screening.isWithinExtended,
            screening,
            statusColor: screening.statusColor,
            statusHeading: screening.statusHeading,
            reasons: screening.reasons,
          });
        }
      }
    }
  }

  const candidates = Array.from(candidatesMap.values());

  // Priority order: 1. GREEN (Close calculated), 2. YELLOW (Possible alternative), 3. RED (Not recommended)
  // Within each color group, sort by smallest absolute diameter difference % first
  const colorPriority = { GREEN: 1, YELLOW: 2, RED: 3 };

  candidates.sort((a, b) => {
    const pA = colorPriority[a.statusColor] || 99;
    const pB = colorPriority[b.statusColor] || 99;
    if (pA !== pB) {
      return pA - pB;
    }
    return a.absDiffPct - b.absDiffPct;
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
