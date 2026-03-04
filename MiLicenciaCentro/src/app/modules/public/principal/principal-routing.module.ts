import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { InicioCentroComponent } from "src/app/components/pages/inicio-centro/inicio-centro.component";
import { PrincipalComponent } from "src/app/components/pages/principal/principal.component";

const routes: Routes = [
    {
        path: "",
        component: PrincipalComponent,
        children: [
            { path: "", component: InicioCentroComponent },
            {
                path: "centros",
                loadChildren: () =>
                    import("src/app/modules/public/centro/centro.module").then((m) => m.CentroModule),
            },
            {
                path: "sdc",
                loadChildren: () =>
                    import("src/app/modules/public/cotizador/cotizador.module").then((m) => m.CotizadorModule),
            },
            {
                path: "consulta",
                loadChildren: () =>
                    import("src/app/modules/public/consulta/consulta.module").then((m) => m.ConsultaModule),
            },
            {
                path: "anulacion",
                loadChildren: () =>
                    import("src/app/modules/public/anulacion/anulacion.module").then((m) => m.AnulacionModule),
            },
            {
                path: "cambio-beneficiario",
                loadChildren: () =>
                    import("src/app/modules/public/cambio-beneficiario/cambio-beneficiario.module").then( (m) => m.CambioBeneficiarioModule),
            },
            {
                path: "consulta-devolucion",
                loadChildren: () =>
                import("src/app/modules/public/consulta-devolucion/consulta-devolucion.module").then((m) => m.ConsultaDevolucionModule),
            },
            {
                path: "resumen",
                title: "Resumen de compra | MiLicencia",
                loadChildren: () =>
                    import("src/app/modules/public/resumen/resumen.module").then(
                        (m) => m.ResumenModule
                    ),
            }
        ]
    },

];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PrincipalRoutingModule { }