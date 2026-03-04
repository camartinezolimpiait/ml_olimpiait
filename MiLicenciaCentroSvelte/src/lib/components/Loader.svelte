<!--
  Componente indicador de carga (spinner/barra de progreso).
  Migrado desde Angular: src/app/components/common/loader/loader.component
  
  En Angular se usaba MatProgressBar. Aquí se usa CSS puro con animación.
-->
<script lang="ts">
  import { isLoading } from '$lib/services/loader.store';
</script>

{#if $isLoading}
  <div class="overlay d-flex justify-content-center">
    <div class="progress-bar-container">
      <div class="progress-bar"></div>
    </div>
  </div>
{/if}

<style>
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    z-index: 9999;
    background-color: transparent;
  }

  .progress-bar-container {
    width: 100%;
    height: 4px;
    background-color: #e3f2fd;
    overflow: hidden;
  }

  .progress-bar {
    height: 100%;
    background-color: #1565c0;
    animation: indeterminate 1.5s infinite linear;
    transform-origin: 0% 50%;
  }

  @keyframes indeterminate {
    0% {
      transform: translateX(0) scaleX(0);
    }
    40% {
      transform: translateX(0) scaleX(0.4);
    }
    100% {
      transform: translateX(100%) scaleX(0.5);
    }
  }
</style>
