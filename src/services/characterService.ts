import type { ApiResponse, Character } from '../types';
import { DATA_ENDPOINT } from './config';

export async function fetchCharacters(): Promise<Character[]> {
  const response = await fetch(`${DATA_ENDPOINT}/characters.json`);
  if (!response.ok) throw new Error('Failed to fetch characters');
  const json: ApiResponse<Character> = await response.json();
  return json.data;
}

export async function fetchCharacterById(
  id: string,
): Promise<Character | undefined> {
  const characters = await fetchCharacters();
  return characters.find((c) => c.id === id);
}
