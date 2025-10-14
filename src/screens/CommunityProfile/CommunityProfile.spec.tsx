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
      <MockedProvider addTypename={false} link={link1}>
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
        <MockedProvider addTypename={false} link={link1}>
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
      <MockedProvider addTypename={false} link={link2}>
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
      <MockedProvider addTypename={false} link={link3}>
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
      <MockedProvider addTypename={false} link={link1}>
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

  test('should show loader while data is being fetched', async () => {
    render(
      <MockedProvider addTypename={false} mocks={LOADING_MOCK}>
        <BrowserRouter>
          <I18nextProvider i18n={i18n}>
            <CommunityProfile />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    expect(screen.getByTestId('spinner-wrapper')).toBeInTheDocument();

    await wait();
  });

  test('should handle error in resetData mutation', async () => {
    const ERROR_RESET_MOCK = [
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
        error: new Error('Reset mutation error'),
      },
    ];

    render(
      <MockedProvider addTypename={false} mocks={ERROR_RESET_MOCK}>
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

    expect(errorHandler).toHaveBeenCalled();
    expect(errorHandler).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Error),
    );
  });

  test('should enable buttons when only name is filled', async () => {
    render(
      <MockedProvider addTypename={false} link={link1}>
        <BrowserRouter>
          <I18nextProvider i18n={i18n}>
            <CommunityProfile />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    const nameInput = screen.getByPlaceholderText(/Community Name/i);
    const saveBtn = screen.getByTestId('saveChangesBtn');
    const resetBtn = screen.getByTestId('resetChangesBtn');

    expect(saveBtn).toBeDisabled();
    expect(resetBtn).toBeDisabled();

    await userEvent.type(nameInput, 'Test Name');
    expect(saveBtn).not.toBeDisabled();
    expect(resetBtn).not.toBeDisabled();
  });

  test('should enable buttons when only websiteURL is filled', async () => {
    render(
      <MockedProvider addTypename={false} link={link1}>
        <BrowserRouter>
          <I18nextProvider i18n={i18n}>
            <CommunityProfile />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    const websiteInput = screen.getByPlaceholderText(/Website Link/i);
    const saveBtn = screen.getByTestId('saveChangesBtn');

    await userEvent.type(websiteInput, 'https://test.com');
    expect(saveBtn).not.toBeDisabled();
  });

  test('should handle logo file upload and trigger state update', async () => {
    render(
      <MockedProvider addTypename={false} link={link1}>
        <BrowserRouter>
          <I18nextProvider i18n={i18n}>
            <CommunityProfile />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    const logoInput = screen.getByTestId('fileInput');
    const nameInput = screen.getByPlaceholderText(/Community Name/i);
    const saveBtn = screen.getByTestId('saveChangesBtn');

    expect(saveBtn).toBeDisabled();

    await userEvent.type(nameInput, 'Test Name');
    expect(saveBtn).not.toBeDisabled();

    await userEvent.upload(
      logoInput,
      new File(['test content'], 'test.png', { type: 'image/png' }),
    );
    await wait(100);

    expect(saveBtn).not.toBeDisabled();
  });

  test('should handle file input change without file selection', async () => {
    render(
      <MockedProvider addTypename={false} link={link1}>
        <BrowserRouter>
          <I18nextProvider i18n={i18n}>
            <CommunityProfile />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    const logoInput = screen.getByTestId('fileInput') as HTMLInputElement;

    fireEvent.change(logoInput, { target: { files: [] } });
    await wait();

    expect(logoInput.files?.length).toBe(0);
  });

  test('should update all social media URLs correctly', async () => {
    render(
      <MockedProvider addTypename={false} link={link1}>
        <BrowserRouter>
          <I18nextProvider i18n={i18n}>
            <CommunityProfile />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    const facebookInput = screen.getByTestId('facebook');
    const instagramInput = screen.getByTestId('instagram');
    const xInput = screen.getByTestId('X');
    const linkedInInput = screen.getByTestId('linkedIn');
    const githubInput = screen.getByTestId('github');
    const youtubeInput = screen.getByTestId('youtube');
    const redditInput = screen.getByTestId('reddit');
    const slackInput = screen.getByTestId('slack');

    await userEvent.type(facebookInput, 'https://facebook.com/test');
    await userEvent.type(instagramInput, 'https://instagram.com/test');
    await userEvent.type(xInput, 'https://x.com/test');
    await userEvent.type(linkedInInput, 'https://linkedin.com/test');
    await userEvent.type(githubInput, 'https://github.com/test');
    await userEvent.type(youtubeInput, 'https://youtube.com/test');
    await userEvent.type(redditInput, 'https://reddit.com/test');
    await userEvent.type(slackInput, 'https://slack.com/test');

    expect(facebookInput).toHaveValue('https://facebook.com/test');
    expect(instagramInput).toHaveValue('https://instagram.com/test');
    expect(xInput).toHaveValue('https://x.com/test');
    expect(linkedInInput).toHaveValue('https://linkedin.com/test');
    expect(githubInput).toHaveValue('https://github.com/test');
    expect(youtubeInput).toHaveValue('https://youtube.com/test');
    expect(redditInput).toHaveValue('https://reddit.com/test');
    expect(slackInput).toHaveValue('https://slack.com/test');
  });

  test('should populate form fields with fetched community data', async () => {
    render(
      <MockedProvider addTypename={false} link={link3}>
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
    expect(screen.getByTestId('facebook')).toHaveValue('http://sociallink.com');
    expect(screen.getByTestId('instagram')).toHaveValue(
      'http://sociallink.com',
    );
    expect(screen.getByTestId('X')).toHaveValue('http://sociallink.com');
    expect(screen.getByTestId('linkedIn')).toHaveValue('http://sociallink.com');
    expect(screen.getByTestId('github')).toHaveValue('http://sociallink.com');
    expect(screen.getByTestId('youtube')).toHaveValue('http://sociallink.com');
    expect(screen.getByTestId('reddit')).toHaveValue('http://sociallink.com');
    expect(screen.getByTestId('slack')).toHaveValue('http://sociallink.com');
  });

  test('should clear logo field before setting new file', async () => {
    render(
      <MockedProvider addTypename={false} link={link3}>
        <BrowserRouter>
          <I18nextProvider i18n={i18n}>
            <CommunityProfile />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    const logoInput = screen.getByTestId('fileInput');
    const mockFile = new File(['test content'], 'test.png', {
      type: 'image/png',
    });

    await userEvent.upload(logoInput, mockFile);
    await wait();

    const mockFile2 = new File(['test content 2'], 'test2.png', {
      type: 'image/png',
    });
    await userEvent.upload(logoInput, mockFile2);
    await wait();

    expect(logoInput).toBeInTheDocument();
  });
});
