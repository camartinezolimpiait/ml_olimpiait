import { Component, Inject, OnInit, ViewChild } from '@angular/core'
import { BreakpointObserver } from '@angular/cdk/layout'
import { Observable } from 'rxjs'
import { map, shareReplay } from 'rxjs/operators'
import { UtilService } from 'src/app/services/util/util.service'
import { RutaNavegacion } from 'src/app/interfaces/comun/RutaNavegacion'
import { rutas } from 'src/app/const/rutas'
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav'
import { DOCUMENT } from '@angular/common'

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit {
  @ViewChild('drawer') sidenav!: MatSidenav;
  paginasCliente: any = rutas.mlCliente.tramites
  procesosBanco: any = rutas.mlCliente.procesosBanco
  procesosSdc: any = rutas.mlCliente.servicios
  host: string = "";
  urlCentro:boolean=false;

  closeMainNav($even: any) {
    if (this.sidenav) {
      this.sidenav.close();
    }
    $even.stopPropagation();
  }

  botonPrincipalMenu: RutaNavegacion = {
    nombreEnlace: 'Servicios en línea',
    ruta: '/servicios'
  }

  abrirSubMenu(subMenuHTML: HTMLElement) {
    subMenuHTML.hidden = !subMenuHTML.hidden;
  }

  openNav() {
    return true;
  }

  closeNav() {
    return true;
  }

  /**
   * Activa o desactiva la barra
   * de estado
   */
  alternarEstadoBarra() {
    if (this.sidenav) {
      this.sidenav.toggle()
    }
  }

  /**
   * Observa si el tamaño en el viewport es de 975px.
   * Si es menor, cambia el modo de navegación
   */
  isHandset$: Observable<boolean> = this._breakpointObserver
    .observe('(max-width: 975px)')
    .pipe(
      map(result => result.matches),
      shareReplay(),
    )

  constructor(
    private readonly _breakpointObserver: BreakpointObserver,
    private readonly _utils: UtilService,
    public router: Router,
    @Inject(DOCUMENT) private readonly document: Document,
  ) { }


  ngOnInit() {
    this.host = window.location.origin;
    this.urlCentro = this.router.url.includes('/centro-de-servicios');
  }

  irARuta(ruta: string) {
    this._utils.cambiarRutaInterna(ruta)
    this.alternarEstadoBarra()
  }
}
