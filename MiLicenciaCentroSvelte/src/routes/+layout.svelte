<script lang="ts">
  import '../app.css';
  import { page } from '$app/stores';
  import { afterNavigate } from '$app/navigation';
  import Loader from '$lib/components/Loader.svelte';
  import DialogoSimple from '$lib/components/DialogoSimple.svelte';
  import Alert from '$lib/components/Alert.svelte';

  export let data;
  $: user = data.user;

  let mobileMenuOpen = false;

  afterNavigate(() => {
    mobileMenuOpen = false;
  });

  const navLinks = [
    { href: '/', label: 'Inicio' },
    { href: '/sdc/busqueda-centros', label: 'Buscar Centro' },
    { href: '/consulta', label: 'Consultar' },
  ];
</script>

<svelte:head>
  <title>MiLicencia | Centro</title>
  <meta name="description" content="Plataforma de gestión de licencias de conducción en Colombia" />
</svelte:head>

<div data-theme="milicencia" class="min-h-screen flex flex-col">
  <!-- Navbar -->
  <nav class="navbar bg-primary text-primary-content shadow-lg sticky top-0 z-50">
    <div class="navbar-start">
      <button
        class="btn btn-ghost lg:hidden"
        aria-label="Abrir menú"
        on:click={() => (mobileMenuOpen = !mobileMenuOpen)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <a href="/" class="btn btn-ghost text-xl font-bold normal-case">
        MiLicencia
      </a>
    </div>

    <!-- Desktop nav -->
    <div class="navbar-center hidden lg:flex">
      <ul class="menu menu-horizontal px-1 gap-1">
        {#each navLinks as link}
          <li>
            <a
              href={link.href}
              class:active={$page.url.pathname === link.href}
              class="rounded-btn"
            >
              {link.label}
            </a>
          </li>
        {/each}
      </ul>
    </div>

    <div class="navbar-end">
      {#if user}
        <div class="dropdown dropdown-end">
          <button class="btn btn-ghost gap-2" tabindex="0">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
            </svg>
            <span class="hidden sm:inline">{user.nombre}</span>
          </button>
          <ul class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 text-base-content rounded-box w-52">
            <li class="menu-title"><span>{user.rol}</span></li>
            <li><a href="/perfil">Mi perfil</a></li>
            <li><form method="POST" action="/logout"><button type="submit">Cerrar sesión</button></form></li>
          </ul>
        </div>
      {:else}
        <a href="/login" class="btn btn-outline btn-sm text-primary-content border-primary-content hover:bg-primary-content hover:text-primary">
          Iniciar sesión
        </a>
      {/if}
    </div>
  </nav>

  <!-- Mobile menu drawer -->
  {#if mobileMenuOpen}
    <div class="lg:hidden bg-primary text-primary-content">
      <ul class="menu menu-vertical p-2">
        {#each navLinks as link}
          <li>
            <a href={link.href} class:active={$page.url.pathname === link.href}>
              {link.label}
            </a>
          </li>
        {/each}
      </ul>
    </div>
  {/if}

  <!-- Main content -->
  <main class="flex-1 bg-base-200">
    <slot />
  </main>

  <!-- Footer -->
  <footer class="footer footer-center p-6 bg-neutral text-neutral-content">
    <div>
      <img src="/assets/img/svg/servicio-olimpia.svg" alt="Un servicio de Olimpia IT" class="h-10 opacity-80" />
    </div>
    <div>
      <p class="text-sm opacity-70">© {new Date().getFullYear()} MiLicencia — Servicio de Olimpia IT</p>
    </div>
  </footer>
</div>

<Loader />
<DialogoSimple />
<Alert />
