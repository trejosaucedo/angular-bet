import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-register',
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h2>Registro</h2>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="fullName">Nombre Completo</label>
            <input
              type="text"
              id="fullName"
              formControlName="fullName"
              class="form-control"
              [class.error]="registerForm.get('fullName')?.invalid && registerForm.get('fullName')?.touched"
            >
            <div class="error-message"
                 *ngIf="registerForm.get('fullName')?.invalid && registerForm.get('fullName')?.touched">
              Nombre completo es requerido
            </div>
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              formControlName="email"
              class="form-control"
              [class.error]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched"
            >
            <div class="error-message" *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched">
              Email válido es requerido
            </div>
          </div>

          <div class="form-group">
            <label for="password">Contraseña</label>
            <input
              type="password"
              id="password"
              formControlName="password"
              class="form-control"
              [class.error]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched"
            >
            <div class="error-message"
                 *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched">
              Contraseña debe tener al menos 6 caracteres
            </div>
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirmar Contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              formControlName="confirmPassword"
              class="form-control"
              [class.error]="registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched"
            >
            <div class="error-message"
                 *ngIf="registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched">
              Las contraseñas no coinciden
            </div>
          </div>

          <div class="form-group">
            <label>
              <input
                type="checkbox"
                formControlName="isAdmin"
              >
              Registrar como administrador
            </label>
          </div>

          <button
            type="submit"
            class="btn btn-primary btn-block"
            [disabled]="registerForm.invalid || isLoading"
          >
            {{ isLoading ? 'Registrando...' : 'Registrarse' }}
          </button>
        </form>

        <div class="auth-links">
          <p>¿Ya tienes cuenta? <a routerLink="/auth/login">Inicia sesión</a></p>
        </div>
      </div>
    </div>
  `,
  imports: [
    ReactiveFormsModule
  ],
  styles: [`
    .auth-container {
      min-height: calc(100vh - 200px);
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 2rem;
    }

    .auth-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
    }

    h2 {
      text-align: center;
      margin-bottom: 2rem;
      color: #333;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #333;
    }

    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      transition: border-color 0.3s;
    }

    .form-control:focus {
      outline: none;
      border-color: #00d4aa;
    }

    .form-control.error {
      border-color: #ef4444;
    }

    .error-message {
      color: #ef4444;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      transition: all 0.3s;
    }

    .btn-primary {
      background: #00d4aa;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #00b892;
    }

    .btn-primary:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .btn-block {
      width: 100%;
    }

    .auth-links {
      text-align: center;
      margin-top: 1.5rem;
    }

    .auth-links a {
      color: #00d4aa;
      text-decoration: none;
    }

    .auth-links a:hover {
      text-decoration: underline;
    }

    input[type="checkbox"] {
      margin-right: 0.5rem;
    }
  `]
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      isAdmin: [false]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    // Si ya está autenticado, redirigir
    if (this.authService.isAuthenticated) {
      this.router.navigate(['/dashboard']);
    }
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ mismatch: true });
    } else if (confirmPassword?.errors?.['mismatch']) {
      confirmPassword.setErrors(null);
    }

    return null;
  }

  onSubmit(): void {
    if (this.registerForm.valid && !this.isLoading) {
      this.isLoading = true;

      const formData = { ...this.registerForm.value };
      delete formData.confirmPassword;

      if (formData.isAdmin) {
        formData.role = 'admin';
      }
      delete formData.isAdmin;

      this.authService.register(formData).subscribe({
        next: (response) => {
          this.notificationService.success('Éxito', 'Usuario registrado correctamente');
          // La redirección se maneja en el AuthService
        },
        error: (error) => {
          this.notificationService.error('Error', error.message || 'Error al registrar usuario');
          this.isLoading = false;
        }
      });
    }
  }
}
