import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { ResponseApi } from '../interfaces/response-api';
import { Venta } from '../interfaces/venta';

@Injectable({
  providedIn: 'root'
})
export class VentaService {

  private http = inject(HttpClient);
  private url = environment.endppoint + 'Venta/';

  constructor() { }

  registrar(request: Venta): Observable<ResponseApi>{
    return this.http.post<ResponseApi>(`${this.url}Regristrar`, request);
  }

  historial(buscarPor: string, numeroVenta:string, fechaInicio: string, fechaFin: string): Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.url}Historial?buscarPor=${buscarPor}&numeroVenta=${numeroVenta}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
  }

  reporte(fechaInicio: string, fechaFin: string): Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.url}Reporte?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
  }
}
