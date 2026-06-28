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

async function postAuth(path, body) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await response.json()
  if (!response.ok) {
    const message = Array.isArray(data.detail)
      ? data.detail.map((error) => error.msg).join(', ')
      : data.detail || 'Something went wrong'
    throw new Error(message)
  }
  return data
}

export function registerUser(payload) {
  return postAuth('/auth/register', payload)
}

export function loginUser(payload) {
  return postAuth('/auth/login', payload)
}

export async function fetchUser(userId) {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch user: ${response.status}`)
  }
  return response.json()
}

export async function fetchCollection(userId) {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/collection`)
  if (!response.ok) {
    throw new Error(`Failed to fetch collection: ${response.status}`)
  }
  return response.json()
}

export async function addOwnedCard(userId, { cardId, category }) {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/collection`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ card_id: cardId, category }),
  })
  if (!response.ok) {
    throw new Error(`Failed to add card: ${response.status}`)
  }
  return response.json()
}

export async function removeOwnedCard(userId, ownedId) {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/collection/${ownedId}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    throw new Error(`Failed to remove card: ${response.status}`)
  }
}

export async function updateBalance(userId, delta) {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/balance`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ delta }),
  })
  if (!response.ok) {
    throw new Error(`Failed to update balance: ${response.status}`)
  }
  return response.json()
}

export async function fetchPlacedBets(userId) {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/bets`)
  if (!response.ok) {
    throw new Error(`Failed to fetch bets: ${response.status}`)
  }
  return response.json()
}

export async function createPlacedBet(userId, { type, legs, stake, odds, payout }) {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/bets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, legs, stake, odds, payout }),
  })
  if (!response.ok) {
    throw new Error(`Failed to place bet: ${response.status}`)
  }
  return response.json()
}

export async function fetchUnopenedPacks(userId) {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/unopened-packs`)
  if (!response.ok) {
    throw new Error(`Failed to fetch unopened packs: ${response.status}`)
  }
  return response.json()
}

export async function createUnopenedPack(userId, { packTierId, cardId, category }) {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/unopened-packs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pack_tier_id: packTierId, card_id: cardId, category }),
  })
  if (!response.ok) {
    throw new Error(`Failed to save unopened pack: ${response.status}`)
  }
  return response.json()
}

export async function removeUnopenedPack(userId, unopenedId) {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/unopened-packs/${unopenedId}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    throw new Error(`Failed to remove unopened pack: ${response.status}`)
  }
}

export async function fetchCardHistory(userId) {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/card-history`)
  if (!response.ok) {
    throw new Error(`Failed to fetch card history: ${response.status}`)
  }
  return response.json()
}

export async function addCardHistory(userId, { cardId, category, action, value }) {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/card-history`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ card_id: cardId, category, action, value }),
  })
  if (!response.ok) {
    throw new Error(`Failed to record card history: ${response.status}`)
  }
  return response.json()
}
