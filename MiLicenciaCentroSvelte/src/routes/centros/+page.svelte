<script lang="ts">
  import type { PageData } from './$types';
  import { TipoCliente, DescripcionTipoClienteCentro } from '$lib/enums/PinesOlimpia/TipoCliente';
  import type { Centro } from '$lib/interfaces/cotizacion/Centro';

  export let data: PageData;

  let tipoCentro = TipoCliente.CRC;
  let nombreFiltro = '';
  let centros: Centro[] = data.centros ?? [];

  $: filtrados = nombreFiltro
    ? centros.filter((c) => c.nombre.toLowerCase().includes(nombreFiltro.toLowerCase()))
    : centros;
</script>

<svelte:head>
  <title>Seleccionar Centro | MiLicencia</title>
</svelte:head>

<div class="max-w-4xl mx-auto py-8 px-4">
  <div class="mb-6">
    <h1 class="text-3xl font-bold">Selecciona tu centro</h1>
    <p class="text-base-content/70 mt-1">Elige el centro de reconocimiento de conductores</p>
  </div>

  <div class="card bg-base-100 shadow-md mb-6">
    <div class="card-body">
      <div class="flex flex-col sm:flex-row gap-3">
        <div class="form-control flex-1">
          <label class="label" for="tipoCentro">
            <span class="label-text">Tipo</span>
          </label>
          <select id="tipoCentro" class="select select-bordered" bind:value={tipoCentro}>
            {#each Object.entries(DescripcionTipoClienteCentro) as [key, label]}
              <option value={Number(key)}>{label}</option>
            {/each}
          </select>
        </div>
        <div class="form-control flex-[2]">
          <label class="label" for="nombreFiltro">
            <span class="label-text">Buscar</span>
          </label>
          <input
            id="nombreFiltro"
            type="text"
            class="input input-bordered"
            placeholder="Nombre del centro..."
            bind:value={nombreFiltro}
          />
        </div>
      </div>
    </div>
  </div>

  {#if filtrados.length === 0}
    <div class="alert alert-info">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="h-6 w-6 shrink-0 stroke-current">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <span>No se encontraron centros. Intenta con otro nombre o tipo.</span>
    </div>
  {:else}
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {#each filtrados as centro}
        <a
          href="/centros/{centro.id}"
          class="card bg-base-100 shadow-sm border border-base-300 hover:border-primary hover:shadow-md transition-all"
        >
          <div class="card-body p-4">
            <h3 class="card-title text-base">{centro.nombre}</h3>
            {#if centro.direccion}
              <p class="text-sm text-base-content/70">{centro.direccion}</p>
            {/if}
          </div>
        </a>
      {/each}
    </div>
  {/if}
</div>
