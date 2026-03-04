import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { CompraDePinComponent } from 'src/app/components/pages/compra-de-pin/compra-de-pin.component';
import { BusquedaCentroComponent } from 'src/app/components/pages/compra-de-pin/busqueda-centro/busqueda-centro.component';

const routes: Routes = [
  { path: "compra-de-pin/:sdcProduct", component: CompraDePinComponent },
  { path: "busqueda-centros", component: BusquedaCentroComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CotizadorRoutingModule { }
