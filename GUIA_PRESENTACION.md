# 📸 GUÍA PARA PRESENTACIÓN DE PRUEBAS UNITARIAS

## 🎓 Para tu Defensa de Tesina

---

## 📋 Checklist Pre-Presentación

Antes de presentar a tu profesor, asegúrate de:

- [ ] Haber ejecutado todas las pruebas al menos una vez
- [ ] Tener VS Code abierto con los archivos de pruebas
- [ ] Tener una terminal PowerShell lista
- [ ] Verificar que Node.js y npm están instalados
- [ ] Revisar que todas las dependencias están instaladas

---

## 🎬 Secuencia de Demostración Sugerida

### 1️⃣ Introducción (2 minutos)
**Qué decir:**
> "Implementé pruebas unitarias tanto para el frontend (Angular) como para el backend (Node.js) de mi sistema Joinify. En total son 23 pruebas automatizadas que validan funcionalidad crítica del sistema."

### 2️⃣ Mostrar Código de Pruebas (3 minutos)

**Archivo 1: Backend**
```powershell
# En VS Code, abrir:
server/utils/encryption.test.js
```

**Explicar:**
- "Aquí tengo 15 pruebas para funciones del servidor"
- "Incluyen encriptación/desencriptación de contraseñas"
- "Validación de emails y contraseñas seguras"
- "Cálculos de costos por usuario"

**Mostrar estructura de una prueba:**
```javascript
test('debe encriptar un texto correctamente', () => {
    // Arrange: Preparar datos
    const textoOriginal = 'MiContraseñaSegura123';
    
    // Act: Ejecutar función
    const textoEncriptado = encryptText(textoOriginal);
    
    // Assert: Verificar resultado
    expect(textoEncriptado).not.toBe(textoOriginal);
});
```

**Archivo 2: Frontend**
```powershell
# En VS Code, abrir:
src/app/unirgrupo/unirgrupo.component.spec.ts
```

**Explicar:**
- "Para el frontend tengo 8 pruebas del componente UnirGrupoComponent"
- "Pruebo los métodos de filtrado y búsqueda de grupos"
- "Valido que los filtros se apliquen correctamente"

### 3️⃣ Ejecutar Pruebas en Vivo (5 minutos)

**Terminal 1: Pruebas de Backend**
```powershell
cd server
npm test
```

**Qué mostrar:**
✅ Esperar a que aparezcan las 15 pruebas PASSED
✅ Señalar los emojis y mensajes de éxito
✅ Mencionar el tiempo de ejecución (~1 segundo)

**Terminal 2: Pruebas de Frontend**
```powershell
# Volver a la raíz
cd ..
npm test -- --browsers=ChromeHeadless --watch=false
```

**Qué mostrar:**
✅ Esperar a que aparezcan las 8 pruebas PASSED
✅ Mostrar el resumen final
✅ Explicar que Karma ejecuta las pruebas en Chrome

### 4️⃣ Mostrar Cobertura (Opcional - 2 minutos)

Si tu profesor pregunta por cobertura de código:

```powershell
cd server
npm run test:coverage
```

Esto generará un reporte HTML en `server/coverage/lcov-report/index.html`

---

## 💡 Preguntas Frecuentes que Puede Hacer tu Profesor

### ❓ "¿Por qué elegiste estos frameworks?"

**Respuesta:**
> "Para Angular elegí Jasmine y Karma porque vienen integrados por defecto y son el estándar de la industria para testing en Angular. Para Node.js elegí Jest porque es el framework más popular, tiene excelente documentación y es muy fácil de usar."

### ❓ "¿Qué tipo de pruebas son estas?"

**Respuesta:**
> "Son pruebas unitarias. Esto significa que pruebo cada función o método de forma aislada para verificar que funcionan correctamente. No son pruebas de integración ni end-to-end."

### ❓ "¿Cómo sabes que las pruebas son buenas?"

**Respuesta:**
> "Cada prueba sigue el patrón AAA (Arrange-Act-Assert):
> 1. Arrange: Preparo los datos de prueba
> 2. Act: Ejecuto la función
> 3. Assert: Verifico que el resultado sea el esperado
>
> Además, pruebo casos exitosos y casos de error para validar el manejo de excepciones."

### ❓ "¿Puedes agregar una prueba nueva en este momento?"

**Respuesta (si te lo piden):**
> "Claro, déjame agregar una prueba para validar que no se pueden crear grupos con costo negativo..."

Luego puedes agregar algo como:

```javascript
test('debe rechazar costos negativos', () => {
    const costoPorUsuario = calcularCostoPorUsuario(-100, 4);
    expect(costoPorUsuario).toBe(0);
});
```

Y ejecutar `npm test` de nuevo.

---

## 🖼️ Capturas Recomendadas para tu Documento

Toma estas capturas para tu tesina:

1. **Captura 1:** Terminal con resultado de `npm test` en /server (todas las pruebas pasadas)
2. **Captura 2:** Terminal con resultado de `npm test` en frontend (todas las pruebas pasadas)
3. **Captura 3:** Código del archivo `encryption.test.js` mostrando las pruebas
4. **Captura 4:** Código del archivo `unirgrupo.component.spec.ts` mostrando las pruebas
5. **Captura 5:** Reporte de cobertura (si lo generas)

---

## ✅ Estructura para Sección de Pruebas en tu Tesina

### Capítulo: Pruebas Unitarias

**4.1 Introducción**
- Importancia de las pruebas en el desarrollo de software
- Frameworks utilizados (Jasmine/Karma y Jest)

**4.2 Pruebas de Backend**
- Descripción de funciones testeadas
- Explicación de casos de prueba
- Resultados obtenidos

**4.3 Pruebas de Frontend**
- Descripción de componentes testeados
- Explicación de métodos probados
- Resultados obtenidos

**4.4 Ejecución de Pruebas**
- Comandos para ejecutar las pruebas
- Interpretación de resultados
- Capturas de pantalla

**4.5 Conclusiones**
- Cobertura de código
- Beneficios de implementar pruebas
- Mejoras futuras

---

## 🎯 Puntos Clave para Destacar

1. **Automatización:** "Las pruebas se ejecutan automáticamente, no necesito probar manualmente"

2. **Confiabilidad:** "Si modifico el código, puedo ejecutar las pruebas para asegurar que no rompí nada"

3. **Documentación viva:** "Las pruebas sirven como documentación de cómo deben funcionar las funciones"

4. **Calidad de código:** "Implementar pruebas me obligó a escribir código más limpio y modular"

5. **Industria real:** "Estos frameworks (Jest, Jasmine) son los mismos que usan empresas como Netflix, Uber y Facebook"

---

## 🚀 Tips para Ejecutar sin Errores

### Antes de la Presentación:

1. **Limpia node_modules si es necesario:**
```powershell
rm -r node_modules
npm install
```

2. **Ejecuta las pruebas varias veces:**
```powershell
npm test
```

3. **Cierra otros programas:**
- Cierra Chrome/navegadores abiertos
- Cierra otras instancias de VS Code
- Libera el puerto 9876 (usado por Karma)

4. **Ten un plan B:**
- Si falla algo en vivo, muestra las capturas
- Ten los comandos copiados en un archivo .txt
- Graba un video de las pruebas funcionando

---

## 📱 Si Algo Sale Mal

### Error: "Port 9876 already in use"
```powershell
# Reinicia VS Code o ejecuta:
taskkill /F /IM node.exe
```

### Error: "Cannot find module"
```powershell
npm install
```

### Error: "Chrome not found"
```powershell
# Usa Firefox en su lugar:
npm test -- --browsers=Firefox
```

---

## 🎉 Mensaje Final

**Recuerda:**
- Habla con confianza
- Si no sabes algo, di "No lo sé, pero puedo investigarlo"
- Muestra entusiasmo por tu proyecto
- Las pruebas demuestran profesionalismo

**¡Mucho éxito en tu defensa! 🎓✨**

---

## 📞 Último Recurso

Si durante la presentación algo falla completamente:

**Backup Plan:**
1. Muestra las capturas de pantalla ya tomadas
2. Explica el código de las pruebas línea por línea
3. Menciona que las pruebas funcionaron antes (muestra el historial de Git si es posible)
4. Ofrece correr las pruebas después de la presentación

**No entres en pánico. Lo importante es que demuestres que ENTIENDES las pruebas, no solo que las ejecutes.**
