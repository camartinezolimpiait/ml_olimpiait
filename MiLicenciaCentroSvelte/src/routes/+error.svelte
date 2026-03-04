<!--
  Página de error global de SvelteKit (equivalente al ErrorModule de Angular).
-->
<script lang="ts">
  import { page } from '$app/stores';
</script>

<svelte:head>
  <title>MiLicencia | {$page.status}</title>
</svelte:head>

<div class="wrapper">
  <div class="flex-column">
    <span style="font-variant: all-small-caps; margin-block-end: 0em;">
      Error {$page.status}
    </span>
    <h1>
      {#if $page.status === 404}
        Esta página no existe
      {:else}
        Ha ocurrido un error
      {/if}
    </h1>
    <p class="explicacion">
      {$page.error?.message || 'Se ha producido un error inesperado.'}
    </p>
    <a href="/" class="button-primary">Volver al inicio</a>
  </div>
</div>

<style>
  .wrapper {
    max-width: 600px;
    margin: 4rem auto;
    padding: 0 1rem;
  }

  .flex-column {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1rem;
  }

  h1 {
    font-size: 2rem;
    color: #1565c0;
  }
</style>
