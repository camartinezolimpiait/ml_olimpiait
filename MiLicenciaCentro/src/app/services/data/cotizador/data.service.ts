import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject, BehaviorSubject } from "rxjs";
import { MetodosCotizador } from "src/app/enums/API/MetodosCotizador";
import { Rutas } from "src/app/enums/API/Rutas";
import { AgenteDispersion } from "src/app/interfaces/comun/AgenteDispersion";
import { AgenteDispersionRequest } from "src/app/interfaces/comun/AgenteDispersionRequest";
import { Categoria } from "src/app/interfaces/cotizacion/Categoria";
import { Centro } from "src/app/interfaces/cotizacion/Centro";
import { ConsultaConvenioCentro } from "src/app/interfaces/cotizacion/ConsultaConveniosCentro";
import { Convenio } from "src/app/interfaces/cotizacion/Convenio";
import { DiscriminadoValorPin } from "src/app/interfaces/cotizacion/DiscriminadoValorPin";
import { ParametrosCostoPin } from "src/app/interfaces/cotizacion/ParametrosCostoPin";
import { TipoIdentificacion } from "src/app/interfaces/cotizacion/TipoIdentificacion";
import { ParametrosMensaje } from "src/app/interfaces/notificacion/ParametrosMensaje";
import { ConsultaIpResponse } from "src/app/interfaces/Otros/ConsultaIpResponse";
import { LogMLFront } from "src/app/interfaces/Otros/LogMLFront";
import { UrlResponse } from "src/app/interfaces/Otros/UrlResponse";
import { ParametrosBancolombia } from "src/app/interfaces/pago/ParametrosBancolombia";
import { BancosPinesOlimpia } from "src/app/interfaces/pago/PinesOlimpia/BancosPinesOlimpia";
import { CentroActualIp } from "src/app/interfaces/pago/PinesOlimpia/CentroActualIp";
import { Comercio } from "src/app/interfaces/pago/PinesOlimpia/Consulta/Comercio";
import { ConsultaComercios } from "src/app/interfaces/pago/PinesOlimpia/Consulta/ConsultaComercios";
import { CorreoCuota } from "src/app/interfaces/pago/PinesOlimpia/Consulta/CorreoCuota";
import { PinCea } from "src/app/interfaces/pago/PinesOlimpia/Consulta/PinCea";
import { PinCeaConsulta } from "src/app/interfaces/pago/PinesOlimpia/Consulta/PinCeaConsulta";
import { AnulacionCompra } from "src/app/interfaces/pago/PinesOlimpia/Devoluciones/AnulacionCompra";
import { CambioDocumento } from "src/app/interfaces/pago/PinesOlimpia/Devoluciones/CambioDocumento";
import { EnvioOtpAccionBancolombia } from "src/app/interfaces/pago/PinesOlimpia/EnvioOtpAccionBancolombia";
import { ReferenciaGenerada } from "src/app/interfaces/pago/PinesOlimpia/ReferenciaGenerada";
import { ReferenciaPagoBancolombia } from "src/app/interfaces/pago/PinesOlimpia/ReferenciaPagoBancolombia";
import { PinesConsulta } from "src/app/interfaces/pago/PinesOlimpia/Respuesta/PinesConsulta";
import { RespuestaAcciones } from "src/app/interfaces/pago/PinesOlimpia/RespuestaAccionBeneficiario";
import { RespuestaConfirmacion } from "src/app/interfaces/pago/PinesOlimpia/RespuestaConfirmacion";
import { SeleccionarReferenciaTransaccionCuotaRequest } from "src/app/interfaces/pago/PinesOlimpia/SeleccionarReferenciaTransaccionCuotaRequest";
import { PilotoCea } from "src/app/interfaces/pago/SecurePay/PilotoCea";
import { ConsultaDevolucionRequest } from "src/app/interfaces/consulta-devolucion/ConsultaDevolucionRequest";
import { ConsultaDevolucionRespuesta } from "src/app/interfaces/consulta-devolucion/ConsultaDevolucionRespuesta";
import { environment } from "src/environments/environment";
import { getApiMilicencia } from 'src/app/services/util/api-milicencia.util';
import { ConvenioOrigenVista } from "src/app/interfaces/compraPin/ConvenioOrigenVista";
import { datosResumen } from "src/app/interfaces/resumen/datosResumen";
import { ActualizacionInformacionDevolucion } from "src/app/interfaces/consulta-devolucion/ActualizacionInformacionDevolucion";
import { RespuestaDevolucion } from "src/app/interfaces/consulta-devolucion/RespuestaDevolucion";
import { TipoDocumentoPtesaDTO } from "src/app/interfaces/cotizacion/TipoDocumentoPtesaDTO";
import { InfoPinSimple } from "src/app/interfaces/devoluciones/InfoPinSimple";
import { ActualizarContacto } from "src/app/interfaces/devoluciones/ActualizarContacto";
import { ActualizarDevolucionTransferencia } from "src/app/interfaces/devoluciones/ActualizarDevolucionTransferencia";
import { FileToUpload } from "src/app/interfaces/devoluciones/FileToUpload";
import { MotivoDevolucionDto } from "src/app/interfaces/devoluciones/MotivoDevolucionDto";
import { ResponseDtoOfPtsaDatosContactoDtoYPlxipCl } from "src/app/interfaces/devoluciones/ResponseDtoOfPtsaDatosContactoDtoYPlxipCl";
import { ConsultaCentoId } from "src/app/interfaces/centro/ConsultaCentoId";
import { validacionOtp } from "src/app/interfaces/cambio-tipo-devolucion/validacionOtp";
import { Destinatario } from "src/app/interfaces/cambio-tipo-devolucion/destinatario";
import { CambiotipoDevolucion } from "src/app/interfaces/cambio-tipo-devolucion/cambio-tipo-devolucion";
import { TokenAceptacion } from "src/app/interfaces/compraPin/TokenAceptacion";
import { ReferenciaBancolombiaWompi } from "src/app/interfaces/pago/Wompi/ReferenciaBancolombiaWompi";
import { ResponseReferenciaWompi } from "src/app/interfaces/pago/Wompi/ResponseReferenciaWompi";
import { RespuestaRecaptcha } from "src/app/interfaces/Otros/RespuestaRecaptcha";
import { ResponseCotizador } from "src/app/interfaces/Otros/ResponseCotizador";
import { UsuarioCotizador } from "src/app/interfaces/Otros/UsuarioCotizador";
import { EntidadMensaje } from "src/app/interfaces/Otros/EntidadMensaje";
import { AutorizacionDaviplata } from "src/app/interfaces/pago/PinesOlimpia/AutorizacionDaviplata";
import { RespuestaConfirmacionDaviplata } from "src/app/interfaces/pago/Daviplata/RespuestaConfirmacionDaviplata";
import { RequestNotificationSuccess } from "src/app/interfaces/compraPin/RequestNotificationSuccess";
import { PermiteFacturaElectronicaRequest } from "src/app/interfaces/pago/FacturacionElectronica/PermiteFacturaElectronicaRequest";
import { PermiteFacturaElectronicaResponse } from "src/app/interfaces/pago/FacturacionElectronica/PermiteFacturaElectronicaResponse";
import { TipoPersonaResponse } from "src/app/interfaces/pago/FacturacionElectronica/TipoPersonaResponse";
import { TipoDocumentoResponse } from "src/app/interfaces/pago/FacturacionElectronica/TipoDocumentoResponse";
import { ConsultaEstadoDevolucion } from "src/app/interfaces/devoluciones/ConsultaEstadoDevolucion";
@Injectable({
    providedIn: "root"
})
export class DataService {
    urlServices: string = getApiMilicencia() + Rutas.ServiciosCotizador;
    urlApiMilincencia: string = getApiMilicencia();
    idCategoriaSeleccionadaMapa$!: string;
    private readonly CategoriaSeleccionadaMapaSubject = new Subject<string>();
    categoriaSeleccionadaMapa = this.CategoriaSeleccionadaMapaSubject.asObservable();
    private enableConfirmFESubject = new BehaviorSubject<boolean>(false);
    enableConfirmFE$ = this.enableConfirmFESubject.asObservable();

    constructor(private readonly http: HttpClient) { }

    asignarCategoriaSeleccionadaMapa(idCategoria:string)
    {
        this.idCategoriaSeleccionadaMapa$=idCategoria;
        this.CategoriaSeleccionadaMapaSubject.next(idCategoria);
        this.CategoriaSeleccionadaMapaSubject.complete();
    }

    obtenerParametrosPortalPines(): Observable<UrlResponse> {
    return this.http.get<UrlResponse>(this.urlApiMilincencia + "/servicios/global/ObtenerParametrosPortalPines");
    }

    obtenerParametrosPilotoCEA(): Observable<PilotoCea> {
    return this.http.get<PilotoCea>(this.urlApiMilincencia + "/servicios/global/obtenerParametrosPilotoCEA");
    }

     /**
    * Calcula la edad del aspirante (de acuerdo al servidor).
    * Formato: "MM-DD-YYYY"
    */
      calcularEdadAspirante(fechaNacimiento: string): Observable<number> {
    return this.http.get<number>(this.urlApiMilincencia + "/servicios/global/ObtenerEdad/" + fechaNacimiento);
    }

    seleccionarComerciosPorTipo(consulta: ConsultaComercios): Observable<Comercio[]>{
        return this.http.post<Comercio[]>(this.urlServices + MetodosCotizador.SeleccionarComerciosPorTipo, consulta);
    }

    /**
    * Otener nueva viegancia en fecha currentIp.
    */
    NuevaVigenciaIp(): Observable<ConsultaIpResponse> {
        return this.http.get<ConsultaIpResponse>(this.urlServices + MetodosCotizador.NuevaVigenciaIp);
    }

    /**
    * Registar log.
    */
    log(data: LogMLFront):Observable<number>{
        return this.http.post<number>(this.urlServices + MetodosCotizador.Log, data);
    }

    enviarCorreo(parametrosMensaje: ParametrosMensaje): Observable<number> {
        return this.http.post<number>(this.urlServices + MetodosCotizador.EnviarCorreo, parametrosMensaje);
    }

    enviarCorreoCuota(correoCuota: CorreoCuota): Observable<number> {
        return this.http.post<number>(this.urlServices + MetodosCotizador.EnviarCorreoCuota, correoCuota);
    }

    obtenerTiposIdentificacion(): Observable<TipoIdentificacion[]> {
        return this.http.get<TipoIdentificacion[]>(this.urlServices + MetodosCotizador.ObtenerTiposDeIdentificacion);
    }

    obtenerParametrosPinesOlimpia(): Observable<ParametrosBancolombia> {
        return this.http.get<ParametrosBancolombia>(this.urlServices + MetodosCotizador.ObtenerParametrosPinesOlimpia);
    }

    obtenerPrecioPIN(parametrosCosto: ParametrosCostoPin): Observable<DiscriminadoValorPin> {
        return this.http.post<DiscriminadoValorPin>(this.urlServices + MetodosCotizador.ObtenerValorDelPin, parametrosCosto);
    }

    obtenerConveniosCentro(consultaConvenioCentro: ConsultaConvenioCentro): Observable<Convenio[]> {
        return this.http.post<Convenio[]>(this.urlServices + MetodosCotizador.ObtenerConveniosCentro, consultaConvenioCentro);
    }

    obtenerConveniosCentroCEA(consultaCentoId: ConsultaCentoId) {
    return this.http.post<Convenio[]>(this.urlApiMilincencia + Rutas.ServicioCentro + MetodosCotizador.ObtenerConveniosCentroCEA, consultaCentoId);
    }

    consultaCentroActual(centroActualIp: CentroActualIp):Observable<Centro[]> {
        return this.http.post<Centro[]>(this.urlServices + MetodosCotizador.ConsultaCentroActual, centroActualIp);
    }

    obtenerReferenciaPinesOlimpia(jsonData: ReferenciaPagoBancolombia,tokenCaptcha :string =''):Observable<ReferenciaGenerada> {
        let headers = new HttpHeaders({'Captcha': tokenCaptcha});
        return this.http.post<ReferenciaGenerada>(this.urlServices + MetodosCotizador.GenerarReferenciaPinesOlimpia, jsonData,{headers});
    }

    obtenerPlantillas(): Observable<any[]> {
        return this.http.get<any[]>(this.urlServices + MetodosCotizador.ObtenerPlantillas);
    }

    seleccionarReferenciaTransaccionCuota(pinConsulta: SeleccionarReferenciaTransaccionCuotaRequest):Observable<ReferenciaGenerada> {
        return this.http.post<ReferenciaGenerada>(this.urlServices + MetodosCotizador.SeleccionarReferenciaTransaccionCuota, pinConsulta);
    }

    obtenerCategorias(): Observable<Categoria[]> {
        return this.http.get<Categoria[]>(this.urlServices + MetodosCotizador.ObtenerCategorias);
    }

    obtenerTodosCentros():Observable<Centro[]> {
        return this.http.get<Centro[]>(this.urlServices + MetodosCotizador.ObtenerCentros);
    }

    consultarPinesCompradosPSE(jsonData: object, tokenCaptcha: string = ''): Observable<RespuestaRecaptcha<PinesConsulta>>{
        let headers = new HttpHeaders({'Captcha': tokenCaptcha});
        return this.http.post<RespuestaRecaptcha<PinesConsulta>>(this.urlServices + MetodosCotizador.ConsultarPinesOlimpiaComprados, jsonData, {headers});
    }

    confirmarConsultaSecurePay(jsonData: object): Observable<RespuestaConfirmacion | object> {
        return this.http.post<RespuestaConfirmacion | object>(this.urlServices + MetodosCotizador.ConfirmarConsultaSecurePay, jsonData);
    }

    consultarPinesCea(pinCea: PinCeaConsulta,tokenCaptcha: string = ''): Observable<PinCea[]> {
        let headers = new HttpHeaders({'Captcha': tokenCaptcha});
        return this.http.post<PinCea[]>(this.urlServices + MetodosCotizador.ConsultarPinesCEA, pinCea, {headers});
    }

    obtenerListaBancos(): Observable<BancosPinesOlimpia[]> {
        return this.http.get<BancosPinesOlimpia[]>(this.urlServices + MetodosCotizador.ObtenerListaBancos);
    }

    accionesBeneficiarioBancolombia(jsonData: EnvioOtpAccionBancolombia, tokenCaptcha: string = ''): Observable<any> {
        let headers = new HttpHeaders({'Captcha': tokenCaptcha});
        return this.http.post<any>(this.urlServices + MetodosCotizador.AccionesCambioBancolombia, jsonData, {headers});
    }

    ConsultaEstadoDevolucion(jsonData: ConsultaEstadoDevolucion, tokenCaptcha: string = ''): Observable<any> {
        let headers = new HttpHeaders({'Captcha': tokenCaptcha});
        return this.http.post<any>(this.urlServices + MetodosCotizador.ConsultaEstadoDevolucion, jsonData, {headers});
    }

    ConsultaEstadoCambioBeneficiario(jsonData: EnvioOtpAccionBancolombia, tokenCaptcha: string = ''): Observable<any> {
        let headers = new HttpHeaders({'Captcha': tokenCaptcha});
        return this.http.post<any>(this.urlServices + MetodosCotizador.ConsultaEstadoCambioBeneficiario, jsonData, {headers});
    }
    ConsultaEstadoAgendamiento(jsonData: EnvioOtpAccionBancolombia, tokenCaptcha: string = ''): Observable<any> {
        let headers = new HttpHeaders({'Captcha': tokenCaptcha});
        return this.http.post<any>(this.urlServices + MetodosCotizador.ConsultaEstadoAgendamiento, jsonData, {headers});
    }

    confirmarDevolucion(jsonData: AnulacionCompra): Observable<RespuestaAcciones> {
        return this.http.post<RespuestaAcciones>(this.urlServices + MetodosCotizador.ConfirmarDevolucion, jsonData);
    }

    validacionOtp(jsonData: validacionOtp): Observable<RespuestaAcciones> {
        return this.http.post<RespuestaAcciones>(this.urlServices + MetodosCotizador.ValidacionOtp, jsonData);
    }

    getAgenteDispersionByPin(jsonData: AgenteDispersionRequest): Observable<AgenteDispersion> {
        return this.http.post<AgenteDispersion>(this.urlServices + MetodosCotizador.GetAgenteDispersionByPin, jsonData);
    }

    confirmarCambioDocumento(jsonData: CambioDocumento): Observable<RespuestaAcciones> {
        return this.http.post<RespuestaAcciones>(this.urlServices + MetodosCotizador.ConfirmarCambioDocumento, jsonData);
    }

    devolucionByDocumento(data: ConsultaDevolucionRequest, tokenCaptcha: string = ''): Observable<ConsultaDevolucionRespuesta> {
        let headers = new HttpHeaders({'Captcha': tokenCaptcha});
        return this.http.post<ConsultaDevolucionRespuesta>(this.urlServices + MetodosCotizador.DevolucionByDocumento, data, {headers});
    }

    prevalidarActualizacionDevolucion(data: ActualizacionInformacionDevolucion): Observable<RespuestaDevolucion> {
        return this.http.post<RespuestaDevolucion>(this.urlServices + MetodosCotizador.PrevalidarActualizacionDevolucion, data);
    }

    envioOtp(data: Destinatario,tokenCaptcha: string = '' ): Observable<RespuestaDevolucion> {
        let headers = new HttpHeaders({'Captcha': tokenCaptcha});
        return this.http.post<RespuestaDevolucion>(this.urlServices + MetodosCotizador.EnvioOtp, data, {headers});
    }

    actualizacionDevolucion(data: ActualizacionInformacionDevolucion): Observable<RespuestaDevolucion> {
        return this.http.post<RespuestaDevolucion>(this.urlServices + MetodosCotizador.ActualizacionDevolucion, data);
    }

    ObtenerConvenioOrigenVista(idOrigenPin: number, idTipoPin: number) {
        return this.http.get<ConvenioOrigenVista>(this.urlServices + "GetConvenioOrigenVista?idOrigenPin=" + idOrigenPin + "&idTipoPin=" + idTipoPin);
    }

    seleccionarResumenPseByPin(pin: string): Observable<datosResumen> {
        return this.http.post<datosResumen>(this.urlServices + MetodosCotizador.seleccionarResumenPseByPin + "?pin=" + pin, "");
    }

    seleccionarResumenByPin(pin: string,tiponegocio:string): Observable<datosResumen> {
        return this.http.get<datosResumen>(this.urlServices + MetodosCotizador.seleccionarResumenByPin + "/" + pin + "/" + tiponegocio);
    }

    obtenerTipoDocumentos(): Observable<TipoDocumentoPtesaDTO[]> {
        return this.http.get<TipoDocumentoPtesaDTO[]>(this.urlServices + MetodosCotizador.ObtenerTipoDocumentos);
    }
    // Devoluciones y certificacion bancaria
    consultarInformacionPinDevoluciones(jsonData: InfoPinSimple): Observable<ResponseDtoOfPtsaDatosContactoDtoYPlxipCl> {

        return this.http.post<ResponseDtoOfPtsaDatosContactoDtoYPlxipCl>(this.urlServices + MetodosCotizador.ConsultarInformacionPinDevoluciones, jsonData);
    }

    actualizarContacto(jsonData: ActualizarContacto): Observable<string> {

        return this.http.post<string>(this.urlServices + MetodosCotizador.ActualizarContacto, jsonData);
    }

    getMotivoDevolucionByTipoPin(jsonData: InfoPinSimple): Observable<MotivoDevolucionDto[]> {

        return this.http.post<MotivoDevolucionDto[]>(this.urlServices + MetodosCotizador.GetMotivoDevolucionByTipoPin, jsonData);
    }

    actualizarDevolucionTransferencia(jsonData: ActualizarDevolucionTransferencia): Observable<boolean> {

        return this.http.post<boolean>(this.urlServices + MetodosCotizador.ActualizarDevolucionTransferencia, jsonData);
    }

    actualizarDevolucionEfectivoTransferencia(jsonData: CambiotipoDevolucion): Observable<boolean> {

        return this.http.post<boolean>(this.urlServices + MetodosCotizador.ActualizacionDevolucion, jsonData);
    }

    guardarCertificado(jsonData: FileToUpload): Observable<boolean> {

        return this.http.post<boolean>(this.urlServices + MetodosCotizador.GuardarCertificado, jsonData);
    }

    getCertificadoByPin(jsonData: string): Observable<FileToUpload> {

        return this.http.get<FileToUpload>(this.urlServices + MetodosCotizador.GetCertificadoByPin + "/"+jsonData);
    }

    ObtenerTokenAceptacion(idCliente: number): Observable<TokenAceptacion> {
      return this.http.get<TokenAceptacion>(this.urlServices + MetodosCotizador.ObtenerTokenAceptacion + "/" + idCliente);
    }

    GenerarReferenciaBancolombiaWompi(jsonData: ReferenciaBancolombiaWompi,tokenCaptcha:string=''): Observable<ResponseReferenciaWompi> {
        let headers = new HttpHeaders({'Captcha': tokenCaptcha});
        return this.http.post<ResponseReferenciaWompi>(this.urlServices + MetodosCotizador.GenerarReferenciaBancolombiaWompi, jsonData,{headers});
    }

    ConsultaExistePin(jsonData: UsuarioCotizador): Observable<ResponseCotizador> {
        return this.http.post<ResponseCotizador>(this.urlServices + MetodosCotizador.ConsultaExistePin, jsonData);
    }

    ConstruirCorreoWompi(jsonData: RequestNotificationSuccess): Observable<EntidadMensaje> {
        return this.http.post<EntidadMensaje>(this.urlServices + MetodosCotizador.ConstruirCorreoWompi, jsonData);
      }
    ObtenerCategoriasCentro(idCentro: string): Observable<Categoria[]> {
        return this.http.get<Categoria[]>(this.urlServices + MetodosCotizador.ObtenerCategoriasCentro + "/" + idCentro);
     }

    AutorizarPagoDaviplata(jsonData: AutorizacionDaviplata): Observable<RespuestaConfirmacionDaviplata> {
        return this.http.post<RespuestaConfirmacionDaviplata>(this.urlServices + MetodosCotizador.AutorizarPagoDaviplata, jsonData);
        }

    PermiteFacturaElectronica(jsonData: PermiteFacturaElectronicaRequest ): Observable<PermiteFacturaElectronicaResponse > {
      return this.http.post<PermiteFacturaElectronicaResponse>(this.urlServices + MetodosCotizador.PermiteFacturaElectronica, jsonData);
    }

     ObtenerTipoPersona(): Observable<TipoPersonaResponse> {

        return this.http.get<TipoPersonaResponse>(this.urlServices + MetodosCotizador.ObtenerTipoPersona);
    }

     ObtenerTipoDocumento(): Observable<TipoDocumentoResponse> {

        return this.http.get<TipoDocumentoResponse>(this.urlServices + MetodosCotizador.ObtenerTipoDocumento);
    }

    setEnableConfirmFE(valor: boolean) {
        this.enableConfirmFESubject.next(valor);
    }

    updateFeStatus(numeroRunt: { idRunt: number }, callback?: () => void) {
    this.PermiteFacturaElectronica(numeroRunt).subscribe((response) => {
        const habilitada = !!(response?.datos && response.datos.facturacionHabilitada);
        this.setEnableConfirmFE(habilitada);
        if (callback) callback();
        });
    }

}
