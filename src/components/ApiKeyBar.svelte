<script lang="ts">
  let key = '';
  if (typeof localStorage !== 'undefined') key = localStorage.getItem('geminiKey') || '';
  function save() { if (typeof localStorage !== 'undefined') localStorage.setItem('geminiKey', key); }
</script>
<div class="p-4 flex gap-2 items-center">
  <input type="password" bind:value={key} on:input={save} placeholder="Gemini API key (opzionale)" class="flex-1 border rounded p-2" />
</div>
