<svelte:head>
  <title>Error | MiLicencia</title>
</svelte:head>

<div class="min-h-[60vh] flex items-center justify-center px-4">
  <div class="text-center max-w-md">
    <div class="alert alert-error mb-6">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>Se presentó un error en el sistema</span>
    </div>
    <h1 class="text-2xl font-bold mb-2">Error</h1>
    <p class="text-base-content/70 mb-6">
      Por favor, intenta de nuevo o contacta al soporte si el problema persiste.
    </p>
    <a href="/" class="btn btn-primary">Ir al inicio</a>
  </div>
</div>
