<script lang="ts">
  import { isLoading } from '$lib/services/loader.store';
</script>

{#if $isLoading}
  <div class="fixed inset-0 bg-black/40 z-[9999] flex items-center justify-center" role="status" aria-live="polite">
    <div class="bg-base-100 rounded-2xl p-8 flex flex-col items-center gap-4 shadow-2xl">
      <span class="loading loading-spinner loading-lg text-primary"></span>
      <p class="text-base-content font-medium">Procesando, por favor espere...</p>
    </div>
  </div>
{/if}
