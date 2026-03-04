import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResumenComponent } from 'src/app/components/pages/resumen/resumen.component';

const routes: Routes = [{ path: ':data', component: ResumenComponent },{ path: ':negocio/:data', component: ResumenComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResumenRoutingModule { }
