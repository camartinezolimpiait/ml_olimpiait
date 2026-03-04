<!--
  Diálogo modal simple para mensajes de información/error/confirmación.
  Migrado desde Angular: src/app/components/common/dialogo-simple/
  
  En Angular se usaba MatDialog. Aquí se implementa con el store dialogStore.
-->
<script lang="ts">
  import { dialogStore, closeDialog } from '$lib/services/dialog.store';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher<{ confirm: void }>();

  function handleClose(): void {
    closeDialog();
  }

  function handleConfirm(): void {
    closeDialog();
    dispatch('confirm');
  }
</script>

{#if $dialogStore.visible}
  <div
    class="dialog-backdrop"
    role="button"
    tabindex="0"
    aria-label="Cerrar diálogo"
    on:click={handleClose}
    on:keydown={(e) => e.key === 'Escape' && handleClose()}
  >
    <div
      class="simple-dialog"
      on:click|stopPropagation
      on:keydown|stopPropagation
      role="dialog"
      aria-modal="true"
    >
      <img src={$dialogStore.logo} alt="Alerta" style="margin-block-end: 1.5rem;" />
      <p class="pregunta">{$dialogStore.mensaje}</p>
      <div class="flex-botones">
        {#if !$dialogStore.confirmable}
          <button type="button" class="button-secondary" on:click={handleClose}>Cerrar</button>
        {:else}
          <button type="button" class="button-secondary" on:click={handleClose}>No</button>
          <button
            type="button"
            class="button-primary"
            id={$dialogStore.idBoton || 'confirmar'}
            on:click={handleConfirm}
          >
            Sí
          </button>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  .dialog-backdrop {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .simple-dialog {
    background: white;
    border-radius: 8px;
    padding: 2rem;
    width: 22rem;
    max-width: 90vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .flex-botones {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
  }
</style>
