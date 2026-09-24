import { TyreDimension, TyreSpecs, CandidateTyre, CandidateCategory } from '../types/tyre';
import {
  calculateTyreSpecs,
  calculateDiameterDiffPct,
  calculateSpeedometer100,
  calculateClearanceChangeMm,
} from './tyreCalculator';
import { DIAMETER_TARGET_PERCENT, MAX_EXTENDED_DIFFERENCE_PERCENT } from './constants';

/**
 * Comprehensive dataset of authentic, commercially produced passenger-car, performance, SUV, and light-truck tyre sizes.
 * Covers rim diameters R13 to R22 with standard commercial section widths and aspect ratios.
 */
export const STANDARD_TYRE_SIZES: TyreDimension[] = [
  // R13
  { width: 135, aspectRatio: 80, rimDiameter: 13 },
  { width: 145, aspectRatio: 70, rimDiameter: 13 },
  { width: 145, aspectRatio: 80, rimDiameter: 13 },
  { width: 155, aspectRatio: 65, rimDiameter: 13 },
  { width: 155, aspectRatio: 70, rimDiameter: 13 },
  { width: 155, aspectRatio: 80, rimDiameter: 13 },
  { width: 165, aspectRatio: 65, rimDiameter: 13 },
  { width: 165, aspectRatio: 70, rimDiameter: 13 },
  { width: 165, aspectRatio: 80, rimDiameter: 13 },
  { width: 175, aspectRatio: 60, rimDiameter: 13 },
  { width: 175, aspectRatio: 70, rimDiameter: 13 },
  { width: 185, aspectRatio: 60, rimDiameter: 13 },
  { width: 185, aspectRatio: 70, rimDiameter: 13 },
  { width: 205, aspectRatio: 60, rimDiameter: 13 },

  // R14
  { width: 155, aspectRatio: 65, rimDiameter: 14 },
  { width: 165, aspectRatio: 60, rimDiameter: 14 },
  { width: 165, aspectRatio: 65, rimDiameter: 14 },
  { width: 165, aspectRatio: 70, rimDiameter: 14 },
  { width: 175, aspectRatio: 60, rimDiameter: 14 },
  { width: 175, aspectRatio: 65, rimDiameter: 14 },
  { width: 175, aspectRatio: 70, rimDiameter: 14 },
  { width: 185, aspectRatio: 55, rimDiameter: 14 },
  { width: 185, aspectRatio: 60, rimDiameter: 14 },
  { width: 185, aspectRatio: 65, rimDiameter: 14 },
  { width: 185, aspectRatio: 70, rimDiameter: 14 },
  { width: 185, aspectRatio: 75, rimDiameter: 14 },
  { width: 195, aspectRatio: 60, rimDiameter: 14 },
  { width: 195, aspectRatio: 65, rimDiameter: 14 },
  { width: 195, aspectRatio: 70, rimDiameter: 14 },
  { width: 205, aspectRatio: 60, rimDiameter: 14 },
  { width: 205, aspectRatio: 70, rimDiameter: 14 },
  { width: 215, aspectRatio: 60, rimDiameter: 14 },
  { width: 215, aspectRatio: 65, rimDiameter: 14 },
  { width: 225, aspectRatio: 60, rimDiameter: 14 },

  // R15
  { width: 155, aspectRatio: 80, rimDiameter: 15 },
  { width: 165, aspectRatio: 60, rimDiameter: 15 },
  { width: 165, aspectRatio: 65, rimDiameter: 15 },
  { width: 175, aspectRatio: 55, rimDiameter: 15 },
  { width: 175, aspectRatio: 60, rimDiameter: 15 },
  { width: 175, aspectRatio: 65, rimDiameter: 15 },
  { width: 185, aspectRatio: 55, rimDiameter: 15 },
  { width: 185, aspectRatio: 60, rimDiameter: 15 },
  { width: 185, aspectRatio: 65, rimDiameter: 15 },
  { width: 185, aspectRatio: 70, rimDiameter: 15 },
  { width: 195, aspectRatio: 50, rimDiameter: 15 },
  { width: 195, aspectRatio: 55, rimDiameter: 15 },
  { width: 195, aspectRatio: 60, rimDiameter: 15 },
  { width: 195, aspectRatio: 65, rimDiameter: 15 },
  { width: 195, aspectRatio: 70, rimDiameter: 15 },
  { width: 195, aspectRatio: 75, rimDiameter: 15 },
  { width: 205, aspectRatio: 50, rimDiameter: 15 },
  { width: 205, aspectRatio: 55, rimDiameter: 15 },
  { width: 205, aspectRatio: 60, rimDiameter: 15 },
  { width: 205, aspectRatio: 65, rimDiameter: 15 },
  { width: 205, aspectRatio: 70, rimDiameter: 15 },
  { width: 205, aspectRatio: 75, rimDiameter: 15 },
  { width: 215, aspectRatio: 60, rimDiameter: 15 },
  { width: 215, aspectRatio: 65, rimDiameter: 15 },
  { width: 215, aspectRatio: 70, rimDiameter: 15 },
  { width: 215, aspectRatio: 75, rimDiameter: 15 },
  { width: 225, aspectRatio: 50, rimDiameter: 15 },
  { width: 225, aspectRatio: 55, rimDiameter: 15 },
  { width: 225, aspectRatio: 60, rimDiameter: 15 },
  { width: 225, aspectRatio: 65, rimDiameter: 15 },
  { width: 225, aspectRatio: 70, rimDiameter: 15 },
  { width: 225, aspectRatio: 75, rimDiameter: 15 },
  { width: 235, aspectRatio: 60, rimDiameter: 15 },
  { width: 235, aspectRatio: 70, rimDiameter: 15 },
  { width: 235, aspectRatio: 75, rimDiameter: 15 },
  { width: 245, aspectRatio: 60, rimDiameter: 15 },
  { width: 265, aspectRatio: 70, rimDiameter: 15 },

  // R16
  { width: 185, aspectRatio: 55, rimDiameter: 16 },
  { width: 185, aspectRatio: 60, rimDiameter: 16 },
  { width: 195, aspectRatio: 45, rimDiameter: 16 },
  { width: 195, aspectRatio: 50, rimDiameter: 16 },
  { width: 195, aspectRatio: 55, rimDiameter: 16 },
  { width: 195, aspectRatio: 60, rimDiameter: 16 },
  { width: 195, aspectRatio: 65, rimDiameter: 16 },
  { width: 195, aspectRatio: 75, rimDiameter: 16 },
  { width: 205, aspectRatio: 45, rimDiameter: 16 },
  { width: 205, aspectRatio: 50, rimDiameter: 16 },
  { width: 205, aspectRatio: 55, rimDiameter: 16 },
  { width: 205, aspectRatio: 60, rimDiameter: 16 },
  { width: 205, aspectRatio: 65, rimDiameter: 16 },
  { width: 205, aspectRatio: 70, rimDiameter: 16 },
  { width: 205, aspectRatio: 75, rimDiameter: 16 },
  { width: 205, aspectRatio: 80, rimDiameter: 16 },
  { width: 215, aspectRatio: 45, rimDiameter: 16 },
  { width: 215, aspectRatio: 50, rimDiameter: 16 },
  { width: 215, aspectRatio: 55, rimDiameter: 16 },
  { width: 215, aspectRatio: 60, rimDiameter: 16 },
  { width: 215, aspectRatio: 65, rimDiameter: 16 },
  { width: 215, aspectRatio: 70, rimDiameter: 16 },
  { width: 215, aspectRatio: 85, rimDiameter: 16 },
  { width: 225, aspectRatio: 45, rimDiameter: 16 },
  { width: 225, aspectRatio: 50, rimDiameter: 16 },
  { width: 225, aspectRatio: 55, rimDiameter: 16 },
  { width: 225, aspectRatio: 60, rimDiameter: 16 },
  { width: 225, aspectRatio: 65, rimDiameter: 16 },
  { width: 225, aspectRatio: 70, rimDiameter: 16 },
  { width: 225, aspectRatio: 75, rimDiameter: 16 },
  { width: 235, aspectRatio: 50, rimDiameter: 16 },
  { width: 235, aspectRatio: 55, rimDiameter: 16 },
  { width: 235, aspectRatio: 60, rimDiameter: 16 },
  { width: 235, aspectRatio: 65, rimDiameter: 16 },
  { width: 235, aspectRatio: 70, rimDiameter: 16 },
  { width: 235, aspectRatio: 85, rimDiameter: 16 },
  { width: 245, aspectRatio: 45, rimDiameter: 16 },
  { width: 245, aspectRatio: 50, rimDiameter: 16 },
  { width: 245, aspectRatio: 55, rimDiameter: 16 },
  { width: 245, aspectRatio: 70, rimDiameter: 16 },
  { width: 245, aspectRatio: 75, rimDiameter: 16 },
  { width: 255, aspectRatio: 50, rimDiameter: 16 },
  { width: 255, aspectRatio: 55, rimDiameter: 16 },
  { width: 255, aspectRatio: 65, rimDiameter: 16 },
  { width: 255, aspectRatio: 70, rimDiameter: 16 },
  { width: 265, aspectRatio: 70, rimDiameter: 16 },
  { width: 265, aspectRatio: 75, rimDiameter: 16 },
  { width: 275, aspectRatio: 50, rimDiameter: 16 },
  { width: 275, aspectRatio: 70, rimDiameter: 16 },

  // R17
  { width: 205, aspectRatio: 40, rimDiameter: 17 },
  { width: 205, aspectRatio: 45, rimDiameter: 17 },
  { width: 205, aspectRatio: 50, rimDiameter: 17 },
  { width: 205, aspectRatio: 55, rimDiameter: 17 },
  { width: 205, aspectRatio: 60, rimDiameter: 17 },
  { width: 215, aspectRatio: 40, rimDiameter: 17 },
  { width: 215, aspectRatio: 45, rimDiameter: 17 },
  { width: 215, aspectRatio: 50, rimDiameter: 17 },
  { width: 215, aspectRatio: 55, rimDiameter: 17 },
  { width: 215, aspectRatio: 60, rimDiameter: 17 },
  { width: 215, aspectRatio: 65, rimDiameter: 17 },
  { width: 225, aspectRatio: 40, rimDiameter: 17 },
  { width: 225, aspectRatio: 45, rimDiameter: 17 },
  { width: 225, aspectRatio: 50, rimDiameter: 17 },
  { width: 225, aspectRatio: 55, rimDiameter: 17 },
  { width: 225, aspectRatio: 60, rimDiameter: 17 },
  { width: 225, aspectRatio: 65, rimDiameter: 17 },
  { width: 225, aspectRatio: 70, rimDiameter: 17 },
  { width: 235, aspectRatio: 40, rimDiameter: 17 },
  { width: 235, aspectRatio: 45, rimDiameter: 17 },
  { width: 235, aspectRatio: 50, rimDiameter: 17 },
  { width: 235, aspectRatio: 55, rimDiameter: 17 },
  { width: 235, aspectRatio: 60, rimDiameter: 17 },
  { width: 235, aspectRatio: 65, rimDiameter: 17 },
  { width: 235, aspectRatio: 70, rimDiameter: 17 },
  { width: 245, aspectRatio: 40, rimDiameter: 17 },
  { width: 245, aspectRatio: 45, rimDiameter: 17 },
  { width: 245, aspectRatio: 50, rimDiameter: 17 },
  { width: 245, aspectRatio: 55, rimDiameter: 17 },
  { width: 245, aspectRatio: 60, rimDiameter: 17 },
  { width: 245, aspectRatio: 65, rimDiameter: 17 },
  { width: 245, aspectRatio: 70, rimDiameter: 17 },
  { width: 255, aspectRatio: 40, rimDiameter: 17 },
  { width: 255, aspectRatio: 45, rimDiameter: 17 },
  { width: 255, aspectRatio: 50, rimDiameter: 17 },
  { width: 255, aspectRatio: 55, rimDiameter: 17 },
  { width: 255, aspectRatio: 60, rimDiameter: 17 },
  { width: 255, aspectRatio: 65, rimDiameter: 17 },
  { width: 255, aspectRatio: 70, rimDiameter: 17 },
  { width: 265, aspectRatio: 40, rimDiameter: 17 },
  { width: 265, aspectRatio: 45, rimDiameter: 17 },
  { width: 265, aspectRatio: 65, rimDiameter: 17 },
  { width: 265, aspectRatio: 70, rimDiameter: 17 },
  { width: 275, aspectRatio: 40, rimDiameter: 17 },
  { width: 275, aspectRatio: 45, rimDiameter: 17 },
  { width: 275, aspectRatio: 55, rimDiameter: 17 },
  { width: 275, aspectRatio: 60, rimDiameter: 17 },
  { width: 275, aspectRatio: 65, rimDiameter: 17 },
  { width: 285, aspectRatio: 40, rimDiameter: 17 },
  { width: 285, aspectRatio: 45, rimDiameter: 17 },
  { width: 285, aspectRatio: 70, rimDiameter: 17 },
  { width: 315, aspectRatio: 35, rimDiameter: 17 },

  // R18
  { width: 215, aspectRatio: 35, rimDiameter: 18 },
  { width: 215, aspectRatio: 40, rimDiameter: 18 },
  { width: 215, aspectRatio: 45, rimDiameter: 18 },
  { width: 215, aspectRatio: 50, rimDiameter: 18 },
  { width: 215, aspectRatio: 55, rimDiameter: 18 },
  { width: 225, aspectRatio: 35, rimDiameter: 18 },
  { width: 225, aspectRatio: 40, rimDiameter: 18 },
  { width: 225, aspectRatio: 45, rimDiameter: 18 },
  { width: 225, aspectRatio: 50, rimDiameter: 18 },
  { width: 225, aspectRatio: 55, rimDiameter: 18 },
  { width: 225, aspectRatio: 60, rimDiameter: 18 },
  { width: 235, aspectRatio: 35, rimDiameter: 18 },
  { width: 235, aspectRatio: 40, rimDiameter: 18 },
  { width: 235, aspectRatio: 45, rimDiameter: 18 },
  { width: 235, aspectRatio: 50, rimDiameter: 18 },
  { width: 235, aspectRatio: 55, rimDiameter: 18 },
  { width: 235, aspectRatio: 60, rimDiameter: 18 },
  { width: 235, aspectRatio: 65, rimDiameter: 18 },
  { width: 245, aspectRatio: 35, rimDiameter: 18 },
  { width: 245, aspectRatio: 40, rimDiameter: 18 },
  { width: 245, aspectRatio: 45, rimDiameter: 18 },
  { width: 245, aspectRatio: 50, rimDiameter: 18 },
  { width: 245, aspectRatio: 55, rimDiameter: 18 },
  { width: 245, aspectRatio: 60, rimDiameter: 18 },
  { width: 245, aspectRatio: 65, rimDiameter: 18 },
  { width: 255, aspectRatio: 35, rimDiameter: 18 },
  { width: 255, aspectRatio: 40, rimDiameter: 18 },
  { width: 255, aspectRatio: 45, rimDiameter: 18 },
  { width: 255, aspectRatio: 50, rimDiameter: 18 },
  { width: 255, aspectRatio: 55, rimDiameter: 18 },
  { width: 255, aspectRatio: 60, rimDiameter: 18 },
  { width: 255, aspectRatio: 65, rimDiameter: 18 },
  { width: 255, aspectRatio: 70, rimDiameter: 18 },
  { width: 265, aspectRatio: 35, rimDiameter: 18 },
  { width: 265, aspectRatio: 40, rimDiameter: 18 },
  { width: 265, aspectRatio: 45, rimDiameter: 18 },
  { width: 265, aspectRatio: 60, rimDiameter: 18 },
  { width: 265, aspectRatio: 65, rimDiameter: 18 },
  { width: 265, aspectRatio: 70, rimDiameter: 18 },
  { width: 275, aspectRatio: 35, rimDiameter: 18 },
  { width: 275, aspectRatio: 40, rimDiameter: 18 },
  { width: 275, aspectRatio: 45, rimDiameter: 18 },
  { width: 275, aspectRatio: 60, rimDiameter: 18 },
  { width: 275, aspectRatio: 65, rimDiameter: 18 },
  { width: 275, aspectRatio: 70, rimDiameter: 18 },
  { width: 285, aspectRatio: 30, rimDiameter: 18 },
  { width: 285, aspectRatio: 35, rimDiameter: 18 },
  { width: 285, aspectRatio: 40, rimDiameter: 18 },
  { width: 285, aspectRatio: 50, rimDiameter: 18 },
  { width: 285, aspectRatio: 60, rimDiameter: 18 },
  { width: 285, aspectRatio: 65, rimDiameter: 18 },
  { width: 295, aspectRatio: 30, rimDiameter: 18 },
  { width: 295, aspectRatio: 35, rimDiameter: 18 },
  { width: 295, aspectRatio: 70, rimDiameter: 18 },
  { width: 305, aspectRatio: 30, rimDiameter: 18 },
  { width: 305, aspectRatio: 35, rimDiameter: 18 },

  // R19
  { width: 225, aspectRatio: 35, rimDiameter: 19 },
  { width: 225, aspectRatio: 40, rimDiameter: 19 },
  { width: 225, aspectRatio: 45, rimDiameter: 19 },
  { width: 225, aspectRatio: 50, rimDiameter: 19 },
  { width: 225, aspectRatio: 55, rimDiameter: 19 },
  { width: 235, aspectRatio: 35, rimDiameter: 19 },
  { width: 235, aspectRatio: 40, rimDiameter: 19 },
  { width: 235, aspectRatio: 45, rimDiameter: 19 },
  { width: 235, aspectRatio: 50, rimDiameter: 19 },
  { width: 235, aspectRatio: 55, rimDiameter: 19 },
  { width: 245, aspectRatio: 30, rimDiameter: 19 },
  { width: 245, aspectRatio: 35, rimDiameter: 19 },
  { width: 245, aspectRatio: 40, rimDiameter: 19 },
  { width: 245, aspectRatio: 45, rimDiameter: 19 },
  { width: 245, aspectRatio: 50, rimDiameter: 19 },
  { width: 245, aspectRatio: 55, rimDiameter: 19 },
  { width: 255, aspectRatio: 30, rimDiameter: 19 },
  { width: 255, aspectRatio: 35, rimDiameter: 19 },
  { width: 255, aspectRatio: 40, rimDiameter: 19 },
  { width: 255, aspectRatio: 45, rimDiameter: 19 },
  { width: 255, aspectRatio: 50, rimDiameter: 19 },
  { width: 255, aspectRatio: 55, rimDiameter: 19 },
  { width: 255, aspectRatio: 60, rimDiameter: 19 },
  { width: 265, aspectRatio: 30, rimDiameter: 19 },
  { width: 265, aspectRatio: 35, rimDiameter: 19 },
  { width: 265, aspectRatio: 40, rimDiameter: 19 },
  { width: 265, aspectRatio: 45, rimDiameter: 19 },
  { width: 265, aspectRatio: 50, rimDiameter: 19 },
  { width: 265, aspectRatio: 55, rimDiameter: 19 },
  { width: 275, aspectRatio: 30, rimDiameter: 19 },
  { width: 275, aspectRatio: 35, rimDiameter: 19 },
  { width: 275, aspectRatio: 40, rimDiameter: 19 },
  { width: 275, aspectRatio: 45, rimDiameter: 19 },
  { width: 275, aspectRatio: 50, rimDiameter: 19 },
  { width: 275, aspectRatio: 55, rimDiameter: 19 },
  { width: 285, aspectRatio: 30, rimDiameter: 19 },
  { width: 285, aspectRatio: 35, rimDiameter: 19 },
  { width: 285, aspectRatio: 40, rimDiameter: 19 },
  { width: 285, aspectRatio: 45, rimDiameter: 19 },
  { width: 295, aspectRatio: 30, rimDiameter: 19 },
  { width: 295, aspectRatio: 35, rimDiameter: 19 },
  { width: 295, aspectRatio: 40, rimDiameter: 19 },
  { width: 305, aspectRatio: 30, rimDiameter: 19 },
  { width: 305, aspectRatio: 35, rimDiameter: 19 },
  { width: 325, aspectRatio: 30, rimDiameter: 19 },

  // R20
  { width: 235, aspectRatio: 35, rimDiameter: 20 },
  { width: 235, aspectRatio: 40, rimDiameter: 20 },
  { width: 235, aspectRatio: 45, rimDiameter: 20 },
  { width: 235, aspectRatio: 50, rimDiameter: 20 },
  { width: 235, aspectRatio: 55, rimDiameter: 20 },
  { width: 245, aspectRatio: 30, rimDiameter: 20 },
  { width: 245, aspectRatio: 35, rimDiameter: 20 },
  { width: 245, aspectRatio: 40, rimDiameter: 20 },
  { width: 245, aspectRatio: 45, rimDiameter: 20 },
  { width: 245, aspectRatio: 50, rimDiameter: 20 },
  { width: 255, aspectRatio: 30, rimDiameter: 20 },
  { width: 255, aspectRatio: 35, rimDiameter: 20 },
  { width: 255, aspectRatio: 40, rimDiameter: 20 },
  { width: 255, aspectRatio: 45, rimDiameter: 20 },
  { width: 255, aspectRatio: 50, rimDiameter: 20 },
  { width: 255, aspectRatio: 55, rimDiameter: 20 },
  { width: 265, aspectRatio: 30, rimDiameter: 20 },
  { width: 265, aspectRatio: 35, rimDiameter: 20 },
  { width: 265, aspectRatio: 40, rimDiameter: 20 },
  { width: 265, aspectRatio: 45, rimDiameter: 20 },
  { width: 265, aspectRatio: 50, rimDiameter: 20 },
  { width: 275, aspectRatio: 30, rimDiameter: 20 },
  { width: 275, aspectRatio: 35, rimDiameter: 20 },
  { width: 275, aspectRatio: 40, rimDiameter: 20 },
  { width: 275, aspectRatio: 45, rimDiameter: 20 },
  { width: 275, aspectRatio: 50, rimDiameter: 20 },
  { width: 275, aspectRatio: 55, rimDiameter: 20 },
  { width: 285, aspectRatio: 30, rimDiameter: 20 },
  { width: 285, aspectRatio: 35, rimDiameter: 20 },
  { width: 285, aspectRatio: 40, rimDiameter: 20 },
  { width: 285, aspectRatio: 45, rimDiameter: 20 },
  { width: 285, aspectRatio: 50, rimDiameter: 20 },
  { width: 295, aspectRatio: 30, rimDiameter: 20 },
  { width: 295, aspectRatio: 35, rimDiameter: 20 },
  { width: 295, aspectRatio: 40, rimDiameter: 20 },
  { width: 295, aspectRatio: 45, rimDiameter: 20 },
  { width: 305, aspectRatio: 30, rimDiameter: 20 },
  { width: 305, aspectRatio: 35, rimDiameter: 20 },
  { width: 305, aspectRatio: 40, rimDiameter: 20 },
  { width: 315, aspectRatio: 30, rimDiameter: 20 },
  { width: 315, aspectRatio: 35, rimDiameter: 20 },
  { width: 325, aspectRatio: 30, rimDiameter: 20 },
  { width: 325, aspectRatio: 35, rimDiameter: 20 },

  // R21
  { width: 245, aspectRatio: 35, rimDiameter: 21 },
  { width: 245, aspectRatio: 40, rimDiameter: 21 },
  { width: 255, aspectRatio: 30, rimDiameter: 21 },
  { width: 255, aspectRatio: 35, rimDiameter: 21 },
  { width: 255, aspectRatio: 40, rimDiameter: 21 },
  { width: 255, aspectRatio: 45, rimDiameter: 21 },
  { width: 255, aspectRatio: 50, rimDiameter: 21 },
  { width: 265, aspectRatio: 30, rimDiameter: 21 },
  { width: 265, aspectRatio: 35, rimDiameter: 21 },
  { width: 265, aspectRatio: 40, rimDiameter: 21 },
  { width: 265, aspectRatio: 45, rimDiameter: 21 },
  { width: 275, aspectRatio: 30, rimDiameter: 21 },
  { width: 275, aspectRatio: 35, rimDiameter: 21 },
  { width: 275, aspectRatio: 40, rimDiameter: 21 },
  { width: 275, aspectRatio: 45, rimDiameter: 21 },
  { width: 285, aspectRatio: 25, rimDiameter: 21 },
  { width: 285, aspectRatio: 30, rimDiameter: 21 },
  { width: 285, aspectRatio: 35, rimDiameter: 21 },
  { width: 285, aspectRatio: 40, rimDiameter: 21 },
  { width: 285, aspectRatio: 45, rimDiameter: 21 },
  { width: 295, aspectRatio: 25, rimDiameter: 21 },
  { width: 295, aspectRatio: 30, rimDiameter: 21 },
  { width: 295, aspectRatio: 35, rimDiameter: 21 },
  { width: 295, aspectRatio: 40, rimDiameter: 21 },
  { width: 305, aspectRatio: 30, rimDiameter: 21 },
  { width: 305, aspectRatio: 35, rimDiameter: 21 },
  { width: 315, aspectRatio: 30, rimDiameter: 21 },
  { width: 315, aspectRatio: 35, rimDiameter: 21 },
  { width: 315, aspectRatio: 40, rimDiameter: 21 },
  { width: 325, aspectRatio: 30, rimDiameter: 21 },

  // R22
  { width: 255, aspectRatio: 30, rimDiameter: 22 },
  { width: 255, aspectRatio: 35, rimDiameter: 22 },
  { width: 255, aspectRatio: 40, rimDiameter: 22 },
  { width: 255, aspectRatio: 45, rimDiameter: 22 },
  { width: 265, aspectRatio: 30, rimDiameter: 22 },
  { width: 265, aspectRatio: 35, rimDiameter: 22 },
  { width: 265, aspectRatio: 40, rimDiameter: 22 },
  { width: 275, aspectRatio: 35, rimDiameter: 22 },
  { width: 275, aspectRatio: 40, rimDiameter: 22 },
  { width: 275, aspectRatio: 45, rimDiameter: 22 },
  { width: 275, aspectRatio: 50, rimDiameter: 22 },
  { width: 285, aspectRatio: 30, rimDiameter: 22 },
  { width: 285, aspectRatio: 35, rimDiameter: 22 },
  { width: 285, aspectRatio: 40, rimDiameter: 22 },
  { width: 285, aspectRatio: 45, rimDiameter: 22 },
  { width: 295, aspectRatio: 30, rimDiameter: 22 },
  { width: 295, aspectRatio: 35, rimDiameter: 22 },
  { width: 295, aspectRatio: 40, rimDiameter: 22 },
  { width: 305, aspectRatio: 30, rimDiameter: 22 },
  { width: 305, aspectRatio: 35, rimDiameter: 22 },
  { width: 305, aspectRatio: 40, rimDiameter: 22 },
  { width: 305, aspectRatio: 45, rimDiameter: 22 },
  { width: 315, aspectRatio: 30, rimDiameter: 22 },
  { width: 315, aspectRatio: 35, rimDiameter: 22 },
  { width: 315, aspectRatio: 40, rimDiameter: 22 },
  { width: 325, aspectRatio: 35, rimDiameter: 22 },
  { width: 335, aspectRatio: 25, rimDiameter: 22 },
];

/**
 * Generates candidate tyre alternatives given an original tyre spec.
 * Evaluates candidates up to MAX_EXTENDED_DIFFERENCE_PERCENT (±3.0%) window:
 * - Candidates within DIAMETER_TARGET_PERCENT (±2.0%) are primary target candidates (isWithinTarget = true).
 * - Candidates between ±2.0% and ±3.0% are secondary close alternatives (isWithinTarget = false), clearly marked.
 */
export function getCandidateTyres(original: TyreSpecs): {
  upsize: CandidateTyre[];
  downsize: CandidateTyre[];
  similar: CandidateTyre[];
  sameRim: CandidateTyre[];
  allCandidates: CandidateTyre[];
} {
  const origDiameter = original.overallDiameter;
  const candidates: CandidateTyre[] = [];

  for (const size of STANDARD_TYRE_SIZES) {
    // Skip exact same size
    if (
      size.width === original.width &&
      size.aspectRatio === original.aspectRatio &&
      size.rimDiameter === original.rimDiameterInches
    ) {
      continue;
    }

    const specs = calculateTyreSpecs(size);
    const diffPct = calculateDiameterDiffPct(specs.overallDiameter, origDiameter);
    const absDiff = Math.abs(diffPct);

    // Primary target is ±2.0%, secondary allowed up to ±3.0%
    if (absDiff <= MAX_EXTENDED_DIFFERENCE_PERCENT) {
      const isSameRim = size.rimDiameter === original.rimDiameterInches;
      const speedometer100 = calculateSpeedometer100(specs.overallDiameter, origDiameter);
      const clearanceChangeMm = calculateClearanceChangeMm(specs.overallDiameter, origDiameter);
      const isWithinTarget = absDiff <= DIAMETER_TARGET_PERCENT;

      const fitmentNotice = isWithinTarget
        ? `Within ±${DIAMETER_TARGET_PERCENT.toFixed(1)}% target — verify vehicle fitment before purchase.`
        : `Outside ±${DIAMETER_TARGET_PERCENT.toFixed(1)}% target — verify fitment.`;

      // Determine category strictly by Rim Diameter priority:
      // 1. SAME RIM: candidate.rim === original.rim (regardless of width)
      // 2. DOWNSIZE: candidate.rim < original.rim (smaller rim)
      // 3. UPSIZE:   candidate.rim > original.rim (larger rim)
      let category: CandidateCategory = 'SAMERIM';

      if (size.rimDiameter === original.rimDiameterInches) {
        category = 'SAMERIM';
      } else if (size.rimDiameter < original.rimDiameterInches) {
        category = 'DOWNSIZE';
      } else {
        category = 'UPSIZE';
      }

      candidates.push({
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

  // Primary sort by closest overall diameter difference
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
