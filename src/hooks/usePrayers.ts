import { useQuery } from '@tanstack/react-query';
import { fetchPrayers, fetchPrayerById } from '../services/prayerService';

export const prayerKeys = {
  all: ['prayers'] as const,
  detail: (id: string) => ['prayers', id] as const,
};

export function usePrayers() {
  return useQuery({ queryKey: prayerKeys.all, queryFn: fetchPrayers });
}

export function usePrayer(id: string) {
  return useQuery({
    queryKey: prayerKeys.detail(id),
    queryFn: () => fetchPrayerById(id),
    enabled: !!id,
  });
}
