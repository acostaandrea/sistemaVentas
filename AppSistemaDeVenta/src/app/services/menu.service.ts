import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { ResponseApi } from '../interfaces/response-api';
import { Menu } from '../interfaces/menu';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private http = inject(HttpClient);
  private url = environment.endppoint + 'Menu/';
  respuesta!: Menu[]

  constructor() {

   }

  lista(idUsuario:number):Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.url}Lista?idUsuario=${idUsuario}`);
  }

  getMenu(idUsuario: number): Promise<Menu[]> {
    return new Promise((resolve, reject) => {
      this.http.get<ResponseApi>(`${this.url}Lista?idUsuario=${idUsuario}`).subscribe(
        (data) => {
          const respuesta: Menu[] = data.value;
          console.log(respuesta);
          resolve(respuesta); // Resuelve la promesa con la respuesta del servidor
        },
        (error) => {
          console.error('Error al obtener el menú:', error);
          reject(error); // Rechaza la promesa con el error
        }
      );
    });
  }

}
