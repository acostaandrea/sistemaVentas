import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Login } from '../../interfaces/login';
import { UsuarioService } from '../../services/usuario.service';
import { UtilidadService } from '../../reutilizable/utilidad.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  private fb = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);
  private utilidadService = inject(UtilidadService);
  private router = inject(Router);

  formularioLogin: FormGroup;
  ocultarPassword: boolean = true;
  mostrarLoading : boolean = false;

  constructor() {
    this.formularioLogin = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  iniciarSesion() {
    this.mostrarLoading = true;
    const request: Login = {
      correo: this.formularioLogin.value.email,
      clave: this.formularioLogin.value.password
    };
    this.usuarioService.iniciarSesion(request).subscribe(
      {
        next: (data) => {
          if (data.status) {
            this.utilidadService.guardarSesionUsuario(data.value);
            this.router.navigate(['/pages/dashboard']);
          } else{
            this.utilidadService.mostrarAlerta('No se encontraron coincidencias', 'ERROR');
          }
        },
        complete: () => {
          this.mostrarLoading = false;
        },
        error: (error) => {
          this.utilidadService.mostrarAlerta('Ocurrio un error al iniciar sesión', 'ERROR');
        }
      }
    );
  }

}
