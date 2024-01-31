import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { ResponseApi } from '../interfaces/response-api';
import { Producto } from '../interfaces/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private http = inject(HttpClient);
  private url = environment.endppoint + 'Producto/';

  constructor() { }

  lista():Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.url}Lista`);
  }

  guardar(request: Producto): Observable<ResponseApi>{
    return this.http.post<ResponseApi>(`${this.url}Guardar`, request);
  }

  editar(request: Producto): Observable<ResponseApi>{
    return this.http.put<ResponseApi>(`${this.url}Editar`, request);
  }

  eliminar(id:number): Observable<ResponseApi>{
    return this.http.delete<ResponseApi>(`${this.url}Eliminar/${id}`);
  }
}
