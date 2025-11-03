# 🎯 COMANDOS RÁPIDOS - PRUEBAS UNITARIAS

## Para el Profesor - Ejecución Rápida

### 📌 BACKEND (Node.js)
```powershell
cd server
npm test
```

**Resultado esperado:** 15 pruebas PASSED ✅

---

### 📌 FRONTEND (Angular)
```powershell
npm test -- --browsers=ChromeHeadless --watch=false
```

**Resultado esperado:** 8 pruebas PASSED ✅

---

## 📊 Resumen Total
- **Backend:** 15 pruebas unitarias
- **Frontend:** 8 pruebas unitarias
- **Total:** 23 pruebas unitarias

## 📁 Archivos de Pruebas
- **Backend:** `server/utils/encryption.test.js`
- **Frontend:** `src/app/unirgrupo/unirgrupo.component.spec.ts`

## 🔧 Funciones/Métodos Testeados

### Backend:
- `encryptText()` - Encriptación AES-256
- `decryptText()` - Desencriptación AES-256  
- `validarEmail()` - Validación de emails
- `calcularCostoPorUsuario()` - Cálculos de costos
- `validarPassword()` - Validación de contraseñas

### Frontend:
- `limpiarFiltros()` - Limpiar filtros de búsqueda
- `aplicarTodosFiltros()` - Aplicar filtros combinados
- `seleccionarPlataforma()` - Seleccionar plataforma

---

## ⚡ Comandos Alternativos

### Backend con cobertura de código:
```powershell
cd server
npm run test:coverage
```

### Frontend en modo interactivo:
```powershell
npm test
```

---

**Documentación completa en:** `GUIA_PRUEBAS_UNITARIAS.md`
