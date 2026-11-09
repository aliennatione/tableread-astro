<script lang="ts">
  let sourceText = '';
  let mode = 'direct';
  let length = 'full';
  let loading = false;
  let script = '';

  async function generate() {
    loading = true;
    const res = await fetch('/api/generate-script', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sourceText, mode, length, targetLang: 'Italian' }),
    });
    const data = await res.json();
    script = data.script || '';
    loading = false;
  }
</script>

<section class="p-6 space-y-4">
  <textarea bind:value={sourceText} rows="8" class="w-full border rounded p-2" placeholder="Incolla testo, URL estratto, trascrizione..."></textarea>
  <div class="flex gap-4">
    <select bind:value={mode} class="border rounded p-2">
      <option value="direct">Diretta</option>
      <option value="light">Leggera</option>
      <option value="heavy">Pesante</option>
    </select>
    <select bind:value={length} class="border rounded p-2">
      <option value="full">Completa</option>
      <option value="summary">Riassuntiva</option>
    </select>
    <button on:click={generate} disabled={loading} class="px-4 py-2 bg-black text-white rounded">
      {loading ? 'Genero...' : 'Genera sceneggiatura'}
    </button>
  </div>
  {#if script}
    <pre class="whitespace-pre-wrap border rounded p-4 bg-gray-50">{script}</pre>
  {/if}
</section>
