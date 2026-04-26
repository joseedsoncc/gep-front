// src/app/services/profissional.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Profissional,
  CategoriaProfissional,
} from '../models/profissional.model';

@Injectable({
  providedIn: 'root',
})
export class ProfissionalService {
  private apiUrl = '/api/profissional';

  constructor(private http: HttpClient) {}

  listar(
    categoria?: CategoriaProfissional | string,
  ): Observable<Profissional[]> {
    let params = new HttpParams();
    if (categoria) {
      params = params.set('categoria', categoria);
    }
    return this.http.get<Profissional[]>(this.apiUrl, { params });
  }

  buscarPorId(id: number): Observable<Profissional> {
    return this.http.get<Profissional>(`${this.apiUrl}/${id}`);
  }

  cadastrar(profissional: Profissional): Observable<Profissional> {
    return this.http.post<Profissional>(this.apiUrl, profissional);
  }

  atualizar(id: number, profissional: Profissional): Observable<Profissional> {
    return this.http.put<Profissional>(`${this.apiUrl}/${id}`, profissional);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
