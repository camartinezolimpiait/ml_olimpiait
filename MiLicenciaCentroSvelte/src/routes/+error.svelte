<script lang="ts">
  import { page } from '$app/stores';
</script>

<svelte:head>
  <title>Error {$page.status} | MiLicencia</title>
</svelte:head>

<div class="min-h-[60vh] flex items-center justify-center px-4">
  <div class="text-center max-w-md">
    <div class="text-8xl font-black text-primary/20 mb-4">{$page.status}</div>
    <h1 class="text-2xl font-bold mb-2">
      {#if $page.status === 404}
        Página no encontrada
      {:else if $page.status === 403}
        Acceso denegado
      {:else}
        Ha ocurrido un error
      {/if}
    </h1>
    <p class="text-base-content/70 mb-6">
      {$page.error?.message ?? 'Lo sentimos, algo salió mal. Por favor intenta de nuevo.'}
    </p>
    <div class="flex gap-3 justify-center">
      <a href="/" class="btn btn-primary">Ir al inicio</a>
      <button class="btn btn-ghost" on:click={() => history.back()}>Volver</button>
    </div>
  </div>
</div>
