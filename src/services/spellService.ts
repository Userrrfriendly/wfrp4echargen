import type { ApiResponse, Spell } from '../types';
import { DATA_ENDPOINT } from './config';

export async function fetchSpells(): Promise<Spell[]> {
  const response = await fetch(`${DATA_ENDPOINT}/spells.json`);
  if (!response.ok) throw new Error('Failed to fetch spells');
  const json: ApiResponse<Spell> = await response.json();
  return json.data;
}

export async function fetchSpellById(id: string): Promise<Spell | undefined> {
  const spells = await fetchSpells();
  return spells.find((s) => s.id === id);
}
