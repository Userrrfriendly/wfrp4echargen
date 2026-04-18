import { useQuery } from '@tanstack/react-query';
import { fetchSpells, fetchSpellById } from '../services/spellService';

export const spellKeys = {
  all: ['spells'] as const,
  detail: (id: string) => ['spells', id] as const,
};

export function useSpells() {
  return useQuery({ queryKey: spellKeys.all, queryFn: fetchSpells });
}

export function useSpell(id: string) {
  return useQuery({
    queryKey: spellKeys.detail(id),
    queryFn: () => fetchSpellById(id),
    enabled: !!id,
  });
}
