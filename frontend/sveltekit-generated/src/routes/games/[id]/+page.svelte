<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { getGame, updateGame, deleteGame } from '$lib/apiClient';
  import type { Game } from '$lib/apiClient';
  import { goto } from '$app/navigation';

  let id: string;
  let game: Game | null = null;
  let error: string | null = null;
  $: id = $page.params.id;

  onMount(async () => {
    try {
      game = await getGame(id);
    } catch (e: any) {
      error = e?.message || 'Failed to load game';
    }
  });

  async function save() {
    try {
      if (!game) return;
      await updateGame(id, game);
      alert('Saved');
    } catch (e: any) {
      alert(e?.message || 'Save failed');
    }
  }

  async function remove() {
    if (!confirm('Delete this game?')) return;
    try {
      const ok = await deleteGame(id);
      if (ok) goto('/games');
      else alert('Not found');
    } catch (e: any) {
      alert(e?.message || 'Delete failed');
    }
  }
</script>

{#if error}
  <p style="color: red">{error}</p>
{:else}
  {#if !game}
    <p>Loading...</p>
  {:else}
    <div class="lcars-rect">
      <h1 class="lcars-accent">Edit: {game.title}</h1>
      <label>Title: <input bind:value={game.title} /></label>
      <label>EAN13: <input bind:value={game.ean13} /></label>
      <div class="mt-2">
        <button class="lcars-pill" on:click={save}>Save</button>
        <button class="lcars-pill ml-2" on:click={remove}>Delete</button>
      </div>
    </div>
  {/if}
{/if}
