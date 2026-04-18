import type { ApiResponse, Skill } from '../types';
import { DATA_ENDPOINT } from './config';

export async function fetchSkills(): Promise<Skill[]> {
  const response = await fetch(`${DATA_ENDPOINT}/skills.json`);
  if (!response.ok) throw new Error('Failed to fetch skills');
  const json: ApiResponse<Skill> = await response.json();
  return json.data;
}

export async function fetchSkillById(id: string): Promise<Skill | undefined> {
  const skills = await fetchSkills();
  return skills.find(s => s.id === id);
}

export async function fetchSkillsByIds(ids: string[]): Promise<Skill[]> {
  const skills = await fetchSkills();
  return skills.filter(s => ids.includes(s.id));
}
