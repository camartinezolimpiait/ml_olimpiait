import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse, HttpEvent } from "@angular/common/http";
import { AuthService } from "src/app/services/data/auth/auth.service";
import { BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError } from "rxjs";
import { AuthResponse } from "../interfaces/auth/AuthResponse";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    private isRefreshing = false;
    private readonly refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  
    constructor(public authService: AuthService) { }
  
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      if(request.url.includes("servicios"))
      {
        if (this.authService.getJwtToken()) {
          request = this.addToken(request, this.authService.getJwtToken());
        }
      
        return next.handle(request).pipe(catchError(error => {
          if (error instanceof HttpErrorResponse && error.status === 401) {
            return this.handle401Error(request, next);
          } else {
            return throwError(error);
          }
        }));
      }
      else{
        return next.handle(request);
      }   
    }
  
    private addToken(request: HttpRequest<any>, token: string) {
      return request.clone({
        setHeaders: {
          'Authorization': `Bearer ${token}`
        }
      });
    }
  
    private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
      if (!this.isRefreshing) {
        this.isRefreshing = true;
        this.refreshTokenSubject.next(null);
  
        return this.authService.refreshToken().pipe(
          switchMap((token: AuthResponse) => {
            this.isRefreshing = false;
            this.refreshTokenSubject.next(token.tokenBearer);
            return next.handle(this.addToken(request, token.tokenBearer));
          }));
  
      } else {
        return this.refreshTokenSubject.pipe(
          filter(token => token != null),
          take(1),
          switchMap(jwt => {
            return next.handle(this.addToken(request, jwt));
          }));
      }
    }
  }