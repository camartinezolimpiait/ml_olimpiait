/**
 * Métodos para el controlador de CompraPin.
 * Migrado desde Angular: src/app/enums/API/MetodosCompraPin.ts
 */
export enum MetodosCompraPin {
  ConsultarTodosCentroNegocio = 'ObtenerTodosCentros',
  ConsultarCentroPorCategoria = 'CentrosPorCategoria',
  ListarCategoriasPorIdCentro = 'ListarCategoriasPorIdCentro',
  ObtenerValorDelPinCEA = 'CostoPinCEA',
  ObtenerCentroParametrosIdCentro = 'CentroParametrosIdCentro',
  Categorias = 'Categorias',
  TiposIdentificacion = 'ObtenerTiposDeIdentificacion',
  ConsultarAgendaPorEstudiante = 'ConsultarAgendaPorEstudiante'
}
