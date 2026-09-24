/**
 * Tyre Technical Specifications & Standard Technical Lookup Helpers
 * Follows ETRTO / TRA standards for rim width, load rating, and speed rating comparisons.
 */

// Speed rating maximum speeds in km/h
export const SPEED_RATINGS_MAP = {
  L: 120,
  M: 130,
  N: 140,
  P: 150,
  Q: 160,
  R: 170,
  S: 180,
  T: 190,
  U: 200,
  H: 210,
  V: 240,
  W: 270,
  Y: 300,
  ZR: 240,
};

/**
 * Compares speed rating strings.
 * Returns true if candidate >= oem, false if candidate < oem, or null if unknown.
 */
export function compareSpeedRatings(candidateRating, oemRating) {
  if (!candidateRating || !oemRating) return null;

  const candSpeed = SPEED_RATINGS_MAP[String(candidateRating).toUpperCase()];
  const oemSpeed = SPEED_RATINGS_MAP[String(oemRating).toUpperCase()];

  if (!candSpeed || !oemSpeed) return null;
  return candSpeed >= oemSpeed;
}

/**
 * Compares load index numbers.
 * Returns true if candidate >= oem, false if candidate < oem, or null if unknown.
 */
export function compareLoadIndex(candidateLoad, oemLoad) {
  if (candidateLoad === null || candidateLoad === undefined || oemLoad === null || oemLoad === undefined) {
    return null;
  }
  const cand = Number(candidateLoad);
  const oem = Number(oemLoad);
  if (isNaN(cand) || isNaN(oem)) return null;

  return cand >= oem;
}

/**
 * Computes standard ETRTO recommended rim width range (min, max, measuring rim) in inches.
 */
export function getRecommendedRimWidthRange(widthMm, aspectRatio) {
  const w = Number(widthMm) || 205;
  const ar = Number(aspectRatio) || 55;

  // ETRTO standard factor based on profile ratio
  let rimFactor = 0.70;
  if (ar <= 45) {
    rimFactor = 0.85;
  } else if (ar <= 55) {
    rimFactor = 0.75;
  } else if (ar <= 65) {
    rimFactor = 0.70;
  } else {
    rimFactor = 0.65;
  }

  const rawMeasuringRim = (w * rimFactor) / 25.4;
  const measuringRim = Math.round(rawMeasuringRim * 2) / 2; // round to nearest 0.5"

  const minRim = Math.max(3.5, measuringRim - 1.0);
  const maxRim = measuringRim + 1.0;

  return {
    min: minRim,
    max: maxRim,
    measuring: measuringRim,
  };
}
