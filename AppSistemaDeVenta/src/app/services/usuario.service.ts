import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { ResponseApi } from '../interfaces/response-api';
import { Login } from '../interfaces/login';
import { Usuario } from '../interfaces/usuario';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private http = inject(HttpClient);
  private url = environment.endppoint + 'Usuario';

  constructor() { }

  iniciarSesion(request: Login): Observable<ResponseApi>{
    return this.http.post<ResponseApi>(`${this.url}/IniciarSesion`, request);
  }

  lista():Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.url}/Lista`);
  }

  guardar(request: Usuario): Observable<ResponseApi>{
    return this.http.post<ResponseApi>(`${this.url}/Guardar`, request);
  }

  editar(request: Usuario): Observable<ResponseApi>{
    return this.http.put<ResponseApi>(`${this.url}/Editar`, request);
  }

  eliminar(id:number): Observable<ResponseApi>{
    return this.http.delete<ResponseApi>(`${this.url}/Eliminar/${id}`);
  }
}
