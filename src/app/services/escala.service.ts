import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Plantao, EscalaSemanal } from '../models/plantao.model';

@Injectable({
  providedIn: 'root',
})
export class EscalaService {
  private apiUrl = '/api/escala';

  constructor(private http: HttpClient) {}

  cadastrarPlantao(plantao: Plantao): Observable<Plantao> {
    return this.http.post<Plantao>(`${this.apiUrl}/plantao`, plantao);
  }

  excluirPlantao(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/plantao/${id}`);
  }

  obterEscalaSemanal(dataInicial: Date): Observable<EscalaSemanal> {
    const params = new HttpParams().set(
      'dataInicial',
      dataInicial.toISOString().split('T')[0],
    );
    return this.http.get<EscalaSemanal>(`${this.apiUrl}/semanal`, { params });
  }
}
