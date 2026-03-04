/**
 * Rutas del frontend
 * Contiene las rutas fisicas
 * y los servicios
 */
 export const rutas = {
  rutasInternas: {
    Local: {
      apiMilicencia: 'https://localhost:7138',
      urlPortalAdminCentro: 'https://miportalcentro.milicencia.co',
      urlResumen: 'https://milicenciadescentro.olimpiait.com:6238/#'
    },
    Desarrollo: {
      apiMilicencia: 'https://milicenciadescentro.olimpiait.com:6238/BackEnd',
      urlPortalAdminCentro: 'https://miportalcentro.milicencia.co',
      urlResumen: 'https://milicenciadescentro.olimpiait.com:6238/#'
    },
    Calidad: {
      apiMilicencia: 'https://milicenciaprucentro.olimpiait.com:6226/BackEnd',
      urlPortalAdminCentro: 'https://miportalcentro.milicencia.co',
      urlResumen: 'https://milicenciaprucentro.olimpiait.com:6226/#'
    },
    Preproduccion: {
      apiMilicencia: 'https://milicenciaprecentro.sisec.co:7112/BackEnd',
      urlPortalAdminCentro: 'https://miportalcentropre.sisec.co',
      urlResumen: 'https://milicenciaprecentro.sisec.co:7112/#'
    },
    Produccion: {
      apiMilicencia: 'https://centro.milicencia.co/Backend',
      urlPortalAdminCentro: 'https://miportalcentro.milicencia.co',
      urlResumen: 'https://centro.milicencia.co/#'
    }
  },
    mlCliente: {
      tramites: {
        nombre: "/tramite",
        acciones: {
          primeraVez: "primera-vez",
          renovar: "renovar",
          recategorizar: "recategorizacion",
          faq: "faq",
        },
      },
      servicios: {
        nombre: "/sdc",
        acciones: {
          compraPin: "compra-de-pin/crc",
          compraPinc: "compra-de-pin",
          mapaCentros: "mapa-centros/CRC",
          busquedaCentros: "busqueda-centros",
          mapaCentrosCea: "mapa-centros/CEA",
          compraConduccion: "compra-de-pin/cea",
          compraConduccionc: "compra-de-pin",
        },
        negocio:{
          cea:"cea",
          crc:"crc"
        }
      },
      procesosBanco: {
        nombre: "/",
        acciones: {
          agenda: "agendamiento",
          devoluciones: "anulacion/CRC/1",
          devolucionesCEA: "anulacion/CEA/1",
          cambioDocumento: "cambio-beneficiario/CRC/2",
          cambioDocumentoCEA: "cambio-beneficiario/CEA/2",
          consulta: "consulta",
          consultaCEA: "consulta/cea",
          consultaCitas: "consulta/cita-cea",
          consultaDevolucionCRC: "consulta-devolucion/CRC",
          consultaDevolucionCEA: "consulta-devolucion/CEA",
        },
      },
    },
    mlAdmin: {
      nombre: "admin",
      acciones: {
        login: "login",
        consultaCitas: "consulta-citas",
        parametrosCentro: "parametros-centro",
      },
    },
    mlPerfil: {
      nombre: "perfil",
      acciones: {
        consultaCitas: "consulta-citas",
        parametrosCentro: "parametros-centro",
        tramite: "tramite",
      },
    },
    rutasExternas: {
      ConsultaRunt: "https://www.runt.com.co/ciudadano/consulta-documento",
      ActualizacionRunt:
        "https://www.runt.com.co/runt/apppub/ServiciosPagoPse/indexMP.html#/modificarPersona",
      OrganismosTransito:
        "https://www.runt.com.co/directorio-de-actores?title=&field_tipo_value=0&field_c_digo_municipio_value=All&field_c_digo_departamento_value_1=All",
      Simit: "https://consulta.simit.org.co/Simit/",
    },
    api: {
      crc: {
        ruta: "servicios/cotizador",
        metodos: {
          ObtenerDepartamentos: "departamentos",
          ObtenerMunicipios: "municipios",
          ObtenerCentros: "centros",
          ObtenerCategorias: "obtenerCategorias",
          ObtenerEstadoRecaudoPuntoPago: "obtenerEstadoRecaudoPuntoPago",
          ObtenerValorDelPin: "costo",
          ObtenerConveniosCentro: "convenio",
          EnviarCorreoElectronico: "enviarCorreo",
          ObtenerCalculadoColpatria: "obtenerCalculadoColpatria",
          GenerarReferenciaPinesOlimpia: "generarReferenciaBancolombia",
          GenerarReferenciaColpatria: "generarReferenciaColpatria",
          ObtenerParametrosColpatria: "parametrosColpatria",
          ObtenerParametrosPinesOlimpia: "parametrosPinesOlimpia",
          ConsultarPinesOlimpiaComprados: "consultarPinesCompradosPSE",
          ObtenerListaBancos: "obtenerListaBancos",
          SeleccionarCanalDestino: "seleccionarCanalDestino",
          ObtenerTiposDeIdentificacion: "obtenerTiposIdentificacion",
          NotificarReferenciaColpatria: "notificacionReferenciaColpatria",
          AccionesCambioBancolombia: "accionesBeneficiarioBancolombia",
          ConfirmarCambioDocumento: "confirmarCambioDocumento",
          ConfirmarDevolucion: "confirmarDevolucion",
          ConsultarPinesCEA: "consultaPinesCea",
          SeleccionarReferenciaTransaccionCuota: "seleccionarReferenciaTransaccionCuota",
          ObtenerPinesExistentes:"consultaExistePinesEstado",
          ConsultaEstadoProcesoCRC:"consultarEstadoProcesoCRC",
          ActualizarUserOTP:"actualizarUserOTP"
        },
      },
      adminCitas: {
        ruta: "servicios/AdminAgenda",
        metodos: {
          getCRCparams: "ObtenerCentroParametros",
          getSpecialScheduleByCenter: "ObtenerHorariosEspecialesCentro",
          getSchedulingByFilter: "ConsultarCitasPorFiltro",
          saveScheduleParameters: "GuardarParametrosAgenda",
          saveSpecialSchedule: "GuardarDiaHorarioEspecial",
        },
      },
      sdcAccount: {
        ruta: "servicios/MiLicenciaApi",
        metodos: {
          autenticar: "autenticar",
          obtenerInfoUsuario: "obtenerInfoUsuario",
          cerrarSesion: "cerrarSesion",
        },
      },
      adminCEA: {
        ruta: "servicios/Ensenanza",
        metodos: {
          actualizarValorRecaudo: "actualizarValorBaseCentroCategoria",
          listarCategoriasPorIdCentro: "listarCategoriasPorIdCentro",
          consultarAgendaPorEstudiante: "consultarAgendaPorEstudiante",
        },
      },
      mlApi: {
        ruta: "servicios/MiLicenciaApi",
        metodos: {
          categorias: "categorias",
          departamentos: "departamentos",
          municipios: "municipios",
          sexo: "sexo",
          tiposIdentificacion: 'tiposIdentificacion',
          tramites: 'tramites',
          estadoProceso: 'consultaEstadoProceso',
          consultarCursosPEI:'consultarCursosPei',
          consultarClasesPracticasPorCurso:'consultarClasesPracticasPorCurso',
          crearClaseTeorica: 'crearClaseTeorica',
          consultarClasesTeoricas: "consultarClasesTeoricas",
          cancelarClaseTeorica: "cancelarClaseTeorica",
          seleccionarAcuerdoPago: 'seleccionarAcuerdoPago',
          seleccionarModulosPEI: 'seleccionarModulosPEI',
          consultaProgresoCursoConduccion: "consultaProgresoCursoConduccion",
          ObtenerConveniosCentro :'convenioCea',
        },
      },
      recaudo: {
        ruta: "servicios/Recaudo",
        metodos: {
          GenerarReferenciaPinesOlimpia: "generarReferenciaBancolombia",
          AccionesCambioBancolombia: "accionesBeneficiarioBancolombia",
          ConfirmarCambioDocumento: "confirmarCambioDocumento",
          ConfirmarDevolucion: "confirmarDevolucion",
          ConsultarPinesOlimpiaComprados: "consultarPinesCompradosPSE",
          ObtenerListaBancos: "obtenerListaBancos",
          ConsultarPinesCEA: "consultaPinesCea"
        },
      },
      compraPin: {
        ruta: "servicios/CompraPin",
        metodos: {
          ConsultarCentroPorCategoria: "centrosPorCategoria",
          ConsultarCentroPorMunicipio: "centrosPorMunicipio",
          ConsultarCentroPorIdNegocio: "obtenerCentroPorTipo",
          ConsultarTodosCentroNegocio: "obtenerTodosCentros",
          ObtenerConveniosCentro: "convenios",
          ObtenerValorDelPinCRC: "costoPinCRC",
          ObtenerValorDelPinCEA: "costoPinCEA",
          EnviarCorreoCotizacion: "enviarCorreo",
          ObtenerCentroParametrosIdCentro:"centroParametrosIdCentro"
        },
      },
    },
  };
