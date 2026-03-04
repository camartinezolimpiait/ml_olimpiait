import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from 'src/app/modules/compartidos/angular-material.module';
import { SharedComponentModule } from 'src/app/modules/shared-component/shared-component.module';
import { UtilidadesModule } from 'src/app/modules/compartidos/utilidades/utilidades.module';
import { CentroRoutingModule } from './centro-routing.module';
import { OpcionesCentroComponent } from 'src/app/components/pages/opciones-centro/opciones-centro.component';
import { NoticiaCentroComponent } from 'src/app/components/pages/noticia-centro/noticia-centro.component';


@NgModule({
  declarations: [
    OpcionesCentroComponent,
    NoticiaCentroComponent
  ],
  imports: [
    CommonModule,
    CentroRoutingModule,
    AngularMaterialModule,
    SharedComponentModule,
    UtilidadesModule
  ],
})
export class CentroModule { }
