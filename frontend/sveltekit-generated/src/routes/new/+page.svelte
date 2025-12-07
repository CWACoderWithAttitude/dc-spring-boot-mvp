<script lang="ts">
  import { createGame } from '$lib/apiClient';
  import type { Game } from '$lib/apiClient';
  import { goto } from '$app/navigation';

  let game: Game = {};
  let validationError: string | null = null;

  async function submit() {
    validationError = null;
    if (!game.title || game.title.trim().length === 0) { validationError = 'Title is required'; return; }
    if (game.ean13 && game.ean13.length > 13) { validationError = 'EAN13 must be at most 13 chars'; return; }
    try {
      const created = await createGame(game);
      goto(`/games/${created.id}`);
    } catch (e: any) {
      alert(e?.message || 'Create failed');
    }
  }
</script>

<h1>Create Game</h1>

<style>
  form { max-width: 600px; }
  label { display:block; margin: 8px 0; }
  .error { color: red }
</style>

<form on:submit|preventDefault={submit} class="lcars-rect">
  <label>Title: <input required bind:value={game.title} /></label>
  <label>EAN13: <input bind:value={game.ean13} minlength={0} maxlength={13} pattern="\d*" /></label>
  <label>Publisher: <input bind:value={game.publisher} /></label>
  <div class="mt-2">
    <button class="lcars-pill" type="submit">Create</button>
  </div>
</form>

{#if validationError}
  <p class="error">{validationError}</p>
{/if}
