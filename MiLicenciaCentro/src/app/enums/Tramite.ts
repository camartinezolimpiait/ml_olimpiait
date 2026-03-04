import { SeleccionTramite } from "../interfaces/compraPin/SeleccionTramite";

export enum Tramite {
  SinDefinir = 0,
  PrimeraVez = 1,
  Renovar = 2,
  Recategorizar = 3,
  PrimeraVezInstructor = 4,
  RecategorizarInstructor = 5,
}

const DescripcionTramite: { [tramite in Tramite]: string } = {
  [Tramite.SinDefinir]: "Trámite no definido",
  [Tramite.PrimeraVez]: "Primera vez o licencia adicional",
  [Tramite.Renovar]: "Renovar licencia",
  [Tramite.Recategorizar]: "Recategorizar licencia",
  [Tramite.PrimeraVezInstructor]: "Nueva licencia de instructor",
  [Tramite.RecategorizarInstructor]: "Recategorizar licencia de instructor",
  };

  const ListaSeleccionTramite: SeleccionTramite[] = Object.keys(Tramite).map(key => {
    const tramiteValue = parseInt(key) as Tramite;
    if(!Number.isNaN(tramiteValue)){
      const descripcion = DescripcionTramite[tramiteValue] || ""; // Si no hay descripción, se asigna una cadena vacía
      return {
        id: tramiteValue,
        nombre: descripcion,
        instructor: descripcion.includes("instructor"),
        selected: false
      };
    } else {
      return null;
    }
  }).filter(x => x !== null) as SeleccionTramite[];

export { DescripcionTramite, ListaSeleccionTramite};
