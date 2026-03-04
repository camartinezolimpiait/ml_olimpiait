import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { CambioTipoDevolucionComponent } from "src/app/components/pages/cambio-tipo-devolucion/cambio-tipo-devolucion.component";

const routes: Routes = [
  { path: ":sisec", component: CambioTipoDevolucionComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CambioTipoDevolucionRoutingModule { }
