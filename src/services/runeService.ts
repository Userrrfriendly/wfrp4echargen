import type { ApiResponse, Rune } from '../types';
import { DATA_ENDPOINT } from './config';

export async function fetchRunes(): Promise<Rune[]> {
  const response = await fetch(`${DATA_ENDPOINT}/runes.json`);
  if (!response.ok) throw new Error('Failed to fetch runes');
  const json: ApiResponse<Rune> = await response.json();
  return json.data;
}

export async function fetchRuneById(id: string): Promise<Rune | undefined> {
  const runes = await fetchRunes();
  return runes.find((r) => r.id === id);
}
