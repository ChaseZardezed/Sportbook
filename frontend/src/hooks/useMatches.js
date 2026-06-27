import { useQuery } from '@tanstack/react-query'
import { fetchMatches } from '../api/client'

export function useMatches() {
  return useQuery({ queryKey: ['matches'], queryFn: fetchMatches })
}
