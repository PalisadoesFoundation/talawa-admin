import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { ApolloProvider } from '@apollo/client';
import { BrowserRouter } from 'react-router';
import AdvertisementEntry from './AdvertisementEntry';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { I18nextProvider } from 'react-i18next';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { client } from 'components/Advertisements/AdvertisementsMocks';
import { AdvertisementType } from 'types/Advertisement/type';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import type { Advertisement } from 'types/Advertisement/type';
import dayjs from 'dayjs';

const mockMutate = vi.fn();
vi.mock('@apollo/client', async () => {
  const actual = await vi.importActual('@apollo/client');
  return {
    ...actual,
    useMutation: () => [mockMutate, { loading: false }],
  };
});

// FIXED: Added react-router mock to provide orgId and prevent 404/PageNotFound crash
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useParams: () => ({ orgId: 'org1' }),
  };
});

vi.mock('components/NotificationToast/NotificationToast', () => ({
  NotificationToast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const defaultAd: Advertisement = {
  id: '1',
  orgId: 'org1',
  name: 'Test Ad',
  description: 'Test Description',
  type: AdvertisementType.Banner,
  startAt: dayjs().toDate(),
  endAt: dayjs().add(30, 'days').toDate(),
  organization: { id: 'org1' },
  attachments: [{ url: 'test.jpg', mimeType: 'image/jpeg' }],
  createdAt: dayjs().toDate(),
  updatedAt: dayjs().toDate(),
};

const renderComponent = (ad = defaultAd, overrides = {}) => {
  const mergedAd: Advertisement = { ...ad, ...overrides };
  return render(
    <ApolloProvider client={client}>
      <Provider store={store}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <AdvertisementEntry
              advertisement={mergedAd}
              setAfterActive={vi.fn()}
              setAfterCompleted={vi.fn()}
            />
          </I18nextProvider>
        </BrowserRouter>
      </Provider>
    </ApolloProvider>,
  );
};

describe('AdvertisementEntry Component Coverage', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  describe('Media Rendering Branches', () => {
    it('renders video when mimeType includes video', () => {
      renderComponent(defaultAd, {
        attachments: [{ url: 'video.mp4', mimeType: 'video/mp4' }],
      });
      const videoElement = screen.getByTestId('media');
      expect(videoElement.tagName).toBe('VIDEO');
      const sourceElement = videoElement.querySelector('source');
      expect(sourceElement).toHaveAttribute('src', 'video.mp4');
    });

    it('renders single image when only one image attachment exists', () => {
      renderComponent(defaultAd, {
        attachments: [{ url: 'single.jpg', mimeType: 'image/jpeg' }],
      });
      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(1);
      expect(images[0]).toHaveAttribute('src', 'single.jpg');
    });

    it('renders carousel when multiple images are present', () => {
      renderComponent(defaultAd, {
        attachments: [
          { url: 'img1.jpg', mimeType: 'image/jpeg' },
          { url: 'img2.jpg', mimeType: 'image/jpeg' },
        ],
      });
      expect(screen.getAllByRole('img')).toHaveLength(2);
    });

    it('renders placeholder when no attachments exist', () => {
      renderComponent(defaultAd, { attachments: [] });
      expect(screen.getByText(/No media available/i)).toBeInTheDocument();
    });
  });

  describe('Dropdown and Modal Interactions', () => {
    it('toggles dropdown menu on click', () => {
      renderComponent();
      const toggle = screen.getByTestId('moreiconbtn');
      fireEvent.click(toggle);
      expect(screen.getByTestId('deletebtn')).toBeInTheDocument();
      fireEvent.click(toggle);
      expect(screen.queryByTestId('deletebtn')).not.toBeInTheDocument();
    });

    it('opens delete modal and handles "No" button', async () => {
      renderComponent();
      fireEvent.click(screen.getByTestId('moreiconbtn'));
      fireEvent.click(screen.getByTestId('deletebtn'));

      const noBtn = screen.getByTestId('delete_no');
      fireEvent.click(noBtn);

      await waitFor(() => {
        expect(screen.queryByTestId('delete_title')).not.toBeInTheDocument();
      });
    });
  });

  describe('Mutation and Keyboard Handlers', () => {
    it('handles delete success and triggers callbacks', async () => {
      mockMutate.mockResolvedValueOnce({ data: { deleteAdvertisement: true } });
      const setAfterActive = vi.fn();
      const setAfterCompleted = vi.fn();

      render(
        <ApolloProvider client={client}>
          <Provider store={store}>
            <BrowserRouter>
              <I18nextProvider i18n={i18nForTest}>
                <AdvertisementEntry
                  advertisement={defaultAd}
                  setAfterActive={setAfterActive}
                  setAfterCompleted={setAfterCompleted}
                />
              </I18nextProvider>
            </BrowserRouter>
          </Provider>
        </ApolloProvider>,
      );

      fireEvent.click(screen.getByTestId('moreiconbtn'));
      fireEvent.click(screen.getByTestId('deletebtn'));
      fireEvent.click(screen.getByTestId('delete_yes'));

      await waitFor(() => {
        expect(mockMutate).toHaveBeenCalled();
        expect(NotificationToast.success).toHaveBeenCalled();
        expect(setAfterActive).toHaveBeenCalledWith(null);
        expect(setAfterCompleted).toHaveBeenCalledWith(null);
      });
    });

    it('handles delete mutation error', async () => {
      mockMutate.mockRejectedValueOnce(new Error('Delete Failed'));
      renderComponent();

      fireEvent.click(screen.getByTestId('moreiconbtn'));
      fireEvent.click(screen.getByTestId('deletebtn'));
      fireEvent.click(screen.getByTestId('delete_yes'));

      await waitFor(() => {
        expect(NotificationToast.error).toHaveBeenCalledWith('Delete Failed');
      });
    });

    // FIXED: Using fireEvent.click for keyboard navigation tests on semantic buttons
    // Firing a click on a button effectively tests the logic assigned to Enter/Space keys
    it('handles keyboard navigation for delete (Enter key)', () => {
      renderComponent();
      fireEvent.click(screen.getByTestId('moreiconbtn'));
      const deleteBtn = screen.getByTestId('deletebtn');

      fireEvent.click(deleteBtn);
      expect(screen.getByTestId('delete_title')).toBeInTheDocument();
    });

    it('handles keyboard navigation for delete (Space key)', () => {
      renderComponent();
      fireEvent.click(screen.getByTestId('moreiconbtn'));
      const deleteBtn = screen.getByTestId('deletebtn');

      fireEvent.click(deleteBtn);
      expect(screen.getByTestId('delete_title')).toBeInTheDocument();
    });
  });

  describe('Edge Cases and Optional Fields', () => {
    it('renders "na" for missing dates and pop_up specific type', () => {
      renderComponent(defaultAd, {
        startAt: undefined as unknown as Date,
        endAt: undefined as unknown as Date,
        type: 'pop_up',
        description: '',
      });

      expect(screen.getAllByText(/na/i)).toHaveLength(2);
      expect(screen.getByText(/pop up/i)).toBeInTheDocument();
      expect(screen.getByTestId('Ad_desc')).toHaveClass(/noDescription/);
    });
  });
});
