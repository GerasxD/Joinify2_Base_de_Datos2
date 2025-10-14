/**
 * 🧪 PRUEBAS UNITARIAS - Funciones del Servidor Joinify
 * 
 * Este archivo contiene pruebas unitarias para funciones REALES del servidor.
 * Todas las funciones testeadas existen en server_FINAL.js
 * 
 * Funciones testeadas:
 * 1. encryptText() - Encriptación de texto (línea 88 server_FINAL.js)
 * 2. decryptText() - Desencriptación de texto (línea 110 server_FINAL.js)
 * 3. esMensajePermitido() - Validación de mensajes (línea 190 server_FINAL.js)
 * 
 * Framework: Jest
 * Patrón: AAA (Arrange-Act-Assert)
 */

const {
    encryptText,
    decryptText,
    esMensajePermitido,
    mensajesPermitidos
} = require('./serverFunctions');

// ============================================
// 🔐 PRUEBAS DE ENCRIPTACIÓN Y DESENCRIPTACIÓN
// ============================================

describe('🔐 Pruebas de Encriptación y Desencriptación', () => {
    
    test('debe encriptar un texto correctamente', () => {
        // Arrange: Preparar datos de prueba
        const textoOriginal = 'MiContraseñaSegura123';
        
        // Act: Ejecutar la función
        const textoEncriptado = encryptText(textoOriginal);
        
        // Assert: Verificar resultados
        expect(textoEncriptado).toBeDefined();
        expect(textoEncriptado).not.toBe(textoOriginal); // No debe ser igual al original
        expect(textoEncriptado).toContain(':'); // Debe contener el separador iv:encrypted
        expect(typeof textoEncriptado).toBe('string');
        
        console.log('✅ Texto encriptado correctamente:', textoEncriptado.substring(0, 20) + '...');
    });
    
    test('debe desencriptar un texto encriptado correctamente', () => {
        // Arrange: Encriptar primero un texto
        const textoOriginal = 'Netflix2024Pass';
        const textoEncriptado = encryptText(textoOriginal);
        
        // Act: Desencriptar
        const textoDesencriptado = decryptText(textoEncriptado);
        
        // Assert: Debe recuperar el texto original
        expect(textoDesencriptado).toBe(textoOriginal);
        
        console.log('✅ Texto desencriptado correctamente:', textoDesencriptado);
    });
    
    test('debe mantener la integridad del texto tras encriptar y desencriptar', () => {
        // Arrange: Array de diferentes textos para probar
        const textosPrueba = [
            'password123',
            'DisneyPlus@2024',
            'Mi Contraseña Con Espacios',
            '!@#$%^&*()_+{}[]',
            'contraseña con ñ y acentos'
        ];
        
        // Act & Assert: Probar cada texto
        textosPrueba.forEach(texto => {
            const encriptado = encryptText(texto);
            const desencriptado = decryptText(encriptado);
            expect(desencriptado).toBe(texto);
        });
        
        console.log(`✅ ${textosPrueba.length} textos mantienen integridad tras encriptar/desencriptar`);
    });
    
    test('debe manejar correctamente valores vacíos o nulos', () => {
        // Arrange & Act & Assert
        expect(encryptText('')).toBe('');
        expect(encryptText(null)).toBe('');
        expect(decryptText('')).toBe('No disponible');
        expect(decryptText(null)).toBe('No disponible');
        
        console.log('✅ Valores vacíos/nulos manejados correctamente');
    });
    
    test('debe manejar texto plano sin formato de encriptación', () => {
        // Arrange: Texto sin formato iv:encrypted
        const textoPlano = 'ContraseñaPlana123';
        
        // Act: Intentar desencriptar texto plano
        const resultado = decryptText(textoPlano);
        
        // Assert: Debe devolver el texto tal cual (asumiendo que ya está desencriptado)
        expect(resultado).toBe(textoPlano);
        
        console.log('✅ Texto plano sin formato manejado correctamente');
    });
    
    test('debe rechazar formatos de encriptación inválidos', () => {
        // Arrange: Datos con formato inválido
        const formatoInvalido = 'parte1:parte2:parte3:parte4:parte5';
        
        // Act: Intentar desencriptar
        const resultado = decryptText(formatoInvalido);
        
        // Assert: Debe devolver mensaje de error
        expect(resultado).toBe('Formato de encriptación inválido');
        
        console.log('✅ Formato inválido rechazado correctamente');
    });
});

// ============================================
// 📧 PRUEBAS DE VALIDACIÓN DE MENSAJES
// ============================================

describe('📧 Pruebas de Validación de Mensajes Permitidos', () => {
    
    test('debe aceptar todos los mensajes permitidos del sistema', () => {
        // Arrange & Act & Assert
        // Verificar que TODOS los mensajes de la lista sean aceptados
        expect(esMensajePermitido("Recibiste pago.")).toBe(true);
        expect(esMensajePermitido("Nuevo integrante añadido.")).toBe(true);
        expect(esMensajePermitido("Grupo lleno.")).toBe(true);
        expect(esMensajePermitido("Tu pago fue recibido.")).toBe(true);
        expect(esMensajePermitido("Se ha actualizado el grupo.")).toBe(true);
        expect(esMensajePermitido("Se elimino el grupo.")).toBe(true);
        expect(esMensajePermitido("Pago pendiente.")).toBe(true);
        
        console.log(`✅ Todos los ${mensajesPermitidos.length} mensajes permitidos fueron aceptados`);
    });
    
    test('debe rechazar mensajes no permitidos', () => {
        // Arrange: Mensajes que NO están en la lista
        const mensajesInvalidos = [
            "Mensaje no autorizado",
            "Hack attempt",
            "Script injection <script>",
            "Recibiste pago", // Sin punto final
            "RECIBISTE PAGO.", // Mayúsculas
            ""
        ];
        
        // Act & Assert: Todos deben ser rechazados
        mensajesInvalidos.forEach(mensaje => {
            expect(esMensajePermitido(mensaje)).toBe(false);
        });
        
        console.log(`✅ ${mensajesInvalidos.length} mensajes no permitidos fueron rechazados`);
    });
    
    test('debe validar que la lista de mensajes tiene exactamente 7 elementos', () => {
        // Arrange & Act
        const numeroMensajes = mensajesPermitidos.length;
        
        // Assert: Debe haber exactamente 7 mensajes permitidos
        expect(numeroMensajes).toBe(7);
        
        console.log(`✅ Lista contiene ${numeroMensajes} mensajes permitidos (correcto)`);
    });
    
    test('debe ser sensible a mayúsculas y minúsculas', () => {
        // Arrange
        const mensajeOriginal = "Recibiste pago.";
        const mensajeMayusculas = "RECIBISTE PAGO.";
        const mensajeMinusculas = "recibiste pago.";
        
        // Act & Assert
        expect(esMensajePermitido(mensajeOriginal)).toBe(true);
        expect(esMensajePermitido(mensajeMayusculas)).toBe(false);
        expect(esMensajePermitido(mensajeMinusculas)).toBe(false);
        
        console.log('✅ Validación sensible a mayúsculas/minúsculas funciona correctamente');
    });
    
    test('debe rechazar mensajes con espacios extra', () => {
        // Arrange: Mensajes con espacios adicionales
        const mensajeConEspacios = " Recibiste pago. ";
        const mensajeOriginal = "Recibiste pago.";
        
        // Act & Assert
        expect(esMensajePermitido(mensajeOriginal)).toBe(true);
        expect(esMensajePermitido(mensajeConEspacios)).toBe(false);
        
        console.log('✅ Mensajes con espacios extra son rechazados correctamente');
    });
});

// ============================================
// 📊 RESUMEN DE PRUEBAS
// ============================================

afterAll(() => {
    console.log('\n' + '='.repeat(60));
    console.log('📊 RESUMEN DE PRUEBAS UNITARIAS - JOINIFY');
    console.log('='.repeat(60));
    console.log('✅ Funciones testeadas:');
    console.log('   1. encryptText() - Encriptación AES-256-CBC');
    console.log('   2. decryptText() - Desencriptación AES-256-CBC');
    console.log('   3. esMensajePermitido() - Validación de mensajes');
    console.log('\n📝 Total de pruebas: 11');
    console.log('🎯 Origen: server_FINAL.js (funciones REALES)');
    console.log('='.repeat(60) + '\n');
});
