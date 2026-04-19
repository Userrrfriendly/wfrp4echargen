// 1-based; 0 = no governing attribute
export const ATTRIBUTES: Record<number, string> = {
  0: '—',
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

export const SPECIES: Record<number, string> = {
  0: 'Human',
  1: 'Halfling',
  2: 'Dwarf',
  3: 'High Elf',
  4: 'Wood Elf',
  5: 'Gnome',
};

export const SKILL_TYPES: Record<number, string> = {
  0: 'Advanced',
  1: 'Basic',
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
  0: '—',
  1: 'Brass',
  2: 'Silver',
  3: 'Gold',
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

export function loreName(labels: number[]): string {
  if (labels.length === 0) return '—';
  return labels.map(l => MAGIC_LORES[l] ?? `Lore ${l}`).join(' / ');
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
