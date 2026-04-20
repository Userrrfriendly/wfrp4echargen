import type { ApiResponse, Career } from '../types';
import { DATA_ENDPOINT } from './config';

export async function fetchCareers(): Promise<Career[]> {
  const response = await fetch(`${DATA_ENDPOINT}/careers.json`);
  if (!response.ok) throw new Error('Failed to fetch careers');
  const json: ApiResponse<Career> = await response.json();
  return json.data;
}

export async function fetchCareerById(id: string): Promise<Career | undefined> {
  const careers = await fetchCareers();
  return careers.find((c) => c.id === id);
}
