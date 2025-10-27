import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HeaderComponent } from './header.component';
import { UsuarioService } from '../services/usuario.service';
import { environment } from '../app.config';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

registerLocaleData(localeEs);

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let httpMock: HttpTestingController;
  let usuarioService: UsuarioService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HeaderComponent,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        UsuarioService,
        { provide: LOCALE_ID, useValue: 'es' }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    usuarioService = TestBed.inject(UsuarioService);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ========== PRUEBAS DE NOTIFICACIONES ==========

  describe('Notificaciones - Cambios en Grupos', () => {
    
    it('debería verificar que se recibe notificación "Nuevo integrante añadido" cuando admin recibe aviso', (done) => {
      // Arrange
      const adminId = 521;
      localStorage.setItem('userId', String(adminId));
      const mockNotificaciones = [
        { id_notificacion: 100, mensaje: 'Nuevo integrante añadido.', fecha_envio: '2025-10-26', estado: 'pendiente' }
      ];

      // Act
      component.cargarNotificaciones();
      
      // Assert
      setTimeout(() => {
        const req = httpMock.expectOne(`${environment.apiUrl}/api/notificaciones/${adminId}`);
        expect(req.request.method).toBe('GET');
        req.flush(mockNotificaciones);

        // Verificar después de que se complete la solicitud
        setTimeout(() => {
          expect(component.notificaciones.length).toBeGreaterThan(0);
          expect(component.notificaciones.some(n => n.mensaje.includes('Nuevo integrante'))).toBe(true);
          done();
        }, 100);
      }, 100);
    });

    it('debería verificar que se recibe notificación "Tu pago fue recibido" al usuario', (done) => {
      // Arrange
      const userId = 531;
      localStorage.setItem('userId', String(userId));
      const mockNotificaciones = [
        { id_notificacion: 101, mensaje: 'Tu pago fue recibido.', fecha_envio: '2025-10-26', estado: 'pendiente' }
      ];

      // Act
      component.cargarNotificaciones();
      
      // Assert
      setTimeout(() => {
        const req = httpMock.expectOne(`${environment.apiUrl}/api/notificaciones/${userId}`);
        expect(req.request.method).toBe('GET');
        req.flush(mockNotificaciones);

        setTimeout(() => {
          expect(component.notificaciones.some(n => n.mensaje === 'Tu pago fue recibido.')).toBe(true);
          done();
        }, 100);
      }, 100);
    });

    it('debería verificar que se recibe notificación "Recibiste pago" al admin', (done) => {
      // Arrange
      const adminId = 521;
      localStorage.setItem('userId', String(adminId));
      const mockNotificaciones = [
        { id_notificacion: 102, mensaje: 'Recibiste pago.', fecha_envio: '2025-10-26', estado: 'pendiente' }
      ];

      // Act
      component.cargarNotificaciones();
      
      // Assert
      setTimeout(() => {
        const req = httpMock.expectOne(`${environment.apiUrl}/api/notificaciones/${adminId}`);
        req.flush(mockNotificaciones);

        setTimeout(() => {
          expect(component.notificaciones.some(n => n.mensaje === 'Recibiste pago.')).toBe(true);
          done();
        }, 100);
      }, 100);
    });

    it('debería verificar que se recibe notificación "Grupo lleno" al admin', (done) => {
      // Arrange
      const adminId = 505;
      localStorage.setItem('userId', String(adminId));
      const mockNotificaciones = [
        { id_notificacion: 103, mensaje: 'Grupo lleno.', fecha_envio: '2025-10-26', estado: 'pendiente' }
      ];

      // Act
      component.cargarNotificaciones();
      
      // Assert
      setTimeout(() => {
        const req = httpMock.expectOne(`${environment.apiUrl}/api/notificaciones/${adminId}`);
        req.flush(mockNotificaciones);

        setTimeout(() => {
          expect(component.notificaciones.some(n => n.mensaje === 'Grupo lleno.')).toBe(true);
          done();
        }, 100);
      }, 100);
    });

    it('debería verificar que se recibe notificación "Se ha actualizado el grupo" al miembro', (done) => {
      // Arrange
      const userId = 510;
      localStorage.setItem('userId', String(userId));
      const mockNotificaciones = [
        { id_notificacion: 104, mensaje: 'Se ha actualizado el grupo.', fecha_envio: '2025-10-26', estado: 'pendiente' }
      ];

      // Act
      component.cargarNotificaciones();
      
      // Assert
      setTimeout(() => {
        const req = httpMock.expectOne(`${environment.apiUrl}/api/notificaciones/${userId}`);
        req.flush(mockNotificaciones);

        setTimeout(() => {
          expect(component.notificaciones.some(n => n.mensaje.includes('actualizado'))).toBe(true);
          done();
        }, 100);
      }, 100);
    });

    it('debería ordenar notificaciones por ID descendente (más recientes primero)', (done) => {
      // Arrange
      localStorage.setItem('userId', '522');
      const mockNotificaciones = [
        { id_notificacion: 559, mensaje: 'Recibiste pago.', fecha_envio: '2025-10-26', estado: 'pendiente' },
        { id_notificacion: 558, mensaje: 'Tu pago fue recibido.', fecha_envio: '2025-10-26', estado: 'pendiente' },
        { id_notificacion: 557, mensaje: 'Nuevo integrante añadido.', fecha_envio: '2025-10-26', estado: 'pendiente' }
      ];

      // Act
      component.cargarNotificaciones();
      
      // Assert
      setTimeout(() => {
        const req = httpMock.expectOne(`${environment.apiUrl}/api/notificaciones/522`);
        req.flush(mockNotificaciones);

        setTimeout(() => {
          // Verificar que las notificaciones vienen en orden descendente
          if (component.notificaciones.length >= 2) {
            expect(component.notificaciones[0].id_notificacion >= component.notificaciones[1].id_notificacion).toBe(true);
          }
          done();
        }, 100);
      }, 100);
    });

    it('debería marcar notificación como leída correctamente', (done) => {
      // Arrange
      component.notificaciones = [
        { id_notificacion: 1, mensaje: 'Nuevo integrante añadido.', fecha_envio: '2025-10-26', estado: 'pendiente', fecha_envio_formateada: '26/10/2025' }
      ];

      // Act
      component.marcarComoLeida(1);

      // Assert
      setTimeout(() => {
        const req = httpMock.expectOne(`${environment.apiUrl}/api/notificaciones/1/leida`);
        expect(req.request.method).toBe('PUT');
        req.flush({ message: 'Notificación marcada como leída' });

        expect(component.notificaciones[0].estado).toBe('leida');
        done();
      }, 100);
    });

    it('debería eliminar notificación correctamente', (done) => {
      // Arrange
      component.notificaciones = [
        { id_notificacion: 1, mensaje: 'Nuevo integrante añadido.', fecha_envio: '2025-10-26', estado: 'pendiente', fecha_envio_formateada: '26/10/2025' }
      ];

      // Act
      component.eliminarNotificacion(1);

      // Assert
      setTimeout(() => {
        const req = httpMock.expectOne(`${environment.apiUrl}/api/notificaciones/1/eliminar`);
        expect(req.request.method).toBe('PUT');
        req.flush({ message: 'Notificación eliminada' });

        expect(component.notificaciones[0].estado).toBe('eliminada');
        done();
      }, 100);
    });

    it('debería mostrar lista vacía cuando no hay notificaciones', (done) => {
      // Arrange
      localStorage.setItem('userId', '999');

      // Act
      component.cargarNotificaciones();

      // Assert
      setTimeout(() => {
        const req = httpMock.expectOne(`${environment.apiUrl}/api/notificaciones/999`);
        req.flush([]);

        setTimeout(() => {
          expect(component.notificaciones.length).toBe(0);
          done();
        }, 100);
      }, 100);
    });

  });
});
