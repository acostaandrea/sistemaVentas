import { Component, AfterViewInit, ViewChild, OnInit, inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ModalUsuarioComponent } from '../../modals/modal-usuario/modal-usuario.component';
import { Usuario } from '../../../../interfaces/usuario';
import { UsuarioService } from '../../../../services/usuario.service';
import { UtilidadService } from '../../../../reutilizable/utilidad.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css'
})
export class UsuarioComponent implements OnInit, AfterViewInit{

  private dialog = inject(MatDialog);
  private usuarioService = inject(UsuarioService);
  private utilidadService = inject(UtilidadService);

  columnasTabla: string[] = ['nombreCompleto', 'correo', 'rolDescripcion', 'estado', 'acciones'];
  dataInicio: Usuario[] = [];
  dataListaUsuarios= new MatTableDataSource<Usuario>(this.dataInicio);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  obtenerUsuarios(){
    this.usuarioService.lista().subscribe({
      next: (data) => {
        if (data.status == true){
          this.dataListaUsuarios.data = data.value;
        }

        else {this.utilidadService.mostrarAlerta('No se encontraron datos', 'Error')};
      },
      error: (error) => {
        console.log(error);;
      }
    })
  }

  ngAfterViewInit(): void {
    this.dataListaUsuarios.paginator = this.paginator;
  }
  ngOnInit(): void {
    this.obtenerUsuarios();

  }

  aplicarFiltro(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaUsuarios.filter = filterValue.trim().toLowerCase();
  }

  nuevoUsuario(){
    this.dialog.open(ModalUsuarioComponent, {
      disableClose: true,
    }).afterClosed().subscribe(resultado => {
      if (resultado === "true") this.obtenerUsuarios();
    });
  }

  editarUsuario( usuario: Usuario){
    this.dialog.open(ModalUsuarioComponent, {
      disableClose: true,
      data: usuario
    }).afterClosed().subscribe(resultado => {
      if (resultado === "true") this.obtenerUsuarios();
    });
  }

  eliminarUsuario(usuario: Usuario){
    Swal.fire({
      title: '¿Estas seguro de eliminar este usuario?',
      text: usuario.nombreCompleto,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Volver'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.eliminar(usuario.idUsuario).subscribe({
          next: (data) => {
            if (data.status) {
              this.utilidadService.mostrarAlerta('Usuario eliminado correctamente', 'Listo');
              this.obtenerUsuarios();
            } else this.utilidadService.mostrarAlerta('No se pudo eliminar el usuario', 'Error');
          },
          error: (error) => {
            console.log(error);
          }
        });
      }
    })
  }

}
