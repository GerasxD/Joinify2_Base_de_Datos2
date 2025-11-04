import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Usuario, UsuarioActualizar, CambiarPassword, UsuarioBaseDatos, DatosAdicionales } from '../models/usuario.model';
import { EnvironmentService } from './environment.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl: string;
  private usuarioActualSubject = new BehaviorSubject<Usuario | null>(null);
  public usuarioActual$ = this.usuarioActualSubject.asObservable();
  private readonly PERFIL_STORAGE_KEY = 'perfil_extendido_';

  constructor(
    private http: HttpClient,
    private environmentService: EnvironmentService
  ) {
    this.apiUrl = this.environmentService.getApiUrl();
    console.log('🔗 UsuarioService inicializado con API URL:', this.apiUrl);
    this.cargarUsuarioDesdeStorage();
  }

  // Cargar datos del usuario desde localStorage
  private cargarUsuarioDesdeStorage() {
    const usuario = localStorage.getItem('usuario');
    if (usuario) {
      this.usuarioActualSubject.next(JSON.parse(usuario));
    }
  }

  // Obtener usuario actual
  get usuarioActual(): Usuario | null {
    return this.usuarioActualSubject.value;
  }

  // Obtener perfil completo del usuario (BD + localStorage)
  obtenerPerfil(idUsuario: number): Observable<Usuario> {
    return new Observable<Usuario>(observer => {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      });

      console.log('🌐 Obteniendo perfil desde:', `${this.apiUrl}/api/usuarios/${idUsuario}/perfil`);
      
      // Obtener datos básicos de la BD
      this.http.get<UsuarioBaseDatos>(`${this.apiUrl}/api/usuarios/${idUsuario}/perfil`, { headers }).subscribe({
        next: (datosBasicos) => {
          console.log('✅ Datos básicos obtenidos de la BD:', datosBasicos);
          // Combinar con datos locales
          const datosLocales = this.obtenerDatosLocales(idUsuario);
          console.log('📦 Datos locales:', datosLocales);
          const perfilCompleto: Usuario = {
            ...datosBasicos,
            ...datosLocales
          };
          console.log('✨ Perfil completo combinado:', perfilCompleto);
          observer.next(perfilCompleto);
          observer.complete();
        },
        error: (error) => {
          console.error('❌ Error al obtener perfil:', error);
          console.error('Error status:', error.status);
          console.error('Error message:', error.message);
          console.error('Error completo:', JSON.stringify(error, null, 2));
          observer.error({
            message: error.error?.message || error.message || 'Error al conectar con el servidor',
            status: error.status,
            error: error
          });
        }
      });
    });
  }

  // Actualizar datos del usuario (solo nombre en BD, resto local)
  actualizarPerfil(idUsuario: number, datos: UsuarioActualizar): Observable<any> {
    return new Observable(observer => {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      });

      // Solo actualizar nombre en BD si se proporcionó
      if (datos.nombre) {
        const datosParaBD = { nombre: datos.nombre };
        
        this.http.put(`${this.apiUrl}/api/usuarios/${idUsuario}/perfil`, datosParaBD, { headers }).subscribe({
          next: (response) => {
            // Guardar el resto de datos localmente
            const datosLocalesActuales = this.obtenerDatosLocales(idUsuario);
            const datosLocalesNuevos = {
              ...datosLocalesActuales,
              apellido: datos.apellido,
              telefono: datos.telefono,
              fecha_nacimiento: datos.fecha_nacimiento,
              genero: datos.genero,
              pais: datos.pais,
              ciudad: datos.ciudad
            };
            this.guardarDatosLocales(idUsuario, datosLocalesNuevos);
            
            observer.next({ message: 'Perfil actualizado correctamente' });
            observer.complete();
          },
          error: (error) => {
            console.error('Error al actualizar perfil en BD:', error);
            observer.error(error);
          }
        });
      } else {
        // Solo guardar datos localmente
        const datosLocalesActuales = this.obtenerDatosLocales(idUsuario);
        const datosLocalesNuevos = {
          ...datosLocalesActuales,
          apellido: datos.apellido,
          telefono: datos.telefono,
          fecha_nacimiento: datos.fecha_nacimiento,
          genero: datos.genero,
          pais: datos.pais,
          ciudad: datos.ciudad
        };
        this.guardarDatosLocales(idUsuario, datosLocalesNuevos);
        
        observer.next({ message: 'Perfil actualizado correctamente' });
        observer.complete();
      }
    });
  }

  // Cambiar contraseña
  cambiarPassword(idUsuario: number, passwords: CambiarPassword): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    console.log('Enviando cambio de contraseña:', { idUsuario, passwords });
    
    return this.http.put(`${this.apiUrl}/api/usuarios/${idUsuario}/password`, passwords, { headers })
      .pipe(
        catchError(error => {
          console.error('Error al cambiar contraseña:', error);
          throw error;
        })
      );
  }

  // Subir foto de perfil (almacenamiento local como base64)
  subirFotoPerfil(idUsuario: number, archivo: File): Observable<any> {
    return new Observable(observer => {
      this.convertirArchivoABase64(archivo).then(base64 => {
        // Guardar foto como base64 en localStorage
        const datosLocales = this.obtenerDatosLocales(idUsuario);
        datosLocales.foto_perfil = base64;
        this.guardarDatosLocales(idUsuario, datosLocales);
        
        observer.next({ 
          message: 'Foto de perfil actualizada correctamente',
          foto_url: base64 
        });
        observer.complete();
      }).catch(error => observer.error(error));
    });
  }

  // Eliminar foto de perfil (del localStorage)
  eliminarFotoPerfil(idUsuario: number): Observable<any> {
    return new Observable(observer => {
      const datosLocales = this.obtenerDatosLocales(idUsuario);
      delete datosLocales.foto_perfil;
      this.guardarDatosLocales(idUsuario, datosLocales);
      
      observer.next({ message: 'Foto de perfil eliminada correctamente' });
      observer.complete();
    });
  }

  // Actualizar datos del usuario en el estado global
  actualizarUsuarioLocal(usuario: Usuario) {
    localStorage.setItem('usuario', JSON.stringify(usuario));
    this.usuarioActualSubject.next(usuario);
  }

  // Limpiar datos del usuario (logout)
  limpiarUsuario() {
    localStorage.removeItem('usuario');
    this.usuarioActualSubject.next(null);
  }

  // Obtener URL completa de la foto de perfil
  obtenerUrlFoto(nombreArchivo?: string): string {
    if (!nombreArchivo) {
      return '/assets/imagenes/default-avatar.svg'; // Foto por defecto
    }
    return `${this.apiUrl}/uploads/avatars/${nombreArchivo}`;
  }

  // Validar formato de imagen
  validarFormatoImagen(archivo: File): boolean {
    const formatosPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    return formatosPermitidos.includes(archivo.type);
  }

  // Validar tamaño de imagen (max 5MB)
  validarTamañoImagen(archivo: File): boolean {
    const tamañoMaximo = 5 * 1024 * 1024; // 5MB en bytes
    return archivo.size <= tamañoMaximo;
  }

  // Métodos para manejo de localStorage (datos extendidos del perfil)
  private obtenerDatosLocales(idUsuario: number): any {
    const datos = localStorage.getItem(this.PERFIL_STORAGE_KEY + idUsuario);
    return datos ? JSON.parse(datos) : {};
  }

  private guardarDatosLocales(idUsuario: number, datos: any): void {
    localStorage.setItem(this.PERFIL_STORAGE_KEY + idUsuario, JSON.stringify(datos));
  }

  // Limpiar datos locales del perfil extendido
  limpiarDatosLocalesPerfil(idUsuario: number): void {
    localStorage.removeItem(this.PERFIL_STORAGE_KEY + idUsuario);
  }

  // Convertir archivo a base64
  private convertirArchivoABase64(archivo: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error: any) => reject(error);
      reader.readAsDataURL(archivo);
    });
  }

  // Validar fortaleza de contraseña
  validarFortalezaPassword(password: string): {
    esValida: boolean;
    mensajes: string[];
    puntuacion: number;
  } {
    const mensajes: string[] = [];
    let puntuacion = 0;

    if (password.length >= 8) {
      puntuacion += 20;
    } else {
      mensajes.push('Debe tener al menos 8 caracteres');
    }

    if (/[A-Z]/.test(password)) {
      puntuacion += 20;
    } else {
      mensajes.push('Debe contener al menos una mayúscula');
    }

    if (/[a-z]/.test(password)) {
      puntuacion += 20;
    } else {
      mensajes.push('Debe contener al menos una minúscula');
    }

    if (/[0-9]/.test(password)) {
      puntuacion += 20;
    } else {
      mensajes.push('Debe contener al menos un número');
    }

    if (/[^A-Za-z0-9]/.test(password)) {
      puntuacion += 20;
    } else {
      mensajes.push('Debe contener al menos un carácter especial');
    }

    return {
      esValida: puntuacion >= 80,
      mensajes,
      puntuacion
    };
  }
}
