/**
 * Pasos del flujo de compra de PIN.
 * Migrado desde Angular: src/app/enums/forms/PasosCompraPin.ts
 */
export enum PasosCompraPin {
  Inicio = 0,
  DatosBasicos = 1,
  CantidadTramites = 2,
  TipoTramiteComboCarro = 3,
  CategoriaComboCarro = 4,
  TipoTramiteComboMoto = 5,
  CategoriaComboMoto = 6,
  TipoTramiteSimple = 7,
  CategoriasSimple = 8,
  SeleccionCentro = 9,
  DatosPersonales = 10,
  MedioPago = 11,
  CuotasCeas = 12,
  ConfirmarCompra = 13
}
