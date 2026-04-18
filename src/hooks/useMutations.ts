import { useQuery } from '@tanstack/react-query';
import { fetchMutations, fetchMutationById } from '../services/mutationService';

export const mutationKeys = {
  all: ['mutations'] as const,
  detail: (id: string) => ['mutations', id] as const,
};

export function useMutations() {
  return useQuery({ queryKey: mutationKeys.all, queryFn: fetchMutations });
}

export function useMutation(id: string) {
  return useQuery({
    queryKey: mutationKeys.detail(id),
    queryFn: () => fetchMutationById(id),
    enabled: !!id,
  });
}
