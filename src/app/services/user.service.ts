import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../environments/enviroment';
import {
  UserProfile,
  UpdateProfileRequest,
  BalanceRequest,
  UpdateBalanceRequest,
} from '../models/user.model';
import { ApiResponse } from '../models/api.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly API_URL = environment.apiUrl || 'http://localhost:3333/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // === OPERACIONES DE USUARIO ===

  // Obtener perfil del usuario
  getProfile(): Observable<ApiResponse<UserProfile>> {
    return this.http.get<ApiResponse<UserProfile>>(`${this.API_URL}/user/profile`)
      .pipe(catchError(this.handleError));
  }

  // Actualizar perfil del usuario
  updateProfile(profileData: UpdateProfileRequest): Observable<ApiResponse<UserProfile>> {
    return this.http.put<ApiResponse<UserProfile>>(`${this.API_URL}/user/profile`, profileData)
      .pipe(
        tap(() => this.authService.refreshUser()),
        catchError(this.handleError)
      );
  }

  // Obtener saldo del usuario
  getBalance(): Observable<ApiResponse<{ balance: number }>> {
    return this.http.get<ApiResponse<{ balance: number }>>(`${this.API_URL}/user/balance`)
      .pipe(catchError(this.handleError));
  }

  // Agregar saldo
  addBalance(amount: number): Observable<ApiResponse<UserProfile>> {
    const balanceData: BalanceRequest = { amount };
    return this.http.post<ApiResponse<UserProfile>>(`${this.API_URL}/user/balance/add`, balanceData)
      .pipe(
        tap(() => this.authService.refreshUser()),
        catchError(this.handleError)
      );
  }

  // Deducir saldo
  deductBalance(amount: number): Observable<ApiResponse<UserProfile>> {
    const balanceData: BalanceRequest = { amount };
    return this.http.post<ApiResponse<UserProfile>>(`${this.API_URL}/user/balance/deduct`, balanceData)
      .pipe(
        tap(() => this.authService.refreshUser()),
        catchError(this.handleError)
      );
  }

  // === OPERACIONES DE ADMINISTRADOR ===

  // Obtener todos los usuarios
  getAllUsers(): Observable<ApiResponse<UserProfile[]>> {
    return this.http.get<ApiResponse<UserProfile[]>>(`${this.API_URL}/admin/users`)
      .pipe(catchError(this.handleError));
  }

  // Obtener usuario por ID
  getUserById(id: number): Observable<ApiResponse<UserProfile>> {
    return this.http.get<ApiResponse<UserProfile>>(`${this.API_URL}/admin/users/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Actualizar usuario por ID (admin)
  updateUserById(id: number, userData: UpdateProfileRequest): Observable<ApiResponse<UserProfile>> {
    return this.http.put<ApiResponse<UserProfile>>(`${this.API_URL}/admin/users/${id}`, userData)
      .pipe(catchError(this.handleError));
  }

  // Cambiar estado del usuario (activar/desactivar)
  toggleUserStatus(id: number): Observable<ApiResponse<UserProfile>> {
    return this.http.put<ApiResponse<UserProfile>>(`${this.API_URL}/admin/users/${id}/toggle-status`, {})
      .pipe(catchError(this.handleError));
  }

  // Actualizar saldo de usuario (admin)
  updateUserBalance(id: number, balance: number): Observable<ApiResponse<UserProfile>> {
    const balanceData: UpdateBalanceRequest = { balance };
    return this.http.put<ApiResponse<UserProfile>>(`${this.API_URL}/admin/users/${id}/balance`, balanceData)
      .pipe(catchError(this.handleError));
  }

  // Eliminar usuario
  deleteUser(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.API_URL}/admin/users/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    console.error('User Service Error:', error);
    return throwError(() => error);
  }
}
