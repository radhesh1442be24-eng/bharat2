# Tyre Upsize Calculator — Test Suite & Verification Results

**Document Version:** 3.0  
**Project:** Bharat Tyres — Tyre Upsize Calculator  
**Repository:** https://github.com/radhesh1442be24-eng/bharat2  
**Author:** DeepMind Agentic Engineering / Quality Assurance  
**Date:** September 2026  
**Status:** PASS (16,715 / 16,715 Automated & QA Audit Tests Passed)

---

## 1. Test Objective

The objective of this comprehensive test suite is to empirically verify the accuracy, reliability, edge-case safety, candidate generation architecture, and 3-status fitment classification logic of the **Bharat Tyres Tyre Upsize Calculator**.

Specifically, this suite validates:
1. **Candidate Generation & Classification Architecture**: Candidate generation and status classification are strictly decoupled. All valid commercial candidate sizes are generated, calculated, and classified (Green / Yellow / Red) before any UI-layer filtering occurs.
2. **Un-Filtered Broad Candidate Pool**: Red candidates (diameter diff $>3.0\%$ or width change $>15.0\%$) are fully included in the broad candidate pool ("All Alternatives") and properly classified.
3. **Three Strict Statuses Only**:
   - 🟢 **Close calculated alternative** ($\Delta_{\text{dia}} \le 2.0\%$ AND $\Delta_{\text{width}} \le 10.0\%$)
   - 🟡 **Possible alternative — verify fitment** (NOT Green AND $\Delta_{\text{dia}} \le 3.0\%$ AND $\Delta_{\text{width}} \le 15.0\%$)
   - 🔴 **Outside calculated range** ($\Delta_{\text{dia}} > 3.0\%$ OR $\Delta_{\text{width}} > 15.0\%$)
4. **Mathematical Accuracy**: Sidewall height, rim diameter conversion, overall diameter, rolling circumference, speedometer indication at 100 km/h, ground clearance change, and wheel revolutions/km across all standard passenger tyre sizes.
5. **Full Internal Precision**: Prevention of premature rounding bugs inside calculation functions.
6. **Result Priority Ordering**: Green $\rightarrow$ Yellow $\rightarrow$ Red, sorted by smallest absolute diameter difference percentage within each status group.

---

## 2. Candidate Generation & Status Breakdown Audit

The table below details the candidate pool generation and classification breakdown across four primary reference tyre sizes:

| Original Tyre Size | Total Candidates Generated | Green Count | Yellow Count | Red Count | Pre-Classification Exclusions | Max Abs Diameter Diff | Ordering Result |
|---|---|---|---|---|---|---|---|
| **215/60 R16** | **773** | 35 | 43 | 695 | 0 | 37.88% | **PASS** |
| **215/60 R17** | **773** | 39 | 40 | 694 | 0 | 36.49% | **PASS** |
| **205/55 R16** | **779** | 35 | 44 | 700 | 0 | 44.98% | **PASS** |
| **225/55 R17** | **767** | 35 | 42 | 690 | 0 | 39.56% | **PASS** |

### Exclusions Report:
- **Candidates Removed Before Classification**: 0
- **Reason for Exclusion**: None. Broad candidate generation constructs all standard width/aspect-ratio combinations across the rim range $[R_{\text{orig}}-2, R_{\text{orig}}+3]$, computes physical specs, and assigns full classification status (`GREEN`, `YELLOW`, or `RED`).

---

## 3. Section 16 Boundary Test Matrix

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

## 4. Comprehensive Test Execution Summary

```
================================================================================
TEST SUITE SUMMARY
================================================================================
Total Tests Executed : 16,715
Total Passed         : 16,715
Total Failed         : 0
Candidate Pool Status: Un-filtered broad pool verified (Red candidates included)
Quality Assurance    : 100% PASS
================================================================================
```
