# Bharat Tyres — Tyre Upsize Calculator

A modern, high-precision web application for calculating tyre sizes, exploring rim-based upsize and downsize alternatives, looking up vehicle OEM factory tyre specifications, and analyzing rolling circumference, speedometer deviation, and clearance changes.

## Overview
The Bharat Tyres Tyre Upsize Calculator allows automotive professionals, tire dealers, and vehicle owners to evaluate valid tire size alternatives. It enforces strict rim-based priority categorization (Same Rim, Downsize, Upsize, Closest Diameter) and filters candidate sizes based on overall diameter deviation target thresholds (±2.0% primary target, extended up to ±3.0%).

## Tech Stack
- **Framework**: Next.js 15+ (App Router)
- **UI & Logic**: React 19, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## Features
- **Tyre Size Calculation**: Dual unit support (Millimetres / Inches) for tread width, sidewall height, overall diameter, rolling circumference, and revs/km (or revs/mi).
- **Vehicle Lookup**: Built-in vehicle database mapping car makes, models, and variants to OEM factory tire sizes.
- **Mutually Exclusive Rim Categorization**:
  - **Same Rim**: Alternative tire sizes using the exact same rim diameter ($R_{candidate} = R_{original}$).
  - **Downsize**: Alternative tire sizes on smaller rim diameters ($R_{candidate} < R_{original}$).
  - **Upsize**: Alternative tire sizes on larger rim diameters ($R_{candidate} > R_{original}$).
  - **Closest Diameter**: Full spectrum of candidate sizes sorted strictly by absolute overall diameter difference.
- **Primary vs. Extended Target Range**: Toggle between standard (±2.0%) and extended (up to ±3.0%) diameter deviation thresholds.
- **Speedometer Deviation & Clearance Analysis**: Calculates actual vehicle speed at 100 km/h indicated and ride-height clearance changes in mm.
- **Responsive Layout**: Designed for seamless mobile and desktop navigation with responsive data tables and visual SVG tire previews.
- **Fitment Disclaimer & Safety Notice**: Professional guidance reminding users to verify load index, speed rating, and wheel-well clearance prior to purchasing.

## Project Structure

```
bharat-cal2/
├── app/
│   ├── page.tsx               # Main application container & reactive state orchestration
│   ├── layout.tsx             # Root layout metadata & HTML container
│   └── globals.css            # Styling & Tailwind utility layers
├── components/
│   ├── Header.tsx             # Brand header with navigation and search bar
│   ├── CompactTitle.tsx       # Page breadcrumb & title banner
│   ├── TyreInputCard.tsx      # Dual-mode input form (manual dimensions or car lookup)
│   ├── OriginalTyreCard.tsx   # Specs overview with dynamic SVG tyre visual
│   ├── CategoryTabs.tsx       # Mutually exclusive category tab switcher with counts
│   ├── CandidatesList.tsx     # Alternatives table with filter toggle & speedo comparison
│   ├── EducationalSection.tsx # Knowledge base for tire readings, upsizing & speedo safety
│   ├── FitmentDisclaimer.tsx  # Safety notice banner
│   ├── Footer.tsx             # Brand footer
│   └── MainLayoutContainer.tsx# App-wide responsive layout wrapper
├── data/
│   └── vehicles.json          # Vehicle database (makes, models, variants & OEM sizes)
├── lib/
│   ├── constants.ts           # Centralized target limits, conversion constants & options
│   ├── standardTyres.ts       # 373 authentic commercial tyre sizes dataset & filter logic
│   └── tyreCalculator.ts      # Pure mathematical tyre calculation functions
├── types/
│   └── tyre.ts                # TypeScript interfaces (TyreSpecs, CandidateTyre, VehicleData, etc.)
├── public/                    # Static assets & favicon
└── README.md                  # Project documentation
```

## Running Locally

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Production Build

1. **Build Production Bundle**:
   ```bash
   npm run build
   ```

2. **Start Production Server**:
   ```bash
   npm start
   ```

## Data

- **Vehicle Database**: Maintained in `data/vehicles.json`. Contains structured records of vehicle makes, models, variants, and OEM factory tyre sizes.
- **Standard Tyre Sizes**: Maintained in `lib/standardTyres.ts`. Contains 373 authentic commercial tire sizes ranging from R13 to R22 rims, sourced from standard automotive replacement tire catalogs.

## Important Calculation Logic

All calculation formulas are isolated in `lib/tyreCalculator.ts` as pure functions:

1. **Sidewall Height ($H$)**:
   $$\text{Sidewall Height (mm)} = \text{Width (mm)} \times \left(\frac{\text{Aspect Ratio}}{100}\right)$$

2. **Rim Diameter in mm ($D_{\text{rim\_mm}}$)**:
   $$\text{Rim Diameter (mm)} = \text{Rim Diameter (inches)} \times 25.4$$

3. **Overall Diameter ($D_{\text{overall}}$)**:
   $$\text{Overall Diameter (mm)} = D_{\text{rim\_mm}} + (2 \times H)$$

4. **Rolling Circumference ($C$)**:
   $$\text{Circumference (mm)} = \pi \times D_{\text{overall}}$$

5. **Revolutions per Kilometre ($R_{\text{km}}$)**:
   $$\text{Revs / km} = \frac{1,000,000}{C}$$

6. **Diameter Difference Percentage ($\Delta_{\%}$)**:
   $$\Delta_{\%} = \left(\frac{D_{\text{candidate}} - D_{\text{original}}}{D_{\text{original}}}\right) \times 100$$

7. **Actual Speed at 100 km/h Indicated ($V_{\text{actual}}$)**:
   $$V_{\text{actual}} = 100 \times \left(1 + \frac{\Delta_{\%}}{100}\right)$$

8. **Ground Clearance Change ($\Delta_{\text{clearance}}$)**:
   $$\Delta_{\text{clearance}} = \frac{D_{\text{candidate}} - D_{\text{original}}}{2}$$

---
© Bharat Tyres — All rights reserved.
