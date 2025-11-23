import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';

/**
 * 🌐 Servicio de Configuración de Entorno
 * 
 * Este servicio detecta automáticamente si la app está corriendo en:
 * - Navegador web (desarrollo)
 * - Dispositivo móvil (Android/iOS)
 * 
 * Y ajusta la URL del backend según corresponda.
 */
@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  
  /**
   * URL base del servidor backend
   * 
   * IMPORTANTE: Cambia esta IP según tu configuración:
   * - En desarrollo local (navegador): http://localhost:3001
   * - Para móvil en red local: http://TU_IP_LOCAL:3001 (ejemplo: http://192.168.1.100:3001)
   * - En producción: https://tu-servidor.com
   */
  private readonly API_URL_WEB = 'http://localhost:3001';
  //private readonly API_URL_MOBILE = 'http://10.0.2.2:3001'; // IP especial para emulador Android
  private readonly API_URL_MOBILE = 'http://192.168.1.100:3001'; // Descomenta y usa tu IP local para dispositivo físico
  
  constructor() {
    console.log('🌐 EnvironmentService inicializado');
    console.log('📱 Plataforma:', this.getPlatform());
    console.log('🔗 API URL:', this.getApiUrl());
  }
  
  /**
   * Obtiene la URL base del servidor según la plataforma
   */
  getApiUrl(): string {
    if (Capacitor.isNativePlatform()) {
      // Corriendo en dispositivo móvil
      return this.API_URL_MOBILE;
    } else {
      // Corriendo en navegador web
      return this.API_URL_WEB;
    }
  }
  
  /**
   * Detecta si está corriendo en plataforma nativa (Android/iOS)
   */
  isNative(): boolean {
    return Capacitor.isNativePlatform();
  }
  
  /**
   * Obtiene el nombre de la plataforma actual
   */
  getPlatform(): string {
    return Capacitor.getPlatform(); // 'web', 'android', 'ios'
  }
  
  /**
   * Construye una URL completa del endpoint
   */
  buildUrl(endpoint: string): string {
    // Asegurar que el endpoint empiece con /
    if (!endpoint.startsWith('/')) {
      endpoint = '/' + endpoint;
    }
    return this.getApiUrl() + endpoint;
  }
}
