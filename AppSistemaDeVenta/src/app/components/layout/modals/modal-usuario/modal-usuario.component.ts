import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Rol } from '../../../../interfaces/rol';
import { Usuario } from '../../../../interfaces/usuario';
import { RolService } from '../../../../services/rol.service';
import { UsuarioService } from '../../../../services/usuario.service';
import { UtilidadService } from '../../../../reutilizable/utilidad.service';

@Component({
  selector: 'app-modal-usuario',
  templateUrl: './modal-usuario.component.html',
  styleUrl: './modal-usuario.component.css'
})
export class ModalUsuarioComponent {

  private modalActual = inject(MatDialogRef<ModalUsuarioComponent>);
  private fb = inject(FormBuilder);
  private rolService = inject(RolService);
  private usuarioService = inject(UsuarioService);
  private utilidadService = inject(UtilidadService);


  formulario: FormGroup;
  ocultarPassword = true;
  tituloAccion: string = 'Agregar'
  botonAccion: string = 'Guardar'
  listaRoles: Rol[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public datosUsuario: Usuario) {
    this.formulario = this.fb.group({
      nombreCompleto: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      idRol: ['', Validators.required],
      clave: ['', Validators.required],
      esActivo: ['1', Validators.required]
    });
    if (this.datosUsuario != null) {
      this.tituloAccion = 'Editar';
      this.botonAccion = 'Actualizar';
    }
    this.rolService.lista().subscribe({
      next: (data) => {
        if (data.status) this.listaRoles = data.value;
      },
      error: (error) => {
        this.utilidadService.mostrarAlerta('Error al cargar roles', 'Error');
      }
    })
  }

  ngOnInit(): void {
    if (this.datosUsuario != null) {
      this.formulario.patchValue({
        nombreCompleto: this.datosUsuario.nombreCompleto,
        correo: this.datosUsuario.correo,
        idRol: this.datosUsuario.idRol,
        clave: this.datosUsuario.clave,
        esActivo: this.datosUsuario.esActivo.toString()
      });
    }
  }

  guardarEditar_Usuario() {
    const _usuario: Usuario = {
      idUsuario: this.datosUsuario == null ? 0 : this.datosUsuario.idUsuario,
      nombreCompleto: this.formulario.value.nombreCompleto,
      correo: this.formulario.value.correo,
      idRol: this.formulario.value.idRol,
      rolDescripcion: "",
      clave: this.formulario.value.clave,
      esActivo: parseInt(this.formulario.value.esActivo)
    }
    if (this.datosUsuario == null) {
      this.usuarioService.guardar(_usuario).subscribe({
        next: (data) => {
          if (data.status == true) {
            this.utilidadService.mostrarAlerta('Usuario agregado correctamente', 'Exito');
            this.modalActual.close("true");
          } else {
            this.utilidadService.mostrarAlerta('Error al agregar usuario', 'Error');
          }
        },
        error: (error) => {
          this.utilidadService.mostrarAlerta('Error', 'Error');
        }
      })
    }else{
      this.usuarioService.editar(_usuario).subscribe({
        next: (data) => {
          if (data.status == true) {
            this.utilidadService.mostrarAlerta('Usuario editado correctamente', 'Exito');
            this.modalActual.close("true");
          } else {
            this.utilidadService.mostrarAlerta('Error al editar usuario', 'Error');
          }
        },
        error: (error) => {
          this.utilidadService.mostrarAlerta('Error', 'Error');
        }
      })
    }
  }
}


