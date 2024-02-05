import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Menu } from '../../interfaces/menu';
import { MenuService } from '../../services/menu.service';
import { UtilidadService } from '../../reutilizable/utilidad.service';


@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

  private router = inject(Router);
  private _menuService = inject(MenuService);
  private _utilidadService = inject(UtilidadService);

  listaMenu: Menu[] = [];
  correoUsuario: string = '';
  rolUsuario: string = '';

  ngOnInit(): void {
   const usuario = this._utilidadService.obtenerSesionUsuario();
   if(usuario != null){
     this.correoUsuario = usuario.correo;
     this.rolUsuario = usuario.rolDescripcion;
     this._menuService.lista(usuario.idUsuario).subscribe({
        next: (data) => {
          if(data.status){
            this.listaMenu = data.value;
          }
        },
        error: (error) => {
          console.error('Error al obtener el menú', error);
        }
      });
   }

  }

  cerrarSesion(){
    this._utilidadService.eliminarSesionUsuario();
    this.router.navigate(['login']);
  }

}
