import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { ResponseApi } from '../interfaces/response-api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolService {

  private http = inject(HttpClient);
  private url = environment.endppoint + 'Rol/';

  constructor() { }

  lista(): Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.url}Lista`);
  }
}
