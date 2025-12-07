export type Game = {
  id?: number;
  title?: string;
  ean13?: string;
  publisher?: string;
  genre?: string;
  min_number_of_players?: number;
  max_number_of_players?: number;
  min_age?: number;
  typical_duration?: string;
};

const BASE = (globalThis as any).API_BASE || process.env.API_BASE || 'http://host.docker.internal:28088';

export async function getGames(): Promise<Game[]> {
  const res = await fetch(`${BASE}/games/`);
  if (!res.ok) throw new Error(`getGames failed: ${res.status}`);
  return await res.json();
}

export async function getGame(id: number | string): Promise<Game | null> {
  const res = await fetch(`${BASE}/games/${id}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`getGame failed: ${res.status}`);
  return await res.json();
}

export async function createGame(game: Game): Promise<Game> {
  if (game.ean13 && game.ean13.length > 13) throw new Error('EAN13 too long');
  const res = await fetch(`${BASE}/games/new`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(game)
  });
  if (!res.ok) throw new Error(`createGame failed: ${res.status}`);
  return await res.json();
}

export async function updateGame(id: number | string, game: Game): Promise<Game> {
  const res = await fetch(`${BASE}/games/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(game)
  });
  if (!res.ok) throw new Error(`updateGame failed: ${res.status}`);
  return await res.json();
}

export async function deleteGame(id: number | string): Promise<boolean> {
  const res = await fetch(`${BASE}/games/${id}`, { method: 'DELETE' });
  if (res.status === 404) return false;
  if (!res.ok) throw new Error(`deleteGame failed: ${res.status}`);
  return true;
}

export async function uploadGamesJSON(json: string): Promise<string> {
  let parsed: any;
  try {
    parsed = JSON.parse(json);
  } catch (e) {
    throw new Error('Malformed JSON');
  }
  const res = await fetch(`${BASE}/games/upload`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsed)
  });
  if (!res.ok) throw new Error(`uploadGames failed: ${res.status}`);
  return await res.text();
}
