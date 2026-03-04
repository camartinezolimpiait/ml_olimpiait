import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CambioBeneficiarioComponent } from 'src/app/components/pages/cambio-beneficiario/cambio-beneficiario.component';

const routes: Routes = [{ path: ':sisec/:idTramite', component: CambioBeneficiarioComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CambioBeneficiarioRoutingModule { }
