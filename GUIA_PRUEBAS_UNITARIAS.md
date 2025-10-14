# 📋 GUÍA DE PRUEBAS UNITARIAS - PROYECTO JOINIFY
**Tesina - Sistema de Suscripciones Compartidas**

---

## 📚 Índice
1. [Requisitos Previos](#requisitos-previos)
2. [Pruebas de Frontend (Angular)](#pruebas-de-frontend-angular)
3. [Pruebas de Backend (Node.js)](#pruebas-de-backend-nodejs)
4. [Resumen de Pruebas Implementadas](#resumen-de-pruebas-implementadas)
5. [Solución de Problemas](#solución-de-problemas)

---

## ✅ Requisitos Previos

Asegúrate de tener instalado:
- Node.js (v18 o superior)
- npm (v9 o superior)
- Angular CLI (v19 o superior)

---

## 🎨 Pruebas de Frontend (Angular)

### 📍 Ubicación de las Pruebas
```
src/app/unirgrupo/unirgrupo.component.spec.ts
```

### 🎯 Métodos Testeados

Las pruebas cubren los siguientes métodos del componente `UnirGrupoComponent`:

1. **`limpiarFiltros()`** - Limpia todos los filtros activos
2. **`aplicarTodosFiltros()`** - Aplica filtros de búsqueda y plataforma
3. **`seleccionarPlataforma()`** - Selecciona una plataforma específica
4. **Validación de plataformas disponibles** - Verifica la lista de plataformas

### 🚀 Cómo Ejecutar las Pruebas de Angular

#### Opción 1: Ejecutar todas las pruebas (Modo Headless - Sin navegador visible)
```powershell
npm test -- --browsers=ChromeHeadless --watch=false
```

#### Opción 2: Ejecutar todas las pruebas (Modo Interactivo - Con navegador)
```powershell
npm test
```

#### Opción 3: Ejecutar solo las pruebas de UnirGrupoComponent
```powershell
npm test -- --include='**/unirgrupo.component.spec.ts' --browsers=ChromeHeadless --watch=false
```

### 📊 Resultados Esperados

Al ejecutar las pruebas, deberías ver algo como:

```
UnirGrupoComponent - Pruebas Unitarias
  ✓ debe crear el componente correctamente
  Prueba del método limpiarFiltros()
    ✓ debe limpiar todos los filtros y restaurar grupos disponibles
  Prueba del método aplicarTodosFiltros() - Filtro por búsqueda
    ✓ debe filtrar grupos por término de búsqueda en el nombre
    ✓ debe filtrar grupos por término de búsqueda en el tipo de servicio
  Prueba del método aplicarTodosFiltros() - Filtro por plataforma
    ✓ debe filtrar grupos por plataforma seleccionada
  Prueba del método aplicarTodosFiltros() - Múltiples filtros combinados
    ✓ debe aplicar tanto búsqueda como filtro de plataforma simultáneamente
  Prueba del método seleccionarPlataforma()
    ✓ debe establecer la plataforma seleccionada y aplicar filtros
  Prueba de plataformas disponibles
    ✓ debe tener al menos 40 plataformas disponibles

Total: 8 pruebas PASSED
```

---

## 🔧 Pruebas de Backend (Node.js)

### 📍 Ubicación de las Pruebas
```
server/utils/encryption.test.js
server/utils/encryption.js (funciones a testear)
```

### 🎯 Funciones Testeadas

Las pruebas cubren las siguientes funciones del backend:

1. **`encryptText()`** - Encripta texto usando AES-256-CBC
2. **`decryptText()`** - Desencripta texto encriptado
3. **`validarEmail()`** - Valida formato de correo electrónico
4. **`calcularCostoPorUsuario()`** - Calcula costo dividido entre usuarios
5. **`validarPassword()`** - Valida seguridad de contraseñas

### 🚀 Cómo Ejecutar las Pruebas de Node.js

#### Navegar a la carpeta del servidor
```powershell
cd server
```

#### Opción 1: Ejecutar todas las pruebas
```powershell
npm test
```

#### Opción 2: Ejecutar pruebas en modo watch (se ejecutan al guardar cambios)
```powershell
npm run test:watch
```

#### Opción 3: Ejecutar pruebas con cobertura de código
```powershell
npm run test:coverage
```

### 📊 Resultados Esperados

Al ejecutar las pruebas, deberías ver algo como:

```
 PASS  utils/encryption.test.js
  🔐 Pruebas de Encriptación y Desencriptación
    ✓ debe encriptar un texto correctamente (5 ms)
    ✓ debe desencriptar un texto encriptado correctamente (3 ms)
    ✓ debe mantener la integridad del texto tras encriptar y desencriptar (8 ms)
    ✓ debe manejar correctamente valores vacíos o nulos (2 ms)
  📧 Pruebas de Validación de Email
    ✓ debe validar correctamente emails válidos (3 ms)
    ✓ debe rechazar emails inválidos (2 ms)
  💰 Pruebas de Cálculo de Costos
    ✓ debe calcular correctamente el costo por usuario (1 ms)
    ✓ debe redondear correctamente costos con decimales (1 ms)
    ✓ debe retornar 0 con valores inválidos (1 ms)
  🔒 Pruebas de Validación de Contraseña
    ✓ debe aceptar contraseñas seguras (2 ms)
    ✓ debe rechazar contraseñas muy cortas (1 ms)
    ✓ debe rechazar contraseñas sin mayúsculas (1 ms)
    ✓ debe rechazar contraseñas sin minúsculas (1 ms)
    ✓ debe rechazar contraseñas sin números (1 ms)
    ✓ debe rechazar contraseñas vacías o nulas (1 ms)

Test Suites: 1 passed, 1 total
Tests:       15 passed, 15 total
Time:        2.345 s
```

---

## 📋 Resumen de Pruebas Implementadas

### Frontend (Angular) - 8 pruebas
| # | Descripción | Método Testeado |
|---|-------------|----------------|
| 1 | Creación del componente | Constructor |
| 2 | Limpiar todos los filtros | `limpiarFiltros()` |
| 3 | Filtrar por nombre de grupo | `aplicarTodosFiltros()` |
| 4 | Filtrar por tipo de servicio | `aplicarTodosFiltros()` |
| 5 | Filtrar por plataforma | `aplicarTodosFiltros()` |
| 6 | Aplicar múltiples filtros | `aplicarTodosFiltros()` |
| 7 | Seleccionar plataforma | `seleccionarPlataforma()` |
| 8 | Validar lista de plataformas | Array de plataformas |

### Backend (Node.js) - 15 pruebas
| # | Descripción | Función Testeada |
|---|-------------|------------------|
| 1 | Encriptar texto | `encryptText()` |
| 2 | Desencriptar texto | `decryptText()` |
| 3 | Ciclo completo encriptar/desencriptar | Ambas funciones |
| 4 | Manejo de valores vacíos en encriptación | Ambas funciones |
| 5 | Validar emails correctos | `validarEmail()` |
| 6 | Rechazar emails inválidos | `validarEmail()` |
| 7 | Calcular costo por usuario | `calcularCostoPorUsuario()` |
| 8 | Redondear decimales en costos | `calcularCostoPorUsuario()` |
| 9 | Manejo de valores inválidos en cálculos | `calcularCostoPorUsuario()` |
| 10 | Validar contraseña segura | `validarPassword()` |
| 11 | Rechazar contraseña corta | `validarPassword()` |
| 12 | Rechazar sin mayúsculas | `validarPassword()` |
| 13 | Rechazar sin minúsculas | `validarPassword()` |
| 14 | Rechazar sin números | `validarPassword()` |
| 15 | Rechazar valores vacíos/nulos | `validarPassword()` |

**Total: 23 pruebas unitarias**

---

## 🛠️ Solución de Problemas

### Problema: "Error: Cannot find module 'jest'"
**Solución:**
```powershell
cd server
npm install
```

### Problema: "Karma browser not found"
**Solución:**
```powershell
npm install --save-dev karma-chrome-launcher
```

### Problema: Las pruebas de Angular no se ejecutan
**Solución:**
Asegúrate de estar en la raíz del proyecto (no en /server):
```powershell
cd ..
npm test
```

### Problema: Puerto 9876 en uso (Karma)
**Solución:**
Detén cualquier proceso previo de Karma o reinicia VS Code.

---

## 📸 Capturas de Pantalla Sugeridas para tu Tesina

Para documentar las pruebas en tu tesina, toma capturas de:

1. **Terminal ejecutando pruebas de Angular** con todos los tests pasados
2. **Terminal ejecutando pruebas de Node.js** con todos los tests pasados  
3. **Reporte de cobertura** (`npm run test:coverage` en /server)
4. **Código de las pruebas** mostrando los métodos `it()` y `expect()`

---

## 📞 Contacto y Soporte

Si tienes problemas ejecutando las pruebas:
1. Verifica que tengas todas las dependencias instaladas
2. Asegúrate de estar en el directorio correcto
3. Revisa que Node.js y npm estén actualizados

---

## ✅ Lista de Verificación para tu Profesor

- [x] Pruebas unitarias implementadas para **al menos una función** ✅
- [x] Pruebas ejecutables desde la **consola** ✅
- [x] Documentación clara de cómo ejecutar las pruebas ✅
- [x] Pruebas tanto para **Frontend** como **Backend** ✅
- [x] Uso de frameworks estándar de la industria (Jasmine/Karma y Jest) ✅
- [x] Resultados visibles y verificables ✅

---

**¡Éxito en tu defensa de tesina! 🎓**
