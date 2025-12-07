<script lang="ts">
  import { onMount } from 'svelte';
  import { getGames } from '$lib/apiClient';
  import type { Game } from '$lib/apiClient';

  let games: Game[] = [];
  let error: string | null = null;

  onMount(async () => {
    try {
      games = await getGames();
    } catch (e: any) {
      error = e?.message || 'Failed to load games';
    }
  });
</script>

<div class="lcars-rect">
  <h1 class="lcars-accent">Games</h1>
  {#if error}
    <p style="color: red">{error}</p>
  {:else}
    <div class="mb-4"><a class="lcars-pill" href="/new">Create new game</a> <a class="ml-4 lcars-pill" href="/upload">Upload JSON</a></div>
    {#if games.length === 0}
      <p>No games found.</p>
    {:else}
      <div class="lcars-column">
        {#each games as g}
          <div class="lcars-card"><a href={`/games/${g.id}`} class="lcars-accent">{g.title || '(no title)'}</a></div>
        {/each}
      </div>
    {/if}
  {/if}
</div>
