<script lang="ts">
  import type { ActionData } from './$types';
  import FieldError from '$lib/components/FieldError.svelte';

  export let form: ActionData;

  let numeroDocumento = '';
  let tipoDocumento = '1';
</script>

<svelte:head>
  <title>Consulta de PIN | MiLicencia</title>
</svelte:head>

<div class="max-w-2xl mx-auto py-8 px-4">
  <div class="mb-6">
    <h1 class="text-3xl font-bold">Consulta de PIN</h1>
    <p class="text-base-content/70 mt-1">Consulta el estado de tu PIN de licencia de conducción</p>
  </div>

  {#if form?.error}
    <div class="alert alert-error mb-4" role="alert">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{form.error}</span>
    </div>
  {/if}

  {#if form?.resultado}
    <div class="card bg-base-100 shadow-xl mb-6">
      <div class="card-body">
        <h2 class="card-title">Resultado de la consulta</h2>
        <div class="overflow-x-auto">
          <table class="table table-zebra">
            <tbody>
              {#each Object.entries(form.resultado) as [key, value]}
                <tr>
                  <td class="font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</td>
                  <td>{String(value)}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  {/if}

  <div class="card bg-base-100 shadow-md">
    <div class="card-body">
      <h2 class="card-title mb-4">Ingresa tus datos</h2>
      <form method="POST" action="?/consultar">
        <div class="form-control mb-4">
          <label class="label" for="tipoDocumento">
            <span class="label-text font-semibold">Tipo de documento</span>
          </label>
          <select
            id="tipoDocumento"
            name="tipoDocumento"
            class="select select-bordered"
            bind:value={tipoDocumento}
          >
            <option value="1">Cédula de ciudadanía</option>
            <option value="2">Cédula de extranjería</option>
            <option value="3">Pasaporte</option>
          </select>
        </div>

        <div class="form-control mb-6">
          <label class="label" for="numeroDocumento">
            <span class="label-text font-semibold">Número de documento</span>
          </label>
          <input
            id="numeroDocumento"
            name="numeroDocumento"
            type="text"
            class="input input-bordered"
            class:input-error={form?.errors?.numeroDocumento}
            placeholder="Ingresa tu número de documento"
            bind:value={numeroDocumento}
            required
          />
          <FieldError mensaje={form?.errors?.numeroDocumento ?? ''} show={!!form?.errors?.numeroDocumento} />
        </div>

        <button type="submit" class="btn btn-primary w-full">
          Consultar
        </button>
      </form>
    </div>
  </div>
</div>
