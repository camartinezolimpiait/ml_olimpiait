import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { CotizadorRoutingModule } from "./cotizador-routing.module";
import { AngularMaterialModule } from "src/app/modules/compartidos/angular-material.module";
import { SharedComponentModule } from "src/app/modules/shared-component/shared-component.module";
import { UtilidadesModule } from "src/app/modules/compartidos/utilidades/utilidades.module";

//Pages
import { CompraDePinComponent } from 'src/app/components/pages/compra-de-pin/compra-de-pin.component';
import { ResumenComponent } from 'src/app/components/pages/compra-de-pin/resumen/resumen.component';
import { TycComponent } from 'src/app/components/pages/compra-de-pin/tyc/tyc.component';
import { BusquedaCentroComponent } from "src/app/components/pages/compra-de-pin/busqueda-centro/busqueda-centro.component";
import { AutocompleteLibModule } from "angular-ng-autocomplete";
import { DatosBasicosComponent } from "src/app/components/pages/compra-de-pin/datos-basicos/datos-basicos.component";
import { TipoTramiteComponent } from "src/app/components/pages/compra-de-pin/tramite-categoria/tipo-tramite/tipo-tramite.component"
import { SeleccionCategoriasComponent } from "src/app/components/pages/compra-de-pin/tramite-categoria/seleccion-categorias/seleccion-categorias.component";
import { SeleccionCentroComponent } from "src/app/components/pages/compra-de-pin/seleccion-centro/seleccion-centro.component";
import { CuotasCeasComponent } from "src/app/components/pages/compra-de-pin/cuotas-ceas/cuotas-ceas.component";
import { TramiteCategoriaComponent } from "src/app/components/pages/compra-de-pin/tramite-categoria/tramite-categoria.component";
import { DatosPersonalesComponent } from "src/app/components/pages/compra-de-pin/datos-personales/datos-personales.component";
import { MediosPagoComponent } from "src/app/components/pages/compra-de-pin/medios-pago/medios-pago.component";
import { ConfirmarCompraComponent } from "src/app/components/pages/compra-de-pin/confirmar-compra/confirmar-compra.component";
import { ConvenioResumenComponent } from "src/app/components/pages/convenio-resumen/convenio-resumen.component";
import { FacturaElectronicaComponent } from "src/app/components/pages/compra-de-pin/factura-electronica/factura-electronica.component";
@NgModule({
  declarations: [
    CompraDePinComponent,
    ResumenComponent,
    TycComponent,
    BusquedaCentroComponent,
    DatosBasicosComponent,
    TipoTramiteComponent,
    SeleccionCategoriasComponent,
    SeleccionCentroComponent,
    CuotasCeasComponent,
    TramiteCategoriaComponent,
    DatosPersonalesComponent,
    MediosPagoComponent,
    ConfirmarCompraComponent,
    ConvenioResumenComponent,
    FacturaElectronicaComponent
  ],
  imports: [
    CommonModule,
    CotizadorRoutingModule,
    SharedComponentModule,
    AngularMaterialModule,
    UtilidadesModule,
    AutocompleteLibModule,
  ],
  exports: [
  ]
})
export class CotizadorModule { }
