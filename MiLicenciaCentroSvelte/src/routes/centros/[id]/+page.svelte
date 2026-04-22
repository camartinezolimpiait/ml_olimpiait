<script lang="ts">
  import type { PageData } from './$types';
  import { TipoCliente } from '$lib/enums/PinesOlimpia/TipoCliente';

  export let data: PageData;

  $: centro = data.centro;
  $: tipoServicio = (centro as (typeof centro & { tipo?: number }))?.tipo ?? TipoCliente.CRC;
  $: esCEA = tipoServicio === TipoCliente.CEA;

  const tipoLabel = esCEA
    ? 'Centro de Enseñanza Automovilística'
    : 'Centro de Reconocimiento de Conductores';
</script>

<svelte:head>
  <title>{centro?.nombre ?? 'Centro'} | MiLicencia</title>
</svelte:head>

{#if centro}
  <!-- Header del centro -->
  <div class="bg-primary text-primary-content py-6 px-4">
    <div class="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-start gap-2">
      <div>
        <h1 class="text-2xl font-bold capitalize">{centro.nombre.toLowerCase()}</h1>
        {#if centro.direccion}
          <p class="opacity-80 text-sm capitalize">{centro.direccion.toLowerCase()}</p>
        {/if}
      </div>
      <div class="text-right">
        <span class="badge badge-outline badge-lg text-primary-content border-primary-content">
          {tipoLabel}
        </span>
        <br />
        <a href="/centros" class="link link-hover text-sm mt-1 inline-block opacity-80">
          Cambiar centro
        </a>
      </div>
    </div>
  </div>

  <!-- Content -->
  <div class="max-w-5xl mx-auto py-8 px-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Comunicados (col A-B) -->
    <div class="lg:col-span-2">
      <h2 class="text-xl font-bold mb-4">Comunicados</h2>
      <div class="alert alert-info">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="h-6 w-6 shrink-0 stroke-current">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span>No hay comunicados disponibles en este momento.</span>
      </div>
    </div>

    <!-- Sidebar de opciones (col C) -->
    <div>
      <div class="card bg-base-100 shadow-md border border-base-300">
        <div class="card-body p-4">
          <!-- Pagos -->
          <h3 class="font-bold text-base mb-2">Pagos</h3>
          <ul class="menu menu-compact p-0 gap-1">
            <li>
              <a
                href="/sdc/compra-de-pin/{esCEA ? 'CEA' : 'CRC'}"
                class="btn btn-primary btn-sm w-full justify-start"
              >
                Comprar PIN
              </a>
            </li>
            {#if esCEA}
              <li>
                <a href="/consulta/cea" class="btn btn-outline btn-sm w-full justify-start">
                  Pagar cuotas
                </a>
              </li>
            {/if}
          </ul>

          <div class="divider my-2"></div>

          <!-- Otros servicios -->
          <h3 class="font-bold text-base mb-2">Otros servicios</h3>
          <ul class="space-y-1">
            <li>
              <a
                href="/anulacion/{esCEA ? 'CEA' : 'CRC'}/1"
                class="link link-primary text-sm block py-1"
              >
                Devolución de dinero
              </a>
            </li>
            <li>
              <a
                href="/cambio-beneficiario/{esCEA ? 'CEA' : 'CRC'}/2"
                class="link link-primary text-sm block py-1"
              >
                Corrección de documento
              </a>
            </li>
            <li>
              <a href="/consulta" class="link link-primary text-sm block py-1">
                Consulta de estado del PIN
              </a>
            </li>
            <li>
              <a
                href="/consulta-devolucion/{esCEA ? 'CEA' : 'CRC'}"
                class="link link-primary text-sm block py-1"
              >
                Consulta estado devolución
              </a>
            </li>
          </ul>

          <div class="divider my-2"></div>

          <!-- Portales SISEC -->
          <h3 class="font-bold text-base mb-2">Portales SISEC</h3>
          <ul class="space-y-1">
            <li>
              <a
                href="https://admin.sisec.com.co"
                target="_blank"
                rel="noopener noreferrer"
                class="link link-primary text-sm block py-1"
              >
                Portal Administrativo SISEC ↗
              </a>
            </li>
            <li>
              <a
                href="https://pines.olimpiait.com"
                target="_blank"
                rel="noopener noreferrer"
                class="link link-primary text-sm block py-1"
              >
                Portal Pines Olimpia ↗
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Canales de atención -->
      <div class="card bg-base-100 shadow-sm border border-base-300 mt-4">
        <div class="card-body p-4">
          <h3 class="font-bold text-base mb-2">Canales de atención</h3>
          <ul class="space-y-2 text-sm">
            <li>
              <a
                href="https://wa.me/573112074439"
                target="_blank"
                rel="noopener noreferrer"
                class="link link-success flex items-center gap-2"
              >
                <span>💬</span> WhatsApp (311) 207-4439
              </a>
            </li>
            {#if !esCEA}
              <li>
                <a href="mailto:soporte@olimpiait.com" class="link link-primary flex items-center gap-2">
                  <span>✉️</span> Soporte SISEC CRC y Armas
                </a>
              </li>
            {/if}
            {#if esCEA}
              <li>
                <a href="mailto:sisec.cea@olimpiait.com" class="link link-primary flex items-center gap-2">
                  <span>✉️</span> Soporte SISEC CEA
                </a>
              </li>
            {/if}
            <li>
              <a href="mailto:servicioalclientesisec@olimpiait.com" class="link link-primary flex items-center gap-2">
                <span>✉️</span> Servicio al cliente SISEC
              </a>
            </li>
            <li>
              <a href="tel:+576017441000" class="link link-primary flex items-center gap-2">
                <span>📞</span> Línea única (601) 744-1000
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
{:else}
  <div class="max-w-2xl mx-auto py-16 px-4 text-center">
    <div class="alert alert-warning mb-6">
      <span>No se encontró información para este centro.</span>
    </div>
    <a href="/centros" class="btn btn-primary">Seleccionar otro centro</a>
  </div>
{/if}
