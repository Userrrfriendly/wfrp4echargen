import { useQuery } from '@tanstack/react-query';
import { fetchCareers, fetchCareerById } from '../services/careerService';

export const careerKeys = {
  all: ['careers'] as const,
  detail: (id: string) => ['careers', id] as const,
};

export function useCareers() {
  return useQuery({ queryKey: careerKeys.all, queryFn: fetchCareers });
}

export function useCareer(id: string) {
  return useQuery({
    queryKey: careerKeys.detail(id),
    queryFn: () => fetchCareerById(id),
    enabled: !!id,
  });
}
