# DECISIONS

## Product: Nakshatra, not a live-chat clone
The previous session named the prototype **Nakshatra by AstroLive** and centered Ashtakoota Bond Cards. That matches the challenge better than rebuilding AstroLive’s wallet/consult marketplace. Kept.

## Virality must live in the URL
Share-to-WhatsApp of `origin` only is not structural. Birth data is encoded in the hash route so a second device can open the invite with **no backend**. Acceptable for a judged prototype; production would swap to invite IDs.

## HashRouter
Chosen in `main.tsx` already. Kept so GitHub Pages / static Vercel work without SPA rewrite surprises.

## Engine stays deterministic mock
`vedic.ts` is explicit that Swiss Ephemeris is production. Do not replace with a fake “AI astrologer.” Determinism makes demos repeatable.

## Invite checks do not consume the free quota
`findOrCreateBond(..., { countTowardLimit: false })` for invite/shared joins so the viral path is not punished by the 3-check gate.

## Premium is simulated
`setPremium(true)` with a disclaimer. Deep insights and timeline now **respect** `isPremium()` instead of staying locked after upgrade.

## Monetization beyond minutes
Subscription + one-time household/couple reports, with copy that routes leftover high-intent questions to AstroLive live astrologers.

## Visual system
Copper/amber on near-black, Outfit/Inter. Kept.

## Responsive layout (19 Aug 2026)
Previously `#root` was capped at 480px on desktop (phone chrome). Challenge judging requires tablet and desktop viewports. Layout tokens now widen: landing up to ~1120px with a two-column hero; app containers ~680–920px. Design language unchanged.

## Do not change
- Core page set and route names already in use
- Product name Nakshatra
- HashRouter without a deploy plan
- Mock engine → “AI astrologer”
