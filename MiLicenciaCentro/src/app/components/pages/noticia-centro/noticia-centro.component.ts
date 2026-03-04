import { Component, NgModule, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { rutas } from "src/app/const/rutas";
import { TipoCliente } from "src/app/enums/PinesOlimpia/TipoCliente";
import { Centro } from "src/app/interfaces/cotizacion/Centro";
import { currentDataIp } from "src/app/interfaces/Otros/currentDataIp";
import { DataService } from "src/app/services/data/cotizador/data.service";
import { UtilGeneralService } from "src/app/services/data/util-general/utilGeneral.service";
import { DomSanitizer, SafeHtml, SafeResourceUrl} from '@angular/platform-browser';
import { UrlResponse } from "src/app/interfaces/Otros/UrlResponse";
import { HttpClientModule } from '@angular/common/http';
import { Apollo, ApolloModule, APOLLO_OPTIONS, gql } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';
import { BrowserModule } from "@angular/platform-browser";
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export type NodeImg = {
  altText: string;
  sourceUrl: string;
}

export type FeaturedImage = {
  node: NodeImg;    
};

export type Node = {
  title: string;
  date: Date;
  content: string;
  featuredImage: FeaturedImage;
};

export type Post = {
  nodes: Node[];
};

export type Query = {
  posts: Post;
};

const GET_NEW = gql`
query GetNewById($id: Int!){
  posts(where: {id: $id}) {
    nodes {
      title
      date
      content 
      featuredImage {
        node {
            altText          
            sourceUrl
        }
      }     
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
          link: httpLink.create({
            uri: ''
          }),
        };
      },
      deps: [HttpLink],
    },
  ],
})
export class AppModule {}

@Component({
  selector: 'app-noticia-centro',
  templateUrl: './noticia-centro.component.html',
  styleUrls: ['./noticia-centro.component.scss']
})
export class NoticiaCentroComponent implements OnInit {
  paginasCliente: any = rutas.mlCliente.tramites;
  procesosBanco: any = rutas.mlCliente.procesosBanco;
  procesosSdc: any = rutas.mlCliente.servicios;
  centroSeleccionado!: Centro;
  tipoServicio!: number;
  tipoCliente: any = TipoCliente;
  direccionConAbreviatura: string = '';
  urlPortalPines!: string ;
  parametroMapasCentro!:string;
  urlmapa!:string;
  urlMapaSegura:SafeResourceUrl="";
  posts!: Observable<Post>;
  post!: Post;
  page!: number;
  id!: number;
  loading = true;
  error: any;
  html!: SafeHtml;

  constructor(
    private readonly _routeGeneral: Router,
    private readonly _route: ActivatedRoute,
    private readonly _data: DataService,
    private readonly _utilGeneral: UtilGeneralService,
    private readonly _sanitizer :DomSanitizer,
    private readonly apollo: Apollo,
    private readonly httpLink: HttpLink
  ) {
    this.configurarParaNegocio();
    this.validarIdCentro();
  }


  ngOnInit() {   
    this._route.queryParams.subscribe((params: any) => {this.id = Number(params.Id);this.page = Number(params.Page);});

    let mlGraphQL = this.apollo.use('mlGraphQL');
    if(mlGraphQL === undefined)
    {
      this._utilGeneral.getUrlWPGQL().subscribe(x => {
        this.apollo.create({cache: new InMemoryCache(), link: this.httpLink.create({
          uri: x.valor
          })
        }, 'mlGraphQL')   
        //Se debe esperar la respuesta para la primer ejecución, por eso se usa en ambos lugares, en el else sería la segunda u otras ejecuciones
        this.consultaGraphQL();     
      });      
    }
    else
    {
      this.consultaGraphQL();
    } 
  }

  private consultaGraphQL() {
    this.posts = this.apollo.use('mlGraphQL')
          .watchQuery<Query>({
            query: GET_NEW,
            variables: {
              id: this.id
            },
          })
          .valueChanges.pipe(map((result) => result.data.posts));
          // .valueChanges.subscribe(({ data, loading }) => {
          //   this.post = data.posts;
          //   this.html = this._sanitizer.bypassSecurityTrustHtml(this.post.nodes[0].content);
          // });
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

  sanitize(html: string){
    return this._sanitizer.bypassSecurityTrustHtml(html);
  }
/**
 * Se obtienes parametros de url
 */
  private obtenerparametros()
   {
      this._data.obtenerParametrosPortalPines().subscribe((x:UrlResponse)=> {
      this.urlPortalPines = x.url;      
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
        this._routeGeneral.navigate(["/centros"])
      }
    });
  }
  
  /**
   * Regresa la url del mapa
   * @returns 
   */
/**
 * Regresa a iniciocentro
 */
  cambioCentro(){
    this._utilGeneral.quitarCentroCurrentDataIp(()=>{
      this._routeGeneral.navigate(["/centros"]);
    });
  }

  volver(){
    this._routeGeneral.navigate(["/centros","ml",this.tipoServicio == 8? "cea": "crc"],{ queryParams: { Page: this.page } });
  }
}
