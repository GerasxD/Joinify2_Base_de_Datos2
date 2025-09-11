import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { environment } from '../app.config';

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
    paymentPolicy: 'monthly' | 'annual';
    accountEmail: string;
    accountPassword: string;
  } = {
    name: '',
    serviceType: '',
    maxUsers: null,
    costPerUser: 0,
    paymentPolicy: 'monthly',
    accountEmail: '',
    accountPassword: ''
  };

  showPass = false; // para alternar visibilidad
  serviceList: Servicio[] = [];
  sweetAlert: any;

  constructor(private http: HttpClient, private router: Router) {
    this.loadServices();
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
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
          }
        }
      });
  }

  private isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  onSubmit() {
    if (!this.groupData.name || !this.groupData.serviceType || !this.groupData.maxUsers || !this.groupData.costPerUser) {
      alert('Por favor, completa todos los campos.');
      return;
    }
    if (!this.isValidEmail(this.groupData.accountEmail)) {
      alert('Ingresa un correo válido para la cuenta del servicio.');
      return;
    }
    if (String(this.groupData.accountPassword).length < 6) {
      alert('La contraseña de la cuenta debe tener al menos 6 caracteres.');
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
          alert('Grupo creado exitosamente');
          this.router.navigate(['/unirgrupo']);
        },
        (error) => {
          alert('Hubo un error al crear el grupo.');
          console.error('Error:', error);
        }
      );
  }
}