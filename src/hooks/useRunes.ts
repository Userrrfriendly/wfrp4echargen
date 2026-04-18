import { useQuery } from '@tanstack/react-query';
import { fetchRunes, fetchRuneById } from '../services/runeService';

export const runeKeys = {
  all: ['runes'] as const,
  detail: (id: string) => ['runes', id] as const,
};

export function useRunes() {
  return useQuery({ queryKey: runeKeys.all, queryFn: fetchRunes });
}

export function useRune(id: string) {
  return useQuery({
    queryKey: runeKeys.detail(id),
    queryFn: () => fetchRuneById(id),
    enabled: !!id,
  });
}
