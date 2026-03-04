import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AnulacionComponent } from 'src/app/components/pages/anulacion/anulacion.component';

const routes: Routes = [{ path: ':sisec/:idTramite', component: AnulacionComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnulacionRoutingModule { }
