import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../services/usuario.service';
import { Usuario } from '../models/usuario.model';
import { SweetAlertService } from '../services/sweet-alert.service';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.css']
})
export class ConfiguracionComponent implements OnInit {
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

  usuario: Usuario | null = null;
  perfilForm: FormGroup;
  passwordForm: FormGroup;
  
  // Estados de la interfaz
  editandoPerfil = false;
  cambiandoPassword = false;
  mostrandoMensaje = false;
  tipoMensaje: 'exito' | 'error' = 'exito';
  textoMensaje = '';
  
  // Datos originales para cancelar cambios
  datosOriginales: any = {};

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private sweetAlert: SweetAlertService
  ) {
    this.perfilForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: [''],
      email: [{ value: '', disabled: true }],
      telefono: [''],
      fecha_nacimiento: [''],
      genero: [''],
      pais: [''],
      ciudad: ['']
    });

    this.passwordForm = this.fb.group({
      passwordActual: ['', Validators.required],
      nuevaPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmarPassword: ['', Validators.required]
    });
  }

  ngOnInit() {
    console.log('Iniciando componente de configuración...');
    this.cargarDatosUsuario();
    
    // También suscribirse a cambios en el usuario actual
    this.usuarioService.usuarioActual$.subscribe(usuario => {
      if (usuario && usuario.id_usuario && !this.usuario) {
        console.log('Usuario detectado desde suscripción:', usuario);
        this.usuario = usuario;
        this.cargarDatosUsuario();
      }
    });
  }

  cargarDatosUsuario() {
    console.log('🔄 Iniciando carga de datos del usuario...');
    
    // Primero intentar obtener del servicio
    this.usuario = this.usuarioService.usuarioActual;
    
    // Si no hay usuario, intentar desde localStorage
    if (!this.usuario) {
      const usuarioStorage = localStorage.getItem('usuario');
      if (usuarioStorage) {
        try {
          this.usuario = JSON.parse(usuarioStorage);
          console.log('✅ Usuario obtenido del localStorage:', this.usuario);
        } catch (e) {
          console.error('❌ Error parsing usuario:', e);
        }
      }
    }
    
    // Si aún no hay usuario, intentar construir desde userId/username
    if (!this.usuario) {
      const userId = localStorage.getItem('userId');
      const username = localStorage.getItem('username');
      if (userId && username) {
        this.usuario = {
          id_usuario: parseInt(userId),
          nombre: username,
          email: '',
          fecha_registro: new Date().toISOString()
        };
        console.log('✅ Usuario construido desde userId/username:', this.usuario);
      }
    }
    
    console.log('👤 Usuario final:', this.usuario);
    
    if (this.usuario && this.usuario.id_usuario) {
      // Obtener perfil completo (BD + localStorage)
      console.log('🌐 Obteniendo perfil desde API para ID:', this.usuario.id_usuario);
      
      this.usuarioService.obtenerPerfil(this.usuario.id_usuario).subscribe({
        next: (perfilCompleto) => {
          console.log('✅ Perfil completo recibido desde API:', perfilCompleto);
          this.usuario = perfilCompleto;
          this.perfilForm.patchValue({
            nombre: perfilCompleto.nombre || '',
            apellido: perfilCompleto.apellido || '',
            email: perfilCompleto.email || '',
            telefono: perfilCompleto.telefono || '',
            fecha_nacimiento: perfilCompleto.fecha_nacimiento || '',
            genero: perfilCompleto.genero || '',
            pais: perfilCompleto.pais || '',
            ciudad: perfilCompleto.ciudad || ''
          });
          
          // Guardar datos originales
          this.datosOriginales = { ...this.perfilForm.value };
          console.log('📝 Formulario actualizado:', this.perfilForm.value);
          this.mostrarNotificacion('Datos cargados correctamente', 'exito');
        },
        error: (error) => {
          console.error('❌ Error al cargar perfil desde API:', error);
          console.error('Error detallado:', JSON.stringify(error, null, 2));
          
          let mensajeError = 'Error de conexión. Usando datos locales.';
          if (error.message) {
            mensajeError = error.message;
          }
          if (error.status === 0) {
            mensajeError = 'No se pudo conectar al servidor. Verifica tu conexión.';
          }
          
          this.mostrarNotificacion(mensajeError, 'error');
          
          // Si hay error con la API, cargar al menos datos básicos del usuario local
          if (this.usuario) {
            this.perfilForm.patchValue({
              nombre: this.usuario.nombre || '',
              apellido: this.usuario.apellido || '',
              email: this.usuario.email || '',
              telefono: this.usuario.telefono || '',
              fecha_nacimiento: this.usuario.fecha_nacimiento || '',
              genero: this.usuario.genero || '',
              pais: this.usuario.pais || '',
              ciudad: this.usuario.ciudad || ''
            });
            this.datosOriginales = { ...this.perfilForm.value };
          }
        }
      });
    } else {
      console.error('❌ No se encontró usuario logueado');
      this.mostrarNotificacion('No se encontró información del usuario. Inicia sesión nuevamente.', 'error');
    }
  }

  // === GESTIÓN DE FOTO DE PERFIL ===
  
  obtenerUrlFoto(): string {
    if (this.usuario?.foto_perfil) {
      // Si es base64, devolverlo directamente
      if (this.usuario.foto_perfil.startsWith('data:')) {
        return this.usuario.foto_perfil;
      }
      // Si no es base64, usar la función del servicio
      return this.usuarioService.obtenerUrlFoto(this.usuario.foto_perfil);
    }
    return this.usuarioService.obtenerUrlFoto();
  }

  abrirSelectorArchivo() {
    this.fileInput.nativeElement.click();
  }

  onSeleccionarArchivo(event: any) {
    const archivo = event.target.files[0];
    if (!archivo) {
      console.log('No se seleccionó ningún archivo');
      return;
    }

    console.log('Archivo seleccionado:', archivo.name, archivo.size, archivo.type);

    // Validar formato
    if (!this.usuarioService.validarFormatoImagen(archivo)) {
      this.mostrarNotificacion('Formato no válido. Use JPG, PNG o GIF.', 'error');
      return;
    }

    // Validar tamaño
    if (!this.usuarioService.validarTamañoImagen(archivo)) {
      this.mostrarNotificacion('La imagen es muy grande. Máximo 5MB.', 'error');
      return;
    }

    console.log('Validaciones pasadas, subiendo foto...');
    this.subirFoto(archivo);
  }

  subirFoto(archivo: File) {
    if (!this.usuario?.id_usuario) {
      console.error('No hay usuario logueado');
      this.mostrarNotificacion('No se encontró información del usuario', 'error');
      return;
    }

    console.log('Subiendo foto para usuario ID:', this.usuario.id_usuario);
    
    this.usuarioService.subirFotoPerfil(this.usuario.id_usuario, archivo).subscribe({
      next: (response) => {
        console.log('Respuesta subida de foto:', response);
        if (this.usuario) {
          // Actualizar la foto en el objeto usuario local
          this.usuario.foto_perfil = response.foto_url;
          
          // Notificar al servicio para que actualice todos los componentes suscritos
          this.usuarioService.actualizarUsuarioLocal(this.usuario);
          
          this.mostrarNotificacion('Foto actualizada correctamente', 'exito');
          
          // Limpiar el input para permitir seleccionar el mismo archivo otra vez
          if (this.fileInput) {
            this.fileInput.nativeElement.value = '';
          }
        }
      },
      error: (error) => {
        console.error('Error al subir foto:', error);
        this.mostrarNotificacion('Error al actualizar la foto', 'error');
      }
    });
  }

  eliminarFoto() {
    if (!this.usuario?.id_usuario) return;

    this.sweetAlert.confirmDelete(
      '¿Eliminar foto de perfil?', 
      'Esta acción eliminará tu foto de perfil actual'
    ).then((result) => {
      if (result.isConfirmed && this.usuario?.id_usuario) {
        this.usuarioService.eliminarFotoPerfil(this.usuario.id_usuario).subscribe({
        next: () => {
          if (this.usuario) {
            // Eliminar la foto del objeto usuario local
            delete this.usuario.foto_perfil;
            
            // Notificar al servicio para que actualice todos los componentes suscritos
            this.usuarioService.actualizarUsuarioLocal(this.usuario);
            
            // También limpiar datos específicos del perfil extendido
            const perfilKey = `perfil_extendido_${this.usuario.id_usuario}`;
            const datosLocales = localStorage.getItem(perfilKey);
            if (datosLocales) {
              try {
                const perfil = JSON.parse(datosLocales);
                delete perfil.foto_perfil;
                localStorage.setItem(perfilKey, JSON.stringify(perfil));
              } catch (e) {
                console.log('Error al actualizar perfil extendido');
              }
            }
            
            this.mostrarNotificacion('Foto eliminada correctamente', 'exito');
          }
        },
        error: (error) => {
          console.error('Error al eliminar foto:', error);
          this.mostrarNotificacion('Error al eliminar la foto', 'error');
        }
        });
      }
    });
  }

  // === GESTIÓN DE PERFIL ===

  toggleEditarPerfil() {
    this.editandoPerfil = !this.editandoPerfil;
    if (!this.editandoPerfil) {
      this.cancelarEdicion();
    }
  }

  cancelarEdicion() {
    this.perfilForm.patchValue(this.datosOriginales);
    this.editandoPerfil = false;
  }

  guardarPerfil() {
    console.log('Guardando perfil...');
    console.log('Formulario válido:', this.perfilForm.valid);
    console.log('Datos del formulario:', this.perfilForm.value);
    
    if (this.perfilForm.valid && this.usuario?.id_usuario) {
      const datosActualizados = this.perfilForm.value;
      
      console.log('Enviando actualización de perfil para usuario ID:', this.usuario.id_usuario);
      
      this.usuarioService.actualizarPerfil(this.usuario.id_usuario, datosActualizados).subscribe({
        next: (response) => {
          console.log('Perfil actualizado exitosamente:', response);
          this.datosOriginales = { ...datosActualizados };
          this.editandoPerfil = false;
          
          // Actualizar datos locales
          if (this.usuario) {
            Object.assign(this.usuario, datosActualizados);
            this.usuarioService.actualizarUsuarioLocal(this.usuario);
          }
          
          this.mostrarNotificacion('Perfil actualizado correctamente', 'exito');
        },
        error: (error) => {
          console.error('Error al actualizar perfil:', error);
          let mensajeError = 'Error al actualizar el perfil';
          if (error.error?.message) {
            mensajeError = error.error.message;
          }
          this.mostrarNotificacion(mensajeError, 'error');
        }
      });
    } else {
      console.error('Formulario inválido o usuario no encontrado');
      if (!this.perfilForm.valid) {
        console.error('Errores del formulario:', this.perfilForm.errors);
      }
      this.mostrarNotificacion('Por favor completa los campos obligatorios correctamente', 'error');
    }
  }

  // === GESTIÓN DE CONTRASEÑA ===

  toggleCambiarPassword() {
    this.cambiandoPassword = !this.cambiandoPassword;
    if (!this.cambiandoPassword) {
      this.cancelarCambioPassword();
    }
  }

  cancelarCambioPassword() {
    this.passwordForm.reset();
    this.cambiandoPassword = false;
  }

  cambiarPassword() {
    console.log('Intentando cambiar contraseña...');
    console.log('Formulario válido:', this.passwordForm.valid);
    console.log('Usuario ID:', this.usuario?.id_usuario);
    
    if (this.passwordForm.valid && this.usuario?.id_usuario) {
      const { passwordActual, nuevaPassword, confirmarPassword } = this.passwordForm.value;
      
      console.log('Datos del formulario:', { passwordActual: '***', nuevaPassword: '***', confirmarPassword: '***' });
      
      if (nuevaPassword !== confirmarPassword) {
        this.mostrarNotificacion('Las contraseñas no coinciden', 'error');
        return;
      }

      const datosPassword = {
        password_actual: passwordActual,
        password_nueva: nuevaPassword,
        confirmar_password: confirmarPassword
      };

      console.log('Enviando petición de cambio de contraseña...');
      
      this.usuarioService.cambiarPassword(this.usuario.id_usuario, datosPassword).subscribe({
        next: (response) => {
          console.log('Respuesta exitosa:', response);
          this.passwordForm.reset();
          this.cambiandoPassword = false;
          this.mostrarNotificacion('Contraseña actualizada correctamente', 'exito');
        },
        error: (error) => {
          console.error('Error al cambiar contraseña:', error);
          let mensajeError = 'Error al cambiar la contraseña';
          if (error.error?.message) {
            mensajeError = error.error.message;
          }
          this.mostrarNotificacion(mensajeError, 'error');
        }
      });
    } else {
      console.error('Formulario inválido o usuario no encontrado');
      if (!this.passwordForm.valid) {
        console.error('Errores del formulario:', this.passwordForm.errors);
      }
      this.mostrarNotificacion('Por favor completa todos los campos correctamente', 'error');
    }
  }

  obtenerFuerzaPassword(): string {
    const password = this.passwordForm.get('nuevaPassword')?.value || '';
    if (!password) return 'sin-password';
    
    const validacion = this.usuarioService.validarFortalezaPassword(password);
    
    if (validacion.puntuacion >= 80) return 'fuerte';
    if (validacion.puntuacion >= 60) return 'media';
    if (validacion.puntuacion >= 40) return 'debil';
    return 'muy-debil';
  }

  obtenerTextoFuerza(): string {
    const fuerza = this.obtenerFuerzaPassword();
    switch (fuerza) {
      case 'fuerte': return 'Muy segura';
      case 'media': return 'Segura';
      case 'debil': return 'Débil';
      case 'muy-debil': return 'Muy débil';
      default: return '';
    }
  }

  // === UTILIDADES ===

  mostrarNotificacion(mensaje: string, tipo: 'exito' | 'error') {
    this.textoMensaje = mensaje;
    this.tipoMensaje = tipo;
    this.mostrandoMensaje = true;
    
    setTimeout(() => {
      this.cerrarMensaje();
    }, 5000);
  }

  cerrarMensaje() {
    this.mostrandoMensaje = false;
  }


}