export enum TipoCliente {
    CRC = 3,
    CEA = 8
}

const DescripcionTipoCliente: { [id: number]: string } = {
    3: "Examen médico",
    8: "Curso de conducción"
};

const DescripcionTipoClienteCentro: { [id: number]: string } = {
    3: "CRC",
    8: "CEA"
};
export { DescripcionTipoCliente,DescripcionTipoClienteCentro };