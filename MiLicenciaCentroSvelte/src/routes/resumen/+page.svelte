<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<svelte:head>
  <title>Resumen de Compra | MiLicencia</title>
</svelte:head>

<div class="max-w-2xl mx-auto py-8 px-4">
  <div class="text-center mb-8">
    <div class="text-6xl mb-4">✅</div>
    <h1 class="text-3xl font-bold mb-2">¡Compra exitosa!</h1>
    <p class="text-base-content/70">Tu PIN ha sido generado correctamente</p>
  </div>

  {#if data.referencia}
    <div class="card bg-base-100 shadow-xl mb-6">
      <div class="card-body items-center text-center">
        <h2 class="card-title">Número de referencia</h2>
        <div class="badge badge-primary badge-lg text-lg px-6 py-4 font-mono">
          {data.referencia}
        </div>
        <p class="text-sm text-base-content/70 mt-2">
          Guarda este número para consultas futuras
        </p>
      </div>
    </div>
  {/if}

  <div class="card bg-base-100 shadow-md mb-4">
    <div class="card-body">
      <div class="alert alert-info">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="h-6 w-6 shrink-0 stroke-current">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <div>
          <h3 class="font-bold">Próximos pasos</h3>
          <ul class="text-sm list-disc list-inside mt-1">
            <li>Recibirás un correo con los detalles de tu compra</li>
            <li>Presenta tu PIN en el centro el día de tu cita</li>
            <li>Lleva documento de identidad original</li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <div class="flex gap-3 justify-center">
    <a href="/" class="btn btn-primary">Ir al inicio</a>
    <a href="/consulta" class="btn btn-ghost">Consultar estado</a>
  </div>
</div>
