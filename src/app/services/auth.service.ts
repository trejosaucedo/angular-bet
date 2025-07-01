// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../environments/enviroment';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
} from '../models/auth.model';

import { ApiResponse } from '../models/api.model'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = environment.apiUrl || 'http://localhost:3333/api';
  private readonly TOKEN_KEY = 'betting_token';
  private readonly USER_KEY = 'betting_user';

  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasValidToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  // Registro de usuario
  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/register`, userData)
      .pipe(
        tap(response => {
          if (response.success) {
            this.setSession(response.data);
          }
        }),
        catchError(this.handleError)
      );
  }

  // Login de usuario
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/login`, credentials)
      .pipe(
        tap(response => {
          if (response.success) {
            this.setSession(response.data);
          }
        }),
        catchError(this.handleError)
      );
  }

  // Logout
  logout(): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.API_URL}/auth/logout`, {})
      .pipe(
        tap(() => this.clearSession()),
        catchError(() => {
          // Incluso si la petición falla, limpiamos la sesión local
          this.clearSession();
          return throwError(() => new Error('Logout failed'));
        })
      );
  }

  // Obtener datos del usuario actual
  getCurrentUser(): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.API_URL}/auth/me`)
      .pipe(
        tap(response => {
          if (response.success) {
            this.updateCurrentUser(response.data);
          }
        }),
        catchError(this.handleError)
      );
  }

  // Configurar sesión después del login/registro
  private setSession(authData: { user: User; token: string }): void {
    sessionStorage.setItem(this.TOKEN_KEY, authData.token);
    sessionStorage.setItem(this.USER_KEY, JSON.stringify(authData.user));

    this.currentUserSubject.next(authData.user);
    this.isAuthenticatedSubject.next(true);

    // Redirigir según el rol
    if (authData.user.role === 'admin') {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  // Limpiar sesión
  private clearSession(): void {
    sessionStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.USER_KEY);

    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);

    this.router.navigate(['/auth/login']);
  }

  // Obtener token del sessionStorage
  getToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
  }

  // Obtener usuario del sessionStorage
  private getUserFromStorage(): User | null {
    const userJson = sessionStorage.getItem(this.USER_KEY);
    if (userJson) {
      try {
        return JSON.parse(userJson);
      } catch (error) {
        console.error('Error parsing user from storage:', error);
        this.clearSession();
        return null;
      }
    }
    return null;
  }

  // Verificar si hay un token válido
  private hasValidToken(): boolean {
    const token = this.getToken();
    const user = this.getUserFromStorage();
    return !!(token && user);
  }

  // Actualizar usuario actual
  private updateCurrentUser(user: User): void {
    sessionStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  // Obtener usuario actual (síncrono)
  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  // Verificar si está autenticado (síncrono)
  get isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  // Verificar si es admin
  isAdmin(): boolean {
    const user = this.currentUserValue;
    return user?.role === 'admin';
  }

  // Verificar si es usuario regular
  isUser(): boolean {
    const user = this.currentUserValue;
    return user?.role === 'user' || !user?.role; // Si no tiene rol, asumimos que es user
  }

  // Manejo de errores
  private handleError(error: any): Observable<never> {
    let errorMessage = 'Ha ocurrido un error';

    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    console.error('Auth Error:', error);
    return throwError(() => new Error(errorMessage));
  }

  // Refrescar datos del usuario
  refreshUser(): void {
    if (this.isAuthenticated) {
      this.getCurrentUser().subscribe({
        next: (response) => {
          console.log('User data refreshed');
        },
        error: (error) => {
          console.error('Error refreshing user:', error);
        }
      });
    }
  }
}
