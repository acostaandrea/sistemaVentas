import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Sesion } from '../interfaces/sesion';

@Injectable({
  providedIn: 'root'
})
export class UtilidadService {

  private _snackBar = inject(MatSnackBar)

  constructor() { }

  mostrarAlerta(mensaje: string, tipo: string) {
    this._snackBar.open(mensaje, tipo, {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  guardarSesionUsuario(usuarioSession: Sesion) {
    localStorage.setItem('usuario', JSON.stringify(usuarioSession));
  }
  obtenerSesionUsuario() {
    const dataCadena = localStorage.getItem('usuario');
    const usuario = JSON.parse(dataCadena!);
    return usuario;
  }
  eliminarSesionUsuario() {
    localStorage.removeItem('usuario');
  }
}
