import React from 'react';
import { render, screen } from '@testing-library/react';
import AuthBranding from './AuthBranding';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

afterEach(() => {
  vi.clearAllMocks();
});

describe('AuthBranding Component', () => {
  it('should render Palisadoes logo when no community data', () => {
    render(<AuthBranding />);
    expect(screen.getByTestId('PalisadoesLogo')).toBeInTheDocument();
  });

  it('should render community social link when communityData provides one', () => {
    const communityData = {
      logoURL: 'https://example.com/logo.png',
      name: 'Test Community',
      websiteURL: 'https://example.com',
      facebookURL: 'https://facebook.com/customCommunity',
    };

    render(<AuthBranding communityData={communityData} />);

    const socialLink = screen.getByTestId('preLoginSocialMedia');

    expect(socialLink).toBeInTheDocument();
    expect(socialLink).toHaveAttribute('href', communityData.facebookURL);
  });

  it('should render all social media links with communityData URLs', () => {
    const communityData = {
      logoURL: 'https://example.com/logo.png',
      name: 'Test Community',
      websiteURL: 'https://example.com',
      facebookURL: 'https://facebook.com/custom',
      xURL: 'https://x.com/custom',
      linkedInURL: 'https://linkedin.com/custom',
      githubURL: 'https://github.com/custom',
      youtubeURL: 'https://youtube.com/custom',
      slackURL: 'https://slack.com/custom',
      instagramURL: 'https://instagram.com/custom',
    };

    render(<AuthBranding communityData={communityData} />);

    const socialLinks = screen.getAllByTestId('preLoginSocialMedia');
    expect(socialLinks).toHaveLength(7);

    expect(socialLinks[0]).toHaveAttribute('href', communityData.facebookURL);
    expect(socialLinks[1]).toHaveAttribute('href', communityData.xURL);
    expect(socialLinks[2]).toHaveAttribute('href', communityData.linkedInURL);
    expect(socialLinks[3]).toHaveAttribute('href', communityData.githubURL);
    expect(socialLinks[4]).toHaveAttribute('href', communityData.youtubeURL);
    expect(socialLinks[5]).toHaveAttribute('href', communityData.slackURL);
    expect(socialLinks[6]).toHaveAttribute('href', communityData.instagramURL);
  });

  it('should render social media links with fallback hrefs when communityData is incomplete', () => {
    const communityData = {
      logoURL: 'https://example.com/logo.png',
      name: 'Test Community',
      websiteURL: 'https://example.com',
      facebookURL: 'https://facebook.com/custom',
    };

    render(<AuthBranding communityData={communityData} />);

    const customLink = screen.getByTestId('preLoginSocialMedia');
    expect(customLink).toHaveAttribute('href', communityData.facebookURL);

    const fallbackLinks = screen.getAllByTestId('PalisadoesSocialMedia');
    expect(fallbackLinks).toHaveLength(6);
  });

  it('should handle missing social media URLs in communityData gracefully', () => {
    const communityData = {
      logoURL: 'https://example.com/logo.png',
      name: 'Test Community',
      websiteURL: 'https://example.com',
    };

    render(<AuthBranding communityData={communityData} />);

    const fallbackLinks = screen.getAllByTestId('PalisadoesSocialMedia');
    expect(fallbackLinks).toHaveLength(7);
  });
});
