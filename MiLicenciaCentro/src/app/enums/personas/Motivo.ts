export enum MotivoSolicitud{
    portal = 1,
    pines,
    crc
}

const DescripcionMotivoSolicitudPQR: { [id: number]: string } = {
    1: "Funcionamiento del portal web",
    2: "Compra y devolución de pin",
    3: "Dirigidas al CRC (Centro de reconocimiento de conductores)"
  };
  
  export { DescripcionMotivoSolicitudPQR };