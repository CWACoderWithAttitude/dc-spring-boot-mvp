<script lang="ts">
  import { uploadGamesJSON } from '$lib/apiClient';
  let text = '';
  let validationError: string | null = null;

  async function submit() {
    validationError = null;
    if (!text.trim()) { validationError = 'Please paste JSON or select a file.'; return; }
    try {
      const res = await uploadGamesJSON(text);
      alert('Upload result: ' + res);
    } catch (e: any) {
      alert(e?.message || 'Upload failed');
    }
  }

  async function onFile(e: Event) {
    const input = e.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const f = input.files[0];
    try {
      text = await f.text();
    } catch (err) {
      alert('Failed to read file');
    }
  }
</script>

<div class="lcars-rect">
  <h1 class="lcars-accent">Upload Games JSON</h1>

  <input type="file" accept="application/json" on:change={onFile} />
  <br />
  <textarea bind:value={text} rows={12} cols={80} placeholder='Paste JSON array of games here'></textarea>
  <br />
  <button class="lcars-pill" on:click={submit}>Upload</button>

  {#if validationError}
    <p style="color:red">{validationError}</p>
  {/if}
</div>
