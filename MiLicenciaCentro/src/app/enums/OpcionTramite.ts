export enum OpcionTramite {
  simple = 1,
  Combo
}

const DescripcionOpcionTramite: { [id: number]: string } = {
  1: "Un solo trámite",
  2: "Carro y moto"
};

export { DescripcionOpcionTramite };