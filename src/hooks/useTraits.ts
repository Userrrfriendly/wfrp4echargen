import { useQuery } from '@tanstack/react-query';
import { fetchTraits, fetchTraitById } from '../services/traitService';

export const traitKeys = {
  all: ['traits'] as const,
  detail: (id: string) => ['traits', id] as const,
};

export function useTraits() {
  return useQuery({ queryKey: traitKeys.all, queryFn: fetchTraits });
}

export function useTrait(id: string) {
  return useQuery({
    queryKey: traitKeys.detail(id),
    queryFn: () => fetchTraitById(id),
    enabled: !!id,
  });
}
