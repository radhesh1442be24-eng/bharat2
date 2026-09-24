/**
 * Unit system for calculator inputs and specifications display.
 */
export type UnitSystem = 'MM' | 'IN';

/**
 * Category classification for candidate alternative tyres.
 */
export type CandidateCategory = 'SAMERIM' | 'UPSIZE' | 'DOWNSIZE' | 'SIMILAR';

/**
 * Basic dimensional input for a tyre.
 */
export interface TyreDimension {
  width: number;       // Section width in millimetres (e.g. 205)
  aspectRatio: number; // Aspect ratio percentage (e.g. 55)
  rimDiameter: number; // Rim diameter in inches (e.g. 16)
}

/**
 * Calculated physical specifications of a tyre size.
 */
export interface TyreSpecs {
  sizeString: string;          // Conventional tyre size notation (e.g. "205/55 R16")
  width: number;               // Section width in mm
  aspectRatio: number;         // Aspect ratio %
  sidewallHeight: number;      // Sidewall height in mm
  rimDiameterMm: number;       // Rim diameter in mm
  rimDiameterInches: number;   // Rim diameter in inches
  overallDiameter: number;     // Overall tyre diameter in mm
  circumference: number;       // Rolling circumference in mm
  revsPerKm: number;           // Revolutions per kilometre
  isValid: boolean;            // Valid input flag
}

/**
 * Candidate tyre alternative with comparative calculations against original tyre specs.
 */
export interface CandidateTyre {
  sizeString: string;
  width: number;
  aspectRatio: number;
  rimDiameter: number;
  overallDiameter: number;
  circumference: number;
  revsPerKm: number;
  differencePct: number;       // Percentage difference in overall diameter (+/- %)
  speedometer100: number;      // Actual speed at 100 km/h indicated speed
  clearanceChangeMm: number;   // Change in vehicle ground clearance (mm)
  category: CandidateCategory; // Rim-based category assignment
  isSameRim: boolean;          // True if candidate uses original rim size
  isWithinTarget: boolean;     // True if Math.abs(differencePct) <= 2.0%
  fitmentNotice: string;      // Guidance notice for vehicle fitment
}

/**
 * Vehicle OEM specification from dataset.
 */
export interface VehicleData {
  make: string;
  model: string;
  variant: string;
  year?: number;
  width: number;
  aspectRatio: number;
  rim: number;
}
