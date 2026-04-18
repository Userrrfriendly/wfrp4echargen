import { useQuery } from '@tanstack/react-query';
import { fetchQualities, fetchQualityById } from '../services/qualityService';

export const qualityKeys = {
  all: ['qualities'] as const,
  detail: (id: string) => ['qualities', id] as const,
};

export function useQualities() {
  return useQuery({ queryKey: qualityKeys.all, queryFn: fetchQualities });
}

export function useQuality(id: string) {
  return useQuery({
    queryKey: qualityKeys.detail(id),
    queryFn: () => fetchQualityById(id),
    enabled: !!id,
  });
}
