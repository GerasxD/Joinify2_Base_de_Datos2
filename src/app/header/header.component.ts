import { Component, OnInit, HostListener } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { environment } from '../app.config';
import { UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, DatePipe],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  userName: string = '';
  userPhoto: string = '';
  userId: number | null = null;
  showUserMenu = false;
  showNotificaciones = false;
  notificaciones: any[] = [];
  showPagosPopup = false;
  historialPagos: any[] = [];
  datePipe = new DatePipe('es');
  showMobileMenu = false;

  constructor(
    private router: Router, 
    private http: HttpClient,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
    this.userName = localStorage.getItem('username') || '';
    this.userId = parseInt(localStorage.getItem('userId') || '0') || null;
    this.cargarFotoPerfil();
    
    // Suscribirse a cambios en el usuario (para actualizar foto)
    this.usuarioService.usuarioActual$.subscribe(usuario => {
      if (usuario) {
        this.userName = usuario.nombre || this.userName;
        this.userId = usuario.id_usuario || this.userId;
        
        // Actualizar foto - si hay foto la usa, si no usa la por defecto
        if (usuario.foto_perfil) {
          this.userPhoto = usuario.foto_perfil;
        } else {
          // Si el usuario no tiene foto (se eliminó), usar imagen por defecto
          this.userPhoto = this.obtenerFotoDefecto();
        }
      }
    });
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('username') !== null;
  }

  logout(): void {
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    localStorage.removeItem('usuario');
    localStorage.removeItem('authToken');
    
    // Limpiar datos del usuario
    this.userName = '';
    this.userPhoto = '';
    this.userId = null;
    
    // Limpiar servicio de usuario
    this.usuarioService.limpiarUsuario();
    
    this.closeMenus();
    this.router.navigate(['/login']);
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
    if (this.showUserMenu) this.showNotificaciones = false;
  }

  toggleNotificaciones() {
    this.showNotificaciones = !this.showNotificaciones;
    if (this.showNotificaciones) {
      this.showUserMenu = false;
      this.cargarNotificaciones();
    }
  }

  togglePagosPopup() {
    this.showPagosPopup = !this.showPagosPopup;
    if (this.showPagosPopup) {
      this.showNotificaciones = false;
      this.showUserMenu = false;
      this.cargarHistorialPagos();
    }
  }

  closeMenus() {
    this.showUserMenu = false;
    this.showNotificaciones = false;
  }

  toggleMobileMenu() {
    this.showMobileMenu = !this.showMobileMenu;
    // Prevenir scroll del body cuando el menú está abierto
    if (this.showMobileMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  closeMobileMenu() {
    this.showMobileMenu = false;
    document.body.style.overflow = '';
    this.closeMenus();
  }

  // Formatea la fecha a dd/MM/yyyy
  formatFecha(fecha: string): string {
    if (!fecha) return '';
    return this.datePipe.transform(fecha, 'dd/MM/yyyy') || '';
  }

  // Obtener notificaciones del usuario
  cargarNotificaciones() {
    const userId = localStorage.getItem('userId');
    console.log('Cargando notificaciones para usuario:', userId);
    if (userId) {
      this.http.get<any[]>(`${environment.apiUrl}/api/notificaciones/${userId}`)
        .subscribe({
          next: (data) => {
            console.log('Notificaciones recibidas del servidor:', data);
            // Formatear la fecha de cada notificación
            this.notificaciones = data.map(n => ({
              ...n,
              fecha_envio_formateada: this.formatFecha(n.fecha_envio)
            }));
            console.log('Notificaciones formateadas:', this.notificaciones);
          },
          error: (error) => {
            console.error('Error al cargar notificaciones:', error);
          }
        });
    } else {
      console.log('No se encontró userId en localStorage');
    }
  }

  // Marcar una notificación como leída
  marcarComoLeida(id_notificacion: number) {
    this.http.put(`${environment.apiUrl}/api/notificaciones/${id_notificacion}/leida`, {})
      .subscribe(() => {
        const notif = this.notificaciones.find(n => n.id_notificacion === id_notificacion);
        if (notif) notif.estado = 'leida';
      });
  }

  // Eliminar una notificación
  eliminarNotificacion(id_notificacion: number) {
    this.http.put(`${environment.apiUrl}/api/notificaciones/${id_notificacion}/eliminar`, {})
      .subscribe(() => {
        // Opcional: quitar del array localmente para respuesta inmediata
        const notif = this.notificaciones.find(n => n.id_notificacion === id_notificacion);
        if (notif) notif.estado = 'eliminada';
      });
  }

  // Cargar historial de pagos del usuario
  cargarHistorialPagos() {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.http.get<any[]>(`${environment.apiUrl}/api/historial_pagos?userId=${userId}`)
        .subscribe(pagos => {
          // Formatear la fecha de cada pago
          this.historialPagos = pagos.map(p => ({
            ...p,
            fecha_pago_formateada: this.formatFecha(p.fecha_pago)
          }));
        });
    }
  }

  // Cerrar menús al hacer clic fuera
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    const userMenuContainer = target.closest('.user-menu-container');
    const notificacionesPopup = target.closest('.notificaciones-popup');

    if (!userMenuContainer && this.showUserMenu) {
      this.showUserMenu = false;
    }
    if (!notificacionesPopup && this.showNotificaciones) {
      this.showNotificaciones = false;
    }
  }

  trackById(index: number, item: any) {
    return item.id_notificacion;
  }

  // Cargar foto de perfil del usuario
  cargarFotoPerfil(): void {
    // 1. Verificar si hay usuario en el servicio (más actualizado)
    const usuarioActual = this.usuarioService.usuarioActual;
    if (usuarioActual?.foto_perfil) {
      this.userPhoto = usuarioActual.foto_perfil;
      return;
    }

    // 2. Obtener datos locales (localStorage específico del perfil)
    if (this.userId) {
      const datosLocales = localStorage.getItem(`perfil_extendido_${this.userId}`);
      if (datosLocales) {
        try {
          const perfil = JSON.parse(datosLocales);
          if (perfil.foto_perfil) {
            this.userPhoto = perfil.foto_perfil;
            return;
          }
        } catch (e) {
          console.log('Error parsing datos locales de perfil');
        }
      }

      // 3. Verificar en el usuario general del localStorage
      const usuarioStorage = localStorage.getItem('usuario');
      if (usuarioStorage) {
        try {
          const usuario = JSON.parse(usuarioStorage);
          if (usuario.foto_perfil) {
            this.userPhoto = usuario.foto_perfil;
            return;
          }
        } catch (e) {
          console.log('Error parsing usuario from localStorage');
        }
      }
    }
    
    // Si no hay foto en ningún lado, usar imagen por defecto
    this.userPhoto = this.obtenerFotoDefecto();
  }

  // Obtener URL de foto por defecto
  obtenerFotoDefecto(): string {
    return '/assets/imagenes/default-avatar.svg';
  }

  // Obtener la foto actual (para usar en el template)
  obtenerFotoPerfil(): string {
    return this.userPhoto || this.obtenerFotoDefecto();
  }
}