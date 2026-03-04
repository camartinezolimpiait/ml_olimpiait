<!--
  Layout principal de la aplicación.
  Equivalente al AppComponent de Angular con el router-outlet.
  Incluye el Loader global, Navigation, Footer, Dialog y Alert.
-->
<script lang="ts">
  import Loader from '$lib/components/Loader.svelte';
  import Navigation from '$lib/components/Navigation.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import DialogoSimple from '$lib/components/DialogoSimple.svelte';
  import Alert from '$lib/components/Alert.svelte';
</script>

<svelte:head>
  <title>MiLicencia | Centro</title>
  <meta name="description" content="Plataforma de gestión de licencias de conducción en Colombia" />
</svelte:head>

<Navigation />

<main>
  <slot />
</main>

<Footer />
<Loader />
<DialogoSimple />
<Alert />

<style>
  main {
    min-height: calc(100vh - 64px - 200px);
  }
</style>
