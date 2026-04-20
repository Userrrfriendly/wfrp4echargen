import type { ApiResponse, Talent } from '../types';
import { DATA_ENDPOINT } from './config';

export async function fetchTalents(): Promise<Talent[]> {
  const response = await fetch(`${DATA_ENDPOINT}/talents.json`);
  if (!response.ok) throw new Error('Failed to fetch talents');
  const json: ApiResponse<Talent> = await response.json();
  return json.data;
}

export async function fetchTalentById(id: string): Promise<Talent | undefined> {
  const talents = await fetchTalents();
  return talents.find((t) => t.id === id);
}

export async function fetchTalentsByIds(ids: string[]): Promise<Talent[]> {
  const talents = await fetchTalents();
  return talents.filter((t) => ids.includes(t.id));
}
