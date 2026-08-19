# PROJECT STATE

## Challenge
AstroLive Product Challenge — prototype + 8-page report. Deadline: 20 August, 11:59 PM IST. Prototype is the primary judging surface.

## Product
**Nakshatra by AstroLive** — Vedic cosmic compatibility as a social product, not a consultation marketplace clone.

## USP
AstroTalk/AstroLive sell minutes with astrologers. Co-Star sells Western daily identity. Nakshatra sells **the Bond Card**: an 8-koota Vedic match you create with someone else, share as a public card, and reopen because the bond weather changes daily.

## Target user
Urban India, 18–35, already checking kundli match or "are we compatible" with friends/partners.

## Core problem
AstroLive's live-consult model is high-intent but low-social. Compatibility is a tool, not a loop. There is no structural way to bring a second user in, or to return tomorrow.

## Solution
1. Create your Vedic profile (30s).
2. Invite a person with a payload in the URL.
3. They onboard to see this bond, not a generic homepage.
4. The Bond Card is a public share object.
5. Daily/7-day bond weather is the habit. Premium + reports are the revenue.

## Viral loop
User A → invite URL → User B onboards → Bond Card → B invites C. Shared cards create curiosity for non-participants.

## Habit loop
Daily bond forecast + personal cosmic weather. "Is today a talk day or a space day for this person?"

## Revenue model
- Free: profile, 3 checks, daily forecast, shareable cards
- Premium ₹199/mo or ₹1,199/yr: unlimited checks, deep analysis, 7-day timeline
- One-time: Couple Deep Dive ₹299, Family Map ₹499
- Strategic upsell: Bond Cards feed AstroLive live consults

## Current implementation
Vite + React 19 + TypeScript + HashRouter. Deterministic mock Vedic engine. localStorage. URL-encoded invites.

## Completed features
All pages: landing, onboarding, profile, compatibility, bond result/list/detail, premium, invite, shared bond, reports. Toast notifications. Profile reset. Deployed.

## Deployment
**LIVE** at https://nakshatra-astrolive.vercel.app
GitHub: https://github.com/CodeInfinity1/AstroLive
Auto-deploys on push to main.

## Report status
HTML report complete at `report/AstroLive_Report.html`. Needs PDF conversion.

## Research status
RESEARCH.md sourced from astrolive.app, CXOToday, MarkNtel, Astrofite, Upstox, Tracxn.
