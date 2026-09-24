import {
  calculateTyreSpecs,
  calculateDiameterDiffPct,
  calculateSpeedometer100,
  calculateClearanceChangeMm,
} from './tyreCalculator.js';
import { DIAMETER_TARGET_PERCENT, MAX_EXTENDED_DIFFERENCE_PERCENT } from './constants.js';

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
  // Enforce reasonable width delta (-50mm to +60mm relative to original width)
  if (w < origWidth - 50 || w > origWidth + 60) return false;
  // Sidewall height must be at least 45mm for safety and wheel rim protection
  const sidewall = (w * ar) / 100;
  if (sidewall < 45) return false;
  return true;
}

/**
 * Generates comprehensive candidate tyre alternatives given an original tyre spec.
 * Evaluates candidates dynamically across standard commercial widths (135–335 mm),
 * aspect ratios (25–85%), and rim sizes (origRim ± 3 inches).
 *
 * Target Limits:
 * - Primary target (±2.0%): isWithinTarget = true
 * - Extended target (up to ±3.0%): isWithinTarget = false (clearly badged)
 *
 * Rim Classification (Mutually Exclusive):
 * - SAMERIM:  candidate.rim === original.rim
 * - DOWNSIZE: candidate.rim < original.rim
 * - UPSIZE:   candidate.rim > original.rim
 * - SIMILAR:  all candidates sorted strictly by absolute overall diameter difference.
 */
export function getCandidateTyres(original) {
  const origDiameter = original.overallDiameter;
  const candidatesMap = new Map();

  const minRim = Math.max(12, original.rimDiameterInches - 3);
  const maxRim = Math.min(24, original.rimDiameterInches + 3);

  // 1. Dynamic candidate generation across commercial sizing grid
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
        const diffPct = calculateDiameterDiffPct(specs.overallDiameter, origDiameter);
        const absDiff = Math.abs(diffPct);

        // Filter within extended target window (up to ±3.0%)
        if (absDiff <= MAX_EXTENDED_DIFFERENCE_PERCENT) {
          const isSameRim = r === original.rimDiameterInches;
          const speedometer100 = calculateSpeedometer100(specs.overallDiameter, origDiameter);
          const clearanceChangeMm = calculateClearanceChangeMm(specs.overallDiameter, origDiameter);
          const isWithinTarget = absDiff <= DIAMETER_TARGET_PERCENT;

          const fitmentNotice = isWithinTarget
            ? `Within ±${DIAMETER_TARGET_PERCENT.toFixed(1)}% target — verify vehicle fitment before purchase.`
            : `Outside ±${DIAMETER_TARGET_PERCENT.toFixed(1)}% target — verify fitment.`;

          let category = 'SAMERIM';
          if (r === original.rimDiameterInches) {
            category = 'SAMERIM';
          } else if (r < original.rimDiameterInches) {
            category = 'DOWNSIZE';
          } else {
            category = 'UPSIZE';
          }

          candidatesMap.set(specs.sizeString, {
            sizeString: specs.sizeString,
            width: specs.width,
            aspectRatio: specs.aspectRatio,
            rimDiameter: specs.rimDiameterInches,
            overallDiameter: specs.overallDiameter,
            circumference: specs.circumference,
            revsPerKm: specs.revsPerKm,
            differencePct: diffPct,
            speedometer100,
            clearanceChangeMm,
            category,
            isSameRim,
            isWithinTarget,
            fitmentNotice,
          });
        }
      }
    }
  }

  const candidates = Array.from(candidatesMap.values());

  // Sort strictly by closest overall diameter difference
  candidates.sort((a, b) => Math.abs(a.differencePct) - Math.abs(b.differencePct));

  const sameRim = candidates.filter((c) => c.category === 'SAMERIM');
  const downsize = candidates.filter((c) => c.category === 'DOWNSIZE');
  const upsize = candidates.filter((c) => c.category === 'UPSIZE');
  const similar = [...candidates].sort((a, b) => Math.abs(a.differencePct) - Math.abs(b.differencePct));

  return {
    upsize,
    downsize,
    similar,
    sameRim,
    allCandidates: candidates,
  };
}
