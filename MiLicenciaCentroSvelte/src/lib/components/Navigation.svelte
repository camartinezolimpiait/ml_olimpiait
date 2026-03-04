<!--
  Componente de navegación principal.
  Migrado desde Angular: src/app/components/common/navigation/navigation.component
  
  En Angular se usaba MatSidenav y BreakpointObserver. 
  Aquí se implementa con estado reactivo de Svelte.
-->
<script lang="ts">
  import { rutas } from '$lib/const/rutas';

  const paginasCliente = rutas.mlCliente.tramites;
  const procesosBanco = rutas.mlCliente.procesosBanco;
  const procesosSdc = rutas.mlCliente.servicios;

  let sidenavOpen = false;
  let subMenuVisible = false;

  function toggleSidenav(): void {
    sidenavOpen = !sidenavOpen;
  }

  function closeSidenav(): void {
    sidenavOpen = false;
  }

  function toggleSubMenu(): void {
    subMenuVisible = !subMenuVisible;
  }
</script>

<nav class="navigation">
  <div class="nav-wrapper">
    <a href="/" class="logo-link">
      <img src="/assets/img/svg/logo-milicencia.svg" alt="MiLicencia" class="logo" />
    </a>

    <!-- Menú de escritorio -->
    <ul class="nav-links desktop-only">
      <li>
        <button type="button" class="nav-btn" on:click={toggleSubMenu}>
          Servicios en línea
        </button>
        {#if subMenuVisible}
          <ul class="submenu">
            <li>
              <a href="{paginasCliente.nombre}/{paginasCliente.acciones.primeraVez}">
                Primera vez
              </a>
            </li>
            <li>
              <a href="{paginasCliente.nombre}/{paginasCliente.acciones.renovar}">
                Renovar licencia
              </a>
            </li>
            <li>
              <a href="{paginasCliente.nombre}/{paginasCliente.acciones.recategorizar}">
                Recategorizar
              </a>
            </li>
            <li>
              <a href="{procesosBanco.nombre}{procesosBanco.acciones.consulta}">
                Consultar estado
              </a>
            </li>
            <li>
              <a href="{procesosSdc.nombre}/{procesosSdc.acciones.compraPin}">
                Comprar PIN (CRC)
              </a>
            </li>
            <li>
              <a href="{procesosSdc.nombre}/{procesosSdc.acciones.compraConduccion}">
                Comprar PIN (CEA)
              </a>
            </li>
          </ul>
        {/if}
      </li>
    </ul>

    <!-- Botón hamburguesa -->
    <button
      type="button"
      class="hamburger mobile-only"
      on:click={toggleSidenav}
      aria-label="Abrir menú"
    >
      &#9776;
    </button>
  </div>

  <!-- Sidenav móvil -->
  {#if sidenavOpen}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="sidenav-backdrop" on:click={closeSidenav}></div>
    <aside class="sidenav">
      <button type="button" class="close-btn" on:click={closeSidenav}>✕</button>
      <ul>
        <li>
          <a href="{paginasCliente.nombre}/{paginasCliente.acciones.primeraVez}" on:click={closeSidenav}>
            Primera vez
          </a>
        </li>
        <li>
          <a href="{paginasCliente.nombre}/{paginasCliente.acciones.renovar}" on:click={closeSidenav}>
            Renovar licencia
          </a>
        </li>
        <li>
          <a href="{paginasCliente.nombre}/{paginasCliente.acciones.recategorizar}" on:click={closeSidenav}>
            Recategorizar
          </a>
        </li>
        <li>
          <a href="{procesosBanco.nombre}{procesosBanco.acciones.consulta}" on:click={closeSidenav}>
            Consultar estado
          </a>
        </li>
      </ul>
    </aside>
  {/if}
</nav>

<style>
  .navigation {
    background-color: #1565c0;
    color: white;
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .nav-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
    display: flex;
    align-items: center;
    height: 64px;
  }

  .logo {
    height: 40px;
  }

  .nav-links {
    display: flex;
    list-style: none;
    margin: 0 0 0 2rem;
    padding: 0;
    gap: 1rem;
    position: relative;
  }

  .nav-btn {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    font-size: 1rem;
    padding: 0.5rem 1rem;
  }

  .submenu {
    position: absolute;
    top: 100%;
    left: 0;
    background: white;
    border-radius: 4px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    list-style: none;
    padding: 0.5rem 0;
    min-width: 200px;
    z-index: 200;
  }

  .submenu a {
    display: block;
    padding: 0.5rem 1rem;
    color: #1565c0;
    text-decoration: none;
  }

  .submenu a:hover {
    background-color: #e3f2fd;
  }

  .hamburger {
    background: none;
    border: none;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
    margin-left: auto;
  }

  .sidenav-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 200;
  }

  .sidenav {
    position: fixed;
    top: 0;
    left: 0;
    width: 280px;
    height: 100vh;
    background: white;
    z-index: 300;
    padding: 1rem;
    overflow-y: auto;
  }

  .sidenav ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .sidenav a {
    display: block;
    padding: 0.75rem 1rem;
    color: #1565c0;
    text-decoration: none;
    border-bottom: 1px solid #e0e0e0;
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 1.25rem;
    cursor: pointer;
    float: right;
    color: #333;
  }

  .desktop-only {
    display: none;
  }

  .mobile-only {
    display: block;
  }

  @media (min-width: 975px) {
    .desktop-only {
      display: flex;
    }

    .mobile-only {
      display: none;
    }
  }
</style>
