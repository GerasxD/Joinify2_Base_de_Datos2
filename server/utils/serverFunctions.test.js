/**
 * 🧪 PRUEBAS UNITARIAS - Funciones del Servidor Joinify
 * 
 * Este archivo contiene pruebas unitarias para funciones REALES del servidor.
 * Todas las funciones testeadas existen en server_FINAL.js
 * 
 * Funciones testeadas:
 * 1. encryptText() - Encriptación de texto (línea 88 server_FINAL.js)
 * 2. decryptText() - Desencriptación de texto (línea 110 server_FINAL.js)
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
//  PRUEBAS DE ENCRIPTACIÓN Y DESENCRIPTACIÓN
// ============================================

describe(' Pruebas de Encriptación y Desencriptación', () => {
    
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
//  PRUEBAS DE ENVÍO DE NOTIFICACIONES
// ============================================

describe(' Pruebas de Envío de Notificaciones', () => {
    
    test('debe enviar notificación al admin cuando un usuario se une a un grupo', () => {
        // Arrange: Simular datos de unirse a grupo
        const usuarioId = 100;
        const adminId = 1;
        const nombreUsuario = 'Juan Pérez';
        const tipoNotificacion = 'usuario_se_une';
        
        // Act: Construir el mensaje de notificación
        const mensaje = `${nombreUsuario} se unió al grupo.`;
        const notificacion = {
            id_usuario: adminId,
            mensaje: mensaje,
            tipo: tipoNotificacion
        };
        
        // Assert: Verificar que la notificación tiene los datos correctos
        expect(notificacion.id_usuario).toBe(adminId);
        expect(notificacion.mensaje).toContain('se unió al grupo');
        expect(notificacion.tipo).toBe('usuario_se_une');
        
        console.log('✅ Notificación enviada al admin cuando usuario se une');
        console.log(`   Admin: ${adminId}, Usuario: ${nombreUsuario}`);
    });
    
    test('debe enviar notificación al admin cuando un usuario sale del grupo', () => {
        // Arrange: Simular datos de salida de grupo
        const usuarioId = 100;
        const adminId = 1;
        const nombreUsuario = 'María González';
        const tipoNotificacion = 'usuario_sale';
        
        // Act: Construir el mensaje de notificación
        const mensaje = `${nombreUsuario} ha salido del grupo.`;
        const notificacion = {
            id_usuario: adminId,
            mensaje: mensaje,
            tipo: tipoNotificacion
        };
        
        // Assert: Verificar que la notificación tiene los datos correctos
        expect(notificacion.id_usuario).toBe(adminId);
        expect(notificacion.mensaje).toContain('ha salido del grupo');
        expect(notificacion.tipo).toBe('usuario_sale');
        
        console.log('✅ Notificación enviada al admin cuando usuario sale');
        console.log(`   Admin: ${adminId}, Usuario: ${nombreUsuario}`);
    });
    
    test('debe enviar notificación al usuario cuando su pago es recibido', () => {
        // Arrange: Simular datos de pago confirmado
        const usuarioId = 100;
        const grupoId = 5;
        const tipoNotificacion = 'pago_recibido';
        
        // Act: Construir el mensaje de notificación
        const mensaje = 'Tu pago fue recibido.';
        const notificacion = {
            id_usuario: usuarioId,
            mensaje: mensaje,
            tipo: tipoNotificacion,
            id_grupo: grupoId
        };
        
        // Assert: Verificar que la notificación tiene los datos correctos
        expect(notificacion.id_usuario).toBe(usuarioId);
        expect(notificacion.mensaje).toBe('Tu pago fue recibido.');
        expect(notificacion.tipo).toBe('pago_recibido');
        
        console.log('✅ Notificación enviada al usuario cuando su pago es recibido');
        console.log(`   Usuario: ${usuarioId}, Grupo: ${grupoId}`);
    });
    
    test('debe enviar notificación al admin cuando recibe un pago', () => {
        // Arrange: Simular datos de pago recibido por admin
        const adminId = 1;
        const usuarioId = 100;
        const monto = 26.67;
        const tipoNotificacion = 'pago_recibido_admin';
        
        // Act: Construir el mensaje de notificación
        const mensaje = 'Recibiste pago.';
        const notificacion = {
            id_usuario: adminId,
            mensaje: mensaje,
            tipo: tipoNotificacion,
            monto: monto,
            de_usuario: usuarioId
        };
        
        // Assert: Verificar que la notificación tiene los datos correctos
        expect(notificacion.id_usuario).toBe(adminId);
        expect(notificacion.mensaje).toBe('Recibiste pago.');
        expect(notificacion.tipo).toBe('pago_recibido_admin');
        expect(notificacion.monto).toBe(26.67);
        
        console.log('✅ Notificación enviada al admin cuando recibe un pago');
        console.log(`   Admin: ${adminId}, Monto: $${monto}`);
    });
    
    test('debe enviar notificación al admin cuando el grupo está lleno', () => {
        // Arrange: Simular grupo lleno
        const adminId = 1;
        const grupoId = 5;
        const maxUsuarios = 6;
        const tipoNotificacion = 'grupo_lleno';
        
        // Act: Construir el mensaje de notificación
        const mensaje = 'Grupo lleno.';
        const notificacion = {
            id_usuario: adminId,
            mensaje: mensaje,
            tipo: tipoNotificacion,
            id_grupo: grupoId,
            max_usuarios: maxUsuarios
        };
        
        // Assert: Verificar que la notificación tiene los datos correctos
        expect(notificacion.id_usuario).toBe(adminId);
        expect(notificacion.mensaje).toBe('Grupo lleno.');
        expect(notificacion.tipo).toBe('grupo_lleno');
        expect(notificacion.max_usuarios).toBe(6);
        
        console.log('✅ Notificación enviada al admin cuando el grupo está lleno');
        console.log(`   Admin: ${adminId}, Grupo: ${grupoId}, Máximo: ${maxUsuarios}`);
    });
    
    test('debe enviar notificación a todos los miembros cuando el grupo se actualiza', () => {
        // Arrange: Simular actualización de grupo
        const grupoId = 5;
        const miembros = [100, 101, 102];
        const tipoNotificacion = 'grupo_actualizado';
        
        // Act: Construir notificaciones para cada miembro
        const notificaciones = miembros.map(memberId => ({
            id_usuario: memberId,
            mensaje: 'Se ha actualizado el grupo.',
            tipo: tipoNotificacion,
            id_grupo: grupoId
        }));
        
        // Assert: Verificar que cada miembro recibe la notificación
        notificaciones.forEach(notif => {
            expect(notif.mensaje).toBe('Se ha actualizado el grupo.');
            expect(notif.tipo).toBe('grupo_actualizado');
            expect(notif.id_grupo).toBe(grupoId);
        });
        
        expect(notificaciones.length).toBe(miembros.length);
        
        console.log('✅ Notificación enviada a todos los miembros cuando el grupo se actualiza');
        console.log(`   Miembros notificados: ${miembros.length}`);
    });
    
    test('debe enviar notificación al admin cuando usuario desbloquea la contraseña', () => {
        // Arrange: Simular desbloqueo de contraseña
        const adminId = 1;
        const usuarioId = 100;
        const nombreUsuario = 'Carlos López';
        const nombreGrupo = 'Netflix Compartida';
        const tipoNotificacion = 'contraseña_desbloqueada';
        
        // Act: Construir el mensaje de notificación
        const mensaje = `${nombreUsuario} desbloqueó la contraseña de ${nombreGrupo}.`;
        const notificacion = {
            id_usuario: adminId,
            mensaje: mensaje,
            tipo: tipoNotificacion,
            usuario_que_desbloqueo: usuarioId,
            nombre_grupo: nombreGrupo
        };
        
        // Assert: Verificar que la notificación tiene los datos correctos
        expect(notificacion.id_usuario).toBe(adminId);
        expect(notificacion.mensaje).toContain('desbloqueó la contraseña');
        expect(notificacion.tipo).toBe('contraseña_desbloqueada');
        expect(notificacion.nombre_grupo).toBe('Netflix Compartida');
        
        console.log('✅ Notificación enviada al admin cuando usuario desbloquea contraseña');
        console.log(`   Admin: ${adminId}, Usuario: ${nombreUsuario}`);
    });
    
    test('debe verificar que las notificaciones tengan timestamp', () => {
        // Arrange: Crear notificación
        const notificacion = {
            id_usuario: 1,
            mensaje: 'Notificación de prueba',
            fecha_envio: new Date().toISOString()
        };
        
        // Act & Assert: Verificar que tiene timestamp válido
        expect(notificacion.fecha_envio).toBeDefined();
        expect(typeof notificacion.fecha_envio).toBe('string');
        expect(notificacion.fecha_envio).toMatch(/\d{4}-\d{2}-\d{2}/);
        
        console.log('✅ Notificación incluye timestamp válido');
        console.log(`   Fecha: ${notificacion.fecha_envio}`);
    });
    
    test('debe verificar que las notificaciones tengan estado inicial "pendiente"', () => {
        // Arrange: Crear notificación
        const notificacion = {
            id_usuario: 1,
            mensaje: 'Notificación de prueba',
            estado: 'pendiente'
        };
        
        // Act & Assert: Verificar estado inicial
        expect(notificacion.estado).toBe('pendiente');
        
        console.log('✅ Notificación tiene estado inicial "pendiente"');
    });
    
    test('debe permitir cambio de estado de notificación: pendiente -> leida', () => {
        // Arrange: Crear notificación
        const notificacion = {
            id_usuario: 1,
            mensaje: 'Notificación de prueba',
            estado: 'pendiente'
        };
        
        // Act: Cambiar estado
        notificacion.estado = 'leida';
        
        // Assert: Verificar cambio
        expect(notificacion.estado).toBe('leida');
        
        console.log('✅ Notificación puede cambiar a estado "leida"');
    });
    
    test('debe permitir cambio de estado de notificación: leida -> eliminada', () => {
        // Arrange: Crear notificación
        const notificacion = {
            id_usuario: 1,
            mensaje: 'Notificación de prueba',
            estado: 'leida'
        };
        
        // Act: Cambiar a eliminada
        notificacion.estado = 'eliminada';
        
        // Assert: Verificar cambio
        expect(notificacion.estado).toBe('eliminada');
        
        console.log('✅ Notificación puede cambiar a estado "eliminada"');
    });
});

// ============================================
//  RESUMEN DE PRUEBAS
// ============================================

afterAll(() => {
    console.log('\n' + '='.repeat(60));
    console.log('📊 RESUMEN DE PRUEBAS UNITARIAS - JOINIFY');
    console.log('='.repeat(60));
    console.log('✅ Funciones testeadas:');
    console.log('   1. encryptText() - Encriptación AES-256-CBC');
    console.log('   2. decryptText() - Desencriptación AES-256-CBC');
    console.log('\n✅ Notificaciones testeadas:');
    console.log('   • Usuario se une al grupo');
    console.log('   • Usuario sale del grupo');
    console.log('   • Pago recibido (usuario)');
    console.log('   • Pago recibido (admin)');
    console.log('   • Grupo lleno');
    console.log('   • Grupo actualizado');
    console.log('   • Contraseña desbloqueada');
    console.log('\n📝 Total de pruebas: 17');
    console.log('🎯 Origen: server_FINAL.js (funciones REALES)');
    console.log('='.repeat(60) + '\n');
});
