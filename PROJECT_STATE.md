# PROJECT STATE

## Challenge
AstroLive Product Challenge — prototype + 8-page report. Deadline: 20 August, 11:59 PM IST. Prototype is the primary judging surface.

## Product
**Nakshatra by AstroLive** — Vedic cosmic compatibility as a social product, not a consultation marketplace clone.

## USP
AstroTalk/AstroLive sell minutes with astrologers. Co-Star sells Western daily identity. Nakshatra sells **the Bond Card**: an 8-koota Vedic match you create with someone else, share as a public card, and reopen because the bond weather changes daily.

## Target user
Urban India, 18–35, already checking kundli match or “are we compatible” with friends/partners — people who currently screenshot a score and drop it in WhatsApp.

## Core problem
AstroLive’s live-consult model is high-intent but low-social. Compatibility is a tool (enter two charts, see a score), not a loop. There is little structural reason to bring a second user in, or to return tomorrow.

## Solution
1. Create your Vedic profile (30s).
2. Invite a person with a **payload in the URL** (works without a backend).
3. They onboard to see *this* bond, not a generic homepage.
4. The Bond Card is a public share object.
5. Daily/7-day bond weather is the habit. Premium + one-time reports are the revenue beyond ₹10/min chat.

## Viral loop
User A creates profile → sends `/#/invite/{token}` encoding A’s birth data → User B lands on A’s invite → B creates profile to unlock the pair score → B gets their own profile and can invite C. Shared `/#/shared/{token}` cards are the curiosity object for people who were not the original pair.

## Habit loop
Daily personal forecast (profile) + **today’s bond forecast** (changes with date) + Premium **7-day bond weather**. Reason to open tomorrow: “is today a talk day or a space day for this person?”

## Revenue model (demo)
- Free: profile, 3 manual checks, shareable cards, daily forecast
- Premium ₹199/mo or ₹1,199/yr: unlimited checks, deep analysis, 7-day timeline
- One-time: Couple Deep Dive ₹299, Family Map ₹499
- Strategic: Bond Cards should **feed** AstroLive live consults (priority astrologer), not replace wallet minutes

## Current implementation
Vite + React 19 + HashRouter. Deterministic mock Vedic engine in `src/engine/vedic.ts`. Persistence: localStorage. Invites: URL-encoded birth payloads.

## Completed features
- Landing, 4-step onboarding, cosmic profile
- Compatibility form + 3-check free limit
- Bond result + bond list + bond detail
- Premium checkout demo
- Structural invite + public shared Bond Card
- Premium unlocks deep insights + 7-day timeline
- One-time report pages (prototype)

## Remaining features
- Public deploy (Vercel)
- 8-page PDF report
- Optional: reset-profile in UI, nicer copy-link toast (currently some alerts)
- Production ephemeris (out of prototype scope)

## Deployment
Not deployed this session. HashRouter is chosen so static hosts work without rewrite rules.

## Report status
Outline exists in REPORT_OUTLINE.md. PDF not written.

## Research status
See RESEARCH.md — sourced from astrolive.app, Tracxn/Inc42 mentions, market reports, competitor write-ups. Third-party “review” sites treated cautiously.
