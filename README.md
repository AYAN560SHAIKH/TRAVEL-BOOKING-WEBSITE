# TravelEase Pro - Local (Static) Demo

## Files
- index.html
- styles.css
- data.js
- database.js
- script.js

## How to run
1. Place all files in a single folder.
2. Open `index.html` in a modern browser (Chrome/Edge/Firefox).
   - For best results run a local static server (recommended):
     - VS Code Live Server extension, or
     - `python -m http.server` then open http://localhost:8000/

## Features
- Search Flights / Hotels / Packages (mock data).
- Animated UI with floating shapes and polished cards.
- Booking modal, confirmation & itinerary generation.
- LocalStorage-backed database for bookings, users, analytics.
- Export bookings to CSV and clear database.
- Simple analytics modal.
- Autocomplete suggestions for `From` and `To`.
- Keyboard shortcuts:
  - Ctrl/Cmd+Enter → search
  - Alt+1/2/3 → switch tabs
  - Esc → close modals

## Notes for hackathon demo
- All data is mocked and stored in localStorage. Works offline.
- You can add more mock entries in `data.js`.
- To simulate different prices use `getDynamicPrice()` (provided in `data.js`).
- For judging: show search → book → open database → export CSV → analytics.

## Next improvements (optional)
- Integrate a real backend / payment gateway (Stripe test mode).
- Add images for results and map previews.
- Authentication & user dashboard.
