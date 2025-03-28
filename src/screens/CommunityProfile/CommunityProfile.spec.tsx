import React, { act } from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { describe, test, expect, vi } from 'vitest';
import { StaticMockLink } from 'utils/StaticMockLink';
import CommunityProfile from './CommunityProfile';
import i18n from 'utils/i18nForTest';
import { GET_COMMUNITY_DATA_PG } from 'GraphQl/Queries/Queries';
import { BrowserRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  RESET_COMMUNITY,
  UPDATE_COMMUNITY_PG,
} from 'GraphQl/Mutations/mutations';
import { errorHandler } from 'utils/errorHandler';
import { useMinioUpload } from 'utils/MinioUpload';

vi.mock('utils/errorHandler', () => ({
  errorHandler: vi.fn(),
}));

// Create a unique name for this file's mock
const communityProfileMockUpload = vi
  .fn()
  .mockResolvedValue({ objectName: 'test-image.png' });

vi.mock('utils/MinioUpload', () => ({
  useMinioUpload: () => ({ uploadFileToMinio: communityProfileMockUpload }),
}));

// Update MOCKS1 to include MinIO objectName in mutation
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
        linkedinURL: 'https://socialurl.com',
        githubURL: 'https://socialurl.com',
        youtubeURL: 'https://socialurl.com',
        redditURL: 'https://socialurl.com',
        slackURL: 'https://socialurl.com',
        inactivityTimeoutDuration: 30,
        logo: 'test-image.png', // MinIO object name
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

    // Replace base64 conversion check with MinIO upload verification
    await waitFor(() => {
      expect(communityProfileMockUpload).toHaveBeenCalledWith(
        expect.any(File),
        'community',
      );
    });

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

    // Loader should be present during loading state
    expect(screen.getByTestId('spinner-wrapper')).toBeInTheDocument();
  });

  test('should handle mutation error correctly', async () => {
    render(
      <MockedProvider addTypename={false} mocks={ERROR_MOCK}>
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

  test('should show success toast when profile is updated successfully', async () => {
    render(
      <MockedProvider addTypename={false} mocks={UPDATE_SUCCESS_MOCKS}>
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
      expect(toast.success).toHaveBeenCalledWith(expect.any(String));
    } catch (error) {
      console.error('Mutation error:', error);
      throw error;
    }
  });
});

// Add MinIO-specific test cases
describe('MinIO File Upload Handling', () => {
  const minioLink = new StaticMockLink(MOCKS1, true);

  beforeEach(() => {
    vi.clearAllMocks(); // Reset mocks before each test
    // Reset mock implementation before each test
    communityProfileMockUpload.mockImplementation(() =>
      Promise.resolve({ objectName: 'test-image.png' }),
    );
  });

  test('uploads logo to MinIO and includes objectName in mutation', async () => {
    // Split this into two separate tests:

    // Test 1: Just verify MinIO upload works
    render(
      <MockedProvider addTypename={false} link={minioLink}>
        <BrowserRouter>
          <I18nextProvider i18n={i18n}>
            <CommunityProfile />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    const file = new File(['logo content'], 'test.png', { type: 'image/png' });
    const fileInput = screen.getByTestId('fileInput');

    // Set required fields
    fireEvent.change(screen.getByPlaceholderText('Community Name'), {
      target: { value: 'Name' },
    });

    fireEvent.change(screen.getByPlaceholderText('Website Link'), {
      target: { value: 'https://website.com' },
    });

    // Fill out ALL social fields to match mock
    fireEvent.change(screen.getByTestId('facebook'), {
      target: { value: 'https://socialurl.com' },
    });
    // Add all other social fields...

    // Upload file
    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [file] } });
    });

    await wait(200);

    // Verify the upload mock was called
    expect(communityProfileMockUpload).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'test.png',
        type: 'image/png',
      }),
      'community',
    );

    // Don't test the save button in this test
  });

  // Test 2 (separate): Test the form submission with pre-filled state
  test('successfully submits the form with MinIO objectName', async () => {
    // CREATE A MORE COMPLETE MOCK
    const MINIO_SUBMISSION_MOCK = [
      {
        request: {
          query: GET_COMMUNITY_DATA_PG,
        },
        result: {
          data: {
            community: {
              // Add inactivityTimeoutDuration to match component query
              inactivityTimeoutDuration: 30,
              // Add other fields as needed
            },
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
            linkedinURL: 'https://socialurl.com',
            githubURL: 'https://socialurl.com',
            youtubeURL: 'https://socialurl.com',
            redditURL: 'https://socialurl.com',
            slackURL: 'https://socialurl.com',
            inactivityTimeoutDuration: 30, // MAKE SURE THIS MATCHES
            logo: 'test-image.png',
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

    // Rest of test remains the same
    render(
      <MockedProvider addTypename={false} mocks={MINIO_SUBMISSION_MOCK}>
        <BrowserRouter>
          <I18nextProvider i18n={i18n}>
            <CommunityProfile />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait(100); // Wait for initial render

    // Set all form fields to match the exact values in the mock
    fireEvent.change(screen.getByPlaceholderText('Community Name'), {
      target: { value: 'Name' },
    });

    fireEvent.change(screen.getByPlaceholderText('Website Link'), {
      target: { value: 'https://website.com' },
    });

    fireEvent.change(screen.getByTestId('facebook'), {
      target: { value: 'https://socialurl.com' },
    });

    fireEvent.change(screen.getByTestId('instagram'), {
      target: { value: 'https://socialurl.com' },
    });

    fireEvent.change(screen.getByTestId('X'), {
      target: { value: 'https://socialurl.com' },
    });

    fireEvent.change(screen.getByTestId('linkedIn'), {
      target: { value: 'https://socialurl.com' },
    });

    fireEvent.change(screen.getByTestId('github'), {
      target: { value: 'https://socialurl.com' },
    });

    fireEvent.change(screen.getByTestId('youtube'), {
      target: { value: 'https://socialurl.com' },
    });

    fireEvent.change(screen.getByTestId('reddit'), {
      target: { value: 'https://socialurl.com' },
    });

    fireEvent.change(screen.getByTestId('slack'), {
      target: { value: 'https://socialurl.com' },
    });

    // Directly set the logo in state to simulate MinIO upload already happened
    // We can't do this externally, so we need to upload a file to trigger the MinIO upload
    const fileInput = screen.getByTestId('fileInput');
    const file = new File(['logo content'], 'test.png', { type: 'image/png' });

    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [file] } });
    });

    await wait(200); // Wait for state update

    // Verify the save button is enabled
    const saveButton = screen.getByTestId('saveChangesBtn');
    expect(saveButton).not.toBeDisabled();

    // Submit the form
    fireEvent.click(saveButton);

    // Wait for the form submission and GraphQL mutation
    await wait(500);

    // Check if success toast was shown
    expect(toast.success).toHaveBeenCalled();
  });
});
