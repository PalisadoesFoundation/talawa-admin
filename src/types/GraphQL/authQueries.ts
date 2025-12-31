/**
 * @file authQueries.ts
 * @description Defines TypeScript interfaces for authentication-related GraphQL query and mutation results.
 */

export interface ISignInResult {
  signIn: {
    user: {
      id: string;
      name: string;
      emailAddress: string;
      role: string;
      countryCode: string | null;
      avatarURL?: string | null;
    };
    authenticationToken: string;
    refreshToken: string;
  };
}

export interface ISignUpResult {
  signUp: {
    user: {
      id: string;
      name?: string;
      emailAddress?: string;
    };
    authenticationToken: string;
    refreshToken: string;
  };
}

export interface IRecaptchaResult {
  recaptcha: boolean;
}

export interface ICommunityDataResult {
  community: {
    id: string;
    name: string;
    logoURL: string;
    websiteURL: string;
    createdAt: string;
    updatedAt: string;
    facebookURL?: string | null;
    githubURL?: string | null;
    instagramURL?: string | null;
    linkedinURL?: string | null;
    redditURL?: string | null;
    slackURL?: string | null;
    xURL?: string | null;
    youtubeURL?: string | null;
    inactivityTimeoutDuration?: number | null;
    logoMimeType?: string | null;
  } | null;
}

export interface ICommunitySessionTimeoutResult {
  community: {
    inactivityTimeoutDuration: number | null;
  } | null;
}

export interface IRefreshTokenResult {
  refreshToken: {
    authenticationToken: string;
    refreshToken: string;
  };
}

export interface IGenerateOtpResult {
  otp: {
    otpToken: string;
  };
}

export interface IForgotPasswordResult {
  forgotPassword: boolean;
}
