<script lang="ts">
  import type { ActionData } from './$types';
  import FieldError from '$lib/components/FieldError.svelte';

  export let form: ActionData;
</script>

<svelte:head>
  <title>Consulta de Devolución | MiLicencia</title>
</svelte:head>

<div class="max-w-2xl mx-auto py-8 px-4">
  <div class="mb-6">
    <h1 class="text-3xl font-bold">Consulta de Devolución</h1>
    <p class="text-base-content/70 mt-1">Consulta el estado de tu solicitud de devolución</p>
  </div>

  {#if form?.error}
    <div class="alert alert-error mb-4" role="alert"><span>{form.error}</span></div>
  {/if}

  {#if form?.resultado}
    <div class="card bg-base-100 shadow-xl mb-6">
      <div class="card-body">
        <h2 class="card-title">Resultado</h2>
        <div class="overflow-x-auto">
          <table class="table table-zebra">
            <tbody>
              {#each Object.entries(form.resultado) as [key, value]}
                <tr>
                  <td class="font-semibold">{key}</td>
                  <td>{String(value)}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  {:else}
    <div class="card bg-base-100 shadow-md">
      <div class="card-body">
        <form method="POST" action="?/consultar">
          <div class="form-control mb-4">
            <label class="label" for="tipoDocumento">
              <span class="label-text font-semibold">Tipo de documento</span>
            </label>
            <select id="tipoDocumento" name="tipoDocumento" class="select select-bordered">
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
            />
            <FieldError mensaje={form?.errors?.numeroDocumento ?? ''} show={!!form?.errors?.numeroDocumento} />
          </div>
          <button type="submit" class="btn btn-primary w-full">Consultar</button>
        </form>
      </div>
    </div>
  {/if}
</div>
