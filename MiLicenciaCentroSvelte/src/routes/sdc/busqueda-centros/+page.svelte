<script lang="ts">
  import type { PageData } from './$types';
  import type { Centro } from '$lib/interfaces/cotizacion/Centro';
  import { goto } from '$app/navigation';
  import { TipoCliente, DescripcionTipoClienteCentro } from '$lib/enums/PinesOlimpia/TipoCliente';

  export let data: PageData;

  let tipoCentro = TipoCliente.CRC;
  let nombreFiltro = '';
  let centros: Centro[] = data.centros;

  $: filtrados = nombreFiltro
    ? centros.filter((c) => c.nombre.toLowerCase().includes(nombreFiltro.toLowerCase()))
    : centros;

  async function cambiarTipo() {
    try {
      const res = await fetch(`/api/centros?tipo=${tipoCentro}`);
      if (res.ok) centros = await res.json();
    } catch {
      centros = [];
    }
  }

  function seleccionarCentro(centro: Centro) {
    goto(`/centros/${centro.id}`);
  }
</script>

<svelte:head>
  <title>Buscar Centro | MiLicencia</title>
</svelte:head>

<div class="max-w-4xl mx-auto py-8 px-4">
  <div class="mb-6">
    <h1 class="text-3xl font-bold">Búsqueda de Centros</h1>
    <p class="text-base-content/70 mt-1">Encuentra el centro más cercano a ti</p>
  </div>

  <div class="card bg-base-100 shadow-md mb-6">
    <div class="card-body">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="form-control">
          <label class="label" for="tipoCentro"><span class="label-text">Tipo de centro</span></label>
          <select
            id="tipoCentro"
            class="select select-bordered"
            bind:value={tipoCentro}
            on:change={cambiarTipo}
          >
            {#each Object.entries(DescripcionTipoClienteCentro) as [key, label]}
              <option value={Number(key)}>{label}</option>
            {/each}
          </select>
        </div>
        <div class="form-control flex-1">
          <label class="label" for="filtro"><span class="label-text">Filtrar por nombre</span></label>
          <input
            id="filtro"
            type="text"
            class="input input-bordered"
            placeholder="Buscar centro..."
            bind:value={nombreFiltro}
          />
        </div>
      </div>
    </div>
  </div>

  {#if filtrados.length === 0}
    <div class="alert alert-info">
      <span>No se encontraron centros. Intenta con otro criterio de búsqueda.</span>
    </div>
  {:else}
    <p class="text-sm text-base-content/70 mb-4">{filtrados.length} centro(s) encontrado(s)</p>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {#each filtrados as centro}
        <button
          type="button"
          class="card bg-base-100 shadow-sm border border-base-300 hover:border-primary hover:shadow-md transition-all text-left"
          on:click={() => seleccionarCentro(centro)}
        >
          <div class="card-body p-4">
            <h3 class="font-semibold">{centro.nombre}</h3>
            {#if centro.direccion}
              <p class="text-sm text-base-content/70">{centro.direccion}</p>
            {/if}
            <div class="mt-2">
              <span class="badge badge-primary badge-outline badge-sm">Seleccionar</span>
            </div>
          </div>
        </button>
      {/each}
    </div>
  {/if}
</div>
