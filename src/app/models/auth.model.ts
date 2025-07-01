// src/app/models/auth.model.ts
export interface User {
  id: number;
  email: string;
  fullName: string;
  balance: string | number;
  isActive: boolean | number;
  role?: 'admin' | 'user';
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  fullName: string;
  password: string;
  role?: 'admin' | 'user';
}
