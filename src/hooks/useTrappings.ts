import { useQuery } from '@tanstack/react-query';
import { fetchTrappings, fetchTrappingById, fetchTrappingsByIds } from '../services/trappingService';

export const trappingKeys = {
  all: ['trappings'] as const,
  detail: (id: string) => ['trappings', id] as const,
  byIds: (ids: string[]) => ['trappings', 'byIds', ids] as const,
};

export function useTrappings() {
  return useQuery({ queryKey: trappingKeys.all, queryFn: fetchTrappings });
}

export function useTrapping(id: string) {
  return useQuery({
    queryKey: trappingKeys.detail(id),
    queryFn: () => fetchTrappingById(id),
    enabled: !!id,
  });
}

export function useTrappingsByIds(ids: string[]) {
  return useQuery({
    queryKey: trappingKeys.byIds(ids),
    queryFn: () => fetchTrappingsByIds(ids),
    enabled: ids.length > 0,
  });
}
