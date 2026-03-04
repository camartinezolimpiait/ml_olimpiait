<!--
  Alerta tipo snackbar/toast.
  Equivalente al MatSnackBar de Angular.
-->
<script lang="ts">
  import { alertStore } from '$lib/services/alert.store';
</script>

{#if $alertStore.visible}
  <div class="snackbar" role="alert">
    <span>{$alertStore.message}</span>
    <button
      type="button"
      on:click={() => alertStore.set({ message: '', visible: false })}
    >
      Aceptar
    </button>
  </div>
{/if}

<style>
  .snackbar {
    position: fixed;
    bottom: 1rem;
    left: 50%;
    transform: translateX(-50%);
    background-color: #323232;
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    display: flex;
    align-items: center;
    gap: 1rem;
    z-index: 2000;
    min-width: 20rem;
    max-width: 90vw;
  }

  .snackbar button {
    background: none;
    border: none;
    color: #90caf9;
    cursor: pointer;
    font-weight: 600;
    margin-left: auto;
  }
</style>
