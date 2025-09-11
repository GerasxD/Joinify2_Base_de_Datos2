const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Maicgio323-2',
    database: 'joinify_2l',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function insertarNotificacionesPrueba() {
    try {
        // Insertar algunas notificaciones de prueba para el usuario 505
        await pool.query(`
            INSERT INTO notificacion (id_usuario, mensaje, fecha_envio) VALUES 
            (505, 'Tu grupo "chocolate" está próximo a vencer en 3 días', NOW()),
            (505, 'Bienvenido a Joinify! Tu cuenta ha sido creada exitosamente', NOW()),
            (505, 'Se ha procesado tu pago para el grupo "Viernes"', NOW())
        `);
        
        console.log('Notificaciones de prueba insertadas correctamente');
        
        // Verificar que se insertaron
        const [notificaciones] = await pool.query(
            'SELECT * FROM notificacion WHERE id_usuario = 505'
        );
        
        console.log('Notificaciones encontradas:', notificaciones);
        
    } catch (error) {
        console.error('Error al insertar notificaciones:', error);
    } finally {
        await pool.end();
    }
}

insertarNotificacionesPrueba();
