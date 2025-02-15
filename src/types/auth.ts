import type { AppUserProfile, User } from './User/type';

export type AuthData = {
  accessToken: string;
  appUserProfile: AppUserProfile;
  refreshToken: string;
  user: User;
};

export type AuthenticationPayload = {
  authenticationToken: string;
  user: User;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type ForgotPasswordData = {
  newPassword: string;
  otpToken: string;
  userOtp: string;
};

export type OTPInput = {
  email: string;
};

export type OtpData = {
  otpToken: string;
};

export type RecaptchaVerification = {
  recaptchaToken: string;
};
