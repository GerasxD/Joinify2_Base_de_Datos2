# 📱 GUÍA COMPLETA: JOINIFY - APLICACIÓN MÓVIL CON CAPACITOR

## 🎯 ¿Qué se ha hecho?

Tu aplicación web Angular **Joinify** ha sido convertida exitosamente en una **aplicación móvil nativa** para Android e iOS usando **Capacitor**.

### ✅ Características implementadas:

1. ✨ **Conversión completa** a app móvil (Android/iOS)
2. 🌐 **Conexión automática** al backend Node.js (detecta si está en web o móvil)
3. 🎨 **Estilos optimizados** para pantallas táctiles
4. 📱 **Plugins nativos** instalados (StatusBar, SplashScreen, Keyboard, Network, App)
5. 🔐 **Permisos configurados** para internet y red
6. 🚀 **Scripts automatizados** para compilar y ejecutar

---

## 📂 Estructura del proyecto actualizada

```
Joinify2_Base_de_Datos/
├── android/                    # ⚡ Proyecto Android nativo (generado)
│   └── app/
│       └── src/main/
│           ├── AndroidManifest.xml
│           └── res/xml/network_security_config.xml
├── src/
│   ├── app/
│   │   ├── app.config.ts      # ✅ Configuración de URLs (web/móvil)
│   │   └── services/
│   │       └── environment.service.ts  # 🌐 Servicio para detectar plataforma
│   ├── main.ts                # ✅ Inicialización de plugins Capacitor
│   ├── mobile-styles.css      # 📱 Estilos específicos móvil
│   └── ...
├── capacitor.config.ts        # ⚙️ Configuración de Capacitor
├── package.json               # ✅ Scripts para móvil agregados
└── server/                    # 🖥️ Backend Node.js (sin cambios)
```

---

## 🚀 PASO 1: Preparar el entorno de desarrollo

### Requisitos previos:

#### Para Android:
1. **Descargar e instalar Android Studio**:
   - Web: https://developer.android.com/studio
   - Durante la instalación, asegúrate de instalar:
     - ✅ Android SDK
     - ✅ Android SDK Platform (API 33 o superior)
     - ✅ Android Virtual Device (AVD) para emulador

2. **Configurar variables de entorno** (Windows):
   ```
   ANDROID_HOME = C:\Users\TU_USUARIO\AppData\Local\Android\Sdk
   ```
   Agregar a PATH:
   ```
   %ANDROID_HOME%\platform-tools
   %ANDROID_HOME%\tools
   ```

#### Para iOS (solo en Mac):
1. **Instalar Xcode** desde Mac App Store
2. **Instalar Command Line Tools**:
   ```bash
   xcode-select --install
   ```

---

## 🖥️ PASO 2: Iniciar el servidor backend

**MUY IMPORTANTE**: El backend Node.js debe estar corriendo **ANTES** de probar la app móvil.

### Opción A: Servidor en tu PC (para desarrollo)

1. Abre una terminal en la carpeta `/server`:
   ```powershell
   cd server
   node server_FINAL.js
   ```

2. Verifica que el servidor esté corriendo en:
   ```
   http://localhost:3001
   ```

3. **Encuentra tu IP local** (para probar en dispositivo físico):
   
   **Windows**:
   ```powershell
   ipconfig
   ```
   Busca "Dirección IPv4" (ejemplo: `192.168.1.100`)
   
   **Mac/Linux**:
   ```bash
   ifconfig
   ```

4. **Actualiza la URL en `src/app/app.config.ts`** si usas dispositivo físico:
   ```typescript
   function getApiUrl(): string {
     const isNative = Capacitor.isNativePlatform();
     
     if (isNative) {
       // Para dispositivo físico, usa tu IP local:
       return 'http://192.168.1.100:3001'; // ⚠️ Cambia por TU IP
     } else {
       return 'http://localhost:3001';
     }
   }
   ```

---

## 📱 PASO 3: Compilar y ejecutar la app móvil

### Para EMULADOR Android:

1. **Compilar y abrir Android Studio**:
   ```powershell
   npm run android:dev
   ```
   Esto hace:
   - ✅ Compila Angular (`ng build`)
   - ✅ Sincroniza con Capacitor (`cap sync android`)
   - ✅ Abre Android Studio

2. **En Android Studio**:
   - Espera a que termine de indexar (barra de progreso abajo)
   - Click en el botón verde **▶ Run** (o presiona `Shift + F10`)
   - Selecciona un emulador o crea uno nuevo
   - ¡La app se instalará y ejecutará! 🎉

### Para DISPOSITIVO FÍSICO Android:

1. **Habilitar modo desarrollador en tu celular**:
   - Ve a Ajustes → Acerca del teléfono
   - Toca 7 veces en "Número de compilación"
   - Regresa y entra a "Opciones de desarrollador"
   - Activa "Depuración USB"

2. **Conecta tu celular con cable USB**

3. **Actualiza la URL del backend** en `src/app/app.config.ts`:
   ```typescript
   return 'http://TU_IP_LOCAL:3001'; // Ejemplo: 'http://192.168.1.100:3001'
   ```

4. **Compila y ejecuta**:
   ```powershell
   npm run android:run
   ```

5. **Acepta la depuración USB** en tu celular cuando aparezca el mensaje

---

## 🔄 PASO 4: Flujo de trabajo para desarrollo

### Cuando hagas cambios en el código:

1. **Modificas el código** en Angular (HTML, CSS, TypeScript)

2. **Recompila y sincroniza**:
   ```powershell
   npm run build:mobile
   ```

3. **Ejecuta en el emulador/dispositivo**:
   ```powershell
   npm run android:run
   ```

### Atajos útiles:

```powershell
# Solo compilar Angular
npm run build

# Compilar + Sincronizar con Capacitor
npm run build:mobile

# Sincronizar sin compilar (si ya compilaste)
npm run sync

# Abrir Android Studio
npx cap open android

# Ver logs en tiempo real
npx cap run android --livereload --external
```

---

## 🐛 SOLUCIÓN DE PROBLEMAS COMUNES

### ❌ Error: "Cannot connect to server"

**Problema**: La app no se conecta al backend.

**Solución**:
1. ✅ Verifica que el servidor Node.js esté corriendo (`node server_FINAL.js`)
2. ✅ Si usas emulador, la URL debe ser `http://10.0.2.2:3001`
3. ✅ Si usas dispositivo físico:
   - Tu celular y tu PC deben estar en la **misma red WiFi**
   - Usa tu IP local: `http://192.168.1.100:3001`
4. ✅ Verifica que el firewall no esté bloqueando el puerto 3001

### ❌ Error: "Cleartext HTTP traffic not permitted"

**Problema**: Android bloquea conexiones HTTP.

**Solución**: Ya está configurado en `AndroidManifest.xml` y `network_security_config.xml`, pero verifica que estén presentes.

### ❌ La app se ve diferente al web

**Problema**: Estilos no se aplican correctamente.

**Solución**:
1. Verifica que `mobile-styles.css` esté en `src/`
2. Verifica que esté incluido en `angular.json` en la sección `styles`
3. Recompila: `npm run build:mobile`

### ❌ Error: "Android SDK not found"

**Problema**: Android Studio no está configurado.

**Solución**:
1. Instala Android Studio completamente
2. Abre Android Studio → Settings → Android SDK
3. Instala SDK Platform 33 o superior
4. Configura `ANDROID_HOME` en las variables de entorno

---

## 🎨 PERSONALIZACIÓN

### Cambiar el icono de la app:

1. Crea un icono de 1024x1024 px (PNG)
2. Usa una herramienta como [icon.kitchen](https://icon.kitchen/) para generar todos los tamaños
3. Reemplaza los archivos en:
   ```
   android/app/src/main/res/mipmap-*/ic_launcher.png
   ```

### Cambiar el nombre de la app:

1. Edita `capacitor.config.ts`:
   ```typescript
   appName: 'Joinify'  // Cambia el nombre aquí
   ```

2. Edita `android/app/src/main/res/values/strings.xml`:
   ```xml
   <string name="app_name">Joinify</string>
   ```

### Cambiar el Splash Screen:

1. Crea una imagen de 2732x2732 px
2. Reemplázala en:
   ```
   android/app/src/main/res/drawable/splash.png
   ```

---

## 📊 MONITOREO Y DEBUGGING

### Ver logs de la app en tiempo real:

```powershell
# Logs de Android
adb logcat | findstr "Capacitor\|Console"

# Logs específicos de tu app
adb logcat | findstr "Joinify"
```

### Inspeccionar la app con Chrome DevTools:

1. Abre Chrome
2. Ve a: `chrome://inspect`
3. Tu app aparecerá en la lista de dispositivos
4. Click en **"Inspect"** para ver:
   - Console logs
   - Network requests
   - DOM elements
   - LocalStorage

---

## 🚀 COMPILAR PARA PRODUCCIÓN

### Generar APK firmado (Android):

1. **Compila la app**:
   ```powershell
   npm run build
   npx cap sync android
   ```

2. **Abre Android Studio**:
   ```powershell
   npx cap open android
   ```

3. **Genera el APK/Bundle**:
   - Build → Generate Signed Bundle / APK
   - Sigue el asistente para crear tu keystore
   - Selecciona "release" como build variant
   - ¡Tu APK estará listo en `android/app/release/`!

---

## 📝 CHECKLIST DE DESPLIEGUE

Antes de subir a producción:

- [ ] Cambiar URLs de desarrollo a producción en `app.config.ts`
- [ ] Deshabilitar `cleartextTrafficPermitted` en `network_security_config.xml`
- [ ] Cambiar `android:usesCleartextTraffic="false"` en `AndroidManifest.xml`
- [ ] Actualizar versión en `capacitor.config.ts` y `package.json`
- [ ] Generar icono y splash screen profesionales
- [ ] Firmar el APK con tu keystore de producción
- [ ] Probar en múltiples dispositivos y versiones de Android

---

## 🆘 NECESITAS AYUDA?

### Recursos útiles:
- 📚 Documentación oficial de Capacitor: https://capacitorjs.com/docs
- 🐛 Troubleshooting Android: https://capacitorjs.com/docs/android/troubleshooting
- 💬 Comunidad: https://ionic.link/discord

---

## 🎉 ¡LISTO!

Tu aplicación Joinify ahora funciona como:
- ✅ Aplicación web (http://localhost:4200)
- ✅ Aplicación móvil Android
- ✅ Aplicación móvil iOS (requiere Mac)

**Las peticiones HTTP al backend funcionan EXACTAMENTE IGUAL**, solo que ahora detecta automáticamente si está en web o móvil y ajusta la URL del servidor.

---

**Desarrollado con ❤️ usando Angular + Capacitor**
