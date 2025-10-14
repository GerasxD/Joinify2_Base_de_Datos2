import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { UnirGrupoComponent } from './unirgrupo.component';
import { SweetAlertService } from '../services/sweet-alert.service';

describe('UnirGrupoComponent - Pruebas Unitarias', () => {
  let component: UnirGrupoComponent;
  let fixture: ComponentFixture<UnirGrupoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        UnirGrupoComponent,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        SweetAlertService
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnirGrupoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente correctamente', () => {
    expect(component).toBeTruthy();
  });

  // ===== PRUEBA 1: Método limpiarFiltros() =====
  describe('Prueba del método limpiarFiltros()', () => {
    it('debe limpiar todos los filtros y restaurar grupos disponibles', () => {
      // Arrange (Preparar): Configurar datos de prueba
      component.gruposDisponibles = [
        { id: 1, name: 'Grupo Netflix', serviceType: 'Netflix', maxUsers: 4, currentUsers: 2, costPerUser: 50, paymentPolicy: 'monthly' },
        { id: 2, name: 'Grupo Disney', serviceType: 'Disney Plus', maxUsers: 4, currentUsers: 3, costPerUser: 40, paymentPolicy: 'monthly' }
      ];
      
      // Simular que hay filtros activos
      component.terminoBusqueda = 'Netflix';
      component.plataformaSeleccionada = 'Netflix';
      component.filtroPlataformaActivo = true;
      component.gruposFiltrados = [component.gruposDisponibles[0]]; // Solo 1 grupo filtrado

      // Act (Actuar): Ejecutar el método a probar
      component.limpiarFiltros();

      // Assert (Verificar): Comprobar los resultados
      expect(component.terminoBusqueda).toBe('');
      expect(component.plataformaSeleccionada).toBe('');
      expect(component.filtroPlataformaActivo).toBe(false);
      expect(component.gruposFiltrados.length).toBe(2);
      expect(component.gruposFiltrados).toEqual(component.gruposDisponibles);
      
      console.log('✅ PRUEBA EXITOSA: limpiarFiltros() funciona correctamente');
    });
  });

  // ===== PRUEBA 2: Método aplicarTodosFiltros() con búsqueda =====
  describe('Prueba del método aplicarTodosFiltros() - Filtro por búsqueda', () => {
    it('debe filtrar grupos por término de búsqueda en el nombre', () => {
      // Arrange
      component.gruposDisponibles = [
        { id: 1, name: 'Grupo Netflix Premium', serviceType: 'Netflix', maxUsers: 4, currentUsers: 2, costPerUser: 50, paymentPolicy: 'monthly' },
        { id: 2, name: 'Grupo Disney Familiar', serviceType: 'Disney Plus', maxUsers: 4, currentUsers: 3, costPerUser: 40, paymentPolicy: 'monthly' },
        { id: 3, name: 'Grupo HBO Max', serviceType: 'HBO Max', maxUsers: 3, currentUsers: 1, costPerUser: 60, paymentPolicy: 'monthly' }
      ];
      component.terminoBusqueda = 'netflix';
      component.plataformaSeleccionada = '';

      // Act
      component.aplicarTodosFiltros();

      // Assert
      expect(component.gruposFiltrados.length).toBe(1);
      expect(component.gruposFiltrados[0].name).toContain('Netflix');
      
      console.log('✅ PRUEBA EXITOSA: Filtrado por búsqueda funciona correctamente');
    });

    it('debe filtrar grupos por término de búsqueda en el tipo de servicio', () => {
      // Arrange
      component.gruposDisponibles = [
        { id: 1, name: 'Grupo Premium', serviceType: 'Netflix', maxUsers: 4, currentUsers: 2, costPerUser: 50, paymentPolicy: 'monthly' },
        { id: 2, name: 'Grupo Familiar', serviceType: 'Disney Plus', maxUsers: 4, currentUsers: 3, costPerUser: 40, paymentPolicy: 'monthly' }
      ];
      component.terminoBusqueda = 'disney';
      component.plataformaSeleccionada = '';

      // Act
      component.aplicarTodosFiltros();

      // Assert
      expect(component.gruposFiltrados.length).toBe(1);
      expect(component.gruposFiltrados[0].serviceType).toContain('Disney');
      
      console.log('✅ PRUEBA EXITOSA: Filtrado por servicio funciona correctamente');
    });
  });

  // ===== PRUEBA 3: Método aplicarTodosFiltros() con filtro de plataforma =====
  describe('Prueba del método aplicarTodosFiltros() - Filtro por plataforma', () => {
    it('debe filtrar grupos por plataforma seleccionada', () => {
      // Arrange
      component.gruposDisponibles = [
        { id: 1, name: 'Grupo Netflix 1', serviceType: 'Netflix', maxUsers: 4, currentUsers: 2, costPerUser: 50, paymentPolicy: 'monthly' },
        { id: 2, name: 'Grupo Netflix 2', serviceType: 'Netflix', maxUsers: 4, currentUsers: 1, costPerUser: 50, paymentPolicy: 'monthly' },
        { id: 3, name: 'Grupo Disney', serviceType: 'Disney Plus', maxUsers: 4, currentUsers: 3, costPerUser: 40, paymentPolicy: 'monthly' }
      ];
      component.plataformaSeleccionada = 'Netflix';
      component.terminoBusqueda = '';

      // Act
      component.aplicarTodosFiltros();

      // Assert
      expect(component.gruposFiltrados.length).toBe(2);
      component.gruposFiltrados.forEach(grupo => {
        expect(grupo.serviceType.toLowerCase()).toBe('netflix');
      });
      
      console.log('✅ PRUEBA EXITOSA: Filtrado por plataforma funciona correctamente');
    });
  });

  // ===== PRUEBA 4: Método aplicarTodosFiltros() con múltiples filtros =====
  describe('Prueba del método aplicarTodosFiltros() - Múltiples filtros combinados', () => {
    it('debe aplicar tanto búsqueda como filtro de plataforma simultáneamente', () => {
      // Arrange
      component.gruposDisponibles = [
        { id: 1, name: 'Grupo Premium Netflix', serviceType: 'Netflix', maxUsers: 4, currentUsers: 2, costPerUser: 50, paymentPolicy: 'monthly' },
        { id: 2, name: 'Grupo Básico Netflix', serviceType: 'Netflix', maxUsers: 4, currentUsers: 1, costPerUser: 30, paymentPolicy: 'monthly' },
        { id: 3, name: 'Grupo Premium Disney', serviceType: 'Disney Plus', maxUsers: 4, currentUsers: 3, costPerUser: 40, paymentPolicy: 'monthly' }
      ];
      component.terminoBusqueda = 'premium';
      component.plataformaSeleccionada = 'Netflix';

      // Act
      component.aplicarTodosFiltros();

      // Assert
      expect(component.gruposFiltrados.length).toBe(1);
      expect(component.gruposFiltrados[0].name).toContain('Premium Netflix');
      expect(component.gruposFiltrados[0].serviceType).toBe('Netflix');
      
      console.log('✅ PRUEBA EXITOSA: Filtros combinados funcionan correctamente');
    });
  });

  // ===== PRUEBA 5: Método seleccionarPlataforma() =====
  describe('Prueba del método seleccionarPlataforma()', () => {
    it('debe establecer la plataforma seleccionada y aplicar filtros', () => {
      // Arrange
      component.gruposDisponibles = [
        { id: 1, name: 'Grupo HBO', serviceType: 'HBO Max', maxUsers: 3, currentUsers: 1, costPerUser: 60, paymentPolicy: 'monthly' },
        { id: 2, name: 'Grupo Disney', serviceType: 'Disney Plus', maxUsers: 4, currentUsers: 3, costPerUser: 40, paymentPolicy: 'monthly' }
      ];
      const plataforma = 'HBO Max';

      // Act
      component.seleccionarPlataforma(plataforma);

      // Assert
      expect(component.plataformaSeleccionada).toBe(plataforma);
      expect(component.filtroPlataformaActivo).toBe(true);
      expect(component.gruposFiltrados.length).toBe(1);
      expect(component.gruposFiltrados[0].serviceType).toBe('HBO Max');
      
      console.log('✅ PRUEBA EXITOSA: seleccionarPlataforma() funciona correctamente');
    });
  });

  // ===== PRUEBA 6: Validación de lista de plataformas disponibles =====
  describe('Prueba de plataformas disponibles', () => {
    it('debe tener al menos 40 plataformas disponibles', () => {
      // Assert
      expect(component.plataformasDisponibles).toBeDefined();
      expect(component.plataformasDisponibles.length).toBeGreaterThanOrEqual(40);
      expect(component.plataformasDisponibles).toContain('Netflix');
      expect(component.plataformasDisponibles).toContain('Disney Plus');
      expect(component.plataformasDisponibles).toContain('HBO Max');
      
      console.log('✅ PRUEBA EXITOSA: Lista de plataformas está completa');
    });
  });
});
