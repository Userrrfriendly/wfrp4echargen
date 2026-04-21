// 1-based; 0 = no governing attribute
export const ATTRIBUTES: Record<number, string> = {
  0: '—', // No governing attribute
  1: 'WS',
  2: 'BS',
  3: 'S',
  4: 'T',
  5: 'I',
  6: 'Ag',
  7: 'Dex',
  8: 'Int',
  9: 'WP',
  10: 'Fel',
};

export const CAREER_CLASSES: Record<number, string> = {
  0: 'Academics',
  1: 'Burghers',
  2: 'Courtiers',
  3: 'Peasants',
  4: 'Rangers',
  5: 'Riverfolk',
  6: 'Rogues',
  7: 'Warriors',
  8: 'Seafarers',
};

export const ITEMS_PER_PAGE = 30;

export const SOURCES: Record<string, string> = {
  1: 'Core Rulebook',
  2: 'Rought Nights and Hard Days',
  3: 'Archives of the Empire Vol I',
  4: 'Archives of the Empire Vol II',
  5: 'Archives of the Empire Vol III',
  6: 'Up in Arms',
  7: 'Winds of Magic',
  8: 'Midenheim: City of the White Wolf',
  9: 'Salzenmund, City of Salt and Silver',
  10: 'Sea of Claws',
  11: 'Lustria',
  12: 'Enemy in Shadows (Companion)',
  13: 'Death on the Reik (Companion)',
  14: 'Enemy in Shadows',
  15: 'Death on the Reik',
  16: 'Power Behind the Throne',
  17: 'Power Behind the Throne (Companion)',
  18: 'The Horned Rat',
  19: 'The Horned Rat (Companion)',
  20: 'Empire in Ruins',
  21: 'Empire in Ruins (Companion)',
  22: 'The Imperial Zoo',
  23: 'Altdorf Crown of the Empire',
  24: 'Ubersreik Adventures',
  25: '25-???',
  26: 'Guide to Ubersreik (Starter Set)',
  27: 'Adventure Book (Starter Set)',
  28: 'Ubersreik Adventures 3',
  29: 'Tribes and Tribulations',
  30: 'Blood And Bramble',
  31: '31-???',
  32: '32-???',
  33: '33-???',
  34: '34-???',
  35: '35-???',
  36: '36-???',
  37: '37-???',
  38: "Dwarf Player's Guide",
  39: 'Deft Steps, Light Fingers',
  40: "High Elves Player's Guide",
  41: 'Lords of Stone and Steel',
};
export const SPECIES: Record<number, string> = {
  0: 'Human',
  1: 'Halfling',
  2: 'Dwarf',
  3: 'High Elf',
  4: 'Wood Elf',
  5: 'Gnome',
  6: 'Ogre',
};

export const SKILL_TYPES: Record<number, string> = {
  0: 'Basic',
  1: 'Advanced',
};

export const QUALITY_TYPES: Record<number, string> = {
  0: 'Quality',
  1: 'Flaw',
};

export const MUTATION_TYPES: Record<number, string> = {
  0: 'Physical',
  1: 'Mental',
};

export const TRAPPING_TYPES: Record<number, string> = {
  0: 'Melee',
  1: 'Ranged',
  2: 'Ammunition',
  3: 'Armour',
  4: 'Container',
  5: 'Miscellaneous',
  6: 'Special',
};

export const STATUS_TIERS: Record<number, string> = {
  0: 'Brass',
  1: 'Silver',
  2: 'Gold',
};

export const AVAILABILITY: Record<number, string> = {
  0: 'Common',
  1: 'Scarce',
  2: 'Rare',
  3: 'Exotic',
};

export const MELEE_REACH: Record<number, string> = {
  0: 'Personal',
  1: 'Very Short',
  2: 'Short',
  3: 'Average',
  4: 'Long',
  5: 'Very Long',
  6: 'Massive',
};

export const MELEE_GROUPS: Record<number, string> = {
  0: 'Basic',
  1: 'Cavalry',
  2: 'Fencing',
  3: 'Flail',
  4: 'Great',
  5: 'Polearm',
  6: 'Brawling',
  7: 'Parrying',
};

export const RANGED_GROUPS: Record<number, string> = {
  0: 'Blackpowder',
  1: 'Bow',
  2: 'Crossbow',
  3: 'Entangling',
  4: 'Engineering',
  5: 'Sling',
  6: 'Throwing',
};

export const ARMOUR_LOCATIONS: Record<number, string> = {
  0: 'Head',
  1: 'Arms',
  2: 'Body',
  3: 'Legs',
};

export const SPELL_TYPES: Record<number, string> = {
  0: 'Other Spell',
  1: 'Petty Magic',
  2: 'Arcane',
  3: 'Lore',
  4: 'Elven Arcane Spell',
};

export const MAGIC_LORES: Record<number, string> = {
  0: 'Beasts',
  1: 'Death',
  2: 'Fire',
  3: 'Heavens',
  4: 'Life',
  5: 'Light',
  6: 'Metal',
  7: 'Shadows',
  8: 'Daemonology',
  9: 'Necromancy',
  10: 'Hedgecraft',
  11: 'Witchcraft',
  12: 'Nurgle',
  13: 'Slaanesh',
  14: 'Tzeentch',
  15: 'Lore of High Magic (general)',
  16: 'Lore of High Magic (Slann)',
  17: 'Lore of Big Waaagh!',
  18: 'Lore of Little  Waaagh!',
  19: 'Lore of Plague',
  20: 'Lore of Ruin',
  21: 'Lore of Stealth',
  22: 'Lore of the Great Maw',
  1001: 'Ritual',
  1002: 'Horned Rat',
  1003: 'Chaos',
  1005: 'Magic of Vaul',
  1006: 'High Elf Sea Magic',
  1007: 'Magic of Hoeth',
};

export const SOURCE_OPTIONS = Object.entries(SOURCES).map(([id, label]) => ({
  id,
  label,
}));

export function loreName(labels: number[]): string {
  if (labels.length === 0) return '—';
  return labels.map((l) => MAGIC_LORES[l] ?? `Lore ${l}`).join(' / ');
}

export function formatPrice(brass: number): string {
  if (brass === 0) return '—';
  const gold = Math.floor(brass / 240);
  const silver = Math.floor((brass % 240) / 12);
  const b = brass % 12;
  const parts: string[] = [];
  if (gold > 0) parts.push(`${gold}GC`);
  if (silver > 0) parts.push(`${silver}SS`);
  if (b > 0) parts.push(`${b}BP`);
  return parts.join(' ') || '—';
}
