export interface BalanceRequest {
  amount: number;
}

export interface UpdateBalanceRequest {
  balance: number;
}

export interface UpdateUserRequest {
  email?: string;
  fullName?: string;
}
