require('dotenv').config(); // Cargar variables de entorno

const express = require('express');
const app = express();
const cors = require('cors');
const Stripe = require('stripe');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

// Añadir multer y fs para manejar subidas de archivos
const fs = require('fs');
const path = require('path');        // <<< añadir
const multer = require('multer');

// Asegurar que exista la carpeta uploads y uploads/profiles
const uploadsDir = path.join(__dirname, 'uploads');
const profilesDir = path.join(uploadsDir, 'profiles');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(profilesDir)) {
  fs.mkdirSync(profilesDir, { recursive: true });
}

// Configuración de almacenamiento de multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Configurar conexión a MySQL
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Maicgio323-2',
    database: 'joinify_db2',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Configura Stripe con manejo de errores
let stripe;
try {
    if (!process.env.STRIPE_SECRET_KEY) {
        console.warn('⚠️ No se encontró STRIPE_SECRET_KEY. Los pagos no funcionarán.');
        stripe = {
            paymentIntents: {
                create: () => Promise.reject(new Error('Stripe no está configurado'))
            }
        };
    } else {
        stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    }
} catch (error) {
    console.error('Error al inicializar Stripe:', error);
    process.exit(1);
}

const secretKey = 'mi_clave_secreta_12345_ghjlo_hyt';

app.use(cors({
    origin: 'http://localhost:4200', // URL de tu aplicación Angular
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Servir archivos estáticos de perfiles
app.use('/uploads/profiles', express.static(path.join(__dirname, 'uploads/profiles')));

// Función para encriptar contraseñas
async function encryptPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}

// Funciones para encriptar/desencriptar texto usando AES-256-CBC
function encryptText(text) {
    if (!text || typeof text !== 'string') {
        console.warn('encryptText: texto inválido, devolviendo original');
        return text || '';
    }
    
    try {
        const algorithm = 'aes-256-cbc';
        const key = crypto.scryptSync(secretKey, 'salt', 32);
        const iv = crypto.randomBytes(16);
        
        const cipher = crypto.createCipheriv(algorithm, key, iv);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        
        return iv.toString('hex') + ':' + encrypted;
    } catch (error) {
        console.error('Error al encriptar:', error);
        return text; // Devolver texto original si falla
    }
}

function decryptText(encryptedData) {
    // Validar entrada
    if (!encryptedData || typeof encryptedData !== 'string' || encryptedData.trim() === '') {
        console.warn('decryptText: datos inválidos o vacíos:', {
            type: typeof encryptedData, 
            value: encryptedData,
            length: encryptedData ? encryptedData.length : 0
        });
        return 'No disponible';
    }
    
    // Si la contraseña parece ser texto plano (sin formato de encriptación)
    if (!encryptedData.includes(':')) {
        console.log('decryptText: datos sin formato de encriptación, devolviendo como texto plano:', encryptedData);
        return encryptedData; // Asumir que ya está desencriptado
    }
    
    try {
        const algorithm = 'aes-256-cbc';
        const key = crypto.scryptSync(secretKey, 'salt', 32);
        
        const parts = encryptedData.split(':');
        console.log('decryptText: procesando partes:', parts.length, parts);
        
        // Manejar diferentes formatos de encriptación
        let iv, encryptedText;
        
        if (parts.length === 2) {
            // Formato nuevo: iv:encrypted
            iv = Buffer.from(parts[0], 'hex');
            encryptedText = parts[1];
        } else if (parts.length === 3) {
            // Formato legacy que parece estar en tu BD: random:iv:encrypted
            iv = Buffer.from(parts[1], 'hex');
            encryptedText = parts[2];
        } else {
            console.warn('decryptText: formato inválido, número de partes:', parts.length);
            return 'Formato de encriptación inválido';
        }
        
        // Validar que tenemos datos válidos
        if (!encryptedText || encryptedText.trim() === '') {
            console.warn('decryptText: texto encriptado vacío después del parsing');
            return 'No disponible';
        }
        
        if (!iv || iv.length !== 16) {
            console.warn('decryptText: IV inválido, longitud:', iv ? iv.length : 0);
            return 'Vector de inicialización inválido';
        }
        
        console.log('decryptText: intentando desencriptar con IV longitud:', iv.length, 'texto longitud:', encryptedText.length);
        
        const decipher = crypto.createDecipheriv(algorithm, key, iv);
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        
        console.log('decryptText: desencriptación exitosa, resultado longitud:', decrypted.length);
        return decrypted;
    } catch (error) {
        console.error('Error al desencriptar:', {
            message: error.message,
            stack: error.stack,
            input: encryptedData
        });
        return 'Error de desencriptación';
    }
}

// Mensajes permitidos
const mensajesPermitidos = [
  "Recibiste pago.",
  "Nuevo integrante añadido.",
  "Grupo lleno.",
  "Tu pago fue recibido.",
  "Se ha actualizado el grupo.",
  "Se elimino el grupo.",
  "Pago pendiente."
];

function esMensajePermitido(mensaje) {
  return mensajesPermitidos.includes(mensaje);
}

// Endpoints

app.get('/usuarios', async (req, res) => {
    try {
        const [usuarios] = await pool.query('SELECT id_usuario, nombre, email, fecha_registro FROM usuario');
        res.json(usuarios);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener los usuarios' });
    }
});

app.post('/usuario', async (req, res) => {
  console.log('[POST /usuario] body:', req.body); // << logging request
  const { nombre, email, password } = req.body;
  if (!nombre || !email || !password) {
    return res.status(400).json({ message: 'Faltan campos obligatorios' });
  }
  try {
    const hashedPassword = await encryptPassword(password);
    const [result] = await pool.query(
      'INSERT INTO usuario (nombre, email, contraseña, fecha_registro) VALUES (?, ?, ?, ?)',
      [nombre, email, hashedPassword, new Date()]
    );
    console.log('[POST /usuario] insertId:', result.insertId);
    res.status(201).json({ message: 'Usuario creado correctamente', id: result.insertId });
  } catch (err) {
    console.error('[POST /usuario] error:', err);
    // Manejo común: email duplicado
    if (err && err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'El correo ya está registrado' });
    }
    res.status(500).json({ message: 'Error al crear el usuario', detail: err.message || err });
  }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [usuarios] = await pool.query('SELECT * FROM usuario WHERE email = ?', [email]);
        if (usuarios.length === 0) return res.status(401).json({ message: 'Usuario no encontrado' });

        const usuario = usuarios[0];
        const match = await bcrypt.compare(password, usuario.contraseña);
        if (match) {
            // Devolver todos los datos del usuario (sin la contraseña)
            const usuarioCompleto = {
                id_usuario: usuario.id_usuario,
                nombre: usuario.nombre,
                email: usuario.email,
                fecha_registro: usuario.fecha_registro
            };
            res.json({ 
                message: 'Login exitoso',
                usuario: usuarioCompleto,
                // Mantener compatibilidad con código anterior
                userId: usuario.id_usuario, 
                userName: usuario.nombre 
            });
        } else {
            res.status(401).json({ message: 'Credenciales incorrectas' });
        }
    } catch (err) {
        console.error('Error en login:', err);
        res.status(500).json({ message: 'Error en el login' });
    }
});

app.post('/api/grupos/crear', async (req, res) => {
    const { name, serviceType, maxUsers, costPerUser, paymentPolicy, userId, accountEmail, accountPassword } = req.body;

    if (!name || !serviceType || !maxUsers || !costPerUser || !userId || !accountEmail || !accountPassword) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    try {
        const [servicio] = await pool.query(
            'SELECT id_servicio, nombre_servicio FROM servicio_streaming WHERE nombre_servicio = ?',
            [serviceType]
        );
        if (servicio.length === 0) return res.status(400).json({ message: 'Servicio no encontrado' });

        const id_servicio = servicio[0].id_servicio;
        const fecha_creacion = new Date();
        const fecha_inicio = new Date();
        const fecha_vencimiento = new Date();
        fecha_vencimiento.setMonth(
            fecha_inicio.getMonth() + (paymentPolicy === 'annual' ? 12 : 1)
        );
        const costo_total = costPerUser * maxUsers;

        const encryptedPass = encryptText(accountPassword);

        const [result] = await pool.query(
            `INSERT INTO grupo_suscripcion
             (nombre_grupo, fecha_creacion, estado_grupo, num_integrantes, id_servicio, costo_total, fecha_inicio, fecha_vencimiento, id_creador, correo_cuenta, contrasena_cuenta)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, fecha_creacion, 'Activo', maxUsers, id_servicio, costo_total, fecha_inicio, fecha_vencimiento, userId, accountEmail, encryptedPass]
        );

        const id_grupo_suscripcion = result.insertId;

        await pool.query(
            'INSERT INTO usuario_grupo (id_usuario, id_grupo_suscripcion, rol) VALUES (?, ?, ?)',
            [userId, id_grupo_suscripcion, 'Admin']
        );

        res.status(201).json({ message: 'Grupo creado exitosamente', id_grupo_suscripcion });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al crear el grupo' });
    }
});

app.get('/api/grupos/usuario', async (req, res) => {
  const id_usuario = req.query.id_usuario;
  if (!id_usuario) return res.status(400).json({ error: 'ID de usuario no proporcionado' });

  try {
    // First, get all groups for the user
    const [grupos] = await pool.query(`
      SELECT gs.*, ug.rol, ss.nombre_servicio,
             (SELECT COUNT(*) FROM usuario_grupo ug2 
              WHERE ug2.id_grupo_suscripcion = gs.id_grupo_suscripcion) AS currentUsers
      FROM grupo_suscripcion gs
      JOIN usuario_grupo ug ON gs.id_grupo_suscripcion = ug.id_grupo_suscripcion
      JOIN servicio_streaming ss ON gs.id_servicio = ss.id_servicio
      WHERE ug.id_usuario = ?`, [id_usuario]);

    // Process each group to handle password visibility
    const gruposConCredenciales = await Promise.all(grupos.map(async grupo => {
      let mostrarPassword = false;

      // Check if user is creator
      if (grupo.id_creador === Number(id_usuario)) {
        mostrarPassword = true;
      } else {
        // Check if user has made payments
        const [pagos] = await pool.query(
          `SELECT 1 FROM historial_pagos hp 
           JOIN pago p ON hp.id_pago = p.id_pago 
           WHERE hp.id_grupo_suscripcion = ? AND p.id_usuario = ? LIMIT 1`,
          [grupo.id_grupo_suscripcion, id_usuario]
        );
        if (pagos.length > 0) mostrarPassword = true;
      }

      return {
        ...grupo,
        contrasena_cuenta: mostrarPassword ? decryptText(grupo.contrasena_cuenta) : 'No disponible'
      };
    }));

    res.json(gruposConCredenciales);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al procesar la solicitud' });
  }
});

app.post('/api/grupos/unirse', async (req, res) => {
    const { groupId, userId } = req.body;
    if (!groupId || !userId) return res.status(400).json({ message: 'Datos faltantes' });

    try {
        const [existe] = await pool.query('SELECT * FROM usuario_grupo WHERE id_usuario = ? AND id_grupo_suscripcion = ?', [userId, groupId]);
        if (existe.length > 0) return res.status(400).json({ message: 'Ya eres miembro de este grupo' });

        const [insertResult] = await pool.query(
            'INSERT INTO usuario_grupo (id_usuario, id_grupo_suscripcion, rol) VALUES (?, ?, ?)',
            [userId, groupId, 'Miembro']
        );

        const [grupo] = await pool.query('SELECT id_creador, num_integrantes FROM grupo_suscripcion WHERE id_grupo_suscripcion = ?', [groupId]);
        const adminId = grupo[0]?.id_creador;
        const maxUsers = grupo[0]?.num_integrantes;

        if (adminId && adminId !== userId) {
            await pool.query('INSERT INTO notificacion (id_usuario, mensaje, fecha_envio, estado) VALUES (?, ?, CURDATE(), ?)', [adminId, 'Nuevo integrante añadido.', 'pendiente']);
        }

        const [usuariosActuales] = await pool.query('SELECT COUNT(*) AS total FROM usuario_grupo WHERE id_grupo_suscripcion = ?', [groupId]);
        const totalUsuarios = usuariosActuales[0]?.total;

        if (totalUsuarios >= maxUsers && adminId) {
            await pool.query('INSERT INTO notificacion (id_usuario, mensaje, fecha_envio, estado) VALUES (?, ?, CURDATE(), ?)', [adminId, 'Grupo lleno.', 'pendiente']);
        }

        res.status(200).json({ message: 'Te has unido al grupo correctamente' });
    } catch (err) {
        res.status(500).json({ message: 'Error al unirse al grupo' });
    }
});

app.get('/gruposdisponibles/:id_usuario', async (req, res) => {
    const id_usuario = req.params.id_usuario;
    if (!id_usuario) return res.status(400).json({ error: 'ID de usuario no proporcionado' });
    try {
        const [grupos] = await pool.query(`
            SELECT gs.*, ss.nombre_servicio,
            (SELECT COUNT(*) FROM usuario_grupo ug WHERE ug.id_grupo_suscripcion = gs.id_grupo_suscripcion) AS currentUsers
            FROM grupo_suscripcion gs
            JOIN servicio_streaming ss ON gs.id_servicio = ss.id_servicio
            WHERE gs.estado_grupo = 'Activo'
            AND gs.id_grupo_suscripcion NOT IN (
                SELECT id_grupo_suscripcion FROM usuario_grupo WHERE id_usuario = ?
            )
            AND (SELECT COUNT(*) FROM usuario_grupo ug WHERE ug.id_grupo_suscripcion = gs.id_grupo_suscripcion) < gs.num_integrantes`, [id_usuario]);
        res.json(grupos);
    } catch (err) {
        res.status(500).json({ message: 'Error al procesar la solicitud' });
    }
});

app.get('/api/notificaciones/vencimientos', async (req, res) => {
    try {
        const [grupos] = await pool.query('SELECT * FROM grupo_suscripcion');
        const [usuarioGrupo] = await pool.query('SELECT * FROM usuario_grupo');
        const hoy = new Date();
        const nuevasNotificaciones = [];

        grupos.forEach((grupo) => {
            const fechaVencimiento = new Date(grupo.fecha_vencimiento);
            const diasRestantes = Math.ceil((fechaVencimiento - hoy) / (1000 * 60 * 60 * 24));
            if (diasRestantes <= 1 && diasRestantes >= 0) {
                const usuariosEnGrupo = usuarioGrupo.filter(ug => ug.id_grupo_suscripcion === grupo.id_grupo_suscripcion);
                usuariosEnGrupo.forEach((relacion) => {
                    nuevasNotificaciones.push({
                        userId: relacion.id_usuario,
                        mensaje: `Tu pago para el grupo "${grupo.nombre_grupo}" vence en ${diasRestantes} día(s).`
                    });
                });
            }
        });
        res.json(nuevasNotificaciones);
    } catch (err) {
        res.status(500).json({ message: 'Error al procesar las notificaciones' });
    }
});

app.post('/api/pagos/simular', async (req, res) => {
    const { userId, groupId, amount } = req.body;
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100,
            currency: 'usd',
            description: `Pago del grupo ${groupId} por el usuario ${userId}`
        });
        res.status(200).json({ message: 'Transacción de pago exitosa', clientSecret: paymentIntent.client_secret });
    } catch (err) {
        res.status(500).json({ message: 'Error al realizar el pago' });
    }
});

app.post('/api/pagos/confirmar', async (req, res) => {
    try {
        const { userId, groupId, monto } = req.body;
        if (!userId || !groupId || !monto) return res.status(400).json({ message: 'Faltan datos obligatorios' });

        const [pagoResult] = await pool.query('INSERT INTO pago (id_usuario, monto, fecha_pago) VALUES (?, ?, CURDATE())', [userId, monto]);
        const id_pago = pagoResult.insertId;

        await pool.query('INSERT INTO historial_pagos (id_pago, id_grupo_suscripcion) VALUES (?, ?)', [id_pago, groupId]);

        const mensajeUsuario = 'Tu pago fue recibido.';
        if (esMensajePermitido(mensajeUsuario)) {
            await pool.query('INSERT INTO notificacion (id_usuario, mensaje, fecha_envio, estado) VALUES (?, ?, CURDATE(), ?)', [userId, mensajeUsuario, 'pendiente']);
        }

        const [adminRows] = await pool.query('SELECT id_creador FROM grupo_suscripcion WHERE id_grupo_suscripcion = ?', [groupId]);
        const adminId = adminRows[0]?.id_creador;

        if (adminId && adminId !== userId) {
            const mensajeAdmin = 'Recibiste pago.';
            if (esMensajePermitido(mensajeAdmin)) {
                await pool.query('INSERT INTO notificacion (id_usuario, mensaje, fecha_envio, estado) VALUES (?, ?, CURDATE(), ?)', [adminId, mensajeAdmin, 'pendiente']);
            }
        }

        res.json({ message: 'Pago confirmado y notificaciones enviadas.' });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message || 'Error al confirmar el pago' });
    }
});

// ✅ Endpoint para mostrar notificaciones personales
app.get('/api/notificaciones/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const [notificaciones] = await pool.query(
            `SELECT id_notificacion, mensaje, fecha_envio, estado 
             FROM notificacion 
             WHERE id_usuario = ? AND estado != 'eliminada'
             ORDER BY fecha_envio DESC`, [userId]
        );
        res.json(notificaciones);
    } catch (err) {
        console.error('Error al obtener notificaciones:', err);
        res.status(500).json({ message: 'Error al obtener notificaciones' });
    }
});

// Marcar notificación como leída
app.put('/api/notificaciones/:id_notificacion/leida', async (req, res) => {
  const { id_notificacion } = req.params;
  try {
    await pool.query(
      'UPDATE notificacion SET estado = ? WHERE id_notificacion = ?',
      ['leida', id_notificacion]
    );
    res.json({ message: 'Notificación marcada como leída' });
  } catch (err) {
    res.status(500).json({ message: 'Error al marcar como leída' });
  }
});

// Eliminar notificación (estado = 'eliminada')
app.put('/api/notificaciones/:id_notificacion/eliminar', async (req, res) => {
  const { id_notificacion } = req.params;
  try {
    await pool.query(
      'UPDATE notificacion SET estado = ? WHERE id_notificacion = ?',
      ['eliminada', id_notificacion]
    );
    res.json({ message: 'Notificación eliminada' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar la notificación' });
  }
});

// Historial de pagos por usuario
app.get('/api/historial_pagos', async (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ message: 'userId requerido' });
  }
  try {
    const [pagos] = await pool.query(
      `SELECT hp.id_historial_pago, hp.id_pago, hp.id_grupo_suscripcion, p.monto, p.fecha_pago
       FROM historial_pagos hp
       JOIN pago p ON hp.id_pago = p.id_pago
       WHERE p.id_usuario = ?
       ORDER BY p.fecha_pago DESC`,
      [userId]
    );
    res.json(pagos);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener el historial de pagos' });
  }
});

// ✅ Función para notificar a todos los miembros del grupo
async function notificarMiembrosGrupo(pool, grupoId, mensaje) {
  const [miembros] = await pool.query(
    'SELECT id_usuario FROM usuario_grupo WHERE id_grupo_suscripcion = ?',
    [grupoId]
  );
  for (const miembro of miembros) {
    await pool.query(
      'INSERT INTO notificacion (id_usuario, mensaje, fecha_envio, estado) VALUES (?, ?, CURDATE(), ?)',
      [miembro.id_usuario, mensaje, 'pendiente']
    );
  }
}

// ✅ Endpoint para activar grupo y notificar a miembros
app.put('/api/grupos/activar/:id', async (req, res) => {
  const grupoId = req.params.id;
  try {
    await pool.query('UPDATE grupo_suscripcion SET estado_grupo = "Activo" WHERE id_grupo_suscripcion = ?', [grupoId]);
    const mensaje = "Se ha actualizado el grupo.";
    await notificarMiembrosGrupo(pool, grupoId, mensaje);
    res.json({ message: 'Grupo activado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al activar el grupo' });
  }
});

// ✅ Endpoint para inactivar grupo y notificar a miembros
app.put('/api/grupos/inactivar/:id', async (req, res) => {
  const grupoId = req.params.id;
  try {
    await pool.query('UPDATE grupo_suscripcion SET estado_grupo = "Inactivo" WHERE id_grupo_suscripcion = ?', [grupoId]);
    const mensaje = "Se ha actualizado el grupo.";
    await notificarMiembrosGrupo(pool, grupoId, mensaje);
    res.json({ message: 'Grupo inactivado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al inactivar el grupo' });
  }
});

// Activar grupo (solo Admin puede hacerlo)
app.put('/api/grupos/activar/:groupId', async (req, res) => {
    const { groupId } = req.params;
    try {
        await pool.query(
            'UPDATE grupo_suscripcion SET estado_grupo = ? WHERE id_grupo_suscripcion = ?',
            ['Activo', groupId]
        );
        res.json({ message: 'Grupo activado correctamente' });
    } catch (err) {
        res.status(500).json({ message: 'Error al activar el grupo' });
    }
});

// Obtener todos los servicios de streaming
app.get('/api/servicios', async (req, res) => {
    try {
        const [servicios] = await pool.query('SELECT * FROM servicio_streaming');
        res.json(servicios);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener los servicios' });
    }
});

// ========== ENDPOINTS PARA CONFIGURACIÓN DE USUARIO (SIN MODIFICAR BD) ==========

// Obtener perfil de usuario (solo datos básicos de BD)
app.get('/api/usuarios/:id/perfil', async (req, res) => {
    const { id } = req.params;
    try {
        // Solo obtener datos básicos que ya existen
        const [usuarios] = await pool.query(
            `SELECT id_usuario, nombre, email, fecha_registro 
             FROM usuario WHERE id_usuario = ?`, 
            [id]
        );
        
        if (usuarios.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const usuario = usuarios[0];
        
        // Los demás campos (teléfono, fecha_nacimiento, etc.) se manejarán en el frontend
        // con localStorage o sessionStorage
        
        res.json(usuario);
    } catch (err) {
        console.error('Error al obtener perfil:', err);
        res.status(500).json({ message: 'Error al obtener el perfil del usuario' });
    }
});

// Actualizar perfil de usuario (solo nombre en BD, resto local)
app.put('/api/usuarios/:id/perfil', async (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body; // Solo actualizamos el nombre en BD
    
    try {
        // Verificar que el usuario existe
        const [usuarioExiste] = await pool.query('SELECT id_usuario FROM usuario WHERE id_usuario = ?', [id]);
        if (usuarioExiste.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Solo actualizar nombre en tabla usuario (si se proporciona)
        if (nombre) {
            await pool.query('UPDATE usuario SET nombre = ? WHERE id_usuario = ?', [nombre, id]);
        }

        // Obtener los datos actualizados de la BD
        const [usuarioActualizado] = await pool.query(
            `SELECT id_usuario, nombre, email, fecha_registro
             FROM usuario WHERE id_usuario = ?`,
            [id]
        );

        res.json({
            message: 'Perfil actualizado correctamente',
            usuario: usuarioActualizado[0]
            // Los demás campos (teléfono, fecha_nacimiento, etc.) se guardan en localStorage del frontend
        });
    } catch (err) {
        console.error('Error al actualizar perfil:', err);
        res.status(500).json({ message: 'Error al actualizar el perfil' });
    }
});

// Cambiar contraseña
app.put('/api/usuarios/:id/password', async (req, res) => {
    const { id } = req.params;
    const { password_actual, password_nueva } = req.body;
    
    try {
        // Verificar contraseña actual
        const [usuario] = await pool.query('SELECT contraseña FROM usuario WHERE id_usuario = ?', [id]);
        if (usuario.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const match = await bcrypt.compare(password_actual, usuario[0].contraseña);
        if (!match) {
            return res.status(400).json({ message: 'La contraseña actual es incorrecta' });
        }

        // Encriptar nueva contraseña
        const nuevaPasswordHash = await encryptPassword(password_nueva);
        
        // Actualizar contraseña
        await pool.query('UPDATE usuario SET contraseña = ? WHERE id_usuario = ?', [nuevaPasswordHash, id]);

        res.json({ message: 'Contraseña actualizada correctamente' });
    } catch (err) {
        console.error('Error al cambiar contraseña:', err);
        res.status(500).json({ message: 'Error al cambiar la contraseña' });
    }
});

// NOTA: Los endpoints de foto no son necesarios con esta aproximación
// Las fotos se manejan como base64 en localStorage del frontend

// ========== FIN ENDPOINTS CONFIGURACIÓN USUARIO ==========

// ========== ENDPOINT TEMPORAL PARA DEPURAR ENCRIPTACIÓN ==========
app.get('/api/debug/grupos/:groupId', async (req, res) => {
    const { groupId } = req.params;
    try {
        const [rows] = await pool.query(
            'SELECT id_grupo_suscripcion, nombre_grupo, correo_cuenta, contrasena_cuenta FROM grupo_suscripcion WHERE id_grupo_suscripcion = ?',
            [groupId]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Grupo no encontrado' });
        }
        
        const grupo = rows[0];
        console.log('DEBUG - Datos raw de la BD:', grupo);
        
        const resultado = {
            id: grupo.id_grupo_suscripcion,
            nombre: grupo.nombre_grupo,
            correo_raw: grupo.correo_cuenta,
            contrasena_raw: grupo.contrasena_cuenta,
            contrasena_tipo: typeof grupo.contrasena_cuenta,
            contrasena_length: grupo.contrasena_cuenta ? grupo.contrasena_cuenta.length : 0,
            contrasena_desencriptada: grupo.contrasena_cuenta ? decryptText(grupo.contrasena_cuenta) : 'NULL'
        };
        
        res.json(resultado);
    } catch (err) {
        console.error('Error en debug:', err);
        res.status(500).json({ message: 'Error en debug', error: err.message });
    }
});

// ========== FIN ENDPOINT TEMPORAL ==========

// Salir de un grupo
app.delete('/api/grupos/salir/:groupId/:userId', async (req, res) => {
    const { groupId, userId } = req.params;
    try {
        await pool.query('DELETE FROM usuario_grupo WHERE id_usuario = ? AND id_grupo_suscripcion = ?', [userId, groupId]);
        res.status(200).json({ message: 'Has salido del grupo correctamente.' });
    } catch (err) {
        res.status(500).json({ message: 'Error al procesar la solicitud.' });
    }
});

// Dar de baja un grupo (solo si la fecha de vencimiento ya pasó)
app.delete('/api/grupos/baja/:groupId', async (req, res) => {
    const { groupId } = req.params;
    try {
        const [grupos] = await pool.query('SELECT * FROM grupo_suscripcion WHERE id_grupo_suscripcion = ?', [groupId]);
        if (grupos.length === 0) {
            return res.status(404).json({ message: 'Grupo no encontrado' });
        }
        const grupo = grupos[0];
        const fechaVencimiento = new Date(grupo.fecha_vencimiento);
        const fechaActual = new Date();
        if (fechaActual < fechaVencimiento) {
            return res.status(400).json({
                message: `No se puede dar de baja el grupo hasta la fecha de vencimiento: ${fechaVencimiento.toISOString()}`
            });
        }
        await pool.query('DELETE FROM usuario_grupo WHERE id_grupo_suscripcion = ?', [groupId]);
        await pool.query('DELETE FROM grupo_suscripcion WHERE id_grupo_suscripcion = ?', [groupId]);

        res.status(200).json({
            message: `El grupo ${groupId} y todas sus relaciones han sido eliminados correctamente`
        });
    } catch (err) {
        res.status(500).json({ message: 'Error al procesar la solicitud' });
    }
});

app.get('/api/grupos/:groupId/credenciales', async (req, res) => {
  const { groupId } = req.params;
  const { userId } = req.query; // pásalo como query: ?userId=123

  if (!groupId || !userId) {
    return res.status(400).json({ message: 'groupId y userId son obligatorios' });
  }

  try {
    // Verifica que el usuario sea miembro del grupo
    const [m] = await pool.query(
      'SELECT 1 FROM usuario_grupo WHERE id_usuario = ? AND id_grupo_suscripcion = ? LIMIT 1',
      [userId, groupId]
    );
    if (m.length === 0) return res.status(403).json({ message: 'No autorizado - No eres miembro de este grupo' });

    // Verificar si es el creador del grupo o si ha pagado
    const [grupoInfo] = await pool.query(
      'SELECT id_creador FROM grupo_suscripcion WHERE id_grupo_suscripcion = ?',
      [groupId]
    );
    
    let puedeVerCredenciales = false;
    
    // Si es el creador, puede ver las credenciales
    if (grupoInfo.length > 0 && grupoInfo[0].id_creador === Number(userId)) {
      puedeVerCredenciales = true;
    } else {
      // Si no es el creador, verificar si ha pagado
      const [pagos] = await pool.query(
        `SELECT 1 FROM historial_pagos hp 
         JOIN pago p ON hp.id_pago = p.id_pago 
         WHERE hp.id_grupo_suscripcion = ? AND p.id_usuario = ? LIMIT 1`,
        [groupId, userId]
      );
      if (pagos.length > 0) puedeVerCredenciales = true;
    }

    if (!puedeVerCredenciales) {
      return res.status(403).json({ 
        message: 'No autorizado - Debes realizar el pago correspondiente para acceder a las credenciales',
        correoCuenta: null,
        passwordCuenta: 'Debes pagar para ver las credenciales'
      });
    }

    // Obtén credenciales
    const [rows] = await pool.query(
      'SELECT correo_cuenta, contrasena_cuenta FROM grupo_suscripcion WHERE id_grupo_suscripcion = ?',
      [groupId]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Grupo no encontrado' });

    const correo = rows[0].correo_cuenta || null;
    const password = rows[0].contrasena_cuenta ? decryptText(rows[0].contrasena_cuenta) : null;

    res.json({ correoCuenta: correo, passwordCuenta: password });
  } catch (err) {
    console.error('Error al obtener credenciales:', err);
    res.status(500).json({ message: 'Error al obtener credenciales' });
  }
});

// Test de conexión a MySQL al arrancar
(async () => {
  try {
    const conn = await pool.getConnection();
    await conn.query('SELECT 1');
    conn.release();
    console.log('MySQL: conexión OK');
  } catch (err) {
    console.error('MySQL: error de conexión inicial:', err.message || err);
  }
})();

// ✅ Iniciar servidor
app.listen(3001, '0.0.0.0', () => {
    console.log('Servidor corriendo en http://localhost:3001');
});