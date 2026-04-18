import type { ApiResponse, Prayer } from '../types';
import { DATA_ENDPOINT } from './config';

export async function fetchPrayers(): Promise<Prayer[]> {
  const response = await fetch(`${DATA_ENDPOINT}/prayers.json`);
  if (!response.ok) throw new Error('Failed to fetch prayers');
  const json: ApiResponse<Prayer> = await response.json();
  return json.data;
}

export async function fetchPrayerById(id: string): Promise<Prayer | undefined> {
  const prayers = await fetchPrayers();
  return prayers.find(p => p.id === id);
}
