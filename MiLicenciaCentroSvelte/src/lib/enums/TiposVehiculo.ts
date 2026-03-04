/**
 * Tipos de vehículo.
 * Migrado desde Angular: src/app/enums/TiposVehiculo.ts
 */
export enum TiposVehiculo {
  Carro = 1,
  Moto = 2
}

export const DescripcionVehiculo: { [id: number]: string } = {
  1: 'Automóvil',
  2: 'Moto'
};
