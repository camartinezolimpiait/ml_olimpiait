<script lang="ts">
  import { goto } from '$app/navigation';
  import { TipoCliente, DescripcionTipoClienteCentro } from '$lib/enums/PinesOlimpia/TipoCliente';
  import type { Centro } from '$lib/interfaces/cotizacion/Centro';
  import { rutas } from '$lib/const/rutas';
  import type { PageData } from './$types';

  export let data: PageData;

  const paginasCliente = rutas.mlCliente.tramites;
  const procesosBanco = rutas.mlCliente.procesosBanco;
  const procesosSdc = rutas.mlCliente.servicios;

  let centros: Centro[] = [];
  let centroSeleccionado: Centro | undefined;
  let tipoCentro: number = TipoCliente.CRC;
  let nombreCentro: string = '';
  let habilitarBoton: boolean = false;
  let cargandoCentros = false;
  let filteredCentros: Centro[] = [];

  $: filteredCentros = nombreCentro
    ? centros.filter((c) => c.nombre.toLowerCase().includes(nombreCentro.toLowerCase()))
    : [];

  async function cargarCentros(): Promise<void> {
    cargandoCentros = true;
    try {
      const response = await fetch(`/api/centros?tipo=${tipoCentro}`);
      if (response.ok) {
        centros = await response.json();
      }
    } catch {
      centros = [];
    } finally {
      cargandoCentros = false;
    }
  }

  function selectCentro(centro: Centro): void {
    centroSeleccionado = centro;
    nombreCentro = centro.nombre;
    habilitarBoton = true;
    filteredCentros = [];
  }

  async function navegarACentro(): Promise<void> {
    if (centroSeleccionado) {
      await goto(`/centros/${centroSeleccionado.id}`);
    }
  }

  $: if (tipoCentro) {
    nombreCentro = '';
    centroSeleccionado = undefined;
    habilitarBoton = false;
    cargarCentros();
  }

  const tramites = [
    {
      href: `${paginasCliente.nombre}/${paginasCliente.acciones.primeraVez}`,
      titulo: 'Primera vez',
      descripcion: 'Obtén tu licencia de conducción por primera vez',
      icono: '🆕',
    },
    {
      href: `${paginasCliente.nombre}/${paginasCliente.acciones.renovar}`,
      titulo: 'Renovar',
      descripcion: 'Renueva tu licencia de conducción vigente',
      icono: '🔄',
    },
    {
      href: `${paginasCliente.nombre}/${paginasCliente.acciones.recategorizar}`,
      titulo: 'Recategorizar',
      descripcion: 'Amplía las categorías de tu licencia',
      icono: '⬆️',
    },
    {
      href: `${procesosBanco.nombre}${procesosBanco.acciones.consulta}`,
      titulo: 'Consultar estado',
      descripcion: 'Conoce el estado de tu trámite',
      icono: '🔍',
    },
    {
      href: `${procesosSdc.nombre}/${procesosSdc.acciones.compraPin}`,
      titulo: 'Comprar PIN (CRC)',
      descripcion: 'Adquiere tu PIN para examen médico',
      icono: '🏥',
    },
    {
      href: `${procesosSdc.nombre}/${procesosSdc.acciones.compraConduccion}`,
      titulo: 'Comprar PIN (CEA)',
      descripcion: 'Adquiere tu PIN para curso de conducción',
      icono: '🚗',
    },
  ];
</script>

<svelte:head>
  <title>MiLicencia | Inicio</title>
  <meta name="description" content="Portal de trámites de licencias de conducción en Colombia" />
</svelte:head>

<!-- Hero Section -->
<section class="hero min-h-[40vh] bg-primary text-primary-content">
  <div class="hero-content text-center">
    <div class="max-w-2xl">
      <h1 class="text-4xl md:text-5xl font-bold mb-4">MiLicencia Centro</h1>
      <p class="text-lg md:text-xl opacity-90 mb-6">
        Gestiona tu licencia de conducción de forma fácil y segura.
      </p>
    </div>
  </div>
</section>

<!-- Buscador de centros -->
<section class="py-8 px-4 bg-base-100">
  <div class="max-w-2xl mx-auto">
    <h2 class="text-2xl font-bold text-center mb-6">Encuentra tu centro</h2>
    <div class="card bg-base-100 shadow-xl border border-base-300">
      <div class="card-body gap-4">
        <div class="form-control">
          <label class="label" for="tipoCentro">
            <span class="label-text font-semibold">Tipo de centro</span>
          </label>
          <select
            id="tipoCentro"
            class="select select-bordered select-primary w-full"
            bind:value={tipoCentro}
          >
            {#each Object.entries(DescripcionTipoClienteCentro) as [key, label]}
              <option value={Number(key)}>{label}</option>
            {/each}
          </select>
        </div>

        <div class="form-control relative">
          <label class="label" for="nombreCentro">
            <span class="label-text font-semibold">Nombre del centro</span>
          </label>
          <input
            type="text"
            id="nombreCentro"
            name="nombreCentro"
            bind:value={nombreCentro}
            placeholder="Escribe para buscar..."
            class="input input-bordered input-primary w-full"
            autocomplete="off"
          />
          {#if cargandoCentros}
            <div class="absolute right-3 top-11">
              <span class="loading loading-spinner loading-sm text-primary"></span>
            </div>
          {/if}

          {#if filteredCentros.length > 0 && nombreCentro}
            <ul class="absolute z-10 top-full mt-1 left-0 right-0 bg-base-100 border border-base-300 rounded-box shadow-xl max-h-48 overflow-y-auto">
              {#each filteredCentros as centro}
                <li>
                  <button
                    type="button"
                    class="w-full text-left px-4 py-2 hover:bg-base-200 transition-colors"
                    on:click={() => selectCentro(centro)}
                  >
                    {centro.nombre}
                  </button>
                </li>
              {/each}
            </ul>
          {/if}
        </div>

        <button
          type="button"
          disabled={!habilitarBoton}
          class="btn btn-primary w-full"
          on:click={navegarACentro}
        >
          Ir al centro
        </button>
      </div>
    </div>
  </div>
</section>

<!-- Tramites disponibles -->
<section class="py-8 px-4 bg-base-200">
  <div class="max-w-5xl mx-auto">
    <h2 class="text-2xl font-bold text-center mb-2">Trámites disponibles</h2>
    <p class="text-center text-base-content/70 mb-8">Selecciona el trámite que necesitas realizar</p>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {#each tramites as tramite}
        <a
          href={tramite.href}
          class="card bg-base-100 shadow-md hover:shadow-xl transition-shadow border border-base-300 hover:border-primary"
        >
          <div class="card-body">
            <div class="text-4xl mb-2" aria-hidden="true">{tramite.icono}</div>
            <h3 class="card-title text-base">{tramite.titulo}</h3>
            <p class="text-sm text-base-content/70">{tramite.descripcion}</p>
          </div>
        </a>
      {/each}
    </div>
  </div>
</section>
