import { NgModule } from "@angular/core";

import { Routes, RouterModule } from "@angular/router";
import { ConsultaCitasCeaComponent } from 'src/app/components/pages/consulta-citas-cea/consulta-citas-cea.component';
import { ConsultaPinComponent } from "src/app/components/pages/consulta-pin/consulta-pin.component";
import { PagoCuotasComponent } from 'src/app/components/pages/pago-cuotas/pago-cuotas.component';

const routes: Routes = [
  { path: '', component: ConsultaPinComponent },
  { path: 'cea', component: PagoCuotasComponent },
  { path: 'cita-cea', component: ConsultaCitasCeaComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultaRoutingModule { }
