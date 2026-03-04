import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { Router, NavigationEnd } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

declare let gtag: Function;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  updateAvailable: boolean = false;
  constructor(@Inject(PLATFORM_ID) private readonly platformId: Object, private readonly update: SwUpdate, public router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (isPlatformBrowser(this.platformId)) {
          /*Se realiza comentario en index para poder enviar peticiones independientes*/

          /*Google recomienda este metodo para medir en SPA. Antes estaba pegado del config*/
          /*https://developers.google.com/analytics/devguides/collection/gtagjs/single-page-applications*/
          gtag('set', 'page_path', event.urlAfterRedirects);
          gtag('event', 'page_view');
        }
      }
    });
  }
  ngOnInit() {
    if (this.update.isEnabled) {
      this.update.available.subscribe(() => {
        this.updateNow();
      });
    }
  }

  updateNow() {
    document.location.reload();
    console.log('The app is updating right now');
  }
}
