import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SweetAlertService {
  
  constructor() { }

  // Configuración común para SweetAlert con tema Joinify
  private getCommonConfig() {
    return {
      customClass: {
        popup: 'joinify-swal-popup',
        title: 'joinify-swal-title',
        content: 'joinify-swal-content',
        confirmButton: 'joinify-swal-confirm',
        cancelButton: 'joinify-swal-cancel'
      },
      buttonsStyling: false,
      backdrop: `
        rgba(30, 30, 47, 0.8)
        left top
        no-repeat
      `
    };
  }

  // Alerta de éxito
  success(title: string, text?: string, timer: number = 3000): Promise<any> {
    return Swal.fire({
      ...this.getCommonConfig(),
      icon: 'success',
      title: title,
      text: text,
      timer: timer,
      timerProgressBar: true,
      showConfirmButton: false,
      toast: false,
      position: 'center'
    });
  }

  // Alerta de error
  error(title: string, text?: string): Promise<any> {
    return Swal.fire({
      ...this.getCommonConfig(),
      icon: 'error',
      title: title,
      text: text,
      confirmButtonText: 'Entendido',
      showConfirmButton: true
    });
  }

  // Alerta de advertencia
  warning(title: string, text?: string): Promise<any> {
    return Swal.fire({
      ...this.getCommonConfig(),
      icon: 'warning',
      title: title,
      text: text,
      confirmButtonText: 'OK',
      showConfirmButton: true
    });
  }

  // Alerta de información
  info(title: string, text?: string): Promise<any> {
    return Swal.fire({
      ...this.getCommonConfig(),
      icon: 'info',
      title: title,
      text: text,
      confirmButtonText: 'OK',
      showConfirmButton: true
    });
  }

  // Confirmación (reemplaza confirm)
  confirm(title: string, text?: string, confirmText: string = 'Sí, confirmar', cancelText: string = 'Cancelar'): Promise<any> {
    return Swal.fire({
      ...this.getCommonConfig(),
      icon: 'question',
      title: title,
      text: text,
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      reverseButtons: true
    });
  }

  // Confirmación de eliminación
  confirmDelete(title: string = '¿Estás seguro?', text: string = 'Esta acción no se puede deshacer'): Promise<any> {
    return Swal.fire({
      ...this.getCommonConfig(),
      icon: 'warning',
      title: title,
      text: text,
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      confirmButtonColor: '#d33',
      focusCancel: true
    });
  }

  // Toast notification (esquina superior derecha)
  toast(title: string, icon: 'success' | 'error' | 'warning' | 'info' = 'info', timer: number = 3000): Promise<any> {
    return Swal.fire({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: timer,
      timerProgressBar: true,
      icon: icon,
      title: title,
      customClass: {
        popup: 'joinify-toast-popup'
      },
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      }
    });
  }

  // Alerta con input (reemplaza prompt)
  input(title: string, text?: string, placeholder?: string, inputType: 'text' | 'email' | 'password' | 'number' = 'text'): Promise<any> {
    return Swal.fire({
      ...this.getCommonConfig(),
      title: title,
      text: text,
      input: inputType,
      inputPlaceholder: placeholder,
      showCancelButton: true,
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value) {
          return 'Este campo es requerido';
        }
        return null;
      }
    });
  }

  // Loading/Progress
  loading(title: string = 'Procesando...', text?: string): void {
    Swal.fire({
      ...this.getCommonConfig(),
      title: title,
      text: text,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }

  // Cerrar cualquier alerta activa
  close(): void {
    Swal.close();
  }
}
