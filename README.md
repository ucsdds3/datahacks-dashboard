# DataHacks 2026 Registration Analytics Dashboard

Static browser dashboard for monitoring live DataHacks 2026 registration data from published Google Sheets CSV exports.

## What it shows

- Topline registration metrics: total registrations, progress toward the registration goal, universities represented, and first-time hackers
- Participant breakdowns for tracks, majors, minors, level of study, university, referrals, first hackathon status, shirt sizes, overnight stay, food restrictions, interests, biotech focus, activities, and club memberships
- Skill distribution snapshots for coding/data, embedded systems, UI/UX and web, and product/presentations
- Separate mentor/judge analytics for company, role category, participation type, and UCSD affiliation

## How it works

- The app fetches two published CSV feeds directly in the browser:
  - participant registrations
  - mentor/judge registrations
- Data is normalized client-side in `app.js`
- The dashboard refreshes automatically every 60 seconds and also supports manual refresh from the UI
- No build step, framework, or backend is required

## Run locally

Serve the project over HTTP so the browser can fetch the CSV sources:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

Do not open `index.html` directly as a `file://` page. Browser fetches to the published sheets are expected to run from a local web server.

## Configuration

Update these constants in `app.js` to point at different sheets or targets:

- `CSV_URL`: participant registration CSV
- `MENTOR_CSV_URL`: mentor/judge registration CSV
- `REGISTRATION_GOAL`: topline registration target
- `REFRESH_INTERVAL_MS`: polling interval

## Project files

- `index.html`: dashboard layout and chart containers
- `styles.css`: visual design and responsive layout
- `app.js`: CSV parsing, normalization, metric aggregation, and chart rendering

## Notes

- The dashboard expects the Google Sheets to remain published as CSV
- Graduation year is not displayed because it is not present in the participant sheet schema
- Several free-response fields are grouped into normalized categories before rendering so the charts stay readable
