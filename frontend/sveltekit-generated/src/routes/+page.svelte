<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  onMount(() => {
    goto('/games');
  });
</script>

<p>Redirecting to <a href="/games">/games</a>…</p>
<script lang="ts">
  import { onMount } from 'svelte';
  import type { Game } from '$lib/apiClient';
  import { getGames } from '$lib/apiClient';

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

{#if error}
  <p style="color: red">{error}</p>
{:else}
  <h1>Games</h1>
  {#if games.length === 0}
    <p>No games found.</p>
  {:else}
    <ul>
      {#each games as g}
        <li>{g.title} {#if g.ean13}— {g.ean13}{/if}</li>
      {/each}
    </ul>
  {/if}
{/if}
