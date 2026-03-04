import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { environment } from 'src/environments/environment';

const pathEnv = environment.routingPrefix;
const routes: Routes = [
  {
    path: pathEnv,
    children: [
      {
        path: "",
        loadChildren: () =>
          import("src/app/modules/public/principal/principal.module").then((m) => m.PrincipalModule),
      },
      {
        path: "**",
        loadChildren: () =>
          import("src/app/modules/error/error.module").then((m) => m.ErrorModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: "top" })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
