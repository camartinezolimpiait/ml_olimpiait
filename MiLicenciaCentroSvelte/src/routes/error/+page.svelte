<!--
  Página de error 404.
  Migrado desde Angular: src/app/components/pages/error/error.component
-->
<script lang="ts">
</script>

<svelte:head>
  <title>MiLicencia | Error 404</title>
</svelte:head>

<div class="wrapper">
  <div class="flex-column">
    <span style="font-variant: all-small-caps; margin-block-end: 0em;">Error 404</span>
    <h1>Esta página no existe</h1>
    <p class="explicacion">
      La página que buscas fue removida, renombrada o no se encuentra disponible ahora mismo.
    </p>
    <p class="explicacion mensaje">
      Revisa que la dirección esté escrita correctamente, o encuentra lo que necesitas desde nuestra
      <a href="/">página de inicio.</a>
    </p>
    <img class="cono" alt="imagen de cono de tráfico" src="/assets/img/cono.svg" />
    <hr />
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
  }

  h1 {
    font-size: 2rem;
    color: #1565c0;
  }

  .explicacion {
    color: #666;
    max-width: 480px;
  }

  .cono {
    max-width: 200px;
    margin: 2rem 0;
  }
</style>
