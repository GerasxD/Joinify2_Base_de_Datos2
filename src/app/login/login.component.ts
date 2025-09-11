import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { environment } from '../app.config';
import { SweetAlertService } from '../services/sweet-alert.service';

@Component({
  selector: 'app-login',
  imports: [RouterModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginData = {
    email: '',
    password: ''
  };

  errorMessage: string = ''; // Variable para almacenar el mensaje de error
  constructor(
    private http: HttpClient, 
    private router: Router,
    private sweetAlert: SweetAlertService
  ) {}

  // Lógica para manejar el envío de los datos de login
  onLoginSubmit(): void {
    const url = `${environment.apiUrl}/login`;  // Cambia a tu endpoint de login

    this.http.post<any>(url, this.loginData).subscribe(
      (response) => {
        console.log('Respuesta del login:', response);
        
        if (response && response.usuario) {
          // Guardar el usuario completo en localStorage
          localStorage.setItem('usuario', JSON.stringify(response.usuario));
          
          // Mantener compatibilidad con el código anterior
          localStorage.setItem('userId', response.usuario.id_usuario.toString());
          localStorage.setItem('username', response.usuario.nombre);
          
          console.log('Usuario guardado en localStorage:', response.usuario);

          this.router.navigate(['/home']).then(() => {
            window.location.reload();
          });
        } else {
          console.log('Login fallido: Respuesta inesperada del servidor');
          this.sweetAlert.error('Error de autenticación', 'Por favor, verifica tus credenciales.');
        }
      },
      (error) => {
        console.error('Error en login:', error);
        this.showError('Usuario o contraseña incorrectos. Intenta nuevamente.');
      }
    );
  }
// Método para mostrar el mensaje de error y ocultarlo automáticamente
showError(message: string) {
  this.errorMessage = message; // Establecer el mensaje de error
  setTimeout(() => {
    this.errorMessage = ''; // Limpiar el mensaje después de 5 segundos
  }, 2000); // Tiempo en milisegundos
}

}

