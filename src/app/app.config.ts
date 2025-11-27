import { ApplicationConfig, provideZoneChangeDetection, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { Capacitor } from '@capacitor/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(), // Habilita las animaciones de Angular
    { provide: LOCALE_ID, useValue: 'es-MX' }
  ]
};

/**
 * 🌐 Configuración global de la API para WEB y MÓVIL
 * 
 * IMPORTANTE: Actualiza estas URLs según tu entorno:
 * 
 * 1. Para desarrollo en NAVEGADOR:
 *    - apiUrl: 'http://localhost:3001'
 * 
 * 2. Para pruebas en EMULADOR ANDROID:
 *    - apiUrl: 'http://10.0.2.2:3001'
 *    (10.0.2.2 es la IP especial que el emulador usa para acceder a localhost de tu PC)
 * 
 * 3. Para pruebas en DISPOSITIVO FÍSICO (celular/tablet):
 *    - Encuentra tu IP local:
 *      * Windows: abre CMD y ejecuta `ipconfig`, busca "Dirección IPv4"
 *      * Mac/Linux: abre Terminal y ejecuta `ifconfig` o `ip addr`
 *    - Usa esa IP: 'http://TU_IP_LOCAL:3001' (ejemplo: 'http://192.168.1.100:3001')
 *    - IMPORTANTE: Tu celular y tu PC deben estar en la MISMA RED WIFI
 * 
 * 4. Para PRODUCCIÓN:
 *    - apiUrl: 'https://tu-servidor-produccion.com'
 */

// Función para obtener la URL correcta según la plataforma
function getApiUrl(): string {
  const isNative = Capacitor.isNativePlatform();
  
  // URL de producción en Railway
  const PROD_URL = 'https://joinify-backend-production.up.railway.app';

  if (isNative) {
    // 🤖 MÓVIL (Android/iOS)
    // Cambia esta URL según tu configuración:
    
    // ⚠️ PARA EMULADOR: usa esto (YA ESTÁ ACTIVO)
    // return 'http://10.0.2.2:3001'; // Para emulador Android
    
    // ⚠️ PARA DISPOSITIVO FÍSICO: descomenta la siguiente línea y pon TU IP local
    // return 'http://192.168.50.202:3001'; // Descomenta y usa tu IP local para dispositivo físico
    
    // Para producción:
    return PROD_URL;
  } else {
    // 🌐 WEB (Navegador)
    // return 'http://localhost:3001';
    return PROD_URL;
  }
}

export const environment = {
  apiUrl: getApiUrl(),
  isNative: Capacitor.isNativePlatform(),
  platform: Capacitor.getPlatform()
};

// Log para debugging
console.log('🌐 Configuración de entorno:', {
  platform: environment.platform,
  isNative: environment.isNative,
  apiUrl: environment.apiUrl
});

