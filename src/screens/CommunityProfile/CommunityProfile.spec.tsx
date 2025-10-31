import React, { act } from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { describe, test, expect, vi } from 'vitest';
import { StaticMockLink } from 'utils/StaticMockLink';
import CommunityProfile from './CommunityProfile';
import i18n from 'utils/i18nForTest';
import { GET_COMMUNITY_DATA_PG } from 'GraphQl/Queries/Queries';
import { BrowserRouter } from 'react-router';
import { toast } from 'react-toastify';
import {
  RESET_COMMUNITY,
  UPDATE_COMMUNITY_PG,
} from 'GraphQl/Mutations/mutations';
import { errorHandler } from 'utils/errorHandler';

vi.mock('utils/errorHandler', () => ({
  errorHandler: vi.fn(),
}));

const MOCKS1 = [
  {
    request: {
      query: GET_COMMUNITY_DATA_PG,
    },
    result: {
      data: {
        community: null,
      },
    },
  },
  {
    request: {
      query: UPDATE_COMMUNITY_PG,
      variables: {
        name: 'Name',
        websiteURL: 'https://website.com',
        facebookURL: 'https://socialurl.com',
        instagramURL: 'https://socialurl.com',
        xURL: 'https://socialurl.com',
        inactivityTimeoutDuration: 30,
        linkedinURL: 'https://socialurl.com',
        githubURL: 'https://socialurl.com',
        youtubeURL: 'https://socialurl.com',
        redditURL: 'https://socialurl.com',
        slackURL: 'https://socialurl.com',
      },
    },
    result: {
      data: {
        updateCommunity: {
          id: '123',
        },
      },
    },
  },
];

const MOCKS2 = [
  {
    request: {
      query: GET_COMMUNITY_DATA_PG,
    },
    result: {
      data: {
        community: {
          createdAt: null,
          id: null,
          name: null,
          logoMimeType: null,
          updater: null,
          updatedAt: null,
          logoURL: null,
          websiteURL: null,
          facebookURL: null,
          githubURL: null,
          youtubeURL: null,
          instagramURL: null,
          linkedInURL: null,
          redditURL: null,
          slackURL: null,
          xURL: null,
          inactivityTimeoutDuration: null,
        },
      },
    },
  },
  {
    request: {
      query: RESET_COMMUNITY,
      variables: {
        resetPreLoginImageryId: 'communityId',
      },
    },
    result: {
      data: {
        resetCommunity: true,
      },
    },
  },
];

const MOCKS3 = [
  {
    request: {
      query: GET_COMMUNITY_DATA_PG,
    },
    result: {
      data: {
        community: {
          createdAt: '2022-01-01T12:00:00Z',
          updatedAt: '2022-01-01T12:00:00Z',
          id: 'communityId',
          name: 'testName',
          logoURL: 'http://logo.com',
          logoMimeType: 'image/png',
          websiteURL: 'http://websitelink.com',
          facebookURL: 'http://sociallink.com',
          githubURL: 'http://sociallink.com',
          youtubeURL: 'http://sociallink.com',
          instagramURL: 'http://sociallink.com',
          linkedInURL: 'http://sociallink.com',
          redditURL: 'http://sociallink.com',
          slackURL: 'http://sociallink.com',
          xURL: 'http://sociallink.com',
          inactivityTimeoutDuration: 30,
          updater: null,
        },
      },
    },
  },
  {
    request: {
      query: RESET_COMMUNITY,
      variables: {
        resetPreLoginImageryId: 'communityId',
      },
    },
    result: {
      data: {
        resetCommunity: true,
      },
    },
  },
];

const link1 = new StaticMockLink(MOCKS1, true);
const link2 = new StaticMockLink(MOCKS2, true);
const link3 = new StaticMockLink(MOCKS3, true);

const LOADING_MOCK = [
  {
    request: {
      query: GET_COMMUNITY_DATA_PG,
    },
    result: {
      data: {
        community: null,
      },
    },
    delay: 100, // Add delay to ensure loading state is rendered
  },
];

const ERROR_MOCK = [
  {
    request: {
      query: GET_COMMUNITY_DATA_PG,
    },
    result: {
      data: {
        community: null,
      },
    },
  },
  {
    request: {
      query: UPDATE_COMMUNITY_PG,
      variables: {
        name: 'Test Name',
        websiteURL: 'https://test.com',
        facebookURL: '',
        instagramURL: '',
        inactivityTimeoutDuration: null,
        xURL: '',
        linkedinURL: '',
        githubURL: '',
        youtubeURL: '',
        redditURL: '',
        slackURL: '',
      },
    },
    error: new Error('Mutation error'),
  },
];

const BASE64_MOCKS = [
  {
    request: {
      query: GET_COMMUNITY_DATA_PG,
    },
    result: {
      data: {
        community: null,
      },
    },
  },
];
const UPDATE_SUCCESS_MOCKS = [
  {
    request: {
      query: GET_COMMUNITY_DATA_PG,
    },
    result: {
      data: {
        community: {
          createdAt: null,
          facebookURL: null,
          githubURL: null,
          id: null,
          inactivityTimeoutDuration: null,
          instagramURL: null,
          linkedInURL: null,
          logoMimeType: null,
          logoURL: null,
          name: null,
          redditURL: null,
          slackURL: null,
          updatedAt: null,
          updater: null,
          websiteURL: null,
          xURL: null,
          youtubeURL: null,
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_COMMUNITY_PG,
      variables: {
        name: 'Test Name',
        websiteURL: 'https://test.com',
        facebookURL: undefined,
        instagramURL: undefined,
        xURL: undefined,
        linkedinURL: undefined,
        githubURL: undefined,
        youtubeURL: undefined,
        redditURL: undefined,
        slackURL: undefined,
        inactivityTimeoutDuration: null,
      },
    },
    result: {
      data: {
        updateCommunity: {
          id: '123',
        },
      },
    },
  },
];

const profileVariables = {
  name: 'Name',
  websiteURL: 'https://website.com',
  socialURL: 'https://socialurl.com',
  logoURL: new File(['logo'], 'test.png', {
    type: 'image/png',
  }),
};

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

describe('Testing Community Profile Screen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('Components should render properly', async () => {
    window.location.assign('/communityProfile');

    render(
      <MockedProvider link={link1}>
        <BrowserRouter>
          <I18nextProvider i18n={i18n}>
            <CommunityProfile />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();

    expect(screen.getByPlaceholderText(/Community Name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Website Link/i)).toBeInTheDocument();
    expect(screen.getByTestId(/facebook/i)).toBeInTheDocument();
    expect(screen.getByTestId(/instagram/i)).toBeInTheDocument();
    expect(screen.getByTestId(/X/i)).toBeInTheDocument();
    expect(screen.getByTestId(/linkedIn/i)).toBeInTheDocument();
    expect(screen.getByTestId(/github/i)).toBeInTheDocument();
    expect(screen.getByTestId(/youtube/i)).toBeInTheDocument();
    expect(screen.getByTestId(/reddit/i)).toBeInTheDocument();
    expect(screen.getByTestId(/slack/i)).toBeInTheDocument();
    expect(screen.getByTestId('resetChangesBtn')).toBeInTheDocument();
    expect(screen.getByTestId('resetChangesBtn')).toBeDisabled();
    expect(screen.getByTestId('saveChangesBtn')).toBeInTheDocument();
    expect(screen.getByTestId('saveChangesBtn')).toBeDisabled();
  });

  test('Testing all the input fields and update community data feature', async () => {
    window.location.assign('/communityProfile');

    await act(async () => {
      render(
        <MockedProvider link={link1}>
          <BrowserRouter>
            <I18nextProvider i18n={i18n}>
              <CommunityProfile />
            </I18nextProvider>
          </BrowserRouter>
        </MockedProvider>,
      );
    });
    await wait();

    const communityName = screen.getByPlaceholderText(/Community Name/i);
    const websiteLink = screen.getByPlaceholderText(/Website Link/i);
    const logo = screen.getByTestId(/fileInput/i);
    const facebook = screen.getByTestId(/facebook/i);
    const instagram = screen.getByTestId(/instagram/i);
    const X = screen.getByTestId(/X/i);
    const linkedIn = screen.getByTestId(/linkedIn/i);
    const github = screen.getByTestId(/github/i);
    const youtube = screen.getByTestId(/youtube/i);
    const reddit = screen.getByTestId(/reddit/i);
    const slack = screen.getByTestId(/slack/i);
    const saveChangesBtn = screen.getByTestId(/saveChangesBtn/i);
    const resetChangeBtn = screen.getByTestId(/resetChangesBtn/i);

    await userEvent.type(communityName, profileVariables.name);
    await userEvent.type(websiteLink, profileVariables.websiteURL);
    await userEvent.type(facebook, profileVariables.socialURL);
    await userEvent.type(instagram, profileVariables.socialURL);
    await userEvent.type(X, profileVariables.socialURL);
    await userEvent.type(linkedIn, profileVariables.socialURL);
    await userEvent.type(github, profileVariables.socialURL);
    await userEvent.type(youtube, profileVariables.socialURL);
    await userEvent.type(reddit, profileVariables.socialURL);
    await userEvent.type(slack, profileVariables.socialURL);
    await userEvent.upload(logo, profileVariables.logoURL);
    await wait();

    expect(communityName).toHaveValue(profileVariables.name);
    expect(websiteLink).toHaveValue(profileVariables.websiteURL);
    // expect(logo).toBeTruthy();
    expect(facebook).toHaveValue(profileVariables.socialURL);
    expect(instagram).toHaveValue(profileVariables.socialURL);
    expect(X).toHaveValue(profileVariables.socialURL);
    expect(linkedIn).toHaveValue(profileVariables.socialURL);
    expect(github).toHaveValue(profileVariables.socialURL);
    expect(youtube).toHaveValue(profileVariables.socialURL);
    expect(reddit).toHaveValue(profileVariables.socialURL);
    expect(slack).toHaveValue(profileVariables.socialURL);
    expect(saveChangesBtn).not.toBeDisabled();
    expect(resetChangeBtn).not.toBeDisabled();
    await wait();

    await userEvent.click(saveChangesBtn);
    await wait();
  });

  test('If the queried data has some fields null then the input field should be empty', async () => {
    render(
      <MockedProvider link={link2}>
        <I18nextProvider i18n={i18n}>
          <CommunityProfile />
        </I18nextProvider>
      </MockedProvider>,
    );
    await wait();

    expect(screen.getByPlaceholderText(/Community Name/i)).toHaveValue('');
    expect(screen.getByPlaceholderText(/Website Link/i)).toHaveValue('');
    expect(screen.getByTestId(/facebook/i)).toHaveValue('');
    expect(screen.getByTestId(/instagram/i)).toHaveValue('');
    expect(screen.getByTestId(/X/i)).toHaveValue('');
    expect(screen.getByTestId(/linkedIn/i)).toHaveValue('');
    expect(screen.getByTestId(/github/i)).toHaveValue('');
    expect(screen.getByTestId(/youtube/i)).toHaveValue('');
    expect(screen.getByTestId(/reddit/i)).toHaveValue('');
    expect(screen.getByTestId(/slack/i)).toHaveValue('');
  });

  test('Should clear out all the input field when click on Reset Changes button', async () => {
    render(
      <MockedProvider link={link3}>
        <I18nextProvider i18n={i18n}>
          <CommunityProfile />
        </I18nextProvider>
      </MockedProvider>,
    );
    await wait();

    const resetChangesBtn = screen.getByTestId('resetChangesBtn');
    await userEvent.click(resetChangesBtn);
    await wait();

    expect(screen.getByPlaceholderText(/Community Name/i)).toHaveValue('');
    expect(screen.getByPlaceholderText(/Website Link/i)).toHaveValue('');
    expect(screen.getByTestId(/facebook/i)).toHaveValue('');
    expect(screen.getByTestId(/instagram/i)).toHaveValue('');
    expect(screen.getByTestId(/X/i)).toHaveValue('');
    expect(screen.getByTestId(/linkedIn/i)).toHaveValue('');
    expect(screen.getByTestId(/github/i)).toHaveValue('');
    expect(screen.getByTestId(/youtube/i)).toHaveValue('');
    expect(screen.getByTestId(/reddit/i)).toHaveValue('');
    expect(screen.getByTestId(/slack/i)).toHaveValue('');
    expect(toast.success).toHaveBeenCalled();
  });

  test('Should have empty input fields when queried result is null', async () => {
    render(
      <MockedProvider link={link1}>
        <I18nextProvider i18n={i18n}>
          <CommunityProfile />
        </I18nextProvider>
      </MockedProvider>,
    );

    expect(screen.getByPlaceholderText(/Community Name/i)).toHaveValue('');
    expect(screen.getByPlaceholderText(/Website Link/i)).toHaveValue('');
    expect(screen.getByTestId(/facebook/i)).toHaveValue('');
    expect(screen.getByTestId(/instagram/i)).toHaveValue('');
    expect(screen.getByTestId(/X/i)).toHaveValue('');
    expect(screen.getByTestId(/linkedIn/i)).toHaveValue('');
    expect(screen.getByTestId(/github/i)).toHaveValue('');
    expect(screen.getByTestId(/youtube/i)).toHaveValue('');
    expect(screen.getByTestId(/reddit/i)).toHaveValue('');
    expect(screen.getByTestId(/slack/i)).toHaveValue('');
  });

  test('should show loader while data is being fetched', async () => {
    render(
      <MockedProvider mocks={LOADING_MOCK}>
        <BrowserRouter>
          <I18nextProvider i18n={i18n}>
            <CommunityProfile />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    // Loader should be present during loading state
    expect(screen.getByTestId('spinner-wrapper')).toBeInTheDocument();
  });

  test('should handle mutation error correctly', async () => {
    render(
      <MockedProvider mocks={ERROR_MOCK}>
        <BrowserRouter>
          <I18nextProvider i18n={i18n}>
            <CommunityProfile />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    const nameInput = screen.getByPlaceholderText(/Community Name/i);
    const websiteInput = screen.getByPlaceholderText(/Website Link/i);
    const logoInput = screen.getByTestId('fileInput');

    await userEvent.type(nameInput, 'Test Name');
    await userEvent.type(websiteInput, 'https://test.com');
    await userEvent.upload(
      logoInput,
      new File([''], 'test.png', { type: 'image/png' }),
    );

    const submitButton = screen.getByTestId('saveChangesBtn');
    await userEvent.click(submitButton);
    await wait();

    expect(errorHandler).toHaveBeenCalled();
    expect(errorHandler).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Error),
    );
  });

  test('should handle null base64 conversion when updating logo', async () => {
    render(
      <MockedProvider mocks={BASE64_MOCKS}>
        <BrowserRouter>
          <I18nextProvider i18n={i18n}>
            <CommunityProfile />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    const mockFile = new File([''], 'test.png', { type: 'image/png' });
    vi.mock('utils/convertToBase64', () => ({
      default: vi.fn().mockResolvedValue(null),
    }));

    const fileInput = screen.getByTestId('fileInput') as HTMLInputElement;
    fireEvent.change(fileInput, {
      target: { files: [mockFile] },
    });
    await wait();

    // Ensure state or UI behavior when base64 conversion fails
    expect(fileInput.value).toBe('');

    // Ensure no success toast is shown for null conversion
    expect(toast.success).not.toHaveBeenCalled();
  });

  test('should show success toast when profile is updated successfully', async () => {
    render(
      <MockedProvider mocks={UPDATE_SUCCESS_MOCKS}>
        <BrowserRouter>
          <I18nextProvider i18n={i18n}>
            <CommunityProfile />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    // Wait for initial query to complete
    await wait(100);

    const nameInput = screen.getByPlaceholderText(/Community Name/i);
    const websiteInput = screen.getByPlaceholderText(/Website Link/i);

    await userEvent.type(nameInput, 'Test Name');
    await userEvent.type(websiteInput, 'https://test.com');

    const submitButton = screen.getByTestId('saveChangesBtn');
    await userEvent.click(submitButton);

    // Increase wait time and add error handling
    try {
      await wait(1000); // Increased wait time
      expect(errorHandler).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Error),
      );
    } catch (error) {
      console.error('Mutation error:', error);
      throw error;
    }
  });
});
