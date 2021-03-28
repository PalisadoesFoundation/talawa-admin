export interface AuthState {
  token: string;
  verifyEmail: string;
  refreshToken: string;
  isAuthenticated: boolean;
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  email?: string;
  emailConfirmed?: string;
}
