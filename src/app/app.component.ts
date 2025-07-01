import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { LoadingService } from './services/loading.service';
import { NotificationService } from './services/notification.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  template: `
    <div class="app-container">
      <!-- Navbar -->
      <nav class="navbar" *ngIf="showNavbar">
        <div class="nav-content">
          <div class="nav-brand">
            <a routerLink="/">BettingApp</a>
          </div>

          <div class="nav-links">
            <a routerLink="/matches" routerLinkActive="active">Partidos</a>
            <a routerLink="/dashboard" routerLinkActive="active" *ngIf="isAuthenticated$ | async">
              Dashboard
            </a>
            <a routerLink="/admin" routerLinkActive="active" *ngIf="isAdmin">
              Admin
            </a>
          </div>

          <div class="nav-user">
            <ng-container *ngIf="isAuthenticated$ | async; else authButtons">
              <span class="user-info">
                {{ (currentUser$ | async)?.fullName }}
                <span class="balance">${{ (currentUser$ | async)?.balance }}</span>
              </span>
              <button (click)="logout()" class="btn btn-outline">Salir</button>
            </ng-container>
            <ng-template #authButtons>
              <a routerLink="/auth/login" class="btn btn-primary">Login</a>
              <a routerLink="/auth/register" class="btn btn-outline">Registro</a>
            </ng-template>
          </div>
        </div>
      </nav>

      <!-- Loading Spinner -->
      <div class="loading-overlay" *ngIf="loading$ | async">
        <div class="spinner"></div>
      </div>

      <!-- Notifications -->
      <div class="notifications">
        <div *ngFor="let notification of notifications$ | async"
             class="notification notification-{{notification.type}}">
          <div class="notification-content">
            <strong>{{notification.title}}</strong>
            <p>{{notification.message}}</p>
          </div>
          <button (click)="removeNotification(notification.id)" class="close-btn">×</button>
        </div>
      </div>

      <!-- Main Content -->
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background: #f5f5f5;
    }

    .navbar {
      background: #1a1a1a;
      color: white;
      padding: 1rem 0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .nav-content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 1rem;
    }

    .nav-brand a {
      color: #00d4aa;
      font-size: 1.5rem;
      font-weight: bold;
      text-decoration: none;
    }

    .nav-links {
      display: flex;
      gap: 2rem;
    }

    .nav-links a {
      color: white;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: background 0.3s;
    }

    .nav-links a:hover,
    .nav-links a.active {
      background: rgba(0,212,170,0.2);
    }

    .nav-user {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-info {
      font-size: 0.9rem;
    }

    .balance {
      color: #00d4aa;
      font-weight: bold;
      margin-left: 0.5rem;
    }

    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      text-decoration: none;
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.3s;
    }

    .btn-primary {
      background: #00d4aa;
      color: white;
    }

    .btn-outline {
      background: transparent;
      color: white;
      border: 1px solid #00d4aa;
    }

    .btn:hover {
      opacity: 0.8;
    }

    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.3);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #00d4aa;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .notifications {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1001;
    }

    .notification {
      background: white;
      border-radius: 8px;
      padding: 1rem;
      margin-bottom: 0.5rem;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      min-width: 300px;
      border-left: 4px solid;
    }

    .notification-success { border-left-color: #10b981; }
    .notification-error { border-left-color: #ef4444; }
    .notification-warning { border-left-color: #f59e0b; }
    .notification-info { border-left-color: #3b82f6; }

    .notification-content p {
      margin: 0.25rem 0 0 0;
      color: #666;
      font-size: 0.9rem;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #999;
    }

    .main-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }

    @media (max-width: 768px) {
      .nav-content {
        flex-direction: column;
        gap: 1rem;
      }

      .nav-links {
        gap: 1rem;
      }

      .main-content {
        padding: 1rem;
      }
    }
  `]
})
export class AppComponent implements OnInit {
  currentUser$ = this.authService.currentUser$;
  isAuthenticated$ = this.authService.isAuthenticated$;
  loading$ = this.loadingService.loading$;
  notifications$ = this.notificationService.notifications$;

  constructor(
    private authService: AuthService,
    private loadingService: LoadingService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    // Verificar si hay sesión activa al iniciar
    if (this.authService.isAuthenticated) {
      this.authService.getCurrentUser().subscribe({
        error: () => {
          // Si falla, limpiar sesión
          this.authService.logout().subscribe();
        }
      });
    }
  }

  get showNavbar(): boolean {
    return true; // Siempre mostrar navbar
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.notificationService.success('Sesión cerrada', 'Has cerrado sesión correctamente');
      },
      error: (error) => {
        this.notificationService.error('Error', 'Error al cerrar sesión');
      }
    });
  }

  removeNotification(id: string): void {
    this.notificationService.remove(id);
  }
}
