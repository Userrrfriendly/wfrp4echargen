import type { ApiResponse, Mutation } from '../types';
import { DATA_ENDPOINT } from './config';

export async function fetchMutations(): Promise<Mutation[]> {
  const response = await fetch(`${DATA_ENDPOINT}/mutations.json`);
  if (!response.ok) throw new Error('Failed to fetch mutations');
  const json: ApiResponse<Mutation> = await response.json();
  return json.data;
}

export async function fetchMutationById(
  id: string,
): Promise<Mutation | undefined> {
  const mutations = await fetchMutations();
  return mutations.find((m) => m.id === id);
}
