import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { ResponseApi } from '../interfaces/response-api';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private http = inject(HttpClient);
  private url = environment.endppoint + 'Dashboard/';

  constructor() { }

  resumen():Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.url}Resumen`);
  }
}
