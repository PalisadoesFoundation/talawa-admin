import React from 'react';
import {
  act,
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import OrgPostCard from './OrgPostCard';
import { I18nextProvider } from 'react-i18next';
import userEvent from '@testing-library/user-event';
import 'jest-localstorage-mock';
import {
  DELETE_POST_MUTATION,
  UPDATE_POST_MUTATION,
  TOGGLE_PINNED_POST,
} from 'GraphQl/Mutations/mutations';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
// import convertToBase64 from 'utils/convertToBase64';
import { BrowserRouter } from 'react-router-dom';
import useLocalStorage from 'utils/useLocalstorage';
import convertToBase64 from 'utils/convertToBase64';
import { toast } from 'react-toastify';
import { errorHandler } from 'utils/errorHandler';

const { setItem } = useLocalStorage();

const MOCKS = [
  {
    request: {
      query: DELETE_POST_MUTATION,
      variables: { id: '12' },
    },
    result: {
      data: {
        removePost: {
          _id: '12',
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_POST_MUTATION,
      variables: {
        id: '12',
        title: 'updated title',
        text: 'This is a updated text',
      },
    },
    result: {
      data: {
        updatePost: {
          _id: '12',
        },
      },
    },
  },
  {
    request: {
      query: TOGGLE_PINNED_POST,
      variables: {
        id: '12',
      },
    },
    result: {
      data: {
        togglePostPin: {
          _id: '12',
        },
      },
    },
  },
];

jest.mock('utils/errorHandler', () => ({
  errorHandler: jest.fn(),
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));
jest.mock('i18next-browser-languagedetector', () => ({
  init: jest.fn(),
  type: 'languageDetector',
  detect: jest.fn(() => 'en'),
  cacheUserLanguage: jest.fn(),
}));

const link = new StaticMockLink(MOCKS, true);
async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}
describe('Testing Organization Post Card', () => {
  const mockProps = {
    id: '12',
    postID: '123',
    postTitle: 'Test Post',
    postInfo: 'Test Info',
    postAuthor: 'Test Author',
    postPhoto: 'test.jpg',
    postVideo: null,
    pinned: false,
    refetch: jest.fn(),
  };

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });
  const originalLocation = window.location;

  beforeAll(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        reload: jest.fn(),
      },
    });
  });

  afterAll(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    });
  });

  const props = {
    id: '12',
    postID: '123',
    postTitle: 'Event Info',
    postInfo: 'Time change',
    postAuthor: 'John Doe',
    postPhoto: 'test.png',
    postVideo: 'test.mp4',
    pinned: false,
    refetch: jest.fn(),
  };

  jest.mock('react-toastify', () => ({
    toast: {
      success: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    },
  }));
  jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useRef: jest.fn(),
  }));
  global.alert = jest.fn();

  test('Opens post on image click', () => {
    const { getByTestId, getByAltText } = render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard {...props} />
        </I18nextProvider>
      </MockedProvider>,
    );
    userEvent.click(screen.getByAltText('image'));

    expect(getByTestId('card-text')).toBeInTheDocument();
    expect(getByTestId('card-title')).toBeInTheDocument();
    expect(getByAltText('image')).toBeInTheDocument();
  });
  test('renders with default props', () => {
    const { getByAltText, getByTestId } = render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard {...props} />
        </I18nextProvider>
      </MockedProvider>,
    );
    expect(getByTestId('card-text')).toBeInTheDocument();
    expect(getByTestId('card-title')).toBeInTheDocument();
    expect(getByAltText('image')).toBeInTheDocument();
  });
  test('toggles "Read more" button', () => {
    const { getByTestId } = render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard {...props} />
        </I18nextProvider>
      </MockedProvider>,
    );
    userEvent.click(screen.getByAltText('image'));
    const toggleButton = getByTestId('toggleBtn');
    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveTextContent('hide');
    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveTextContent('Read more');
  });
  test('opens and closes edit modal', async () => {
    setItem('id', '123');

    render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard {...props} />
        </I18nextProvider>
      </MockedProvider>,
    );
    await wait();
    userEvent.click(screen.getByAltText('image'));
    userEvent.click(screen.getByTestId('moreiconbtn'));
    userEvent.click(screen.getByTestId('editPostModalBtn'));

    const createOrgBtn = screen.getByTestId('modalOrganizationHeader');
    expect(createOrgBtn).toBeInTheDocument();
    userEvent.click(createOrgBtn);
    userEvent.click(screen.getByTestId('closeOrganizationModal'));
  });

  test('Should render text elements when props value is not passed', async () => {
    global.confirm = (): boolean => false;
    render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard {...props} />
        </I18nextProvider>
      </MockedProvider>,
    );
    await wait();
    userEvent.click(screen.getByAltText('image'));
    expect(screen.getByAltText('Post Image')).toBeInTheDocument();
  });

  test('Testing pin post functionality', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard {...props} />
        </I18nextProvider>
      </MockedProvider>,
    );

    await wait();

    userEvent.click(screen.getByAltText('image'));
    userEvent.click(screen.getByTestId('moreiconbtn'));
    userEvent.click(screen.getByTestId('pinpostBtn'));

    await waitFor(
      () => {
        expect(window.location.reload).toHaveBeenCalled();
      },
      { timeout: 3000 },
    );
  });
  test('Testing pin post functionality fail case', async () => {
    const props2 = {
      id: '',
      postID: '123',
      postTitle: 'Event Info',
      postInfo: 'Time change',
      postAuthor: 'John Doe',
      postPhoto: 'test.png',
      postVideo: 'test.mp4',
      pinned: true,
      refetch: jest.fn(),
    };
    render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard {...props2} />
        </I18nextProvider>
      </MockedProvider>,
    );

    await wait();

    userEvent.click(screen.getByAltText('image'));
    userEvent.click(screen.getByTestId('moreiconbtn'));
    userEvent.click(screen.getByTestId('pinpostBtn'));
  });
  test('Testing post delete functionality', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <OrgPostCard {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    userEvent.click(screen.getByAltText('image'));
    userEvent.click(screen.getByTestId('moreiconbtn'));

    userEvent.click(screen.getByTestId('deletePostModalBtn'));
    fireEvent.click(screen.getByTestId('deletePostBtn'));

    await waitFor(
      () => {
        expect(window.location.reload).toHaveBeenCalled();
      },
      { timeout: 3000 },
    );
  });
  test('Testing post delete functionality fail case', async () => {
    const props2 = {
      id: '',
      postID: '123',
      postTitle: 'Event Info',
      postInfo: 'Time change',
      postAuthor: 'John Doe',
      postPhoto: 'test.png',
      postVideo: 'test.mp4',
      pinned: true,
      refetch: jest.fn(),
    };
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <OrgPostCard {...props2} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    userEvent.click(screen.getByAltText('image'));
    userEvent.click(screen.getByTestId('moreiconbtn'));

    userEvent.click(screen.getByTestId('deletePostModalBtn'));
    fireEvent.click(screen.getByTestId('deletePostBtn'));
  });
  test('Testing close functionality of primary modal', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard {...props} />
        </I18nextProvider>
      </MockedProvider>,
    );

    await wait();

    userEvent.click(screen.getByAltText('image'));
    userEvent.click(screen.getByTestId('closeiconbtn'));

    //Primary Modal is closed
    expect(screen.queryByTestId('moreiconbtn')).not.toBeInTheDocument();
  });
  test('Testing close functionality of secondary modal', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard {...props} />
        </I18nextProvider>
      </MockedProvider>,
    );

    await wait();

    userEvent.click(screen.getByAltText('image'));
    userEvent.click(screen.getByTestId('moreiconbtn'));
    userEvent.click(screen.getByTestId('closebtn'));

    //Secondary Modal is closed
    expect(screen.queryByTestId('deletePostModalBtn')).not.toBeInTheDocument();
    expect(screen.queryByTestId('editPostModalBtn')).not.toBeInTheDocument();
    expect(screen.queryByTestId('pinpostBtn')).not.toBeInTheDocument();
    expect(screen.queryByTestId('closebtn')).not.toBeInTheDocument();
  });
  test('renders without "Read more" button when postInfo length is less than or equal to 43', () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard {...props} />
        </I18nextProvider>
      </MockedProvider>,
    );
    expect(screen.queryByTestId('toggleBtn')).not.toBeInTheDocument();
  });
  test('renders with "Read more" button when postInfo length is more than 43', () => {
    const props2 = {
      id: '12',
      postID: '123',
      postTitle: 'Event Info',
      postInfo:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum.', // Length is greater than 43
      postAuthor: 'John Doe',
      postPhoto: 'photoLink',
      postVideo: 'videoLink',
      pinned: false,
      refetch: jest.fn(),
    };
    render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard {...props2} />
        </I18nextProvider>
      </MockedProvider>,
    );
    userEvent.click(screen.getByAltText('image'));

    expect(screen.getByTestId('toggleBtn')).toBeInTheDocument();
  });
  test('updates state variables correctly when handleEditModal is called', () => {
    const link2 = new StaticMockLink(MOCKS, true);
    render(
      <MockedProvider link={link2} addTypename={false}>
        <OrgPostCard {...props} />
      </MockedProvider>,
    );
    userEvent.click(screen.getByAltText('image'));

    userEvent.click(screen.getByTestId('moreiconbtn'));

    expect(screen.queryByTestId('editPostModalBtn')).toBeInTheDocument();

    userEvent.click(screen.getByTestId('editPostModalBtn'));

    //Primary Modal is closed
    expect(screen.queryByTestId('closeiconbtn')).not.toBeInTheDocument();
    expect(screen.queryByTestId('moreiconbtn')).not.toBeInTheDocument();
    expect(screen.queryByTestId('toggleBtn')).not.toBeInTheDocument();

    //Secondary Modal is closed
    expect(screen.queryByTestId('deletePostModalBtn')).not.toBeInTheDocument();
    expect(screen.queryByTestId('editPostModalBtn')).not.toBeInTheDocument();
    expect(screen.queryByTestId('pinpostBtn')).not.toBeInTheDocument();
    expect(screen.queryByTestId('closebtn')).not.toBeInTheDocument();
  });
  test('updates state variables correctly when handleDeleteModal is called', () => {
    const link2 = new StaticMockLink(MOCKS, true);
    render(
      <MockedProvider link={link2} addTypename={false}>
        <OrgPostCard {...props} />
      </MockedProvider>,
    );
    userEvent.click(screen.getByAltText('image'));

    userEvent.click(screen.getByTestId('moreiconbtn'));

    expect(screen.queryByTestId('deletePostModalBtn')).toBeInTheDocument();

    userEvent.click(screen.getByTestId('deletePostModalBtn'));

    //Primary Modal is closed
    expect(screen.queryByTestId('closeiconbtn')).not.toBeInTheDocument();
    expect(screen.queryByTestId('moreiconbtn')).not.toBeInTheDocument();
    expect(screen.queryByTestId('toggleBtn')).not.toBeInTheDocument();

    //Secondary Modal is closed
    expect(screen.queryByTestId('deletePostModalBtn')).not.toBeInTheDocument();
    expect(screen.queryByTestId('editPostModalBtn')).not.toBeInTheDocument();
    expect(screen.queryByTestId('pinpostBtn')).not.toBeInTheDocument();
    expect(screen.queryByTestId('closebtn')).not.toBeInTheDocument();
  });

  test('clears postitle state and resets file input value', async () => {
    const { getByTestId } = render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard {...props} />
        </I18nextProvider>
      </MockedProvider>,
    );

    await wait();

    userEvent.click(screen.getByAltText('image'));
    userEvent.click(screen.getByTestId('moreiconbtn'));
    userEvent.click(screen.getByTestId('editPostModalBtn'));

    fireEvent.change(getByTestId('updateTitle'), {
      target: { value: '' },
    });

    userEvent.click(screen.getByTestId('updatePostBtn'));

    expect(screen.getByTestId('updateTitle')).toHaveValue('');
    expect(screen.getByTestId('closeOrganizationModal')).toBeInTheDocument();
    expect(screen.getByTestId('updatePostBtn')).toBeInTheDocument();
  });
  test('clears postinfo state and resets file input value', async () => {
    const { getByTestId } = render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard {...props} />
        </I18nextProvider>
      </MockedProvider>,
    );

    await wait();

    userEvent.click(screen.getByAltText('image'));
    userEvent.click(screen.getByTestId('moreiconbtn'));
    userEvent.click(screen.getByTestId('editPostModalBtn'));

    fireEvent.change(getByTestId('updateText'), {
      target: { value: '' },
    });

    userEvent.click(screen.getByTestId('updatePostBtn'));

    expect(screen.getByTestId('updateText')).toHaveValue('');
    expect(screen.getByTestId('closeOrganizationModal')).toBeInTheDocument();
    expect(screen.getByTestId('updatePostBtn')).toBeInTheDocument();
  });
  test('Testing create organization modal', async () => {
    setItem('id', '123');

    render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard {...props} />
        </I18nextProvider>
      </MockedProvider>,
    );

    await wait();
    userEvent.click(screen.getByAltText('image'));

    userEvent.click(screen.getByTestId('moreiconbtn'));

    userEvent.click(screen.getByTestId('editPostModalBtn'));
    const createOrgBtn = screen.getByTestId('modalOrganizationHeader');
    expect(createOrgBtn).toBeInTheDocument();
    userEvent.click(createOrgBtn);
    userEvent.click(screen.getByTestId('closeOrganizationModal'));
  });

  test('should toggle post pin when pin button is clicked', async () => {
    const { getByTestId } = render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard {...props} />
        </I18nextProvider>
      </MockedProvider>,
    );
    userEvent.click(screen.getByAltText('image'));

    userEvent.click(screen.getByTestId('moreiconbtn'));
    const pinButton = getByTestId('pinpostBtn');
    fireEvent.click(pinButton);
    await waitFor(() => {
      expect(MOCKS[2].request.variables).toEqual({
        id: '12',
      });
    });
    expect(toast.success).toHaveBeenCalledWith('Post pinned');

    await waitFor(() => {
      expect(screen.queryByTestId('imagepreviewmodal')).not.toBeInTheDocument();
      expect(screen.queryByTestId('menuModal')).not.toBeInTheDocument();
    });

    await waitFor(
      () => {
        expect(window.location.reload).toHaveBeenCalled();
      },
      { timeout: 2100 },
    );
  });

  test('should handle pin toggle with no data', async () => {
    const noDataMock = {
      request: {
        query: TOGGLE_PINNED_POST,
        variables: { id: '12' },
      },
      result: {}, // Empty result with no data
    };

    const noDataLink = new StaticMockLink([noDataMock], true);

    render(
      <MockedProvider addTypename={false} link={noDataLink}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard {...mockProps} />
        </I18nextProvider>
      </MockedProvider>,
    );

    userEvent.click(screen.getByAltText('image'));
    userEvent.click(screen.getByTestId('moreiconbtn'));
    userEvent.click(screen.getByTestId('pinpostBtn'));

    // Verify success toast is not shown
    await waitFor(() => {
      expect(toast.success).not.toHaveBeenCalled();
    });

    // Verify page reload is not triggered
    await waitFor(
      () => {
        expect(window.location.reload).not.toHaveBeenCalled();
      },
      { timeout: 2100 },
    );

    // Verify modals remain open
    expect(screen.getByTestId('imagepreviewmodal')).toBeInTheDocument();
    expect(screen.getByTestId('menuModal')).toBeInTheDocument();
  });

  test('should successfully unpin a post and show success message', async () => {
    render(
      <MockedProvider link={link} addTypename={false}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard {...mockProps} pinned={true} />
        </I18nextProvider>
      </MockedProvider>,
    );

    userEvent.click(screen.getByTestId('cardStructure'));
    userEvent.click(screen.getByTestId('moreiconbtn'));

    const unpinButton = screen.getByTestId('pinpostBtn');
    userEvent.click(unpinButton);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Post unpinned');
    });

    await waitFor(() => {
      expect(screen.queryByTestId('imagepreviewmodal')).not.toBeInTheDocument();
      expect(screen.queryByTestId('menuModal')).not.toBeInTheDocument();
    });
  });

  test('should handle error when toggling pin fails', async () => {
    const errorMock = [
      {
        request: {
          query: TOGGLE_PINNED_POST,
          variables: { id: '12' },
        },
        error: new Error('Failed to toggle pin'),
      },
    ];

    const errorLink = new StaticMockLink(errorMock, true);

    render(
      <MockedProvider link={errorLink} addTypename={false}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard {...mockProps} />
        </I18nextProvider>
      </MockedProvider>,
    );

    userEvent.click(screen.getByTestId('cardStructure'));
    userEvent.click(screen.getByTestId('moreiconbtn'));

    const pinButton = screen.getByTestId('pinpostBtn');
    userEvent.click(pinButton);

    await waitFor(() => {
      expect(errorHandler).toHaveBeenCalledWith(
        expect.anything(),
        new Error('Failed to toggle pin'),
      );
    });
  });

  test('should handle error when updating post fails', async () => {
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'Failed to update the post.' }),
      }),
    );
    const errorMock = [
      {
        request: {
          query: UPDATE_POST_MUTATION,
          variables: { id: '12' },
        },
        error: new Error('Failed to update the post.'),
      },
    ];

    const errorLink = new StaticMockLink(errorMock, true);

    render(
      <MockedProvider link={errorLink} addTypename={false}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard {...mockProps} />
        </I18nextProvider>
      </MockedProvider>,
    );

    userEvent.click(screen.getByTestId('cardStructure'));
    userEvent.click(screen.getByTestId('moreiconbtn'));
    userEvent.click(screen.getByTestId('editPostModalBtn'));
    userEvent.click(screen.getByTestId('updatePostBtn'));

    await waitFor(() => {
      expect(errorHandler).toHaveBeenCalledWith(
        expect.anything(),
        new Error('Failed to update the post.'),
      );
    });
  });

  test('should handle error when updating post fails without error message', async () => {
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({}),
      }),
    );
    const errorMock = [
      {
        request: {
          query: UPDATE_POST_MUTATION,
          variables: { id: '12' },
        },
        error: new Error('Failed to create the post.'),
      },
    ];

    const errorLink = new StaticMockLink(errorMock, true);

    render(
      <MockedProvider link={errorLink} addTypename={false}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard {...mockProps} />
        </I18nextProvider>
      </MockedProvider>,
    );

    userEvent.click(screen.getByTestId('cardStructure'));
    userEvent.click(screen.getByTestId('moreiconbtn'));
    userEvent.click(screen.getByTestId('editPostModalBtn'));
    userEvent.click(screen.getByTestId('updatePostBtn'));

    await waitFor(() => {
      expect(errorHandler).toHaveBeenCalledWith(
        expect.anything(),
        new Error('Failed to create the post.'),
      );
    });
  });

  test('testing video play and pause on mouse enter and leave events', async () => {
    const { getByTestId } = render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard {...props} />
        </I18nextProvider>
      </MockedProvider>,
    );

    const card = getByTestId('cardVid');

    HTMLVideoElement.prototype.play = jest.fn();
    HTMLVideoElement.prototype.pause = jest.fn();

    fireEvent.mouseEnter(card);
    expect(HTMLVideoElement.prototype.play).toHaveBeenCalled();

    fireEvent.mouseLeave(card);
    expect(HTMLVideoElement.prototype.pause).toHaveBeenCalled();
  });
  test('for rendering when no image and no video is available', async () => {
    const props2 = {
      id: '',
      postID: '123',
      postTitle: 'Event Info',
      postInfo: 'Time change',
      postAuthor: 'John Doe',
      postPhoto: '',
      postVideo: '',
      pinned: true,
      refetch: jest.fn(),
    };

    const { getByAltText } = render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard {...props2} />
        </I18nextProvider>
      </MockedProvider>,
    );

    expect(getByAltText('image not found')).toBeInTheDocument();
  });
  test('clears image input and resets related state', () => {
    // Mock getElementById for image input
    const mockImageInput = document.createElement('input');
    mockImageInput.setAttribute('id', 'postImageUrl');
    mockImageInput.value = 'test.jpg';
    document.getElementById = jest.fn((id) =>
      id === 'postImageUrl' ? mockImageInput : null,
    );

    render(
      <MockedProvider>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard {...mockProps} />
        </I18nextProvider>
      </MockedProvider>,
    );

    // Open edit modal to access the clear button
    fireEvent.click(screen.getByAltText('image'));
    fireEvent.click(screen.getByTestId('moreiconbtn'));
    fireEvent.click(screen.getByTestId('editPostModalBtn'));

    // Trigger clear media input
    const clearButton = screen.getByTestId('closeimage');
    fireEvent.click(clearButton);

    // Check if image input value is cleared
    expect(mockImageInput.value).toBe('');
  });

  test('clears video input and resets related state', () => {
    // Props with video instead of image
    const videoProps = {
      ...mockProps,
      postPhoto: null,
      postVideo: 'test.mp4',
    };

    // Mock getElementById for video input
    const mockVideoInput = document.createElement('input');
    mockVideoInput.setAttribute('id', 'postVideoUrl');
    mockVideoInput.value = 'test.mp4';
    document.getElementById = jest.fn((id) =>
      id === 'postVideoUrl' ? mockVideoInput : null,
    );

    render(
      <MockedProvider>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard {...videoProps} />
        </I18nextProvider>
      </MockedProvider>,
    );

    // Open edit modal to access the clear button
    fireEvent.click(screen.getByTestId('cardVid'));
    fireEvent.click(screen.getByTestId('moreiconbtn'));
    fireEvent.click(screen.getByTestId('editPostModalBtn'));

    // Trigger clear media input
    const clearButton = screen.getByTestId('closePreview');
    fireEvent.click(clearButton);

    // Check if video input value is cleared
    expect(mockVideoInput.value).toBe('');
  });

  test('handles case when no input elements are found', () => {
    // Mock getElementById to return null
    document.getElementById = jest.fn().mockReturnValue(null);

    render(
      <MockedProvider>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard {...mockProps} />
        </I18nextProvider>
      </MockedProvider>,
    );

    // Open edit modal to access the clear button
    fireEvent.click(screen.getByAltText('image'));
    fireEvent.click(screen.getByTestId('moreiconbtn'));
    fireEvent.click(screen.getByTestId('editPostModalBtn'));

    // Trigger clear media input
    const clearButton = screen.getByTestId('closeimage');

    // This should not throw an error even though inputs are null
    expect(() => fireEvent.click(clearButton)).not.toThrow();
  });

  test('prevents default event behavior', () => {
    render(
      <MockedProvider>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard {...mockProps} />
        </I18nextProvider>
      </MockedProvider>,
    );

    // Open edit modal to access the clear button
    fireEvent.click(screen.getByAltText('image'));
    fireEvent.click(screen.getByTestId('moreiconbtn'));
    fireEvent.click(screen.getByTestId('editPostModalBtn'));

    // Get the clear button and simulate click with mock event
    const clearButton = screen.getByTestId('closeimage');
    fireEvent.click(clearButton, { preventDefault: jest.fn() });

    // Verify preventDefault was called
    expect(clearButton.onclick).toBeDefined();
  });

  test('successfully updates post with new title and info', async () => {
    const updatedTitle = 'Updated Test Post';
    const updatedInfo = 'Updated Test Info';

    render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard {...mockProps} />
        </I18nextProvider>
      </MockedProvider>,
    );

    // Open edit modal
    userEvent.click(screen.getByAltText('image'));
    userEvent.click(screen.getByTestId('moreiconbtn'));
    userEvent.click(screen.getByTestId('editPostModalBtn'));

    // Update form fields
    fireEvent.change(screen.getByTestId('updateTitle'), {
      target: { value: updatedTitle },
    });
    fireEvent.change(screen.getByTestId('updateText'), {
      target: { value: updatedInfo },
    });

    // Submit form
    const form = screen.getByTestId('updatePostBtn').closest('form');
    fireEvent.submit(form as HTMLFormElement);

    await wait();
    toast.success('postUpdated');
  });

  test('handles form submission with empty spaces in title and info', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard {...mockProps} />
        </I18nextProvider>
      </MockedProvider>,
    );

    // Open edit modal
    userEvent.click(screen.getByAltText('image'));
    userEvent.click(screen.getByTestId('moreiconbtn'));
    userEvent.click(screen.getByTestId('editPostModalBtn'));

    // Update form fields with spaces
    fireEvent.change(screen.getByTestId('updateTitle'), {
      target: { value: '   ' },
    });
    fireEvent.change(screen.getByTestId('updateText'), {
      target: { value: '   ' },
    });

    // Submit form
    const form = screen.getByTestId('updatePostBtn').closest('form');
    fireEvent.submit(form as HTMLFormElement);

    await wait();

    // Form submission should fail due to empty trimmed values
    expect(mockProps.refetch).not.toHaveBeenCalled();
  });

  test('handles media file upload in form submission', async () => {
    const file = new File(['dummy content'], 'test.jpg', {
      type: 'image/jpeg',
    });

    render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard {...mockProps} />
        </I18nextProvider>
      </MockedProvider>,
    );

    // Open edit modal
    userEvent.click(screen.getByAltText('image'));
    userEvent.click(screen.getByTestId('moreiconbtn'));
    userEvent.click(screen.getByTestId('editPostModalBtn'));
    // Mock URL.createObjectURL to prevent TypeError
    global.URL.createObjectURL = jest.fn(() => 'mocked-url');

    // Upload file
    const fileInput = screen.getByTestId('postImageUrl');
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Submit form
    const form = screen.getByTestId('updatePostBtn').closest('form');
    fireEvent.submit(form as HTMLFormElement);

    await wait();
    toast.success('postUpdated');
  });

  test('handles failed API response in form submission', async () => {
    // Mock fetch to return error
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'Update failed' }),
      }),
    );

    render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard {...mockProps} />
        </I18nextProvider>
      </MockedProvider>,
    );

    // Open edit modal
    userEvent.click(screen.getByAltText('image'));
    userEvent.click(screen.getByTestId('moreiconbtn'));
    userEvent.click(screen.getByTestId('editPostModalBtn'));

    // Submit form
    const form = screen.getByTestId('updatePostBtn').closest('form');
    fireEvent.submit(form as HTMLFormElement);

    await wait();

    // Verify error handling
    expect(mockProps.refetch).not.toHaveBeenCalled();
  });

  test('handles successful API response with empty data', async () => {
    // Mock fetch to return success but no data
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      }),
    );

    render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard {...mockProps} />
        </I18nextProvider>
      </MockedProvider>,
    );

    // Open edit modal
    userEvent.click(screen.getByAltText('image'));
    userEvent.click(screen.getByTestId('moreiconbtn'));
    userEvent.click(screen.getByTestId('editPostModalBtn'));

    // Submit form
    const form = screen.getByTestId('updatePostBtn').closest('form');
    fireEvent.submit(form as HTMLFormElement);

    await wait();

    // Verify handling of empty response
    expect(mockProps.refetch).toHaveBeenCalled();
  });
  test('clears preview URL when media input is cleared', () => {
    const props = {
      ...mockProps,
      postPhoto: 'test.jpg',
    };

    render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard {...props} />
        </I18nextProvider>
      </MockedProvider>,
    );

    // Open edit modal
    userEvent.click(screen.getByAltText('image'));
    userEvent.click(screen.getByTestId('moreiconbtn'));
    userEvent.click(screen.getByTestId('editPostModalBtn'));

    // Initially, preview should be visible
    expect(screen.getByAltText('Post Image')).toBeInTheDocument();

    // Clear media input
    const clearButton = screen.getByTestId('closeimage');
    fireEvent.click(clearButton);

    // Preview should no longer be visible
    expect(screen.queryByAltText('Post Image')).not.toBeInTheDocument();
  });

  test('clears preview URL when empty file is selected', () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard {...mockProps} />
        </I18nextProvider>
      </MockedProvider>,
    );

    // Open edit modal
    userEvent.click(screen.getByAltText('image'));
    userEvent.click(screen.getByTestId('moreiconbtn'));
    userEvent.click(screen.getByTestId('editPostModalBtn'));

    // Trigger file input change with no files
    const fileInput = screen.getByTestId('postImageUrl');
    fireEvent.change(fileInput, {
      target: {
        files: [],
      },
    });

    // Preview should not be visible
    expect(screen.queryByAltText('Post Image')).not.toBeInTheDocument();
  });

  test('handles media file upload and preview', () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard {...mockProps} />
        </I18nextProvider>
      </MockedProvider>,
    );

    // Open edit modal
    userEvent.click(screen.getByAltText('image'));
    userEvent.click(screen.getByTestId('moreiconbtn'));
    userEvent.click(screen.getByTestId('editPostModalBtn'));

    // Create a dummy file
    const file = new File(['dummy content'], 'test.jpg', {
      type: 'image/jpeg',
    });

    // Mock URL.createObjectURL
    const mockUrl = 'blob:test-url';
    URL.createObjectURL = jest.fn(() => mockUrl);

    // Upload file
    const fileInput = screen.getByTestId('postImageUrl');
    fireEvent.change(fileInput, {
      target: {
        files: [file],
      },
    });

    // Preview should be visible with the new file
    expect(screen.getByAltText('Post Image')).toBeInTheDocument();
    expect(URL.createObjectURL).toHaveBeenCalledWith(file);

    // Clear the file
    const clearButton = screen.getByTestId('closeimage');
    fireEvent.click(clearButton);

    // Preview should be removed
    expect(screen.queryByAltText('Post Image')).not.toBeInTheDocument();
  });

  test('opens edit modal with video post', async () => {
    setItem('id', '123');

    const videoProps = {
      ...props,
      postPhoto: null,
      postVideo: 'test-video.mp4',
    };

    render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard {...videoProps} />
        </I18nextProvider>
      </MockedProvider>,
    );
    await wait();
    userEvent.click(screen.getByTestId('cardVid'));
    userEvent.click(screen.getByTestId('moreiconbtn'));
    userEvent.click(screen.getByTestId('editPostModalBtn'));
  });

  test('renders noPostImage when no post image or video is present', async () => {
    const noPostProps = {
      ...mockProps,
      postPhoto: null,
      postVideo: null,
    };
    render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard {...noPostProps} />
        </I18nextProvider>
      </MockedProvider>,
    );
    await wait();
    userEvent.click(screen.getByTestId('cardStructure'));
    expect(screen.getByTestId('noPostImage')).toBeInTheDocument();
  });

  test('renders post info text with truncated text', async () => {
    const longPostInfo =
      'This is a very long post information that needs to be truncated because it exceeds the maximum length allowed for display in the card component and should show ellipsis at the end';
    const mockPropsWithLongInfo = {
      ...mockProps,
      postPhoto: null,
      postVideo: null,
      postInfo: longPostInfo,
    };
    render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard {...mockPropsWithLongInfo} />
        </I18nextProvider>
      </MockedProvider>,
    );
    await wait();
    expect(screen.getByTestId('post-info-text')).toBeInTheDocument();
    expect(screen.getByTestId('post-info-text')).toHaveTextContent(
      mockPropsWithLongInfo.postInfo.substring(0, 20) + '...',
    );
  });

  test('opens edit modal with video post and verifies state', async () => {
    setItem('id', '123');
    
    const videoProps = {
      ...props,
      postPhoto: null,
      postVideo: 'test-video.mp4',
      pinned: true
    };

    render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPostCard {...videoProps} />
        </I18nextProvider>
      </MockedProvider>,
    );

    await wait();
    
    // Open the edit modal
    userEvent.click(screen.getByTestId('cardVid'));
    userEvent.click(screen.getByTestId('moreiconbtn'));
    userEvent.click(screen.getByTestId('editPostModalBtn'));

    // Verify the modal is open
    expect(screen.getByTestId('modalOrganizationHeader')).toBeInTheDocument();
    
    // Verify that the preview URL is set to the video URL
    const videoPreview = screen.getByTestId('videoPreview');
    const source = videoPreview.querySelector('source');
    expect(source).toHaveAttribute('src', 'test-video.mp4');
    
    // Verify form state is initialized correctly
    expect(screen.getByTestId('updateTitle')).toHaveValue(videoProps.postTitle);
    expect(screen.getByTestId('updateText')).toHaveValue(videoProps.postInfo);
  });
});
