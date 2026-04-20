# WFRP4e Character Generator — Project Roadmap

## Tech Stack

| Concern      | Choice                         | Notes                                                                   |
| ------------ | ------------------------------ | ----------------------------------------------------------------------- |
| Framework    | React 19 + TypeScript + Vite   | Already configured                                                      |
| UI           | MUI v9                         | Already installed                                                       |
| Routing      | React Router v7                | Nested routes, lazy loading                                             |
| Server state | TanStack Query v5              | Caching, loading/error states; trivial swap from JSON files to real API |
| Client state | Zustand                        | Character sheet, session, dice state                                    |
| Forms        | React Hook Form                | Character creation wizards                                              |
| Testing      | Vitest + React Testing Library | Co-located with Vite                                                    |

### API-readiness pattern

All data is loaded through service functions in `src/services/`. Each function does one `fetch()` call. The **only** change needed when a real backend exists is the URL inside that function — all hooks and components are unaffected.

---

## Phase 1 — Foundation & Service Layer ✅

**Goal:** Establish the architecture every subsequent phase builds on.

- TypeScript interfaces for all 10 data entities (`Career`, `Skill`, `Talent`, `Trait`, `Trapping`, `Spell`, `Prayer`, `Mutation`, `Quality`, `Rune`)
- `src/services/config.ts` — single `DATA_ENDPOINT` constant (swap to `/api` for backend)
- One service file per entity: typed `fetchX()` and `fetchXById()` functions
- TanStack Query hooks in `src/hooks/` wrapping every service
- React Router shell with all routes defined (placeholder pages)
- MUI dark theme (grimdark palette)
- Permanent nav drawer with Reference / Characters / Tools sections
- `QueryClientProvider` + `ThemeProvider` + `RouterProvider` in `main.tsx`

**Verify:** `npm run dev` loads with nav drawer, no console errors.

---

## Phase 2 — Data Reference Browser

**Goal:** Read-only browser for all game data — the GM/player reference tool.

- Career list with search + filter by class/species; career detail page resolving skill/talent names from IDs
- Skills browser grouped by type (Basic/Advanced/Grouped) with governing attribute shown
- Talents browser: searchable, shows attribute modifiers and max rank
- Trappings browser: filterable by type (melee / ranged / armour / misc), shows full stats
- Spells browser: filterable by lore and casting number
- Prayers browser: filterable by deity
- Routes: `/reference/careers`, `/reference/careers/:id`, `/reference/skills`, etc.

**Verify:** All browsers load data; career detail page shows resolved skill/talent names, not raw IDs.

---

## Phase 3 — Character Sheet (Display)

**Goal:** A complete, readable character sheet component before tackling creation.

- Define `Character` TypeScript type: attributes (WS/BS/S/T/Ag/I/Dex/Int/WP/Fel), skills with advances, talents, equipped items, wounds (total/current), fate/fortune, resilience/resolve, movement, encumbrance, career progression
- `CharacterSheet` component: tabbed layout — **Attributes | Skills | Talents | Equipment | Notes**
- Attribute bonuses auto-calculated (attribute ÷ 10, rounded down)
- Encumbrance totals from equipped items
- Hardcoded sample character to validate the layout
- Route: `/characters/:id`

**Verify:** Sample character renders correctly across all tabs; wounds and encumbrance totals are correct.

---

## Phase 4 — Character Creation Wizard

**Goal:** Create a valid WFRP4e character following the official rulebook steps.

Multi-step wizard (React Hook Form + Zustand for step state):

1. **Species** — Human / Dwarf / Halfling / High Elf / Wood Elf / Gnome; shows species attribute bonuses and starting skills
2. **Attributes** — roll 2d10+20 per characteristic (with reroll), or manual entry; species bonuses applied
3. **Career** — filtered by species; shows level 1 skills, talents, trappings, and status
4. **Skills** — assign 40 points across career level 1 skills (max 10 per skill)
5. **Talents** — pick from career level 1 talent options (handle group talents)
6. **Review** — summary before confirming; save to Zustand store + localStorage

**Verify:** Complete wizard end-to-end; resulting character appears in `/characters` list and opens as a full sheet.

---

## Phase 5 — Character Advancement

**Goal:** Track XP and advance the character per WFRP4e rules.

- XP log per character: earned vs. spent, with reason field
- Spend XP on skill advances: cost = current advance level × 10
- Spend XP on talent acquisition: cost based on tier (25 / 50 / 75 / 100)
- Spend XP on characteristic advances: cost = current advance × 25
- Career level promotion: verify all level requirements met, unlock next level's skills/talents
- Career change: record exit career, enter new career at level 1
- Full advancement history log visible on character sheet

**Verify:** XP pool decrements on spend; advances appear on sheet; career level unlock gated behind completion.

---

## Phase 6 — Dice Roller

**Goal:** A virtual dice system that understands WFRP4e test mechanics.

- Standalone page at `/dice` + floating widget accessible from any page
- d10, d100 (percentile) rollers
- **Success Level calculator**: enter characteristic value → roll d100 → compute SL (`tens(score) − tens(roll)`)
- Opposed Test resolver: two characteristic values + rolls → compare SLs → declare winner
- Extended Test tracker: target SL + accumulated SL progress bar
- Fumble / critical detection (doubles under/over characteristic)
- Roll history log for the session

**Verify:** SL calculations match WFRP4e rulebook examples; fumble/critical detection correct at boundary values.

---

## Phase 7 — Combat Tracker

**Goal:** Track a full combat encounter from initiative to resolution.

- Add combatants (from party or manual entry) with WS, BS, Wounds, Initiative
- Roll Initiative (Ag + d10) for all combatants; display sorted turn order
- Per-combatant state: current Wounds, Advantage, active Conditions (Bleeding, Broken, Prone, Stunned, Entangled, Poisoned, Surprised)
- Damage workflow: select attacker/defender → enter hit location + damage → auto-subtract AP → apply wound
- Critical wound table roller (d100 + hit location)
- End-of-round: tick down Conditions, prompt Bleeding damage, resolve Broken tests
- Encounter log with all actions

**Verify:** Full combat round can be run; conditions apply and expire correctly; Wounds reach 0 → Incapacitated state.

---

## Phase 8 — Magic & Religion

**Goal:** Full support for Wizards and Priests.

- **Spellcasting**: select spell from grimoire → roll Channelling → track Casting Number progress → miscast table roller on failure
- **Corruption tracker**: minor / major corruption counter; Tzeentch's curse table roller
- **Prayer management**: track Prayer Test results, active Blessings/Miracles with remaining duration
- Mutations tab on character sheet: list acquired mutations with modifiers applied
- Winds of Magic display (optional): track current Wind strength

**Verify:** Spell casting flow runs from channelling to cast or miscast; corruption increments trigger the correct threshold warnings.

---

## Phase 9 — Party & Session Tools

**Goal:** GM and group-level tooling.

- **Party view**: all characters side-by-side with key stats (Wounds, Conditions, Fate)
- **Shared inventory**: loot pool with encumbrance split across party
- **GM overview**: all combatant conditions visible in one panel
- **Export character**: download as JSON for backup/sharing
- **Import character**: load from JSON file
- **Print sheet**: CSS print stylesheet producing a clean one-page character sheet

**Verify:** Export → import round-trips without data loss; print preview shows clean layout.

---

## Folder Structure (post Phase 1)

```
src/
  types/           TypeScript interfaces for all entities
  services/        fetch functions (one per entity + config.ts)
  hooks/           TanStack Query hooks (one per entity)
  stores/          Zustand stores (character, session, dice)
  components/
    layout/        AppLayout, NavDrawer
    ui/            Shared MUI wrappers
  pages/
    reference/     CareersPage, CareerDetailPage, SkillsPage, …
    characters/    CharactersPage, CharacterCreationPage, CharacterSheetPage
    DicePage
  theme/           MUI theme config
  router.tsx       createBrowserRouter definition
```
