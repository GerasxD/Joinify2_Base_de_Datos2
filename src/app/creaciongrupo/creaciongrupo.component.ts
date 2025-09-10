import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { environment } from '../app.config';

interface Servicio {
  id_servicio: number;
  nombre_servicio: string;
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

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.loadServices();
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
    const { name, serviceType, maxUsers, costPerUser, paymentPolicy, accountEmail, accountPassword } = this.groupData;

    if (!name || !serviceType || !maxUsers || !costPerUser || !accountEmail || !accountPassword) {
      alert('Por favor, completa todos los campos.');
      return;
    }
    if (!this.isValidEmail(accountEmail)) {
      alert('Ingresa un correo válido para la cuenta del servicio.');
      return;
    }
    if (String(accountPassword).length < 6) {
      alert('La contraseña de la cuenta debe tener al menos 6 caracteres.');
      return;
    }

    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('No se puede crear el grupo. El usuario no está logueado.');
      return;
    }

    const payload = {
      name,
      serviceType,
      maxUsers,
      costPerUser: Number(costPerUser) || 0,
      paymentPolicy,
      userId: parseInt(userId, 10),
      accountEmail,
      accountPassword
    };

    this.http.post<{ id_grupo_suscripcion: number }>(
      `${environment.apiUrl}/api/grupos/crear`,
      payload
    ).subscribe(
      () => {
        alert('Grupo creado exitosamente');
        this.router.navigate(['/unirgrupo']);
      },
      (error) => {
        const msg = error?.error?.message || 'Hubo un error al crear el grupo.';
        alert(msg);
        console.error('Error:', error);
      }
    );
  }
}