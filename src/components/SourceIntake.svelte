<script lang="ts">
  let sourceText = '';
  let mode = 'direct';
  let length = 'full';
  let model = 'gemini-3.8-flash';
  let models: string[] = ['gemini-3.8-flash'];
  if (typeof window !== 'undefined') { fetch('/api/models',{headers:{'X-Gemini-Key': (typeof localStorage!=='undefined'?localStorage.getItem('geminiKey')||'':'')}}).then(r=>r.json()).then(d=>{ if(d.models?.length) models=d.models; }).catch(()=>{}); }
  let loading = false;
  let script = '';

  const modeDesc: Record<string,string> = {
    direct: 'Usa la fonte quasi così com\'è (fedele)',
    light: 'Piccoli adattamenti (pulizia, formato sceneggiatura)',
    heavy: 'Rielaborazione profonda (chat + editor)',
  };

  async function generate() {
    loading = true;
    const res = await fetch('/api/generate-script', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Gemini-Key': (typeof localStorage!=='undefined'?localStorage.getItem('geminiKey')||'':'') },
      body: JSON.stringify({ sourceText, mode, length, targetLang: 'Italian', model }),
    });
    const data = await res.json();
    script = data.script || data.error || '';
    loading = false;
  }
</script>

<section class="p-6 space-y-4 bg-white rounded shadow">
  <h2 class="text-xl font-semibold">1. Fonte</h2>
  <textarea bind:value={sourceText} rows="8" class="w-full border rounded p-2" placeholder="Incolla testo, URL estratto, trascrizione..."></textarea>

  <h2 class="text-xl font-semibold">2. Opzioni di trasformazione</h2>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
    <div>
      <label class="block text-sm font-medium">Modalità</label>
      <select bind:value={mode} class="w-full border rounded p-2">
        <option value="direct">Diretta — {modeDesc.direct}</option>
        <option value="light">Leggera — {modeDesc.light}</option>
        <option value="heavy">Pesante — {modeDesc.heavy}</option>
      </select>
    </div>
    <div>
      <label class="block text-sm font-medium">Lunghezza</label>
      <select bind:value={length} class="w-full border rounded p-2">
        <option value="full">Completa (tutto il contenuto)</option>
        <option value="summary">Riassuntiva (punti chiave)</option>
      </select>
    </div>
    <div>
      <label class="block text-sm font-medium">Modello</label>
      <select bind:value={model} class="w-full border rounded p-2">
        {#each models as m}<option value={m}>{m}</option>{/each}
      </select>
    </div>
  </div>

  <button on:click={generate} disabled={loading || !sourceText.trim()} class="px-4 py-2 bg-black text-white rounded disabled:opacity-50">
    {loading ? 'Genero...' : 'Genera sceneggiatura (italiano)'}
  </button>

  {#if script}
    <h2 class="text-xl font-semibold">3. Sceneggiatura generata</h2>
    <pre class="whitespace-pre-wrap border rounded p-4 bg-gray-50">{script}</pre>
  {/if}
</section>
