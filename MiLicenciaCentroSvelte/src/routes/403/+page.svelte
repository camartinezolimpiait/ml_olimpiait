<svelte:head>
  <title>Acceso Denegado | MiLicencia</title>
</svelte:head>

<div class="min-h-[60vh] flex items-center justify-center px-4">
  <div class="text-center max-w-md">
    <div class="text-8xl font-black text-error/20 mb-4">403</div>
    <div class="alert alert-error mb-6 w-fit mx-auto">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <span>No tienes permiso para acceder a esta página</span>
    </div>
    <h1 class="text-2xl font-bold mb-2">Acceso Denegado</h1>
    <p class="text-base-content/70 mb-6">
      Tu perfil de usuario no tiene los permisos necesarios para acceder a este recurso.
    </p>
    <div class="flex gap-3 justify-center">
      <a href="/" class="btn btn-primary">Ir al inicio</a>
      <button class="btn btn-ghost" on:click={() => history.back()}>Volver</button>
    </div>
  </div>
</div>
