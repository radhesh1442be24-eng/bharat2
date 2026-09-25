# Tyre Upsize Calculator — Test Suite & Verification Results

**Document Version:** 2.1  
**Project:** Bharat Tyres — Tyre Upsize Calculator  
**Repository:** https://github.com/radhesh1442be24-eng/bharat2  
**Author:** DeepMind Agentic Engineering / Quality Assurance  
**Date:** September 2026  
**Status:** PASS (304 / 304 Automated & QA Audit Tests Passed)

---

## 1. Test Objective

The objective of this comprehensive test suite is to empirically verify the accuracy, reliability, edge-case safety, and 3-status fitment classification logic of the **Bharat Tyres Tyre Upsize Calculator**.

Specifically, this suite validates:
1. **Mathematical Accuracy**: Sidewall height, rim diameter conversion, overall diameter, rolling circumference, speedometer indication at 100 km/h, ground clearance change, and wheel revolutions/km across all standard passenger tyre sizes.
2. **Full Internal Precision**: Prevention of premature rounding bugs inside calculation functions.
3. **Professional Fitment Screening**: Strict separation between **Calculated Size Compatibility** (Green / Yellow / Red) and physical vehicle fitment.
4. **Three Strict Statuses Only**:
   - 🟢 **Close calculated alternative**
   - 🟡 **Possible alternative — verify fitment**
   - 🔴 **Outside calculated range**
5. **Percentage Width Classification**: Section width changes calculated as percentage deltas ($\text{widthChangePct} = \frac{|W_{\text{new}} - W_{\text{orig}}|}{W_{\text{orig}}} \times 100$) rather than fixed millimetre steps.
6. **Exact Boundary Compliance**: Section 16 boundary tests for diameter ($\le 2.0\%$, $\le 3.0\%$, $> 3.0\%$) and width ($\le 10.0\%$, $\le 15.0\%$, $> 15.0\%$).
7. **Result Priority Ordering**: Green $\rightarrow$ Yellow $\rightarrow$ Red, sorted by smallest absolute diameter difference percentage within each status group.
8. **Mutually Exclusive Category Separation**: Same Rim Diameter ($R_{\text{new}} = R_{\text{orig}}$), Downsize ($R_{\text{new}} < R_{\text{orig}}$), Upsize ($R_{\text{new}} > R_{\text{orig}}$), and Closest Diameter.
9. **Responsive UI & Conversion Accuracy**: Seamless metric (mm) to imperial (in) conversions and layout integrity.

---

## 2. Test Environment

- **Localhost URL**: `http://localhost:3000`
- **Runtime**: Node.js v20+ / Next.js 16.3.6 (App Router) / React 19
- **Operating System**: Windows 11 x64
- **Test Executable Scripts**: `scratch/qaAuditScript.js`, `scratch/testCalculator.js`
- **Execution Command**: `node scratch/qaAuditScript.js`

---

## 3. Test Methodology

Tests are executed using independent double-calculation formulas without relying on application internal state or pre-computed UI values.

### Independent Core Reference Formulas:
- **Sidewall Height ($H$)**: $H = \frac{W \times AR}{100}$
- **Rim Diameter in mm ($D_{\text{rim}}$)**: $D_{\text{rim}} = R_{\text{inches}} \times 25.4$
- **Overall Diameter ($D$)**: $D = D_{\text{rim}} + (2 \times H)$
- **Rolling Circumference ($C$)**: $C = \pi \times D$
- **Revolutions per Kilometre ($R_{\text{km}}$)**: $R_{\text{km}} = \frac{1,000,000}{C}$
- **Diameter Difference Percentage ($\Delta_{\text{dia}}$)**: $\Delta_{\text{dia}} = \frac{D_{\text{new}} - D_{\text{orig}}}{D_{\text{orig}}} \times 100$
- **Width Change Percentage ($\Delta_{\text{width}}$)**: $\Delta_{\text{width}} = \frac{|W_{\text{new}} - W_{\text{orig}}|}{W_{\text{orig}}} \times 100$
- **Speedometer Indication at 100 km/h ($V_{100}$)**: $V_{100} = 100 \times \frac{D_{\text{new}}}{D_{\text{orig}}}$
- **Ride Height Change ($\Delta_{\text{clearance}}$)**: $\Delta_{\text{clearance}} = \frac{D_{\text{new}} - D_{\text{orig}}}{2}$

---

## 4. QA Audit History & Bug Fix Verification

### Previous QA Result (Phase 1 Audit):
- **Total Tests Executed**: 127
- **Passed**: 124
- **Failed**: 3
- **Identified Bug**: `calculateDiameterDiffPct` executed `toFixed(1)` inside the core math layer before returning the result.
  - *Impact*: Values such as $+2.01\%$, $-2.01\%$, and $+3.01\%$ were rounded to $+2.0\%$, $-2.0\%$, and $+3.0\%$, erroneously causing candidates beyond threshold limits to pass boundary checks.
- **Fix Implemented**: Removed `toFixed()` from internal calculation utilities. Maintained double-precision float values internally and moved display formatting exclusively to the UI presentation layer.
- **Post-Fix Phase 1 Result**: **127 / 127 Passed (100%)**.

### Current QA Result (Phase 2 Professional Fitment Upgrade):
- **Total Tests Executed**: 304
- **Passed**: 304
- **Failed**: 0
- **Pass Rate**: **100%**

---

## 5. Section 16 Boundary Test Matrix

All boundary conditions use exact internal unrounded float values.

| # | Diameter Difference % ($\Delta_{\text{dia}}$) | Width Change % ($\Delta_{\text{width}}$) | Expected Classification Status | Actual Classification Status | Test Result |
|---|---|---|---|---|---|
| 1 | 0.0% | 0.0% | `GREEN` (Close calculated alternative) | `GREEN` | **PASS** |
| 2 | 1.5% | 5.0% | `GREEN` (Close calculated alternative) | `GREEN` | **PASS** |
| 3 | 2.0% | 10.0% | `GREEN` (Close calculated alternative) | `GREEN` | **PASS** |
| 4 | 2.01% | 5.0% | `YELLOW` (Possible alternative — verify fitment) | `YELLOW` | **PASS** |
| 5 | 1.5% | 10.01% | `YELLOW` (Possible alternative — verify fitment) | `YELLOW` | **PASS** |
| 6 | 3.0% | 5.0% | `YELLOW` (Possible alternative — verify fitment) | `YELLOW` | **PASS** |
| 7 | 3.01% | 5.0% | `RED` (Outside calculated range) | `RED` | **PASS** |
| 8 | 1.0% | 15.0% | `YELLOW` (Possible alternative — verify fitment) | `YELLOW` | **PASS** |
| 9 | 1.0% | 15.01% | `RED` (Outside calculated range) | `RED` | **PASS** |
| 10 | 2.5% | 12.0% | `YELLOW` (Possible alternative — verify fitment) | `YELLOW` | **PASS** |
| 11 | 3.5% | 5.0% | `RED` (Outside calculated range) | `RED` | **PASS** |
| 12 | 1.0% | 18.0% | `RED` (Outside calculated range) | `RED` | **PASS** |
| 13 | 4.0% | 20.0% | `RED` (Outside calculated range) | `RED` | **PASS** |
| 14 | -2.01% | 5.0% | `YELLOW` (Possible alternative — verify fitment) | `YELLOW` | **PASS** |
| 15 | -3.01% | 5.0% | `RED` (Outside calculated range) | `RED` | **PASS** |

---

## 6. Comprehensive Test Section Breakdown

### Section 1: Independent Calculation Verification (30 Tests)
Evaluated specs across 6 sample sizes (`215/60 R17`, `225/55 R17`, `205/55 R16`, `195/65 R15`, `245/45 R18`, `175/65 R14`).
- Sidewall Height ($\pm 0.05\text{ mm}$): **PASS**
- Rim Diameter mm ($\pm 0.05\text{ mm}$): **PASS**
- Overall Diameter ($\pm 0.1\text{ mm}$): **PASS**
- Rolling Circumference ($\pm 0.2\text{ mm}$): **PASS**
- Revolutions / km ($\pm 0.2\text{ revs}$): **PASS**

### Section 2: Mandatory Known Reference Benchmark Case (`215/60 R17` vs `225/55 R17`) (6 Tests)
- OE Sidewall: `129.0 mm` (Expected 129.0 mm) $\rightarrow$ **PASS**
- OE Rim Diameter: `431.8 mm` (Expected 431.8 mm) $\rightarrow$ **PASS**
- OE Overall Diameter: `689.8 mm` (Expected 689.8 mm) $\rightarrow$ **PASS**
- OE Circumference: `2167.1 mm` (Expected 2167.1 mm) $\rightarrow$ **PASS**
- Candidate Sidewall: `123.75 mm` (Expected 123.75 mm) $\rightarrow$ **PASS**
- Candidate Overall Diameter: `679.3 mm` (Expected 679.3 mm) $\rightarrow$ **PASS**
- Diameter Difference: `-1.52%` (Expected ~ -1.52%) $\rightarrow$ **PASS**
- Speedometer @ 100 km/h: `98.5 km/h` (Expected ~ 98.48 km/h) $\rightarrow$ **PASS**

### Section 3: 20+ Commercial Tyre Combinations Candidate Generation (40 Tests)
Validated non-NaN calculations and candidate list generation across 20 common Indian car tyre sizes. All combinations produced valid candidate sets. $\rightarrow$ **PASS**

### Section 4: Target & Extended Window Boundary Checks (10 Tests)
Checked exact threshold behaviors around $\pm 2.0\%$ target and $\pm 3.0\%$ limit for diameter variance. $\rightarrow$ **PASS**

### Section 5: MM $\leftrightarrow$ INCH Conversion & Lossless Roundtrip (2 Tests)
Validated conversion from millimetres to inches and back to millimetres ($215\text{ mm} \rightarrow 8.46457\text{ in} \rightarrow 215\text{ mm}$).
- Delta overall diameter: $< 0.0001\text{ mm}$ $\rightarrow$ **PASS**

### Section 6: Edge Case & Invalid Input Safety (20 Tests)
Executed calculator against zero values, negative widths, string inputs (`'abc'`), `null` values, and extreme out-of-range specs (`9999/999 R999`).
- Non-NaN guarantee: **PASS**
- Finite number bounds: **PASS**

### Section 7: Section 16 Boundary & Percentage Width Tests (15 Tests)
Tested all 15 explicit test cases specified in Section 16. All classifications matched expected `GREEN`, `YELLOW`, or `RED` values. $\rightarrow$ **PASS**

### Section 8: Vehicle / OEM Fitment Verification Tests (6 Tests)
- Evaluated mock Hyundai Creta specs (`215/60 R17` OE, `215/55 R18` OEM size).
- Sizes classified under 3-status logic (`GREEN` for close dimensions, `YELLOW` for extended dimensions). $\rightarrow$ **PASS**

### Section 9: Category vs. Status Independence Tests (175 Tests)
Verified that Category (`SAMERIM`, `UPSIZE`, `DOWNSIZE`) and Status (`GREEN`, `YELLOW`, `RED`) remain completely decoupled.
- All candidate sizes in `sameRim` array have $R_{\text{candidate}} = R_{\text{orig}}$.
- All candidate sizes in `upsize` array have $R_{\text{candidate}} > R_{\text{orig}}$.
- All candidate sizes in `downsize` array have $R_{\text{candidate}} < R_{\text{orig}}$. $\rightarrow$ **PASS**

---

## 7. Visual QA

| Checkpoint | Status | Details |
|---|---|---|
| **Desktop Layout** | **PASS** | 2-column input & specs layout with responsive data tables |
| **Mobile Layout** | **PASS** | Touch-friendly inputs, horizontal table scroll, stacked drawers |
| **Result Ordering** | **PASS** | Strict Green $\rightarrow$ Yellow $\rightarrow$ Red order by $|\Delta_{\text{dia}}|$ |
| **Difference Colors** | **PASS** | Green badge for Green status, Yellow badge for Yellow status, Red badge for Red status |
| **Recommendation Legend**| **PASS** | Displays exactly 3 statuses (🟢 Close calculated alternative, 🟡 Possible alternative — verify fitment, 🔴 Outside calculated range) |
| **UI Overflow** | **PASS** | No layout overflow or clipping across mobile or desktop breakpoints |

---

## 8. Summary Table of Test Execution Results

```
================================================================================
TEST SUITE SUMMARY
================================================================================
Total Tests Executed : 304
Total Passed         : 304
Total Failed         : 0
Regression Status    : 100% PASS (All 127 previous + 177 new tests passing)
Final QA Verdict     : APPROVED FOR PRODUCTION
================================================================================
```
