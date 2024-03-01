import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import 'jest-location-mock';
import { I18nextProvider } from 'react-i18next';

import CommunityProfile from './CommunityProfile';
import i18n from 'utils/i18nForTest';

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

describe('Testing Community Profile Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Components should render properly', async () => {
    render(
      <MockedProvider addTypename={false}>
        <I18nextProvider i18n={i18n}>
          <CommunityProfile />
        </I18nextProvider>
      </MockedProvider>
    );

    expect(screen.getByText(/Community Profile/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Community Name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Website Link/i)).toBeInTheDocument();
    expect(screen.getByTestId(/facebook/i)).toBeInTheDocument();
    expect(screen.getByTestId(/instagram/i)).toBeInTheDocument();
    expect(screen.getByTestId(/twitter/i)).toBeInTheDocument();
    expect(screen.getByTestId(/linkedIn/i)).toBeInTheDocument();
    expect(screen.getByTestId(/github/i)).toBeInTheDocument();
    expect(screen.getByTestId(/youtube/i)).toBeInTheDocument();
    expect(screen.getByTestId(/reddit/i)).toBeInTheDocument();
    expect(screen.getByTestId(/slack/i)).toBeInTheDocument();
  });

  test('Testing all the input fields', async () => {
    const profileVariables = {
      name: 'Name',
      websiteLink: 'https://website.com',
      socialUrl: 'https://socialurl.com',
      logo: new File(['logo'], 'test.png', {
        type: 'image/png',
      }),
    };

    await act(async () => {
      render(
        <MockedProvider addTypename={false}>
          <I18nextProvider i18n={i18n}>
            <CommunityProfile />
          </I18nextProvider>
        </MockedProvider>
      );
      await wait();

      const communityName = screen.getByPlaceholderText(/Community Name/i);
      const websiteLink = screen.getByPlaceholderText(/Website Link/i);
      const logo = screen.getByTestId(/fileInput/i);
      const facebook = screen.getByTestId(/facebook/i);
      const instagram = screen.getByTestId(/instagram/i);
      const linkedIn = screen.getByTestId(/linkedIn/i);
      const github = screen.getByTestId(/github/i);
      const youtube = screen.getByTestId(/youtube/i);
      const reddit = screen.getByTestId(/reddit/i);
      const slack = screen.getByTestId(/slack/i);

      userEvent.type(communityName, profileVariables.name);
      userEvent.type(websiteLink, profileVariables.websiteLink);
      userEvent.upload(logo, profileVariables.logo);
      await wait();
      userEvent.type(facebook, profileVariables.socialUrl);
      userEvent.type(instagram, profileVariables.socialUrl);
      userEvent.type(linkedIn, profileVariables.socialUrl);
      userEvent.type(github, profileVariables.socialUrl);
      userEvent.type(youtube, profileVariables.socialUrl);
      userEvent.type(reddit, profileVariables.socialUrl);
      userEvent.type(slack, profileVariables.socialUrl);
      await wait();

      expect(communityName).toHaveValue(profileVariables.name);
      expect(websiteLink).toHaveValue(profileVariables.websiteLink);
      expect(logo).toBeTruthy();
      expect(facebook).toHaveValue(profileVariables.socialUrl);
      expect(instagram).toHaveValue(profileVariables.socialUrl);
      expect(linkedIn).toHaveValue(profileVariables.socialUrl);
      expect(github).toHaveValue(profileVariables.socialUrl);
      expect(youtube).toHaveValue(profileVariables.socialUrl);
      expect(reddit).toHaveValue(profileVariables.socialUrl);
      expect(slack).toHaveValue(profileVariables.socialUrl);
    });
  });
});
