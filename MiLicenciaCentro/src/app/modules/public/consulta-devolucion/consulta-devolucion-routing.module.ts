import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { ConsultaDevolucionComponent } from "src/app/components/pages/consulta-devolucion/consulta-devolucion.component";

const routes: Routes = [
  { path: ":sisec", component: ConsultaDevolucionComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultaDevolucionRoutingModule { }
