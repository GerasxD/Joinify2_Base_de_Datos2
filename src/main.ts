import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { registerLocaleData } from '@angular/common';
import localeEsMX from '@angular/common/locales/es-MX';
import localeEs from '@angular/common/locales/es';

// Registrar ambos locales: es y es-MX
registerLocaleData(localeEs, 'es');
registerLocaleData(localeEsMX, 'es-MX');

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
