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
});
