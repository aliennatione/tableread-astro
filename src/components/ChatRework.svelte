<script lang="ts">
  export let script: string = '';
  let messages: {role:string;text:string}[] = [];
  let input = '';
  let loading = false;

  async function send() {
    if (!input.trim()) return;
    messages = [...messages, { role: 'user', text: input }];
    loading = true;
    const res = await fetch('/api/generate-script', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sourceText: script + '\n\nUSER REQUEST: ' + input, mode: 'heavy', length: 'full', targetLang: 'Italian' }),
    });
    const data = await res.json();
    messages = [...messages, { role: 'assistant', text: data.script || '' }];
    loading = false;
    input = '';
  }
</script>

<section class="p-6 space-y-3">
  <div class="space-y-2 max-h-64 overflow-auto border rounded p-3">
    {#each messages as m}
      <div class="text-sm"><b>{m.role}:</b> <pre class="whitespace-pre-wrap inline">{m.text}</pre></div>
    {/each}
  </div>
  <div class="flex gap-2">
    <input bind:value={input} class="flex-1 border rounded p-2" placeholder="Chiedi modifiche alla sceneggiatura..." />
    <button on:click={send} disabled={loading} class="px-4 py-2 bg-black text-white rounded">{loading?'...':'Invia'}</button>
  </div>
</section>
