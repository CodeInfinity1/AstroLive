# ARCHITECTURE

## Stack
- Vite 8, React 19, TypeScript, react-router-dom 7 (`HashRouter`)
- No backend. No auth.

## Source map
| Path | Role |
| --- | --- |
| `src/engine/vedic.ts` | Birth → profile; Ashtakoota-style compatibility; daily/weekly/timeline helpers |
| `src/store/storage.ts` | localStorage + session pending invite + report purchases + `findOrCreateBond` |
| `src/store/share.ts` | Base64url encode/decode, invite + shared-card URLs, share/copy |
| `src/pages/*` | Screens |
| `src/components/ScoreRing.tsx` | Score visualization |
| `src/components/BottomNav.tsx` | App chrome (hidden on landing/onboarding/invite/shared) |
| `src/index.css` | Design tokens and shared UI |

## Routes
| Hash path | Auth | Purpose |
| --- | --- | --- |
| `/` | none | Landing; redirects to `/profile` if stored profile exists |
| `/onboarding` | none | Birth details; if pending invite, then Bond Result |
| `/profile` | profile | Cosmic identity + daily weather |
| `/compatibility` | profile | Manual check (counts toward free limit) |
| `/bond-result/:bondId` | profile | First-view Bond Card |
| `/bonds` | profile | Bond list |
| `/bond/:bondId` | profile | Persistent bond + timeline |
| `/premium` | none | Plans + report purchase |
| `/invite/:token` | none | Structural invite landing |
| `/shared/:token` | none | Public Bond Card |
| `/report/:type` | profile | couple \| family report |

## Data
- Profile + bonds + premium flag + check count: `localStorage` keys prefixed `nakshatra_`
- Pending invite: `sessionStorage`
- Invite token: JSON `{name,date,time,place,gender?}` encoded
- Shared token: `{ a: InvitePayload, b: InvitePayload }` — compatibility is **recomputed** on open

## Layout
- Mobile: ~480px content column
- Tablet (768+): ~680–740px; 2-column koota categories
- Desktop (1024+): no `#root` 480px lock; landing max ~1120px

## Limitations
- Charts are not ephemeris-accurate
- Tokens in URLs contain birth metadata (demo only; production must not)
- Same-browser testing of two users requires a second profile (incognito) or clearing storage
