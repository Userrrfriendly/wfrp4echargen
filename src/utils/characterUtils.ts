import type { Career, Character } from '../types';
import { ATTRIBUTES } from './gameData';
import type { AttributeKey } from './gameData';

export function attrBonus(value: number): number {
  return Math.floor(value / 10);
}

export function getTotalAttr(char: Character, key: AttributeKey): number {
  return char.object.baseAttributes[key] + char.object.attributeAdvances[key];
}

export function calcWounds(char: Character): number {
  const S = getTotalAttr(char, 'S');
  const T = getTotalAttr(char, 'T');
  const WP = getTotalAttr(char, 'WP');
  const SB = attrBonus(S);
  const TB = attrBonus(T);
  const WPB = attrBonus(WP);
  if (char.object.species === '0100') return 2 * TB + WPB; // Halfling
  return SB + 2 * TB + WPB;
}

export function careerLevelName(career: Career, level: number): string {
  const key = `level${level}` as keyof typeof career.object;
  const data = career.object[key];
  if (
    data &&
    typeof data === 'object' &&
    'name' in data &&
    typeof data.name === 'string' &&
    data.name
  ) {
    return data.name;
  }
  return career.object.name;
}

/** Returns "Level Name (Career Name)", e.g. "Journeyman (Wizard)". */
export function careerFullTitle(career: Career, level: number): string {
  return `${careerLevelName(career, level)} (${career.object.name})`;
}

export function resolveMaxRank(
  attribute: number,
  maxRank: number,
): string | null {
  if (attribute > 0)
    return `${ATTRIBUTES[attribute] ?? `Attr ${attribute}`} Bonus`;
  if (maxRank === 0) return null;
  if (maxRank >= 99) return '∞';
  return String(maxRank);
}
