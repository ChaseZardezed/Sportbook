import { useQuery } from '@tanstack/react-query'
import { fetchPacks } from '../api/client'

export function usePacks() {
  return useQuery({ queryKey: ['packs'], queryFn: fetchPacks })
}
