import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as client from '../src/lib/apiClient';

beforeEach(() => {
  // reset fetch mock
  (globalThis as any).fetch = vi.fn();
});

describe('apiClient edge cases', () => {
  it('getGames returns empty array when API returns []', async () => {
    (globalThis as any).fetch.mockResolvedValueOnce({ ok: true, status: 200, json: async () => [] });
    const res = await client.getGames();
    expect(res).toEqual([]);
  });

  it('getGame returns null when API returns 404', async () => {
    (globalThis as any).fetch.mockResolvedValueOnce({ ok: false, status: 404 });
    const res = await client.getGame(9999);
    expect(res).toBeNull();
  });

  it('createGame throws when EAN is too long', async () => {
    const longEan = '1'.repeat(20);
    await expect(client.createGame({ title: 'X', ean13: longEan } as any)).rejects.toThrow('EAN13 too long');
  });

  it('uploadGamesJSON throws for malformed JSON input', async () => {
    await expect(client.uploadGamesJSON('not a json')).rejects.toThrow('Malformed JSON');
  });

  it('network errors are propagated', async () => {
    (globalThis as any).fetch.mockImplementationOnce(() => { throw new Error('network down'); });
    await expect(client.getGames()).rejects.toThrow('network down');
  });
});
