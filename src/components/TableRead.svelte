<script lang="ts">
  import { parseScreenplay, generateDefaultCast, buildSynthesisTurns } from '../utils/screenplayParser';
  export let script: string = '';
  let audioUrl: string | null = null;
  let loading = false;

  async function synthesize() {
    loading = true;
    const { elements } = parseScreenplay(script);
    const cast = generateDefaultCast(elements.map(e=>e.character).filter(Boolean) as string[]);
    const turns = buildSynthesisTurns(elements, cast);
    const speakers = Object.values(cast).map((c:any)=>({ speaker: c.name, voice: c.voice }));
    const res = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Gemini-Key': (typeof localStorage!=='undefined'?localStorage.getItem('geminiKey')||'':'') },
      body: JSON.stringify({ turns, speakers }),
    });
    const data = await res.json();
    if (data.audio) {
      const blob = new Blob([Uint8Array.from(atob(data.audio), c => c.charCodeAt(0))], { type: 'audio/wav' });
      audioUrl = URL.createObjectURL(blob);
    }
    loading = false;
  }
</script>

<section class="p-6 space-y-4">
  <button on:click={synthesize} disabled={loading || !script} class="px-4 py-2 bg-black text-white rounded">
    {loading ? 'Sintetizzo...' : 'Leggi sceneggiatura'}
  </button>
  {#if audioUrl}
    <audio controls src={audioUrl} class="w-full"></audio>
  {/if}
</section>
