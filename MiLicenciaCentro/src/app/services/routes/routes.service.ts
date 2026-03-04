import { Injectable } from "@angular/core";
import { rutas } from "src/app/const/rutas";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
  })
  export class RoutesService {
  
    environment: string = environment.routingPrefix;
    _rutas = rutas;
  
    constructor() { }
    /**
       * Builds a string that represents a URL used in a request
       * @param server server URL
       * @param segments subsequent strings separated by '/' in a URL
       */
    getRequestURL(server: string, ...segments: string[]) {
      let url = "";
      segments.forEach((s) => (url += "/" + s));
      return server + url;
    }
  
    /**
     * Builds a string that represents a route inside the angular app
     * to navigate to a child route
     * @param segments
     */
    getChildNavigationURL(...segments: string[]) {
      let url = "";
      segments.forEach((s) => (url += s + "/"));
      return url;
    }
  
    /**
     * Builds a strings that represents a route inside the angular app
     * to navigate to an absolute route
     * @param segments
     */
    getAbsoluteNavigationURL(...segments: string[]) {
      let url = this.environment;
      segments.forEach((s) => (url += s + "/"));
      return url;
    }
  }