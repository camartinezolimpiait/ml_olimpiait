export enum TiposVehiculo {
  Carro = 1,
  Moto
}

const DescripcionVehiculo: { [id: number]: string } = {
  1: "Automóvil",
  2: "Moto"
};

export { DescripcionVehiculo };