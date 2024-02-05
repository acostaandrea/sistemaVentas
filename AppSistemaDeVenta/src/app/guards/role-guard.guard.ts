import { CanActivateFn, Router } from '@angular/router';
import { UtilidadService } from '../reutilizable/utilidad.service';
import { inject } from '@angular/core';
import { MenuService } from '../services/menu.service';
import { Menu } from '../interfaces/menu';


export const roleGuard: CanActivateFn = async (route, state) => {

  const utilidadService = inject(UtilidadService);
  const menuService = inject(MenuService);
  const router = inject(Router);
  const usuario = utilidadService.obtenerSesionUsuario();
  console.log('estado',state.url);
  console.log(route);
  try {
    const listado = await menuService.getMenu(usuario.idUsuario);
    const menu = listado.find((m: Menu) => m.url === state.url);
    if (!menu) {
      router.navigate(['']);
      return false;
    }
    else{
      return true;
    }

  } catch (error) {
    console.error('Error al obtener el menú:', error);
    router.navigate(['']);
    return false;
  }




return true;
};




