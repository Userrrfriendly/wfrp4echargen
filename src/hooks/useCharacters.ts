import { useQuery } from '@tanstack/react-query';
import {
  fetchCharacters,
  fetchCharacterById,
} from '../services/characterService';

export const characterKeys = {
  all: ['characters'] as const,
  detail: (id: string) => ['characters', id] as const,
};

export function useCharacters() {
  return useQuery({ queryKey: characterKeys.all, queryFn: fetchCharacters });
}

export function useCharacter(id: string) {
  return useQuery({
    queryKey: characterKeys.detail(id),
    queryFn: () => fetchCharacterById(id),
    enabled: !!id,
  });
}
