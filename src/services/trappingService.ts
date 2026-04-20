import type { ApiResponse, Trapping } from '../types';
import { DATA_ENDPOINT } from './config';

export async function fetchTrappings(): Promise<Trapping[]> {
  const response = await fetch(`${DATA_ENDPOINT}/trappings.json`);
  if (!response.ok) throw new Error('Failed to fetch trappings');
  const json: ApiResponse<Trapping> = await response.json();
  return json.data;
}

export async function fetchTrappingById(
  id: string,
): Promise<Trapping | undefined> {
  const trappings = await fetchTrappings();
  return trappings.find((t) => t.id === id);
}

export async function fetchTrappingsByIds(ids: string[]): Promise<Trapping[]> {
  const trappings = await fetchTrappings();
  return trappings.filter((t) => ids.includes(t.id));
}
