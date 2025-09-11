import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { environment } from '../app.config';
import { SweetAlertService } from '../services/sweet-alert.service';

@Component({
  selector: 'app-creaciongrupo',
  imports: [RouterModule, FormsModule, CommonModule], // Agregado CommonModule
  templateUrl: './creaciongrupo.component.html',
  styleUrl: './creaciongrupo.component.css'
})
export class CreaciongrupoComponent {
  groupData = {
    name: '',
    serviceType: '',
    maxUsers: null,
    costPerUser: 0,
    paymentPolicy: 'monthly'
  };

  serviceList: any[] = [];

  constructor(
    private http: HttpClient, 
    private router: Router,
    private sweetAlert: SweetAlertService
  ) {
    this.loadServices();
  }

  loadServices() {
    this.http.get<any[]>(`${environment.apiUrl}/api/servicios`).subscribe(
      data => {
        this.serviceList = data;
        console.log('Servicios cargados:', data); // Para debugging
      },
      error => console.error('Error al cargar servicios', error)
    );
  }

  onSubmit() {
    if (!this.groupData.name || !this.groupData.serviceType || !this.groupData.maxUsers || !this.groupData.costPerUser) {
      this.sweetAlert.warning('Campos incompletos', 'Por favor, completa todos los campos.');
      return;
    }

    const userId = localStorage.getItem('userId');
    if (!userId) {
      this.sweetAlert.error('No autorizado', 'No se puede crear el grupo. Debes iniciar sesión.');
      return;
    }

    const grupoConUsuario = {
      name: this.groupData.name,
      serviceType: this.groupData.serviceType,
      maxUsers: this.groupData.maxUsers,
      costPerUser: Number(this.groupData.costPerUser) || 0,
      paymentPolicy: this.groupData.paymentPolicy,
      userId: parseInt(userId, 10)
    };


    this.http.post<{ id_grupo_suscripcion: number }>(`${environment.apiUrl}/api/grupos/crear`, grupoConUsuario)

      .subscribe(
        (response) => {
          this.sweetAlert.success('¡Éxito!', 'Grupo creado exitosamente').then(() => {
            this.router.navigate(['/unirgrupo']);
          });
        },
        (error) => {
          this.sweetAlert.error('Error', 'Hubo un error al crear el grupo.');
          console.error('Error:', error);
        }
      );
  }
}