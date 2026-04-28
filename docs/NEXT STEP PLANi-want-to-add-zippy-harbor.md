# Phase 3 — Character Sheet (Display)

## Context

Phase 2 (reference browser) is complete. Phase 3 delivers a read-only character sheet that
resolves all the IDs in a character JSON record into meaningful display: named skills with
totals, talent descriptions, equipment with encumbrance, spells/prayers/mutations, and
derived stats (wounds, movement, attribute bonuses). Three stub pages already exist
(`CharactersPage`, `CharacterSheetPage`, `CharacterCreationPage`) but contain only a
`<Typography>` placeholder. The data files are `public/data/characters.json` (list of 4
sample characters) and `public/data/character.json` (single character, same format).

---

## Approach

Follow the established pattern: service → hook → page. The character sheet is data-heavy
so `CharacterSheetPage` orchestrates all queries and passes resolved data down to a pure
`CharacterSheet` display component. Tabs handle the five concerns of a WFRP4e sheet.

---

## Derived Stats & Game Rules

- **Total attribute** = `baseAttributes[key] + attributeAdvances[key]`
- **Attribute bonus** = `Math.floor(total / 10)`
- **Wounds** = SB + 2 × TB + WPB (all humanoids)
- **Max encumbrance** = SB + TB
- **Current encumbrance** = sum of `enc` on carried + equipped items (stored does not count)
- **Money** = separate `gold` / `silver` / `brass` coin counts (display raw denominations)
- **Attribute display order**: WS, BS, S, T, I, Ag, Dex, Int, WP, Fel

---

## Files to Create

### 1. `src/types/index.ts` — add Character types

```ts
export interface CharacterCareerRef { id: string; number: number; }
export interface CharacterItemRef   { id: string; number: number; }
export interface CharacterSkillRef  { id: string; number: number; } // number = advances
export interface CharacterTalentRef { id: string; number: number; } // number = rank

export interface CharacterData {
  name: string; description: string; notes: string;
  species: string;  shared: boolean;
  baseAttributes: AttributeModifiers;
  attributeAdvances: AttributeModifiers;
  career: CharacterCareerRef;
  careerPath: CharacterCareerRef[];
  skills: CharacterSkillRef[];
  talents: CharacterTalentRef[];
  traits: string[];
  equippedItems: CharacterItemRef[];
  carriedItems:  CharacterItemRef[];
  storedItems:   CharacterItemRef[];
  spells: string[]; prayers: string[]; mutations: string[];
  brass: number; silver: number; gold: number;
  fate: number; fortune: number;
  resilience: number; resolve: number;
  corruption: number; sin: number;
  status: number; standing: number;
  currentExp: number; spentExp: number;
}
export type Character = ApiEntity<CharacterData>;
```

Note: `AttributeModifiers` already exists in `src/types/index.ts` with the correct keys
(Ag, BS, Dex, Fel, I, Int, S, T, WP, WS).

### 2. `src/services/characterService.ts`

Standard pattern — `fetchCharacters()` from `characters.json`,
`fetchCharacterById(id)` scans the list.

### 3. `src/hooks/useCharacters.ts`

Standard pattern — `useCharacters()` and `useCharacter(id: string)`.

### 4. `src/utils/gameData.ts` — append species & movement constants

```ts
export const CHARACTER_SPECIES: Record<string, string> = {
  '0001': 'Human',  '0010': 'Dwarf',   '0100': 'Halfling',
  '1000': 'High Elf', '2000': 'Wood Elf', '0200': 'Gnome',
};
export const SPECIES_MOVEMENT: Record<string, number> = {
  '0001': 4, '0010': 3, '0100': 3,
  '1000': 5, '2000': 5, '0200': 3,
};
export const ATTRIBUTE_ORDER =
  ['WS','BS','S','T','I','Ag','Dex','Int','WP','Fel'] as const;
export const ATTRIBUTE_LABELS: Record<string, string> = {
  WS:'Weapon Skill', BS:'Ballistic Skill', S:'Strength', T:'Toughness',
  I:'Initiative', Ag:'Agility', Dex:'Dexterity', Int:'Intelligence',
  WP:'Willpower', Fel:'Fellowship',
};
```

---

## Files to Modify

### 5. `src/pages/characters/CharactersPage.tsx`

Replace stub. Loads `useCharacters()` + `useCareers()` (to resolve career name).

Each card shows: name · species · career name at current level · status tier + standing.
Clicking navigates to `/characters/:id`. Loading/error states required.
Follows app-shell scroll pattern (root `Box` with `height: '100%', overflowY: 'auto'`).

### 6. `src/pages/characters/CharacterSheetPage.tsx`

Replace stub. Orchestrates all queries:

```ts
usePageTitle(character ? `Characters / ${character.object.name}` : 'Characters')
useCharacter(id)
useSkillsByIds(skillIds)         // from src/hooks/useSkills.ts (already exists)
useTalentsByIds(talentIds)       // from src/hooks/useTalents.ts (already exists)
useTrappingsByIds(allItemIds)    // from src/hooks/useTrappings.ts (already exists)
useCareer(careerId)              // from src/hooks/useCareers.ts (already exists)
useMutationsByIds(mutationIds)   // from src/hooks/useMutations.ts (already exists)
useSpellsByIds(spellIds)         // from src/hooks/useSpells.ts (already exists)
usePrayersByIds(prayerIds)       // from src/hooks/usePrayers.ts (already exists)
```

All IDs extracted via `useMemo` from character data. Shows a skeleton while any query is
loading; passes resolved maps (keyed by ID) to `<CharacterSheet>`.

---

## New Components

### 7. `src/components/characters/CharacterSheet.tsx`

Container receiving all resolved data as props. Renders MUI `Tabs` (scrollable variant for
mobile) with 6 tabs:

| Tab | Contents |
|-----|----------|
| Attributes | Characteristic table + derived stats |
| Skills | Resolved skills with totals |
| Talents | Resolved talents with rank |
| Equipment | Items by location + encumbrance + money |
| Magic | Spells, prayers, mutations |
| Notes | Description, notes, corruption/sin, career path, XP |

### 8. `src/components/characters/tabs/AttributesTab.tsx`

- MUI Table: **Characteristic | Initial | Advances | Current | Bonus** for all 10 stats in
  `ATTRIBUTE_ORDER`
- Derived stats row group: Wounds (SB+2TB+WPB), Movement (from `SPECIES_MOVEMENT`),
  Fate/Fortune, Resilience/Resolve
- Career: name + level from resolved career data
- Status: `STATUS_TIERS[status]` + standing

### 9. `src/components/characters/tabs/SkillsTab.tsx`

- Table: **Skill | Attr | Attr Value | Adv | Total**
- Sorted alphabetically
- Total = total attribute value + advances
- Show "Group" chip for group skills

### 10. `src/components/characters/tabs/TalentsTab.tsx`

- Cards/rows: **Talent name | Rank / Max | Description**
- Max rank uses the same `resolveMaxRank` logic from `CareerDetailPage.tsx:28`

### 11. `src/components/characters/tabs/EquipmentTab.tsx`

- Three sections: **Equipped | Carried | Stored**
- Each item row: name, type chip, enc, qty
- Encumbrance summary: current enc (carried+equipped) / max enc (SB+TB)
- Money: gold, silver, brass coin counts with the currency colours from `TrappingsPage.tsx`

### 12. `src/components/characters/tabs/MagicTab.tsx`

- Spells section (if any): name, CN, range, target, duration, description
- Prayers section (if any): name, deity chip, range, target, duration, description
- Mutations section (if any): name, type chip, modifiers, description
- Empty state if all three are absent

### 13. `src/components/characters/tabs/NotesTab.tsx`

- Description text
- Notes text
- Career path timeline (career name + level per entry)
- Corruption / Sin with numeric chips
- XP: spent / current / total

---

## Key Reuse

| What | Where it already lives |
|------|----------------------|
| `resolveMaxRank` logic | `CareerDetailPage.tsx:28` (duplicate — small helper) |
| `formatModifiers` | `MutationsPage.tsx:20` (duplicate — small helper) |
| Currency colour constants | `TrappingsPage.tsx:29–33` (duplicate inline) |
| `useSkillsByIds`, `useTalentsByIds`, `useTrappingsByIds` | Already in hooks layer |
| `STATUS_TIERS`, `ATTRIBUTES` | `src/utils/gameData.ts` |
| `usePageTitle` | `src/hooks/usePageTitle.ts` |
| `SourceChips` | Not needed on sheet (character data has no source field) |

---

## Verification

1. `npm run dev` → navigate to `/characters` — four character cards shown
2. Click any card → sheet opens, AppBar shows "Characters / Karl Schuster" etc.
3. **Attributes tab**: totals = base + advances; bonus = floor(total/10); wounds correct
4. **Skills tab**: skill names resolved (not raw IDs); totals = attribute + advances
5. **Talents tab**: talent names + descriptions resolved
6. **Equipment tab**: items named; current enc ≤ max enc for all sample characters
7. **Magic tab**: Marien has 3 spells + 2 prayers + 1 mutation — all visible
8. **Notes tab**: Marien's career path shows 6 entries resolved
9. Hard-refresh on `/characters/69ea85e849960d0001ad2147` → loads correctly
10. Mobile viewport: tabs scroll horizontally, no layout overflow
11. `npx tsc --noEmit` — no errors
