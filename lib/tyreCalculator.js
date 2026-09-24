import { MM_PER_INCH } from './constants.js';

/**
 * Calculates sidewall height in millimetres.
 * Formula: (section width * aspect ratio) / 100
 */
export function calculateSidewallHeight(width, aspectRatio) {
  return (width * aspectRatio) / 100;
}

/**
 * Converts rim diameter from inches to millimetres.
 * Formula: rim diameter in inches * 25.4
 */
export function calculateRimDiameterMm(rimInches) {
  return rimInches * MM_PER_INCH;
}

/**
 * Calculates total overall diameter in millimetres.
 * Formula: rim diameter in mm + (2 * sidewall height in mm)
 */
export function calculateOverallDiameter(rimMm, sidewallMm) {
  return rimMm + (2 * sidewallMm);
}

/**
 * Calculates rolling circumference in millimetres.
 * Formula: Pi * overall diameter in mm
 */
export function calculateCircumference(overallDiameterMm) {
  return Math.PI * overallDiameterMm;
}

/**
 * Calculates wheel revolutions per kilometre.
 * Formula: 1,000,000 / circumference in mm
 */
export function calculateRevsPerKm(circumferenceMm) {
  return circumferenceMm > 0 ? 1000000 / circumferenceMm : 0;
}

/**
 * Computes complete physical specifications for a given tyre dimension.
 */
export function calculateTyreSpecs(input) {
  const width = Math.max(100, Math.min(400, Number(input.width) || 205));
  const aspectRatio = Math.max(20, Math.min(90, Number(input.aspectRatio) || 55));
  const rimDiameter = Math.max(10, Math.min(30, Number(input.rimDiameter) || 16));

  const isValid = Boolean(input.width > 0 && input.aspectRatio > 0 && input.rimDiameter > 0);

  const sidewallHeight = calculateSidewallHeight(width, aspectRatio);
  const rimDiameterMm = calculateRimDiameterMm(rimDiameter);
  const overallDiameter = calculateOverallDiameter(rimDiameterMm, sidewallHeight);
  const circumference = calculateCircumference(overallDiameter);
  const revsPerKm = calculateRevsPerKm(circumference);

  return {
    sizeString: `${width}/${aspectRatio} R${rimDiameter}`,
    width,
    aspectRatio,
    rimDiameterMm: Number(rimDiameterMm.toFixed(1)),
    rimDiameterInches: rimDiameter,
    sidewallHeight: Number(sidewallHeight.toFixed(1)),
    overallDiameter: Number(overallDiameter.toFixed(1)),
    circumference: Number(circumference.toFixed(1)),
    revsPerKm: Number(revsPerKm.toFixed(1)),
    isValid,
  };
}

/**
 * Computes percentage difference in overall diameter between new and original tyre.
 */
export function calculateDiameterDiffPct(newDiameter, originalDiameter) {
  if (!originalDiameter || originalDiameter <= 0) return 0;
  const diff = ((newDiameter - originalDiameter) / originalDiameter) * 100;
  return Number(diff.toFixed(1));
}

/**
 * Calculates actual speed at an indicated speed of 100 km/h.
 */
export function calculateSpeedometer100(newDiameter, originalDiameter) {
  if (!originalDiameter || originalDiameter <= 0) return 100;
  return Number((100 * (newDiameter / originalDiameter)).toFixed(1));
}

/**
 * Calculates ground clearance change in mm.
 */
export function calculateClearanceChangeMm(newDiameter, originalDiameter) {
  if (!originalDiameter || originalDiameter <= 0) return 0;
  return Number(((newDiameter - originalDiameter) / 2).toFixed(1));
}

/**
 * Unit conversion helper functions.
 */
export function mmToInches(mm) {
  return mm / MM_PER_INCH;
}

export function inchesToMm(inches) {
  return inches * MM_PER_INCH;
}

export function formatWidth(widthMm, unit) {
  if (unit === 'IN') {
    return `${(widthMm / MM_PER_INCH).toFixed(2)} in`;
  }
  return `${Math.round(widthMm)} mm`;
}

export function formatLength(lengthMm, unit) {
  if (unit === 'IN') {
    return `${(lengthMm / MM_PER_INCH).toFixed(2)} in`;
  }
  return `${lengthMm.toFixed(1)} mm`;
}
