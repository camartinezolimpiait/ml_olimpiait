<script lang="ts">
  import { dialogStore } from '$lib/services/dialog.store';

  function confirmar() {
    $dialogStore?.onConfirm?.();
    dialogStore.set(null);
  }

  function cancelar() {
    $dialogStore?.onCancel?.();
    dialogStore.set(null);
  }
</script>

{#if $dialogStore}
  <dialog class="modal modal-open" aria-modal="true">
    <div class="modal-box">
      {#if $dialogStore.titulo}
        <h3 class="font-bold text-lg">{$dialogStore.titulo}</h3>
      {/if}
      <p class="py-4">{$dialogStore.mensaje}</p>
      <div class="modal-action">
        {#if $dialogStore.onCancel !== undefined || $dialogStore.textoCancelar !== undefined}
          <button class="btn btn-ghost" on:click={cancelar}>
            {$dialogStore.textoCancelar ?? 'Cancelar'}
          </button>
        {/if}
        <button class="btn btn-primary" on:click={confirmar}>
          {$dialogStore.textoConfirmar ?? 'Aceptar'}
        </button>
      </div>
    </div>
    <div class="modal-backdrop" on:click={cancelar} role="presentation"></div>
  </dialog>
{/if}
