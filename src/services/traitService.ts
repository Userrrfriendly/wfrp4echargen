import type { ApiResponse, Trait } from '../types';
import { DATA_ENDPOINT } from './config';

export async function fetchTraits(): Promise<Trait[]> {
  const response = await fetch(`${DATA_ENDPOINT}/traits.json`);
  if (!response.ok) throw new Error('Failed to fetch traits');
  const json: ApiResponse<Trait> = await response.json();
  return json.data;
}

export async function fetchTraitById(id: string): Promise<Trait | undefined> {
  const traits = await fetchTraits();
  return traits.find((t) => t.id === id);
}
