import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/enviroment';
import {
  BetSlip,
  CreateBetSlipRequest,
} from '../models/betting.model';

import { ApiResponse } from '../models/api.model';

@Injectable({
  providedIn: 'root'
})
export class BettingService {
  private readonly API_URL = environment.apiUrl || 'http://localhost:3333/api';

  constructor(private http: HttpClient) {}

  // Crear nueva apuesta
  createBetSlip(betSlipData: CreateBetSlipRequest): Observable<ApiResponse<BetSlip>> {
    return this.http.post<ApiResponse<BetSlip>>(`${this.API_URL}/bet-slips`, betSlipData)
      .pipe(catchError(this.handleError));
  }

  // Obtener apuestas del usuario
  getUserBetSlips(page: number = 1, limit: number = 20): Observable<ApiResponse<BetSlip[]>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<ApiResponse<BetSlip[]>>(`${this.API_URL}/bet-slips`, { params })
      .pipe(catchError(this.handleError));
  }

  // Obtener apuesta específica por ID
  getBetSlipById(id: number): Observable<ApiResponse<BetSlip>> {
    return this.http.get<ApiResponse<BetSlip>>(`${this.API_URL}/bet-slips/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Calcular cuota total para apuesta múltiple
  calculateParlayOdds(odds: number[]): number {
    return odds.reduce((total, odd) => total * odd, 1);
  }

  // Calcular pago potencial
  calculatePotentialPayout(stake: number, odds: number): number {
    return stake * odds;
  }

  private handleError(error: any): Observable<never> {
    console.error('Betting Service Error:', error);
    return throwError(() => error);
  }
}
