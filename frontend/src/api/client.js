const API_BASE_URL = 'http://localhost:8000'

export async function fetchMatches() {
  const response = await fetch(`${API_BASE_URL}/matches`)
  if (!response.ok) {
    throw new Error(`Failed to fetch matches: ${response.status}`)
  }
  return response.json()
}

export async function fetchPacks() {
  const response = await fetch(`${API_BASE_URL}/packs`)
  if (!response.ok) {
    throw new Error(`Failed to fetch packs: ${response.status}`)
  }
  return response.json()
}
