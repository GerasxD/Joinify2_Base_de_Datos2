import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { environment } from '../app.config';
import { SweetAlertService } from '../services/sweet-alert.service';

interface Servicio {
  id: number;
  nombre_servicio: string; // <- nombrado como aparece en plantilla
  // ...otros campos si aplica
}

@Component({
  selector: 'app-creaciongrupo',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './creaciongrupo.component.html',
  styleUrl: './creaciongrupo.component.css'
})
export class CreaciongrupoComponent implements OnInit {
  groupData: {
    name: string;
    serviceType: string;
    maxUsers: number | null;
    costPerUser: number;
    totalCost: number;
    paymentPolicy: 'monthly' | 'annual';
    accountEmail: string;
    accountPassword: string;
  } = {
    name: '',
    serviceType: '',
    maxUsers: null,
    costPerUser: 0,
    totalCost: 0,
    paymentPolicy: 'monthly',
    accountEmail: '',
    accountPassword: ''
  };

  costPerUser: number = 0; // Para mostrar en el template

  serviceList: Servicio[] = [];

  constructor(
    private http: HttpClient, 
    private router: Router,
    private sweetAlert: SweetAlertService
  ) {
    this.loadServices();
  }
  ngOnInit(): void {
    // Método implementado - cargar servicios se hace en constructor
  }

  loadServices() {
    console.log('Intentando cargar servicios...');
    this.http.get<Servicio[]>(`${environment.apiUrl}/api/servicios`)
      .subscribe({
        next: (data) => {
          console.log('Servicios cargados:', data);
          this.serviceList = data;
        },
        error: (error) => {
          console.error('Error al cargar servicios:', error);
          if (error.status === 0) {
            console.error('No se puede conectar al servidor. Verifica que el backend esté corriendo en puerto 3001');
            this.sweetAlert.error('Error de conexión', 'No se puede conectar al servidor. Verifica que el backend esté funcionando.');
          } else {
            this.sweetAlert.error('Error', 'Hubo un problema al cargar los servicios disponibles.');
          }
        }
      });
  }

  private isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Calcular costo por usuario cuando cambie el costo total o número de usuarios
  calculateCostPerUser() {
    if (this.groupData.maxUsers && this.groupData.maxUsers > 0 && this.groupData.totalCost > 0) {
      // Calcular y redondear a 2 decimales
      const calculated = this.groupData.totalCost / this.groupData.maxUsers;
      this.costPerUser = Math.round(calculated * 100) / 100;
      this.groupData.costPerUser = this.costPerUser;
    } else {
      this.costPerUser = 0;
      this.groupData.costPerUser = 0;
    }
  }

  onSubmit() {
    if (!this.groupData.name || !this.groupData.serviceType || !this.groupData.maxUsers || !this.groupData.totalCost) {
      this.sweetAlert.warning('Campos incompletos', 'Por favor, completa todos los campos obligatorios.');
      return;
    }
    
    // Calcular el costo por usuario final antes de enviar
    this.calculateCostPerUser();
    if (!this.isValidEmail(this.groupData.accountEmail)) {
      this.sweetAlert.error('Email inválido', 'Ingresa un correo válido para la cuenta del servicio.');
      return;
    }
    if (String(this.groupData.accountPassword).length < 6) {
      this.sweetAlert.error('Contraseña muy corta', 'La contraseña de la cuenta debe tener al menos 6 caracteres.');
      return;
    }

    const userId = localStorage.getItem('userId');
    if (!userId) {
      this.sweetAlert.error('No autorizado', 'No se puede crear el grupo. Debes iniciar sesión.');
      return;
    }

    const payload = {
      name: this.groupData.name,
      serviceType: this.groupData.serviceType,
      maxUsers: this.groupData.maxUsers,
      costPerUser: Number(this.groupData.costPerUser) || 0,
      paymentPolicy: this.groupData.paymentPolicy,
      userId: parseInt(userId, 10),
      accountEmail: this.groupData.accountEmail,
      accountPassword: this.groupData.accountPassword
    };

    this.http.post<{ id_grupo_suscripcion: number }>(`${environment.apiUrl}/api/grupos/crear`, payload)
      .subscribe(
        (response) => {
          this.sweetAlert.success('¡Grupo creado exitosamente!', 'Tu grupo ha sido creado correctamente. Serás redirigido a la página de inicio.').then(() => {
            // Redirigir a la página de inicio en lugar de unirgrupo
            this.router.navigate(['/']);
          }).catch((error) => {
            console.error('Error en navegación:', error);
            // En caso de error, navegar directamente sin esperar
            this.router.navigate(['/']);
          });
        },
        (error) => {
          console.error('Error:', error);
          if (error.status === 409) {
            this.sweetAlert.error('Error al crear grupo', 'Ya existe un grupo con ese nombre o configuración.');
          } else if (error.status === 400) {
            this.sweetAlert.error('Datos inválidos', 'Verifica que todos los datos estén correctos.');
          } else {
            this.sweetAlert.error('Error del servidor', 'Hubo un problema al crear el grupo. Inténtalo de nuevo.');
          }
        }
      );
  }
}