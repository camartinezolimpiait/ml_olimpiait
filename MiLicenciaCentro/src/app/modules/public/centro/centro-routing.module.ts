import { NgModule } from "@angular/core";

import { Routes, RouterModule } from "@angular/router";
import { InicioCentroComponent } from "src/app/components/pages/inicio-centro/inicio-centro.component";
import { NoticiaCentroComponent } from "src/app/components/pages/noticia-centro/noticia-centro.component";
import { OpcionesCentroComponent } from "src/app/components/pages/opciones-centro/opciones-centro.component";

const routes: Routes = [
  { path: "", component: InicioCentroComponent },
  { path: "ml/:sdcProduct", component: OpcionesCentroComponent },
  { path: "ml/:sdcProduct/noticia", component: NoticiaCentroComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CentroRoutingModule {}
