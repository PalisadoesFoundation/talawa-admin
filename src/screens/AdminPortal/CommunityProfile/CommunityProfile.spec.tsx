import React, { act } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
import { MockedProvider } from '@apollo/react-testing';
import { render, screen, waitFor } from '@testing-library/react';

import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { StaticMockLink } from 'utils/StaticMockLink';
import CommunityProfile from './CommunityProfile';
import i18n from 'utils/i18nForTest';
import { GET_COMMUNITY_DATA_PG } from 'GraphQl/Queries/Queries';
import { BrowserRouter } from 'react-router';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import {
  RESET_COMMUNITY,
  UPDATE_COMMUNITY_PG,
} from 'GraphQl/Mutations/mutations';
import { errorHandler } from 'utils/errorHandler';

const { toastMocks, errorHandlerMock } = vi.hoisted(() => ({
  toastMocks: {
    success: vi.fn(),
    warning: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
  errorHandlerMock: vi.fn(),
}));

vi.mock('utils/errorHandler', () => ({
  errorHandler: errorHandlerMock,
}));

vi.mock('components/NotificationToast/NotificationToast', () => ({
  NotificationToast: toastMocks,
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
        logo: undefined,
        name: 'Name',
        websiteURL: 'https://website.com',
        facebookURL: 'https://socialurl.com',
        instagramURL: 'https://socialurl.com',
        xURL: 'https://socialurl.com',
        inactivityTimeoutDuration: undefined,
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
          id: 'communityId',
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
          linkedinURL: null,
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
          createdAt: dayjs.utc().toISOString(),
          updatedAt: dayjs.utc().toISOString(),
          id: 'communityId',
          name: 'testName',
          logoURL: 'http://logo.com',
          logoMimeType: 'image/png',
          websiteURL: 'http://websitelink.com',
          facebookURL: 'http://sociallink.com',
          githubURL: 'http://sociallink.com',
          youtubeURL: 'http://sociallink.com',
          instagramURL: 'http://sociallink.com',
          linkedinURL: 'http://sociallink.com',
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
    delay: 100,
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
        logo: undefined,
        name: 'Test Name',
        websiteURL: 'https://test.com',
        facebookURL: undefined,
        instagramURL: undefined,
        inactivityTimeoutDuration: undefined,
        xURL: undefined,
        linkedinURL: undefined,
        githubURL: undefined,
        youtubeURL: undefined,
        redditURL: undefined,
        slackURL: undefined,
      },
    },
    error: new Error('Mutation error'),
  },
];

const RESET_ERROR_MOCK = [
  {
    request: {
      query: GET_COMMUNITY_DATA_PG,
    },
    result: {
      data: {
        community: {
          id: 'communityId',
          name: 'Test',
          websiteURL: 'https://test.com',
          logoURL: 'logo.png',
          logoMimeType: 'image/png',
          inactivityTimeoutDuration: 30,
          facebookURL: null,
          instagramURL: null,
          xURL: null,
          linkedinURL: null,
          githubURL: null,
          youtubeURL: null,
          redditURL: null,
          slackURL: null,
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
    error: new Error('Reset error'),
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
          inactivityTimeoutDuration: 25,
          instagramURL: null,
          linkedinURL: null,
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
        logo: undefined,
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
        inactivityTimeoutDuration: 25,
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

describe('Testing Community Profile Screen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('Components should render properly', async () => {
    window.location.assign('/admin/communityProfile');

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
    window.location.assign('/admin/communityProfile');

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

    const mockFile = new File(['logo'], 'test.png', { type: 'image/png' });
    await userEvent.upload(logo, mockFile);
    await waitFor(() => {
      expect((logo as HTMLInputElement).files?.[0]).toBe(mockFile);
    });

    expect(communityName).toHaveValue(profileVariables.name);
    expect(websiteLink).toHaveValue(profileVariables.websiteURL);
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
        <BrowserRouter>
          <I18nextProvider i18n={i18n}>
            <CommunityProfile />
          </I18nextProvider>
        </BrowserRouter>
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
        <BrowserRouter>
          <I18nextProvider i18n={i18n}>
            <CommunityProfile />
          </I18nextProvider>
        </BrowserRouter>
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
    expect(NotificationToast.success).toHaveBeenCalled();
  });

  test('Should have empty input fields when queried result is null', async () => {
    render(
      <MockedProvider link={link1}>
        <BrowserRouter>
          <I18nextProvider i18n={i18n}>
            <CommunityProfile />
          </I18nextProvider>
        </BrowserRouter>
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

    const spinners = screen.getAllByTestId('spinner');
    expect(spinners.length).toBeGreaterThan(0);
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

    await wait();

    const nameInput = screen.getByPlaceholderText(/Community Name/i);
    const websiteInput = screen.getByPlaceholderText(/Website Link/i);
    const logoInput = screen.getByTestId('fileInput');

    await userEvent.type(nameInput, 'Test Name');
    await userEvent.type(websiteInput, 'https://test.com');

    const mockFile = new File(['test'], 'test.png', { type: 'image/png' });
    await userEvent.upload(logoInput, mockFile);

    await wait();

    const submitButton = screen.getByTestId('saveChangesBtn');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(errorHandler).toHaveBeenCalled();
    });
  });

  test('should handle file upload and store File object', async () => {
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

    const mockFile = new File(['test content'], 'test.png', {
      type: 'image/png',
    });
    const fileInput = screen.getByTestId('fileInput') as HTMLInputElement;

    await userEvent.upload(fileInput, mockFile);
    await waitFor(() => {
      // Verify file input accepted the file
      expect(fileInput.files?.[0]).toBe(mockFile);
    });
  });

  test('should handle empty file selection gracefully', async () => {
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

    const fileInput = screen.getByTestId('fileInput') as HTMLInputElement;

    // Simulate clearing file input by setting value to empty
    Object.defineProperty(fileInput, 'files', {
      value: [],
      configurable: true,
    });
    fileInput.dispatchEvent(new Event('change', { bubbles: true }));
    await wait();

    // Should not crash and buttons should still be disabled if no other fields filled
    expect(screen.getByTestId('saveChangesBtn')).toBeDisabled();
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

    // Wait for LoadingState to complete and form inputs to be rendered
    await waitFor(() => {
      expect(
        screen.getByPlaceholderText(/Community Name/i),
      ).toBeInTheDocument();
    });

    const nameInput = screen.getByPlaceholderText(
      /Community Name/i,
    ) as HTMLInputElement;
    const websiteInput = screen.getByPlaceholderText(
      /Website Link/i,
    ) as HTMLInputElement;

    // Update text fields only (no file upload to match mock variables)
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'Test Name');

    await userEvent.clear(websiteInput);
    await userEvent.type(websiteInput, 'https://test.com');

    // Wait for state to update
    await waitFor(() => {
      expect(nameInput.value).toBe('Test Name');
      expect(websiteInput.value).toBe('https://test.com');
    });

    const submitButton = screen.getByTestId('saveChangesBtn');
    expect(submitButton).not.toBeDisabled();

    // Submit form
    await userEvent.click(submitButton);

    // Wait for success toast
    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalled();
    });
  });

  test('should handle reset error correctly', async () => {
    render(
      <MockedProvider mocks={RESET_ERROR_MOCK}>
        <BrowserRouter>
          <I18nextProvider i18n={i18n}>
            <CommunityProfile />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    const resetButton = screen.getByTestId('resetChangesBtn');
    await userEvent.click(resetButton);

    await waitFor(() => {
      expect(errorHandler).toHaveBeenCalled();
    });
  });

  test('should enable buttons when only name is filled', async () => {
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

    const nameInput = screen.getByPlaceholderText(/Community Name/i);
    await userEvent.type(nameInput, 'Test');

    const saveButton = screen.getByTestId('saveChangesBtn');
    const resetButton = screen.getByTestId('resetChangesBtn');

    expect(saveButton).not.toBeDisabled();
    expect(resetButton).not.toBeDisabled();
  });

  test('should enable buttons when only website is filled', async () => {
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

    const websiteInput = screen.getByPlaceholderText(/Website Link/i);
    await userEvent.type(websiteInput, 'https://test.com');

    const saveButton = screen.getByTestId('saveChangesBtn');
    const resetButton = screen.getByTestId('resetChangesBtn');

    expect(saveButton).not.toBeDisabled();
    expect(resetButton).not.toBeDisabled();
  });

  test('should enable buttons when only logo is uploaded', async () => {
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

    const logoInput = screen.getByTestId('fileInput');
    const mockFile = new File(['test'], 'test.png', { type: 'image/png' });
    await userEvent.upload(logoInput, mockFile);

    // Wait for state to update after file selection
    await waitFor(() => {
      const saveButton = screen.getByTestId('saveChangesBtn');
      expect(saveButton).not.toBeDisabled();
    });

    const saveButton = screen.getByTestId('saveChangesBtn');
    const resetButton = screen.getByTestId('resetChangesBtn');

    expect(saveButton).not.toBeDisabled();
    expect(resetButton).not.toBeDisabled();
  });

  test('should set document title correctly', async () => {
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

    expect(document.title).toBeTruthy();
  });

  test('should populate form with existing community data', async () => {
    render(
      <MockedProvider link={link3}>
        <BrowserRouter>
          <I18nextProvider i18n={i18n}>
            <CommunityProfile />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    expect(screen.getByPlaceholderText(/Community Name/i)).toHaveValue(
      'testName',
    );
    expect(screen.getByPlaceholderText(/Website Link/i)).toHaveValue(
      'http://websitelink.com',
    );
    expect(screen.getByTestId(/facebook/i)).toHaveValue(
      'http://sociallink.com',
    );
  });

  test('should handle file input without files', async () => {
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

    const fileInput = screen.getByTestId('fileInput') as HTMLInputElement;
    // Simulate clearing file input by setting value to empty
    Object.defineProperty(fileInput, 'files', {
      value: [],
      configurable: true,
    });
    fileInput.dispatchEvent(new Event('change', { bubbles: true }));

    await wait();

    // Should not crash and maintain empty state
    expect(fileInput.files?.length).toBe(0);

    // Assert component-level effects: buttons should remain disabled
    const saveChangesBtn = screen.getByTestId('saveChangesBtn');
    const resetChangesBtn = screen.getByTestId('resetChangesBtn');

    expect(saveChangesBtn).toBeDisabled();
    expect(resetChangesBtn).toBeDisabled();

    // Verify the component's logo state was cleared/remains empty
    // Note: This assumes the component exposes logo state through the file input
    // or that no logo was set, keeping the form in its initial disabled state
    expect(fileInput.value).toBe('');
  });

  test('should handle multiple file selections correctly', async () => {
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

    const fileInput = screen.getByTestId('fileInput') as HTMLInputElement;
    const mockFile = new File(['content'], 'test.png', { type: 'image/png' });

    await userEvent.upload(fileInput, mockFile);
    await waitFor(() => {
      expect(fileInput.files?.[0]).toBe(mockFile);
    });

    // Upload another file
    const mockFile2 = new File(['content2'], 'test2.png', {
      type: 'image/png',
    });
    await userEvent.upload(fileInput, mockFile2);
    await waitFor(() => {
      // The second file should be in the input
      expect(fileInput.files?.[0]).toBe(mockFile2);
    });
  });

  test('should handle uploading then clearing a logo file', async () => {
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

    const fileInput = screen.getByTestId('fileInput') as HTMLInputElement;
    const mockFile = new File(['content'], 'test.png', { type: 'image/png' });

    // Upload file
    await userEvent.upload(fileInput, mockFile);
    await waitFor(() => {
      expect(screen.getByTestId('saveChangesBtn')).not.toBeDisabled();
    });

    // Clear file by setting files to empty (userEvent.clear doesn't work for file inputs)
    Object.defineProperty(fileInput, 'files', {
      value: [],
      configurable: true,
    });
    Object.defineProperty(fileInput, 'value', {
      value: '',
      configurable: true,
    });
    fileInput.dispatchEvent(new Event('change', { bubbles: true }));
    await wait();

    // After clearing, if no other fields are filled, buttons should be disabled
    expect(screen.getByTestId('saveChangesBtn')).toBeDisabled();
  });

  describe('LoadingState Behavior', () => {
    it('should show LoadingState spinner while community data is loading', async () => {
      render(
        <MockedProvider mocks={LOADING_MOCK}>
          <BrowserRouter>
            <I18nextProvider i18n={i18n}>
              <CommunityProfile />
            </I18nextProvider>
          </BrowserRouter>
        </MockedProvider>,
      );

      const spinners = screen.getAllByTestId('spinner');
      expect(spinners.length).toBeGreaterThan(0);
    });

    it('should hide spinner and render form after LoadingState completes', async () => {
      render(
        <MockedProvider link={link1}>
          <BrowserRouter>
            <I18nextProvider i18n={i18n}>
              <CommunityProfile />
            </I18nextProvider>
          </BrowserRouter>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText(/Community Name/i),
        ).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
      });
    });
  });
});
