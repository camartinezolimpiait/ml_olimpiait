import { Observable } from "rxjs";
import { TipoCliente } from "src/app/enums/PinesOlimpia/TipoCliente";
import { TipoDocumentoPtesaDTO } from "src/app/interfaces/cotizacion/TipoDocumentoPtesaDTO";
import { DataService } from "src/app/services/data/cotizador/data.service";

export class TipoDocumentoPtesaClass {
    private readonly _dataService: DataService;
    private readonly tipoCliente: any = TipoCliente;
    private _tipoDocumentoPtesa: TipoDocumentoPtesaDTO[] = [];

    constructor(dataService: DataService) {
        this._dataService = dataService;
    }

    set(tipoDocumentos: TipoDocumentoPtesaDTO[]) {
        this._tipoDocumentoPtesa = tipoDocumentos;
    }
    
    get(): Observable<TipoDocumentoPtesaDTO[]> {
        return this._dataService.obtenerTipoDocumentos();
    }

    getDocumentosByClienteCompraEdad(clienteCompra: number, edad: number): TipoDocumentoPtesaDTO[] {
        let filtroClienteCompra: TipoDocumentoPtesaDTO[] = this.getDocumentosByClienteCompra(clienteCompra);
        return filtroClienteCompra.filter(f=> edad >= f.edadMinima && edad <= f.edadMaxima);
    }

    getDocumentosByClienteCompra(clienteCompra: number): TipoDocumentoPtesaDTO[] {
        if(clienteCompra == this.tipoCliente.CRC) {
            return this._tipoDocumentoPtesa.filter(f => f.visualizarCrc == 1 && f.idTipoSisec != '4');
        }
        else{
            return this._tipoDocumentoPtesa.filter(f => f.visualizarCea == 1 && f.idTipoSisec != '4');
        }
    }

    getDocumentosByClienteCompraDevoluciones(clienteCompra: number): TipoDocumentoPtesaDTO[] {
        if(clienteCompra == this.tipoCliente.CRC) {
            return this._tipoDocumentoPtesa.filter(f => f.visualizarCrc == 1);
        }
        else{
            return this._tipoDocumentoPtesa.filter(f => f.visualizarCea == 1);
        }
    }
}