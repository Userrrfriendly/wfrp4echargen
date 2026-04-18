import { useQuery } from '@tanstack/react-query';
import { fetchSkills, fetchSkillById, fetchSkillsByIds } from '../services/skillService';

export const skillKeys = {
  all: ['skills'] as const,
  detail: (id: string) => ['skills', id] as const,
  byIds: (ids: string[]) => ['skills', 'byIds', ids] as const,
};

export function useSkills() {
  return useQuery({ queryKey: skillKeys.all, queryFn: fetchSkills });
}

export function useSkill(id: string) {
  return useQuery({
    queryKey: skillKeys.detail(id),
    queryFn: () => fetchSkillById(id),
    enabled: !!id,
  });
}

export function useSkillsByIds(ids: string[]) {
  return useQuery({
    queryKey: skillKeys.byIds(ids),
    queryFn: () => fetchSkillsByIds(ids),
    enabled: ids.length > 0,
  });
}
