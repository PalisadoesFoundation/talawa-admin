import type { SocialMediaUrls } from './socialmedia'; // Assuming SocialMediaUrls is another type

export type Community = {
  _id: string;
  logoUrl?: string; // Optional
  name: string;
  socialMediaUrls?: SocialMediaUrls; // Optional
  timeout?: number; // Optional
  websiteLink?: string; // Optional
};
