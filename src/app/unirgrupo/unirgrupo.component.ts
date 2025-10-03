import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { environment } from '../app.config';
import { SweetAlertService } from '../services/sweet-alert.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-unirgrupo',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './unirgrupo.component.html',
  styleUrl: './unirgrupo.component.css'
})

export class UnirGrupoComponent implements OnInit {

  gruposDisponibles: any[] = [];
  gruposFiltrados: any[] = [];
  
  // Propiedades para el buscador
  terminoBusqueda: string = '';
  
  // Propiedades para el filtro de plataforma
  plataformaSeleccionada: string = '';
  filtroPlataformaActivo: boolean = false;
  
  // Lista de todas las plataformas disponibles
  plataformasDisponibles: string[] = [
    'Netflix',
    'Disney Plus', 
    'Amazon Prime',
    'HBO Max',
    'Apple TV',
    'Hulu',
    'Paramount+',
    'Star+',
    'Crunchyroll',
    'YouTube Premium',
    'Tubi',
    'Pluto TV',
    'Rakuten TV',
    'Mubi',
    'Funimation',
    'DAZN',
    'Plex',
    'Kanopy',
    'Acorn TV',
    'CuriosityStream',
    'Shudder',
    'Discovery+',
    'BritBox',
    'Sundance Now',
    'FuboTV',
    'Xumo Play',
    'PopcornFlix',
    'Redbox Free Live TV',
    'Vix',
    'Sling TV',
    'The Roku Channel',
    'Hayu',
    'Crackle',
    'Topic',
    'AMC Presents Plus',
    'Binge',
    'Shahid',
    'Cinepolis kLIC',
    'Claro Video',
    'Televisa Univision+',
    'AMCT',
    'StarzPlay',
    'Vix Cine Now',
    'Discovery Familia GO',
    'Claro Now',
    'MagellanTV',
    'Pantaya Movies Now',
    'Pantaya'
  ];

  constructor(
    private http: HttpClient, 
    private router: Router,
    private sweetAlert: SweetAlertService
  ) {}

  ngOnInit(): void {
    this.obtenerGruposDisponibles(); // Cargar los grupos disponibles
  }

  obtenerGruposDisponibles(): void {
    const usuarioId = localStorage.getItem('userId');
    if (!usuarioId) {
        this.sweetAlert.warning('No autorizado', 'Usuario no identificado. Por favor, inicia sesión.');
        return;
    }


    this.http.get<any[]>(`${environment.apiUrl}/gruposdisponibles/${usuarioId}`)

      .subscribe(
        data => {
          this.gruposDisponibles = data.map(grupo => ({
            id: grupo.id_grupo_suscripcion,
            name: grupo.nombre_grupo,
            serviceType: grupo.nombre_servicio,
            maxUsers: grupo.num_integrantes,
            currentUsers: grupo.currentUsers,
            costPerUser: grupo.costo_total / grupo.num_integrantes,
            paymentPolicy: grupo.fecha_inicio && grupo.fecha_vencimiento
              ? this.calcularPoliticaPago(grupo.fecha_inicio, grupo.fecha_vencimiento)
              : ''
          }));
          
          // Inicializar grupos filtrados
          this.gruposFiltrados = [...this.gruposDisponibles];
        },
        error => {
          console.error('Error al obtener los grupos', error);
        }
      );
}


   unirseAGrupo(grupoId: number): void {
    const usuarioId = localStorage.getItem('userId');
    if (!usuarioId) {
      this.sweetAlert.error('No autorizado', 'Debes iniciar sesión para unirte a un grupo').then(() => {
        this.router.navigate(['/login']);
      });
      return;
    }


    this.http.post<any>(`${environment.apiUrl}/api/grupos/unirse`, {
      groupId: grupoId,
      userId: usuarioId
    })
    .subscribe(
      response => {
        this.sweetAlert.success('¡Éxito!', 'Te has unido al grupo exitosamente').then(() => {
          this.obtenerGruposDisponibles();
        });
      },
      error => {
        this.sweetAlert.error('Error', 'No se pudo unir al grupo: ' + error.error.message);
      }
    );
  }
    
    actualizarDisponibilidad(groupId: number) {

      this.http.put<any>(`${environment.apiUrl}/api/servicio-suscripcion/actualizar/${groupId}`, {})

        .subscribe(
          (response) => {
            console.log(response.message, 'Disponibilidad:', response.disponibilidad);
            this.sweetAlert.info('Disponibilidad actualizada', `La disponibilidad del grupo se actualizó a: ${response.disponibilidad}`);
          },
          (error) => {
            console.error('Error al actualizar la disponibilidad:', error);
            this.sweetAlert.error('Error', 'Error al verificar o actualizar la disponibilidad.');
          }
        );
    }
    
    // Métodos para el buscador
    filtrarPorBusqueda(): void {
      this.aplicarTodosFiltros();
    }
    
    // Métodos para filtrar por plataforma
    aplicarFiltroPlataforma(): void {
      this.filtroPlataformaActivo = true;
      this.aplicarTodosFiltros();
    }
    
    // Método combinado que aplica búsqueda y filtros de plataforma
    aplicarTodosFiltros(): void {
      let gruposFiltrados = [...this.gruposDisponibles];
      
      // Aplicar filtro de búsqueda
      if (this.terminoBusqueda.trim()) {
        gruposFiltrados = gruposFiltrados.filter(grupo =>
          grupo.name.toLowerCase().includes(this.terminoBusqueda.toLowerCase()) ||
          grupo.serviceType.toLowerCase().includes(this.terminoBusqueda.toLowerCase())
        );
      }
      
      // Aplicar filtro de plataforma
      if (this.plataformaSeleccionada) {
        gruposFiltrados = gruposFiltrados.filter(grupo => 
          grupo.serviceType.toLowerCase() === this.plataformaSeleccionada.toLowerCase()
        );
      }
      
      this.gruposFiltrados = gruposFiltrados;
    }
    
    // Método para seleccionar plataforma predefinida
    seleccionarPlataforma(plataforma: string): void {
      this.plataformaSeleccionada = plataforma;
      this.aplicarFiltroPlataforma();
    }
    
    limpiarFiltros(): void {
      this.terminoBusqueda = '';
      this.plataformaSeleccionada = '';
      this.filtroPlataformaActivo = false;
      this.gruposFiltrados = [...this.gruposDisponibles];
    }
    
    calcularPoliticaPago(fechaInicio: string, fechaVencimiento: string): string {
      // Lógica para calcular la política de pago basada en las fechas
      // Por ejemplo, si la fecha de inicio es este mes, el pago es mensual
      // Si la fecha de vencimiento es dentro de 3 meses, puede ser trimestral, etc.
      // Retorna una cadena que describa la política de pago
      return 'monthly'; // Placeholder, implementar lógica real
    }
}