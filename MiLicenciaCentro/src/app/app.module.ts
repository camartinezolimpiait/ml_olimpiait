import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { LoaderComponent } from './components/common/loader/loader.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './modules/compartidos/angular-material.module';
import { GraphQLModule } from './graphql.module';
import { AppHttpInterceptor } from './interceptors/error-http-interceptor';
import { LoaderInterceptor } from './interceptors/loader-interceptor';
import { LoaderService } from './services/loader/loader.service';
import { GoogleAnalyticsService } from './services/data/googleAnalytics/google-analytics.service';
import { SharedComponentModule } from './modules/shared-component/shared-component.module';
import { UtilidadesModule } from './modules/compartidos/utilidades/utilidades.module';
import { InicioCentroComponent } from './components/pages/inicio-centro/inicio-centro.component';
import { TokenInterceptor } from './interceptors/token-Interceptor';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { PopupSimpleComponent } from "src/app/components/common/popup-simple/popup-simple/popup-simple.component";
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module, ReCaptchaV3Service } from 'ng-recaptcha';
import { RecaptchaConfigService } from './services/util/captcha-service/recaptcha-config.service';

@NgModule({
  declarations: [
    AppComponent,
    LoaderComponent,
    InicioCentroComponent,
    PopupSimpleComponent
  ],
  imports: [
    SharedComponentModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    UtilidadesModule,
    AngularMaterialModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    GraphQLModule,
    RecaptchaV3Module
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    GoogleAnalyticsService,
    LoaderService,
    { provide: HTTP_INTERCEPTORS, useClass: AppHttpInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    {provide: RECAPTCHA_V3_SITE_KEY, useValue: environment.recaptcha.siteKey,},
    { provide: ReCaptchaV3Service, useClass: RecaptchaConfigService }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
