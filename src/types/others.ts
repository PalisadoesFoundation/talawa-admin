export type EmailAddress = string;

export type Date = string;

export type DateTime = string;

export type CountryCode = string;

export type Latitude = string;

export type Longitude = string;

export type PhoneNumber = string;

export type ExtendSession = {
  accessToken: string;
  refreshToken: string;
};

export type DeletePayload = {
  success: boolean;
};

export type Error = {
  message: string;
};

export const Frequency = {
  DAILY: 'DAILY',
  MONTHLY: 'MONTHLY',
  WEEKLY: 'WEEKLY',
  YEARLY: 'YEARLY',
} as const;

export type Frequency = (typeof Frequency)[keyof typeof Frequency];

export const Gender = {
  FEMALE: 'FEMALE',
  MALE: 'MALE',
  OTHER: 'OTHER',
} as const;

export type Gender = (typeof Gender)[keyof typeof Gender];

export const MaritalStatus = {
  DIVORCED: 'DIVORCED',
  ENGAGED: 'ENGAGED',
  MARRIED: 'MARRIED',
  SEPERATED: 'SEPERATED',
  SINGLE: 'SINGLE',
  WIDOWED: 'WIDOWED',
} as const;

export type MaritalStatus = (typeof MaritalStatus)[keyof typeof MaritalStatus];
