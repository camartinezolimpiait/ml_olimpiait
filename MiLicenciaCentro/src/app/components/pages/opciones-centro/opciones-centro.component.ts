import { Component, NgModule, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { rutas } from "src/app/const/rutas";
import { TipoCliente } from "src/app/enums/PinesOlimpia/TipoCliente";
import { Centro } from "src/app/interfaces/cotizacion/Centro";
import { currentDataIp } from "src/app/interfaces/Otros/currentDataIp";
import { DataService } from "src/app/services/data/cotizador/data.service";
import { UtilGeneralService } from "src/app/services/data/util-general/utilGeneral.service";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { UrlResponse } from "src/app/interfaces/Otros/UrlResponse";
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { Apollo, ApolloModule, APOLLO_OPTIONS, gql} from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';
import { BrowserModule } from "@angular/platform-browser";
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { UtilService } from "src/app/services/util/util.service";
import { SharedService } from 'src/app/services/data/cliente/cliente.service';
import { environment } from "src/environments/environment.prod";
import { getUrlPortalAdminCentro } from 'src/app/services/util/api-milicencia.util';

export type NodeImg = {
  altText: string;
  sourceUrl: string;
}

export type FeaturedImage = {
  node: NodeImg;
};

export type Edge = {
  cursor: string;
}

export type Node = {
  databaseId: string;
  title: string;
  link: string;
  date: Date;
  featuredImage: FeaturedImage;
  excerpt: string;
};

export type Post = {
  nodes: Node[];
  edges: Edge[];
};

export type Query = {
  posts: Post;
};

const NewsXPage = 3;

const GET_NEWS_AFTER = gql`
query GetNews($cursor: String!,$cantPagina: Int!,$day: Int!,$month: Int!,$year: Int!,$categoryName: String!){
  posts (after: $cursor, first: $cantPagina, where:{dateQuery: {after: {day: $day, month: $month, year: $year}},categoryName: $categoryName}){
    nodes {
      databaseId
      title
      link
      date
      featuredImage {
        node {
            altText
            sourceUrl
        }
      }
      excerpt
    }
  }
}
`;

const GET_NEWS_TOTAL = gql`
query GetNews($day: Int!,$month: Int!,$year: Int!,$categoryName: String!){
  posts (where:{dateQuery: {after: {day: $day, month: $month, year: $year}},categoryName: $categoryName}){
    edges {
      cursor
    }
  }
}
`;

@NgModule({
  imports: [BrowserModule, ApolloModule, HttpClientModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink) => {
        return {
          cache: new InMemoryCache(),
        };
      },
      deps: [HttpLink],
    },
  ],
})
export class AppModule {}

@Component({
  selector: "app-opciones-centro",
  templateUrl: "./opciones-centro.component.html",
  styleUrls: ["./opciones-centro.component.scss"],
})
export class OpcionesCentroComponent implements OnInit {
  paginasCliente: any = rutas.mlCliente.tramites;
  procesosBanco: any = rutas.mlCliente.procesosBanco;
  procesosSdc: any = rutas.mlCliente.servicios;
  centroSeleccionado!: Centro;
  tipoServicio!: number;
  tipoCliente: any = TipoCliente;
  direccionConAbreviatura: string = '';
  urlPortalPines!: string ;
  urlPortalAdminCentro!: string ;
  parametroMapasCentro!:string;
  urlmapa!:string;
  urlMapaSegura:SafeResourceUrl="";
  buttonsLeftDisabled!: boolean;
  buttonsRightDisabled!: boolean;
  pages!: number;
  page!: number;
  cursors!: Edge[];
  endCursors: string[] = [];
  postsTotal!: number;
  posts!: Observable<Post>;
  error!: any;
  today!: Date;
  urlGQL!: string;
  categoryName!: string;
  UrlIpTemp!: string;
  loading!: boolean;
  errorGQL!: boolean;
  subscription!: Subscription;

  constructor(
    private readonly _routeGeneral: Router,
    private readonly _route: ActivatedRoute,
    private readonly _data: DataService,
    private readonly _utilGeneral: UtilGeneralService,
    private readonly _sanitizer :DomSanitizer,
    private readonly apollo: Apollo,
    private readonly httpLink: HttpLink,
    private readonly _utils: UtilService,
    private readonly sharedService: SharedService
  ) {
    this.configurarParaNegocio();
    this.validarIdCentro();
  }

  ngOnInit() {
    this.loading = true;
    this.errorGQL = false;
    this.today = new Date();
    this.today.setDate(this.today.getDate() - 31);
    let mlGraphQL = this.apollo.use('mlGraphQL');

    this.subscription = this._utilGeneral.errorHttp.subscribe((x: any)=> {
      if (x.url.includes("ObtenerUrlGQL")){
        this.loading = false;
        this.errorGQL = true;
      }
      else if(this.UrlIpTemp.replace("/?", "?") === x.url.replace("/?", "?")){
        this.loading = false;
        this.errorGQL = true;
      }
    });

    this._utilGeneral.getUrlWPGQL().subscribe(( x: any) => {
      this.UrlIpTemp = x.valor;
      if(mlGraphQL === undefined)
      {
        this.apollo.create({cache: new InMemoryCache(),
          defaultOptions: {
            watchQuery: {
              errorPolicy: 'all'
            }
          },
          link: this.httpLink.create({
            uri: x.valor
          }),
        }, 'mlGraphQL')
      }
      this.consultaGraphQL();
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private consultaGraphQL() {
    this.apollo.use('mlGraphQL')
      .watchQuery<Query>({
        query: GET_NEWS_TOTAL,
        variables: {
          day: this.today.getDate(),
          month: this.today.getMonth() + 1,
          year: this.today.getFullYear(),
          categoryName: this.categoryName
        },
        errorPolicy: 'all',
        fetchPolicy: 'cache-and-network'
      }).valueChanges
        .subscribe(({ data, errors }) => {
          this.error = errors;
          this.cursors = data.posts.edges;
          this.endCursors.push("");
          this.cursors.forEach((value,index)=>{
            if(((index+1)%NewsXPage)==0) this.endCursors.push(this.cursors[index].cursor);
          });
          this.postsTotal = this.cursors.length;
          this.pages = Math.ceil(this.postsTotal/NewsXPage);
          if(this.pages == 0) this.pages = 1;
          this._route.queryParams.subscribe((params: any) => {this.page = Number(params.Page);});
          if(isNaN(this.page)) this.page = 1;
          this.resetButtons();
          this.consultaGraphQLPagina();
          this.loading = false;
        });
  }

  private consultaGraphQLPagina(){
    this.posts = this.apollo.use('mlGraphQL')
          .watchQuery<Query>({
            query: GET_NEWS_AFTER,
            variables: {
              cursor: this.endCursors[this.page-1],
              cantPagina: NewsXPage,
              day: this.today.getDate(),
              month: this.today.getMonth() + 1,
              year: this.today.getFullYear(),
              categoryName: this.categoryName,
            },
          })
          .valueChanges.pipe(map((result) => result.data.posts));
  }

  private resetButtons(){
    this.buttonsLeftDisabled = this.page == 1;
    this.buttonsRightDisabled = this.page == this.pages;
  }

  pageDisabled(currentPage: number){
    return this.page == currentPage;
  }

  /**
   * Valida si se tiene algun centro seleccionado
   */
  private validarIdCentro() {
    const navigation: any = this._routeGeneral.getCurrentNavigation();
    const state: any = navigation.extras.state as { data: Centro };
    if(state !== undefined){
      this.centroSeleccionado = state.data["centro"];
      this.direccionConAbreviatura = this.quitarAbreviaciones(this.centroSeleccionado.direccion);
      this.obtenerparametros();
    } else{
      this.validarIpCentro();
    }
  }
/**
 * Se obtienes parametros de url
 */
  private obtenerparametros()
   {
      this._data.obtenerParametrosPortalPines().subscribe((x:UrlResponse)=> {
      this.urlPortalPines = x.url;
  // ...existing code...
  // Reemplazo dinámico según setting
  // Importa la función si no está importada
  // import { getUrlPortalAdminCentro } from 'src/app/services/util/api-milicencia.util';
  this.urlPortalAdminCentro = getUrlPortalAdminCentro();
    });
   }
  /**
   * Elimina abreviaturas
   * @param input
   * @returns
   */
  quitarAbreviaciones(input: string) {
    let filtroAvenidaCarrera = /\b(ak|acr)\b/;
    let filtroAvenidaCalle = /\b(ac|avcl)\b/;
    let filtroAvenida = /\b(ave|av)\b/;
    let filtroCalle = /\b(c|cl|cll|clle|cale|call)\b/;
    let filtroCarrera = /\b(cr|cra|k|kr|kra|crr|car)\b/;
    let filtroTransversal = /\b(trans|transv|tranv|trv|tv|tvr)\b/;
    let filtroDiagonal = /\b(dg|dig|diag)\b/;
    let filtroVereda = /\b(vr|vda)\b/;
    let filtroManzana = /\b(mza)\b/;
    let filtroKilometro = /\b(km|kto)\b/;
    let filtroGuiones = /(\s?–\s?|\s?-\s?)/g;
    let filtroEspeciales = /[^a-zA-Z0-9-# ]/g;
    let filtroNum = /\s(no|n)\s/g;

    input = input.replace(filtroAvenidaCarrera, "avenida carrera");
    input = input.replace(filtroAvenidaCalle, "avenida calle");
    input = input.replace(filtroAvenida, "avenida");
    input = input.replace(filtroCalle, "calle");
    input = input.replace(filtroCarrera, "carrera");
    input = input.replace(filtroTransversal, "transversal");
    input = input.replace(filtroDiagonal, "diagonal");
    input = input.replace(filtroVereda, "vereda");
    input = input.replace(filtroManzana, "manzana");
    input = input.replace(filtroKilometro, "kilometro");
    input = input.replace(filtroGuiones, " - ");
    input = input.replace(filtroEspeciales, "");
    input = input.replace(filtroNum, " # ");

    return input;
  }

  /**
   * Valida si se consulta un centro Crc o un Cea.
   */
  private configurarParaNegocio() {
    this._route.params.subscribe((e: any) => {
      this.tipoServicio =
        e.sdcProduct == "cea" ? TipoCliente.CEA : TipoCliente.CRC;
      this.categoryName = this.tipoServicio == 8? "CEA": "CRC";
      this.sharedService.setTipoServicio(this.tipoServicio);
    });
  }

  /**
   * Valida si el centro tiene ip asociada
   */
  private validarIpCentro(){
    this._utilGeneral.ObtenerIp((data: currentDataIp)=>{
      if(data != null && data.centroSeleccionado != null && data.tipoCliente != null && data.tipoCliente === this.tipoServicio){
        this.centroSeleccionado = data.centroSeleccionado;
        this.direccionConAbreviatura = this.quitarAbreviaciones(this.centroSeleccionado.direccion);
        this.obtenerparametros();
      } else{
        this._routeGeneral.navigate(["/"])
      }
    });
  }

  /**
   * Regresa la url del mapa
   * @returns
   */
  // urlMapaCentros()
  // {
  //   return this.urlMapaSegura= this._sanitizer.bypassSecurityTrustResourceUrl(this.urlmapa);
  // }
/**
 * Regresa a iniciocentro
 */
  cambioCentro(){
    this._utilGeneral.quitarCentroCurrentDataIp(()=>{
      this._routeGeneral.navigate(["/centros"]);
    });
  }

  abrirNoticia(id: string){
    this._routeGeneral.navigate(["centros","ml",this.categoryName.toLowerCase(),"noticia"],{ queryParams: { Id: id, Page: this.page } });
  }

  firstP(){
    this.page = 1;
    this.resetButtons();
    this._routeGeneral.navigate(["centros","ml",this.categoryName.toLowerCase()],{ queryParams: { Page: this.page } });
    this.consultaGraphQLPagina();
  }

  previousP(){
    this.page -= 1;
    this.resetButtons();
    this._routeGeneral.navigate(["centros","ml",this.categoryName.toLowerCase()],{ queryParams: { Page: this.page } });
    this.consultaGraphQLPagina();
  }

  goToP(page: number){
    this.page = page;
    this.resetButtons();
    this._routeGeneral.navigate(["centros","ml",this.categoryName.toLowerCase()],{ queryParams: { Page: this.page } });
    this.consultaGraphQLPagina();
  }

  nextP(){
    this.page += 1;
    this.resetButtons();
    this._routeGeneral.navigate(["centros","ml",this.categoryName.toLowerCase()],{ queryParams: { Page: this.page } });
    this.consultaGraphQLPagina();
  }

  lastP(){
    this.page = this.pages;
    this.resetButtons();
    this._routeGeneral.navigate(["centros","ml",this.categoryName.toLowerCase()],{ queryParams: { Page: this.page } });
    this.consultaGraphQLPagina();
  }
  seleccionCompraPin(){
      this.redireccionCentro(this.centroSeleccionado,this.tipoServicio);


  }
  private redireccionCentro(centroSeleccionado: Centro | undefined, tipoCliente: number | undefined){
    if (this.tipoCliente.CEA === tipoCliente) {
      this._routeGeneral.navigate(['/sdc/compra-de-pin/cea'], { state: { data: { centroSeleccionado } } });
    }
    else {
      this._routeGeneral.navigate(['/sdc/compra-de-pin/crc'], { state: { data: { centroSeleccionado } } });
    }
  }

}
