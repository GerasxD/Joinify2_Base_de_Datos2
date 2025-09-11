import { Component, OnInit, OnDestroy, TrackByFunction } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loadStripe } from '@stripe/stripe-js';
import { HistorialPago } from '../models/historial-pago.model';
import { HistorialPagosService } from '../services/historial-pagos.service';
import { CommonModule } from '@angular/common';
import { environment } from '../app.config';


@Component({
  selector: 'app-misgrupos',
  imports: [CommonModule, RouterModule],
  templateUrl: './misgrupos.component.html',
  styleUrls: ['./misgrupos.component.css']
})
export class MisGruposComponent implements OnInit, OnDestroy {
  grupos: Grupo[] = [];
  notificaciones: any[] = [];
  errorMessage: string = '';
  stripe: any;
  elements: any;
  card: any;

  notificacionesInterval: any;  // Variable para almacenar el intervalo
  isProcessingPayment = false; // Variable para manejar el estado del pago


  historialPagos: HistorialPago[] = [];
  pagosError = '';
today: any;
  // Add the trackBy function (remove it from the interface declaration)
  trackGrupoById: TrackByFunction<Grupo> = (index: number, grupo: Grupo) => {
    return grupo.id;
  };


  constructor(
    private http: HttpClient,
    private historialSrv: HistorialPagosService,
    private sweetAlert: SweetAlertService
  ) {}

  ngOnInit(): void {
    this.cargarHistorialPagos();

    const usuarioId = localStorage.getItem('userId');
    if (!usuarioId) {
      this.errorMessage = 'Por favor, inicia sesión para ver tus grupos.';
      return;
    }

    this.http.get<any[]>(`${environment.apiUrl}/api/grupos/usuario?id_usuario=${usuarioId}`)
      .subscribe(
        (grupos) => {

          this.grupos = grupos.map(grupo => ({
            id: grupo.id_grupo_suscripcion,
            name: grupo.nombre_grupo,
            serviceType: grupo.nombre_servicio,
            maxUsers: grupo.num_integrantes,
            currentUsers: grupo.currentUsers || 1,
            costPerUser: grupo.costo_total && grupo.num_integrantes ? parseFloat((grupo.costo_total / grupo.num_integrantes).toFixed(2)) : 0,
            paymentPolicy: grupo.fecha_inicio && grupo.fecha_vencimiento
              ? this.calcularPoliticaPago(grupo.fecha_inicio, grupo.fecha_vencimiento)
              : 'monthly',
            fechaLimite: grupo.fecha_vencimiento || '',
            rol: grupo.rol || '',
            isCreatedByUser: grupo.rol === 'Admin',
            isJoinedByUser: grupo.rol === 'Miembro',
            estado_grupo: grupo.estado_grupo,
            correo_cuenta: grupo.correo_cuenta || 'No disponible',
            contrasena_cuenta: grupo.contrasena_cuenta || 'No disponible'
          }));
        },
        (error) => {
          console.error('Error al obtener los grupos:', error);
          this.errorMessage = 'Error al cargar tus grupos. Intenta nuevamente más tarde.';
        }
      );

    this.http.get<any[]>(`${environment.apiUrl}/api/notificaciones/vencimientos`)
      .subscribe(
        (notificaciones) => { 
          this.notificaciones = notificaciones.filter(n => n.userId === parseInt(usuarioId || '0'));
          this.notificaciones.forEach((notificacion, index) => {
            setTimeout(() => {
              this.notificaciones.splice(index, 1);
            }, 5000);
          });
        },
        (error) => { 
          console.error('Error al obtener las notificaciones:', error); 
          this.errorMessage = 'Error al cargar tus notificaciones.'; 
        }
      );


     // Obtener las notificaciones inicialmente

     this.http.get<any[]>(`${environment.apiUrl}/api/notificaciones/vencimientos`)

     .subscribe(
       (notificaciones) => { 
         this.notificaciones = notificaciones.filter(n => n.userId === parseInt(usuarioId || '0'));
         console.log('Notificaciones recibidas:', this.notificaciones);

         // Hacer que cada notificación desaparezca después de 5 segundos
         this.notificaciones.forEach((notificacion, index) => {
           setTimeout(() => {
             this.notificaciones.splice(index, 1);  // Eliminar la notificación después de 5 segundos
           }, 5000);
         });
       },
       (error) => { 
         console.error('Error al obtener las notificaciones:', error); 
         this.errorMessage = 'Error al cargar tus notificaciones.'; 
       }
     );

   // Llamada periódica cada 10 minutos (600,000 ms)
   this.notificacionesInterval = setInterval(() => {

     this.http.get<any[]>(`${environment.apiUrl}/api/notificaciones/vencimientos`)

       .subscribe(
         (notificaciones) => { 
           this.notificaciones = notificaciones.filter(n => n.userId === parseInt(usuarioId || '0')); 
         },
         (error) => { 
           console.error('Error al obtener las notificaciones:', error); 
           this.errorMessage = 'Error al cargar tus notificaciones.'; 
         }
       );
   }, 60000);  // 10 minutos
  


    loadStripe('pk_test_51QTYY1KKAL9Zx73kVaH7pAwFyqaSPByJFrZCQKpfzLwRgE9WTWHx6lJxKfXkhK3dgOCBTFlmSGHjBUvtJJyOSM7r00PzjBxalJ')
      .then((stripe) => {
        if (stripe) {
          this.stripe = stripe;
          this.elements = stripe.elements();
          this.card = this.elements.create('card');
          this.card.mount('#card-element');
        } else {
          console.error('Stripe no se cargó correctamente');
        }
      })
      .catch((error) => {
        console.error('Error al cargar Stripe:', error);
      });
  }

  ngOnDestroy(): void {
    if (this.notificacionesInterval) {
      clearInterval(this.notificacionesInterval);
    }
  }

  private cargarHistorialPagos(): void {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    this.historialSrv.getByUsuario(+userId).subscribe({
      next: pagos => this.historialPagos = pagos,
      error: _ => this.pagosError = 'Error al cargar el historial de pagos'
    });
  }

  simularPago(grupoId: number, monto: number): void {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      this.sweetAlert.error('No autorizado', 'No se ha encontrado un usuario logueado.');
      return;
    }

  

    this.http.post(`${environment.apiUrl}/api/pagos/simular`, {

      userId: userId,      // Asegúrate de enviar el userId
      groupId: grupoId,    // Enviar el ID del grupo
      amount: monto        // Monto del pago
    }).subscribe(
      (res: any) => {
        const { clientSecret } = res;  // Obtener el clientSecret desde el servidor
        this.confirmPayment(clientSecret, grupoId, monto); // Confirmar el pago usando Stripe Elements


      },
      (error) => { 
        console.error('Error en la simulación de pago:', error);
        this.sweetAlert.error('Error de pago', 'Hubo un problema al procesar la simulación. Inténtalo de nuevo.');
      }
    );
  }


  // Método para simular la confirmación del pago with Stripe
  confirmPayment(clientSecret: string, grupoId: number, monto: number): void {
    this.isProcessingPayment = true;

    this.stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: this.card,
        billing_details: {

          name: 'Usuario Joinify',

        },
      },
    }).then((result: any) => {
      this.isProcessingPayment = false;
      if (result.error) {
        console.error('Error al procesar el pago:', result.error);
        this.sweetAlert.error('Error de pago', 'Hubo un error en el pago. Inténtalo de nuevo.');
      } else {
        if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
          const userId = localStorage.getItem('userId');
          this.http.post(`${environment.apiUrl}/api/pagos/confirmar`, {
            userId: userId,
            groupId: grupoId,
            monto: monto
          }).subscribe(
            (response) => {
              this.sweetAlert.success('¡Pago exitoso!', 'El pago ha sido registrado correctamente.');
            },
            (error) => {
              console.error('Error al registrar el pago:', error);
              this.sweetAlert.warning('Pago procesado', 'El pago fue procesado, pero hubo un problema al registrarlo.');
            }
          );
        }
      }
    });
  }

  darDeBajaGrupo(grupoId: number): void {
    this.sweetAlert.confirmDelete(
      '¿Dar de baja grupo?',
      'Esta acción es irreversible. ¿Estás seguro de que deseas continuar?'
    ).then((result) => {
      if (result.isConfirmed) {
        this.http.delete<any>(`${environment.apiUrl}/api/grupos/baja/${grupoId}`)
          .subscribe(
            response => {
              this.sweetAlert.success('Grupo dado de baja', 'El grupo ha sido dado de baja correctamente').then(() => {
                setTimeout(() => {
                  window.location.reload();
                }, 1000);
              });
            },
            error => {
              console.error('Error al dar de baja el grupo:', error);
              this.sweetAlert.error('Error', 'Error al dar de baja el grupo: ' + error.error.message);
            }
          );
      }
    });
  }

  salirDelGrupo(grupoId: number): void {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      this.sweetAlert.warning('No autorizado', 'Debes iniciar sesión para salir de un grupo');
      return;
    }

    this.http.delete<any>(`${environment.apiUrl}/api/grupos/salir/${grupoId}/${userId}`)
      .subscribe(
        response => {
          this.sweetAlert.success('¡Éxito!', 'Has salido del grupo exitosamente');
          // this.actualizarDisponibilidad(grupoId);
          setTimeout(() => {
            window.location.reload();
          }, 4000);
        },
        error => {
          console.error('Error al salir del grupo:', error);
          this.sweetAlert.error('Error', 'No se pudo salir del grupo: ' + error.error.message);
        }
      );
  }

  // actualizarDisponibilidad(groupId: number) {

  //   this.http.put<any>(`${environment.apiUrl}/api/servicio-suscripcion/actualizar/${groupId}`, {})
  //     .subscribe(
  //       (response) => {
  //         alert(`La disponibilidad del grupo ${groupId} se actualizó a: ${response.disponibilidad}`);
  //       },
  //       (error) => {
  //         console.error('Error al actualizar la disponibilidad:', error);
  //         alert('Error al verificar o actualizar la disponibilidad.');
  //       }
  //     );
  // }

  calcularPoliticaPago(fechaInicio: string, fechaVencimiento: string): 'monthly' | 'annual' {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaVencimiento);
    const diff = (fin.getFullYear() - inicio.getFullYear()) * 12 + (fin.getMonth() - inicio.getMonth());
    return diff >= 11 ? 'annual' : 'monthly';
  }

  inactivarGrupo(grupoId: number): void {
    this.sweetAlert.confirm(
      '¿Inactivar grupo?',
      '¿Estás seguro que deseas inactivar este grupo?'
    ).then((result) => {
      if (result.isConfirmed) {
        this.http.put<any>(`${environment.apiUrl}/api/grupos/inactivar/${grupoId}`, {})
          .subscribe(
            response => {
              this.sweetAlert.success('¡Éxito!', 'Grupo inactivado correctamente').then(() => {
                window.location.reload();
              });
            },
            error => {
              this.sweetAlert.error('Error', 'Error al inactivar el grupo');
            }
          );
      }
    });
  }

  activarGrupo(grupoId: number): void {
    this.sweetAlert.confirm(
      '¿Activar grupo?',
      '¿Estás seguro que deseas activar este grupo?'
    ).then((result) => {
      if (result.isConfirmed) {
        this.http.put<any>(`${environment.apiUrl}/api/grupos/activar/${grupoId}`, {})
          .subscribe(
            response => {
              this.sweetAlert.success('¡Éxito!', 'Grupo activado correctamente').then(() => {
                window.location.reload();
              });
            },
            error => {
              this.sweetAlert.error('Error', 'Error al activar el grupo');
            }
          );
      }
    });
  }

  showPassword: { [key: number]: boolean } = {};

  togglePassword(groupId: number) {
    this.showPassword[groupId] = !this.showPassword[groupId];
  }

  // trackBy ya existe
  // Añadir pagarGrupo wrapper que convierte monto y llama a simularPago
  pagarGrupo(grupo: Grupo): void {
    const monto = typeof grupo.costPerUser === 'number'
      ? grupo.costPerUser
      : parseFloat(String(grupo.costPerUser || '0')) || 0;
    this.simularPago(grupo.id, monto);
  }
}

