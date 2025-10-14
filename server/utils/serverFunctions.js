/**
 * 🔐 Módulo de Funciones del Servidor - Joinify
 * 
 * Este módulo contiene funciones REALES extraídas del servidor principal
 * (server_FINAL.js) para poder realizar pruebas unitarias de forma aislada.
 * 
 * IMPORTANTE: Todas estas funciones YA EXISTEN en server_FINAL.js
 * 
 * Funciones disponibles:
 * 1. encryptText() - Línea 88 de server_FINAL.js
 * 2. decryptText() - Línea 110 de server_FINAL.js
 * 3. esMensajePermitido() - Línea 190 de server_FINAL.js
 */

const crypto = require('crypto');

// Clave secreta usada en el servidor (misma que en server_FINAL.js)
const secretKey = 'mi_clave_secreta_12345_ghjlo_hyt';

// Lista de mensajes permitidos para notificaciones (líneas 179-187 de server_FINAL.js)
const mensajesPermitidos = [
  "Recibiste pago.",
  "Nuevo integrante añadido.",
  "Grupo lleno.",
  "Tu pago fue recibido.",
  "Se ha actualizado el grupo.",
  "Se elimino el grupo.",
  "Pago pendiente."
];

/**
 * FUNCIÓN 1: encryptText() 
 * Ubicación original: server_FINAL.js línea 88
 * 
 * Encripta un texto usando AES-256-CBC
 * Esta función se usa en el proyecto para encriptar contraseñas de cuentas de streaming
 * antes de guardarlas en la base de datos.
 * 
 * Ejemplo de uso en server_FINAL.js (línea 284):
 *   const encryptedPass = encryptText(accountPassword);
 * 
 * @param {string} text - Texto a encriptar
 * @returns {string} - Texto encriptado en formato "iv:encrypted"
 */
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
        return text;
    }
}

/**
 * FUNCIÓN 2: decryptText()
 * Ubicación original: server_FINAL.js línea 110
 * 
 * Desencripta un texto previamente encriptado con encryptText()
 * Esta función se usa en múltiples endpoints para mostrar contraseñas desencriptadas
 * 
 * Ejemplos de uso en server_FINAL.js:
 *   - Línea 342: decryptText(grupo.contrasena_cuenta)
 *   - Línea 733: decryptText(grupo.contrasena_cuenta)
 *   - Línea 837: decryptText(rows[0].contrasena_cuenta)
 * 
 * @param {string} encryptedData - Texto encriptado en formato "iv:encrypted"
 * @returns {string} - Texto desencriptado o mensaje de error
 */
function decryptText(encryptedData) {
    if (!encryptedData || typeof encryptedData !== 'string' || encryptedData.trim() === '') {
        console.warn('decryptText: datos inválidos o vacíos');
        return 'No disponible';
    }
    
    if (!encryptedData.includes(':')) {
        console.log('decryptText: datos sin formato de encriptación, devolviendo como texto plano');
        return encryptedData;
    }
    
    try {
        const algorithm = 'aes-256-cbc';
        const key = crypto.scryptSync(secretKey, 'salt', 32);
        
        const parts = encryptedData.split(':');
        let iv, encryptedText;
        
        if (parts.length === 2) {
            iv = Buffer.from(parts[0], 'hex');
            encryptedText = parts[1];
        } else if (parts.length === 3) {
            iv = Buffer.from(parts[1], 'hex');
            encryptedText = parts[2];
        } else {
            console.warn('decryptText: formato inválido');
            return 'Formato de encriptación inválido';
        }
        
        if (!encryptedText || encryptedText.trim() === '') {
            console.warn('decryptText: texto encriptado vacío');
            return 'No disponible';
        }
        
        if (!iv || iv.length !== 16) {
            console.warn('decryptText: IV inválido');
            return 'Vector de inicialización inválido';
        }
        
        const decipher = crypto.createDecipheriv(algorithm, key, iv);
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        
        return decrypted;
    } catch (error) {
        console.error('Error al desencriptar:', error);
        return 'Error de desencriptación';
    }
}

/**
 * FUNCIÓN 3: esMensajePermitido()
 * Ubicación original: server_FINAL.js línea 190
 * 
 * Valida si un mensaje está en la lista de mensajes permitidos para notificaciones
 * Esta función se usa para validar mensajes antes de crear notificaciones en el sistema
 * 
 * @param {string} mensaje - Mensaje a validar
 * @returns {boolean} - true si el mensaje está permitido, false si no
 */
function esMensajePermitido(mensaje) {
    return mensajesPermitidos.includes(mensaje);
}

// Exportar las funciones y constantes para usar en las pruebas
module.exports = {
    encryptText,
    decryptText,
    esMensajePermitido,
    mensajesPermitidos
};
