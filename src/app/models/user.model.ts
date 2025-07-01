export interface UserProfile {
  id: number;
  email: string;
  fullName: string;
  balance: string | number;
  isActive: boolean | number;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateProfileRequest {
  fullName?: string;
  email?: string;
}

export interface BalanceRequest {
  amount: number;
}

export interface UpdateBalanceRequest {
  balance: number;
}
