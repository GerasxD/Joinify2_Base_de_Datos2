import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { registerLocaleData } from '@angular/common';
import localeEsMX from '@angular/common/locales/es-MX';
import { App } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Capacitor } from '@capacitor/core';

registerLocaleData(localeEsMX, 'es-MX');

// Inicializar plugins de Capacitor si estamos en plataforma nativa
if (Capacitor.isNativePlatform()) {
  console.log('📱 Inicializando plugins de Capacitor...');
  
  // Configurar la barra de estado (StatusBar)
  StatusBar.setStyle({ style: Style.Dark }).catch(err => 
    console.warn('Error configurando StatusBar:', err)
  );
  
  StatusBar.setBackgroundColor({ color: '#1e1e2f' }).catch(err => 
    console.warn('Error configurando color de StatusBar:', err)
  );
  
  // Ocultar el splash screen después de que la app esté lista
  setTimeout(() => {
    SplashScreen.hide().catch(err => 
      console.warn('Error ocultando SplashScreen:', err)
    );
  }, 2000);
  
  // Manejar el botón de atrás de Android
  App.addListener('backButton', ({ canGoBack }) => {
    if (!canGoBack) {
      App.exitApp();
    } else {
      window.history.back();
    }
  });
  
  console.log('✅ Plugins de Capacitor inicializados');
}

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
