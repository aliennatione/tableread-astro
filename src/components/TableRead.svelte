<script lang="ts">
  export let script: string = '';
  let audioUrl: string | null = null;
  let loading = false;

  async function synthesize() {
    loading = true;
    // Minimal: treat whole script as one turn, one speaker
    const turns = [{ speaker: 'Narrator', text: script, style: 'neutral' }];
    const speakers = [{ speaker: 'Narrator', voice: 'Kore' }];
    const res = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
