# Nakshatra by AstroLive

Vedic Bond Cards you create **with** someone — shareable, daily-updating, and structurally viral.

## Challenge

AstroLive Product Challenge (August 2026). Prototype is the primary judging surface. This repo is the working product **Nakshatra**, a social compatibility layer for AstroLive — not a generic astrology website and not a live-consult marketplace clone.

## USP

AstroTalk/AstroLive sell minutes with astrologers. Co-Star sells Western daily identity. **Nakshatra sells the Bond Card**: an 8-koota Vedic match you create with a second person, share as a public card, and reopen because bond weather changes every day.

## Core features

- 30-second Vedic profile (Moon, Nakshatra, planets, traits)
- Invite URLs that encode the inviter so the recipient lands on a personal Bond, not a homepage
- Manual compatibility checks (3 free; invites do not consume the quota)
- Shareable public Bond Cards
- Daily personal + bond forecasts
- Premium (simulated payment, real unlock): unlimited checks, deep analysis, 7-day timeline
- One-time Couple Deep Dive / Family Map reports
- Upsell copy toward AstroLive live consults

## Viral loop

User A creates a profile → copies an invite link → User B sees A's identity → B onboards to unlock the Bond Card → B can invite C. Shared cards create curiosity for people who were not in the original pair.

## Habit loop

Daily bond forecast: “Is today a talk day or a space day for this person?” Premium adds a 7-day relationship timeline.

## Monetization

| Layer | Price (prototype) | What you get |
| --- | --- | --- |
| Free | ₹0 | Profile, 3 checks, daily forecast, shareable cards, invites |
| Premium | ₹199/mo or ₹1,199/yr | Unlimited checks, deep 8-koota analysis, 7-day timeline |
| Reports | ₹299 / ₹499 | Couple Deep Dive / Family Map |
| Consult bridge | AstroLive wallet | High-intent questions from Bond scores → live astrologers |

Payment is **not** processed. Upgrade still unlocks premium UI in this prototype.

## Tech stack

Vite 8, React 19, TypeScript, HashRouter, CSS, localStorage. Deterministic mock Vedic engine (`src/engine/vedic.ts`). No backend.

## Local setup

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deployment

Public prototype: **https://nakshatra-astrolive.vercel.app**  
Source: **https://github.com/CodeInfinity1/AstroLive**  
Vercel auto-deploys from `main`.

## Demo URL

https://nakshatra-astrolive.vercel.app

Use **Not you? Reset profile** at the bottom of Profile if a previous demo session is still in `localStorage`.

## Report

Print-ready PDF (placeholders until team/leader names are provided):

`submission/AstroLive_TeamName_LeaderName.pdf`

HTML source: `report/AstroLive_Report.html`

## AI tools used

- **Cursor IDE** — development environment
- **Claude (Anthropic)** via Cursor — prior sessions: product design, implementation, research, report draft
- **Cursor Grok 4.6** — this session: responsive layouts, screenshots, PDF packaging, README

## Disclaimer

Charts are demonstration-grade (deterministic, not Swiss Ephemeris). Invite URLs contain birth metadata — prototype only; production must use invite IDs.
