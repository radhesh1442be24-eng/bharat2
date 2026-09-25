# Bharat Tyres — Tyre Upsize Calculator

A modern, high-precision web application for calculating tyre dimensions, exploring rim-based upsize and downsize alternatives, looking up vehicle factory specifications, and analyzing rolling circumference, speedometer deviation, and ride-height changes.

---

## 1. Product Overview

The **Bharat Tyres Tyre Upsize Calculator** provides automotive professionals, tire dealers, and vehicle owners with accurate, data-backed tyre sizing recommendations.

The calculator operates as a mathematical screening tool and classifies candidates into **three distinct calculated statuses**:
- 🟢 **Close calculated alternative**
- 🟡 **Possible alternative — verify fitment**
- 🔴 **Outside calculated range**

---

## 2. How the Product Works

The calculator processes data through a clear multi-stage workflow:

```
User enters/selects tyre
          ↓
Candidate tyre sizes are identified
          ↓
Candidate dimensions are calculated
          ↓
Candidates are categorized (Same Rim | Downsize | Upsize | Closest Diameter)
          ↓
Diameter and width differences are calculated (%)
          ↓
Green / Yellow / Red screening is applied
          ↓
Results are displayed
```

1. **Input Stage**: The user enters custom tyre dimensions (Width, Aspect Ratio, Rim Diameter) or selects a vehicle from the built-in database.
2. **Calculation Stage**: Full-precision technical specs are computed (Sidewall, Rim Diameter mm, Overall Diameter, Circumference, Revs/km).
3. **Category Assignment**: Candidates are sorted into mutually exclusive rim categories (`SAMERIM`, `DOWNSIZE`, `UPSIZE`, `SIMILAR`).
4. **Compatibility Screening**: Percentage diameter difference and percentage section width change are calculated against threshold limits.
5. **3-Status Classification**: Candidates are assigned `GREEN`, `YELLOW`, or `RED` status.
6. **Result Presentation**: Candidates are presented in strict priority order (Green $\rightarrow$ Yellow $\rightarrow$ Red) with expandable detailed technical comparisons.

---

## 3. How Tyre Candidates Are Determined

Tyre candidates are generated from an authentic commercial tyre dataset of 373 standard sizes (spanning R13 to R22 rim diameters).

Candidates are separated into:
- **Same Rim**: Alternative tyre sizes using the exact same rim diameter ($R_{\text{cand}} = R_{\text{orig}}$).
- **Downsize**: Alternative tyre sizes on smaller rim diameters ($R_{\text{cand}} < R_{\text{orig}}$).
- **Upsize**: Alternative tyre sizes on larger rim diameters ($R_{\text{cand}} > R_{\text{orig}}$).
- **Closest Diameter**: Full spectrum of candidate sizes sorted strictly by absolute overall diameter difference.

Each candidate size is evaluated mathematically against calculated screening thresholds.

> [!NOTE]
> Mathematical candidates are calculated dimensional alternatives and are not guaranteed physical vehicle fitments.

---

## 4. Calculation Formulas

All calculations use **full precision internally**; rounding is performed only when rendering display strings in the UI layer.

### Core Physical Specs:
- **Sidewall Height ($H$)**:
  $$\text{Sidewall Height (mm)} = \frac{\text{Width (mm)} \times \text{Aspect Ratio}}{100}$$

- **Rim Diameter in Millimetres ($D_{\text{rim\_mm}}$)**:
  $$\text{Rim Diameter (mm)} = \text{Rim Diameter (inches)} \times 25.4$$

- **Overall Diameter ($D_{\text{overall}}$)**:
  $$\text{Overall Diameter (mm)} = D_{\text{rim\_mm}} + (2 \times H)$$

- **Rolling Circumference ($C$)**:
  $$\text{Circumference (mm)} = \pi \times D_{\text{overall}}$$

- **Revolutions per Kilometre ($R_{\text{km}}$)**:
  $$\text{Revs / km} = \frac{1,000,000}{C}$$

### Comparative Operational Metrics:
- **Diameter Difference Percentage ($\Delta_{\text{dia}}$)**:
  $$\Delta_{\text{dia}} = \left(\frac{D_{\text{candidate}} - D_{\text{original}}}{D_{\text{original}}}\right) \times 100$$

- **Width Change Percentage ($\Delta_{\text{width}}$)**:
  $$\Delta_{\text{width}} = \left(\frac{|W_{\text{candidate}} - W_{\text{original}}|}{W_{\text{original}}}\right) \times 100$$

- **Speedometer Indication at 100 km/h ($V_{100}$)**:
  $$V_{100} = 100 \times \left(\frac{D_{\text{candidate}}}{D_{\text{original}}}\right)$$

- **Ground Clearance Change ($\Delta_{\text{clearance}}$)**:
  $$\Delta_{\text{clearance}} = \frac{D_{\text{candidate}} - D_{\text{original}}}{2}$$

---

## 5. Classification Logic

Fitment compatibility is classified using percentage-based dimensional screening:

### 🟢 GREEN — Close Calculated Alternative
- **Condition**: $\text{diameterDifferencePct} \le 2.0\%$ **AND** $\text{widthChangePct} \le 10.0\%$
- **Heading**: `Close calculated alternative`
- **Description**: `"Very close in calculated dimensions; verify vehicle fitment"`

### 🟡 YELLOW — Possible Alternative — Verify Fitment
- **Condition**: Does not qualify for Green, but $\text{diameterDifferencePct} \le 3.0\%$ **AND** $\text{widthChangePct} \le 15.0\%$
- **Heading**: `Possible alternative — verify fitment`
- **Description**: `"Dimensionally possible; professional fitment verification required"`

### 🔴 RED — Outside Calculated Range
- **Condition**: $\text{diameterDifferencePct} > 3.0\%$ **OR** $\text{widthChangePct} > 15.0\%$
- **Heading**: `Outside calculated range`
- **Description**: `"Significant dimensional difference"`

---

## 6. Why Percentage Width Is Used

Fixed millimetre steps ($\pm 10\text{ mm}$, $\pm 20\text{ mm}$) are not proportionally equal across different original tyre widths.

For example:
- A $20\text{ mm}$ width increase on a $175\text{ mm}$ tyre represents an $11.4\%$ change.
- A $20\text{ mm}$ width increase on a $275\text{ mm}$ tyre represents a $7.3\%$ change.

Using proportional percentage section width change ($\text{widthChangePct} = \frac{|W_{\text{cand}} - W_{\text{orig}}|}{W_{\text{orig}}} \times 100$) ensures fair, consistent screening across all vehicle and tyre classes.

---

## 7. Difference Between Calculated Compatibility and Physical Fitment

Calculated compatibility evaluates mathematical dimensional proximity only. It does not guarantee physical vehicle fitment.

Actual physical fitment can additionally depend on:
- Recommended rim width range (ETRTO standard)
- Wheel offset (ET) and backspacing
- Pitch Circle Diameter (PCD) and Centre Bore
- Brake disc/caliper clearance
- Full-lock steering & suspension strut clearance
- Wheel arch clearance under full payload compression
- Load index and speed rating compliance
- Vehicle-specific manufacturer information

---

## 8. Result Ordering

Search results are displayed according to strict status hierarchy:

1. 🟢 **Green** (Close calculated alternative)
2. 🟡 **Yellow** (Possible alternative — verify fitment)
3. 🔴 **Red** (Outside calculated range)

Within each status group, candidates are sorted by **smallest absolute diameter difference percentage** ($|\Delta_{\text{dia}}|$) first, followed by smallest width change percentage.

---

## 9. MM / IN Unit System

The calculator provides a dual-unit system toggle (`MM` / `IN`):
- **MM Mode**: Displays width in millimetres, sidewall in mm, overall diameter in mm, clearance in mm.
- **IN Mode**: Displays width in inches ($W / 25.4$), sidewall in inches, overall diameter in inches, clearance in inches.
- Conversion between units uses exact conversion constant $1\text{ inch} = 25.4\text{ mm}$ without precision loss.

---

## 10. Testing & QA Documentation

The project includes an automated test suite verifying 304 test cases across calculation logic, boundary limits, unit conversions, and screening rules.

Detailed test results and boundary matrices are documented in:
[docs/tyre-calculator-test-results.md](file:///c:/Users/Hp/OneDrive/Desktop/bharat-cal2/docs/tyre-calculator-test-results.md)

To run the automated test suite locally:
```bash
node scratch/qaAuditScript.js
```

---

## 11. How to Run

### Prerequisites
- Node.js v18.0 or higher
- npm v9.0 or higher

### Step-by-Step Setup:

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

3. **Run Code Linter**:
   ```bash
   npm run lint
   ```

4. **Build Production Bundle**:
   ```bash
   npm run build
   ```

5. **Start Production Server**:
   ```bash
   npm start
   ```

---

## 12. Project Structure

```
bharat-cal2/
├── app/
│   ├── calculator/page.jsx    # Dedicated calculator route
│   ├── globals.css            # Global Tailwind CSS styles
│   ├── layout.jsx             # Root layout container & HTML metadata
│   └── page.jsx               # Main application page (reactive calculator state)
├── components/
│   ├── CandidatesList.jsx     # Alternatives table with filter toggle & expandable drawer
│   ├── CategoryTabs.jsx       # Mutually exclusive category tab switcher with counts
│   ├── CompactTitle.jsx       # Breadcrumb & title banner
│   ├── EducationalSection.jsx # Educational knowledge base (reading tyres, upsizing guide)
│   ├── FitmentDisclaimer.jsx  # Fitment safety notice banner
│   ├── Footer.jsx             # Brand footer
│   ├── Header.jsx             # Header with logo & navigation
│   ├── HeroSection.jsx        # Landing hero banner
│   ├── MainLayoutContainer.jsx# App-wide responsive layout wrapper
│   ├── OriginalTyreCard.tsx   # Specs overview with dynamic SVG tyre visual
│   ├── PhoneContainer.jsx     # Mobile frame wrapper preview
│   └── TyreInputCard.jsx      # Dual-mode input form (manual specs or car lookup)
├── data/
│   └── vehicles.json          # Raw vehicle database JSON
├── docs/
│   └── tyre-calculator-test-results.md # Automated QA test results & boundary matrix
├── lib/
│   ├── constants.js           # Centralized limits (±2% target, ±3% limit, presets)
│   ├── fitmentScreening.js    # 7-stage fitment screening & 3-status engine
│   ├── standardTyres.js       # Commercial tyre dataset (373 sizes) & candidate generator
│   ├── tyreCalculator.js      # Core mathematical calculation functions
│   ├── tyreTechnicalData.js   # Rim width range (ETRTO) & speed/load index logic
│   └── vehiclesData.js        # Comprehensive Indian market passenger vehicle database
├── public/                    # Static assets, icons, and background images
├── scratch/
│   ├── qaAuditScript.js       # Automated 304-test QA audit script
│   └── testCalculator.js      # Result ordering & candidate generation verification script
└── README.md                  # Comprehensive product documentation
```

---

## 13. Screenshots

The application interface comprises five main visual zones:

1. **Main Input & Vehicle Lookup**: Dual-mode selection card supporting manual dimension dropdowns or Indian vehicle make/model/variant lookup.
   ![Application Interface](file:///c:/Users/Hp/OneDrive/Desktop/bharat-cal2/public/spaceship-bg.png)
2. **Original Tyre Specs & Visual Preview**: Displays canonical physical specs alongside a reactive SVG tyre visual.
3. **Category Tabs & Recommendation Legend**: Mutually exclusive tab switcher (Same Rim | Downsize | Upsize | Closest Diameter) with clear color badges.
4. **Candidates Data Table**: Interactive table with color-coded difference badges, speedometer comparisons, and ride height deltas.
5. **Expandable Detailed Technical Comparison**: Detailed side-by-side specs, screening checklists, and ETRTO rim width range compatibility.

---

## 14. Limitations

Calculated compatibility is mathematical screening only. Physical vehicle fitment should be verified using vehicle-specific information and a qualified tyre/wheel professional where required.

---

© Bharat Tyres — All rights reserved.
