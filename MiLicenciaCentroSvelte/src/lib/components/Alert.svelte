<script lang="ts">
  import { alertStore } from '$lib/services/alert.store';

  function cerrar() {
    alertStore.set(null);
  }
</script>

{#if $alertStore}
  <div class="toast toast-top toast-center z-[9998]">
    <div
      class="alert"
      class:alert-info={$alertStore.tipo === 'info'}
      class:alert-success={$alertStore.tipo === 'success'}
      class:alert-warning={$alertStore.tipo === 'warning'}
      class:alert-error={$alertStore.tipo === 'error'}
      role="alert"
    >
      <span>{$alertStore.mensaje}</span>
      <button class="btn btn-ghost btn-xs" on:click={cerrar} aria-label="Cerrar alerta">✕</button>
    </div>
  </div>
{/if}
