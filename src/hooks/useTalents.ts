import { useQuery } from '@tanstack/react-query';
import { fetchTalents, fetchTalentById, fetchTalentsByIds } from '../services/talentService';

export const talentKeys = {
  all: ['talents'] as const,
  detail: (id: string) => ['talents', id] as const,
  byIds: (ids: string[]) => ['talents', 'byIds', ids] as const,
};

export function useTalents() {
  return useQuery({ queryKey: talentKeys.all, queryFn: fetchTalents });
}

export function useTalent(id: string) {
  return useQuery({
    queryKey: talentKeys.detail(id),
    queryFn: () => fetchTalentById(id),
    enabled: !!id,
  });
}

export function useTalentsByIds(ids: string[]) {
  return useQuery({
    queryKey: talentKeys.byIds(ids),
    queryFn: () => fetchTalentsByIds(ids),
    enabled: ids.length > 0,
  });
}
