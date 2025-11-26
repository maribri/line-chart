# Test Assignment: Interactive Line Chart

## Tech Stack:
- React 19 + TS
- Vite 7
- VisX for SVG chart
- date-fns for date math/formatting
- SCSS Modules (BEM) for styling
- html-to-image for PNG export

## Core Features Implemented
- Conversion-rate line chart for every test variation (percent-based)
- Hover interactions: vertical crosshair + tooltip listing all visible variations
- Variation selector with "select all" action guarantees at least one active variation
- Timeframe toggle (Day/Week) with weekly aggregation
- Dynamic axes that adapt automatically when variations or timeframe change
- Responsive layout for 671-1300 px viewports with maintained chart aspect ratio

## Bonus Features Implemented
- Line style selector (line, smooth, area)
- Light / dark theme toggle (persisted in localStorage, implemented with CSS custom properties)
- Zoom controls (zoom in/out with reset, domains clamped to visible data)
- Export to PNG (one-click export that omits tooltips and respects the active theme)
- Accessibility niceties: keyboard-friendly selectors, focus styles

## Corner Cases & Polish
- Tooltip flips alignment left/center/right so it never overflows the viewport, but still tracks the exact crosshair position
- Crosshair snapping uses a bisector over unique dates and a timestamp map, for accurate alignment even with sparse datasets
- Left-axis label spacing (Y_AXIS_LABEL_GAP) is using to set the chart margins without clipped text
- Zoom state auto-resets when timeframe/variation filters change to avoid blank charts

## Getting Started

Prerequisites: Node 20+ (or the version required by Vite 7).

Install dependencies:
```bash
npm install
```

Run locally:
```bash
npm run dev
```
Vite will print the local URL (default http://localhost:5173).

Lint (optional but recommended):
```bash
npm run lint
```

## Additional
- Theme, selected variations, timeframe, line style, and zoom state persist in localStorage
- All icons are loaded with vite-plugin-svgr

---

## From the old Readme:

## Requirements

- Display a **conversion rate (conversionRate)** line chart for all variations, showing all values as **percentages**.
- On **hover**, show a **vertical line** and a **popup** with daily data.
- At least **one variation must always be selected**.
- When variations are toggled, both X and Y axes must **adapt automatically** to the visible data range.
- Display all values as **percentages**.
- Responsive layout for screens between **671 px** and **1300 px**.
- Controls:
  - **Variations selector** (choose which lines to display)
  - **Day / Week selector**

---

## Bonus Features

- Zoom / Reset zoom
- Line style selector (`Line`, `Smooth`, `Area`)
- Light / Dark theme toggle
- Export chart to PNG

---

## Tech Stack

- **React + TypeScript**
- Any charting library (e.g. **D3**, **VisX**, **Recharts**, etc.)
- Use **CSS Modules** for component styling.
- The project must:
  1. Be published on **GitHub Pages**
  2. Include a **README** with setup instructions and a short feature overview

---

## Deliverables

1. GitHub repository with full source code
2. Live demo on GitHub Pages
3. Clear README including:
   - Chosen visualization library
   - Implemented and bonus features
   - Local setup instructions
