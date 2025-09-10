// Datos que vienen de la base de datos
export interface UsuarioBaseDatos {
  id_usuario: number;
  nombre: string;
  email: string;
  contraseña?: string;
  fecha_registro: string;
}

// Datos adicionales que se guardan en localStorage
export interface DatosAdicionales {
  apellido?: string;
  telefono?: string;
  fecha_nacimiento?: string;
  genero?: 'masculino' | 'femenino' | 'otro' | 'prefiero_no_decir';
  pais?: string;
  ciudad?: string;
  foto_perfil?: string; // base64
}

// Interface completa para el frontend (BD + localStorage)
export interface Usuario extends UsuarioBaseDatos {
  apellido?: string;
  telefono?: string;
  fecha_nacimiento?: string;
  genero?: 'masculino' | 'femenino' | 'otro' | 'prefiero_no_decir';
  pais?: string;
  ciudad?: string;
  foto_perfil?: string;
}

export interface UsuarioActualizar {
  // Solo nombre se actualiza en BD
  nombre?: string;
  // El resto va a localStorage
  apellido?: string;
  telefono?: string;
  fecha_nacimiento?: string;
  genero?: 'masculino' | 'femenino' | 'otro' | 'prefiero_no_decir';
  pais?: string;
  ciudad?: string;
}

export interface CambiarPassword {
  password_actual: string;
  password_nueva: string;
  confirmar_password: string;
}

export interface FotoPerfil {
  archivo: File;
  preview?: string;
}
