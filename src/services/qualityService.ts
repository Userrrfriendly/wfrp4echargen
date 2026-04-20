import type { ApiResponse, Quality } from '../types';
import { DATA_ENDPOINT } from './config';

export async function fetchQualities(): Promise<Quality[]> {
  const response = await fetch(`${DATA_ENDPOINT}/qualities.json`);
  if (!response.ok) throw new Error('Failed to fetch qualities');
  const json: ApiResponse<Quality> = await response.json();
  return json.data;
}

export async function fetchQualityById(
  id: string,
): Promise<Quality | undefined> {
  const qualities = await fetchQualities();
  return qualities.find((q) => q.id === id);
}
