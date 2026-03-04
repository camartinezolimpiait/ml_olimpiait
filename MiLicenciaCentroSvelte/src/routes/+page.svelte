<!--
  Página principal (home) - equivalente al InicioCentroComponent de Angular.
  Migrado desde Angular: src/app/components/pages/inicio-centro/
-->
<script lang="ts">
  import { goto } from '$app/navigation';
  import { rutas } from '$lib/const/rutas';
  import { TipoCliente, DescripcionTipoClienteCentro } from '$lib/enums/PinesOlimpia/TipoCliente';
  import type { Centro } from '$lib/interfaces/cotizacion/Centro';

  const paginasCliente = rutas.mlCliente.tramites;
  const procesosBanco = rutas.mlCliente.procesosBanco;
  const procesosSdc = rutas.mlCliente.servicios;

  let centros: Centro[] = [];
  let centroSeleccionado: Centro | undefined;
  let tipoCentro: number = TipoCliente.CRC;
  let nombreCentro: string = '';
  let habilitarBoton: boolean = false;
  let filteredCentros: Centro[] = [];

  $: filteredCentros = centros.filter((c) =>
    c.nombre.toLowerCase().includes(nombreCentro.toLowerCase())
  );

  function selectCentro(centro: Centro): void {
    centroSeleccionado = centro;
    nombreCentro = centro.nombre;
    habilitarBoton = true;
  }

  async function navegarACentro(): Promise<void> {
    if (centroSeleccionado) {
      await goto(`/centro/${centroSeleccionado.id}`);
    }
  }
</script>

<svelte:head>
  <title>MiLicencia | Inicio</title>
</svelte:head>

<main class="centros_main">
  <div class="busca-contenedor field">
    <label for="tipoCentro">Selecciona tu Centro</label>
    <div class="busca-flex">
      <select
        class="busca-flex-tipo"
        id="tipoCentro"
        bind:value={tipoCentro}
      >
        {#each Object.entries(DescripcionTipoClienteCentro) as [key, label]}
          <option value={Number(key)}>{label}</option>
        {/each}
      </select>
      <input
        type="text"
        id="nombreCentro"
        name="nombreCentro"
        bind:value={nombreCentro}
        placeholder="Nombre del centro"
        class="busca-flex-nombre"
        autocomplete="off"
      />
      {#if filteredCentros.length > 0 && nombreCentro}
        <ul class="autocomplete-list">
          {#each filteredCentros as centro}
            <li>
              <button type="button" on:click={() => selectCentro(centro)}>
                {centro.nombre}
              </button>
            </li>
          {/each}
        </ul>
      {/if}
      <button
        type="button"
        disabled={!habilitarBoton}
        class="button-primary"
        on:click={navegarACentro}
      >
        Seleccionar
      </button>
    </div>
  </div>

  <div class="logos">
    <div class="wrapper">
      <img
        src="/assets/img/svg/servicio-olimpia.svg"
        alt="Un servicio de Olimpia IT"
        class="olimpia"
      />
    </div>
  </div>

  <!-- Accesos rápidos a trámites -->
  <section class="accesos-rapidos wrapper">
    <h2>Trámites disponibles</h2>
    <div class="cards-grid">
      <a href="{paginasCliente.nombre}/{paginasCliente.acciones.primeraVez}" class="card">
        <h3>Primera vez</h3>
        <p>Obtén tu licencia de conducción por primera vez</p>
      </a>
      <a href="{paginasCliente.nombre}/{paginasCliente.acciones.renovar}" class="card">
        <h3>Renovar</h3>
        <p>Renueva tu licencia de conducción vigente</p>
      </a>
      <a href="{paginasCliente.nombre}/{paginasCliente.acciones.recategorizar}" class="card">
        <h3>Recategorizar</h3>
        <p>Amplía las categorías de tu licencia</p>
      </a>
      <a href="{procesosBanco.nombre}{procesosBanco.acciones.consulta}" class="card">
        <h3>Consultar estado</h3>
        <p>Conoce el estado de tu trámite</p>
      </a>
      <a href="{procesosSdc.nombre}/{procesosSdc.acciones.compraPin}" class="card">
        <h3>Comprar PIN (CRC)</h3>
        <p>Adquiere tu PIN para examen médico</p>
      </a>
      <a href="{procesosSdc.nombre}/{procesosSdc.acciones.compraConduccion}" class="card">
        <h3>Comprar PIN (CEA)</h3>
        <p>Adquiere tu PIN para curso de conducción</p>
      </a>
    </div>
  </section>
</main>

<style>
  .centros_main {
    padding: 2rem 1rem;
  }

  .busca-contenedor {
    max-width: 800px;
    margin: 0 auto 2rem;
  }

  .busca-flex {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    align-items: flex-start;
    position: relative;
  }

  .busca-flex-tipo {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    min-width: 160px;
  }

  .busca-flex-nombre {
    flex: 1;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    min-width: 200px;
  }

  .autocomplete-list {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #ccc;
    border-radius: 4px;
    list-style: none;
    padding: 0;
    margin: 0;
    z-index: 10;
    max-height: 200px;
    overflow-y: auto;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .autocomplete-list button {
    width: 100%;
    text-align: left;
    padding: 0.5rem 1rem;
    background: none;
    border: none;
    cursor: pointer;
  }

  .autocomplete-list button:hover {
    background-color: #e3f2fd;
  }

  .logos {
    text-align: center;
    margin: 2rem 0;
  }

  .olimpia {
    max-height: 60px;
  }

  .accesos-rapidos {
    margin-top: 3rem;
  }

  .cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1.5rem;
    margin-top: 1.5rem;
  }

  .card {
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 1.5rem;
    text-decoration: none;
    color: inherit;
    transition: box-shadow 0.2s;
  }

  .card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .card h3 {
    color: #1565c0;
    margin-top: 0;
  }

  .wrapper {
    max-width: 1200px;
    margin: 0 auto;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }
</style>
