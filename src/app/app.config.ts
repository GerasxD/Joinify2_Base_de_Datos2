import { ApplicationConfig, provideZoneChangeDetection, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    { provide: LOCALE_ID, useValue: 'es-MX' }
  ]
};

// Configuración global de la API
export const environment = {
  production: false,
  apiBase: 'http://localhost:3001',
  apiUrl: 'http://localhost:3001', // add alias for backward compatibility
  stripePK: 'pk_test_XXXX_REEMPLAZA_POR_LA_TUYA'
};

