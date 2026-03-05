<!--
  Componente para mostrar errores de validación en campos de formulario.
  Migrado desde Angular: src/app/components/common/field-error/
-->
<script lang="ts">
  /** Mensaje de error a mostrar */
  export let message: string = '';
</script>

{#if message}
  <span class="field-error" role="alert">{message}</span>
{/if}

<style>
  .field-error {
    color: #d32f2f;
    font-size: 0.75rem;
    margin-top: 0.25rem;
    display: block;
  }
</style>
