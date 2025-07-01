import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/enviroment';
import {
  Match,
  CreateMatchRequest,
  FinishMatchRequest,
} from '../models/match.model';

import { ApiResponse } from '../models/api.model';

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  private readonly API_URL = environment.apiUrl || 'http://localhost:3333/api';

  constructor(private http: HttpClient) {}

  // Obtener todos los partidos
  getAllMatches(): Observable<ApiResponse<Match[]>> {
    return this.http.get<ApiResponse<Match[]>>(`${this.API_URL}/matches`)
      .pipe(catchError(this.handleError));
  }

  // Obtener partidos próximos (disponibles para apostar)
  getUpcomingMatches(): Observable<ApiResponse<Match[]>> {
    return this.http.get<ApiResponse<Match[]>>(`${this.API_URL}/matches/upcoming`)
      .pipe(catchError(this.handleError));
  }

  // Obtener partido por ID
  getMatchById(id: number): Observable<ApiResponse<Match>> {
    return this.http.get<ApiResponse<Match>>(`${this.API_URL}/matches/${id}`)
      .pipe(catchError(this.handleError));
  }

  // [ADMIN] Crear nuevo partido
  createMatch(matchData: CreateMatchRequest): Observable<ApiResponse<Match>> {
    return this.http.post<ApiResponse<Match>>(`${this.API_URL}/admin/matches`, matchData)
      .pipe(catchError(this.handleError));
  }

  // [ADMIN] Finalizar partido con resultados
  finishMatch(id: number, result: FinishMatchRequest): Observable<ApiResponse<Match>> {
    return this.http.put<ApiResponse<Match>>(`${this.API_URL}/admin/matches/${id}/finish`, result)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    console.error('Match Service Error:', error);
    return throwError(() => error);
  }
}
