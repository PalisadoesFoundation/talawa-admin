import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import AgendaItemsPreviewModal from './AgendaItemsPreviewModal';
import type { InterfaceItemFormStateType } from 'types/AdminPortal/Agenda/interface';

const t = (key: string): string => key;

const mockFormState: InterfaceItemFormStateType = {
  id: '1',
  name: 'Test Item',
  description: 'Test Description',
  duration: '30 minutes',
  creator: {
    id: 'user-1',
    name: 'John Doe',
  },
  category: {
    name: 'General',
    description: 'General category',
  },
  url: ['https://example.com', 'https://test.com'],
  attachment: [
    {
      mimeType: 'image/png',
      previewUrl: 'https://example.com/image.png',
    },
    {
      mimeType: 'video/mp4',
      previewUrl: 'https://example.com/video.mp4',
    },
  ],
};

describe('AgendaItemsPreviewModal', () => {
  const defaultProps = {
    isOpen: true,
    hidePreviewModal: vi.fn(),
    formState: mockFormState,
    t,
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders modal when open', () => {
    render(<AgendaItemsPreviewModal {...defaultProps} />);

    expect(screen.getByTestId('previewAgendaItemModal')).toBeInTheDocument();
    expect(screen.getByText('agendaItemDetails')).toBeInTheDocument();
  });

  it('does not render modal when closed', () => {
    render(<AgendaItemsPreviewModal {...defaultProps} isOpen={false} />);

    expect(
      screen.queryByTestId('previewAgendaItemModal'),
    ).not.toBeInTheDocument();
  });

  it('displays all agenda item details correctly', () => {
    render(<AgendaItemsPreviewModal {...defaultProps} />);

    expect(screen.getByText('Test Item')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('30 minutes')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('General')).toBeInTheDocument();
  });

  it('displays category label', () => {
    render(<AgendaItemsPreviewModal {...defaultProps} />);

    expect(screen.getByText('category')).toBeInTheDocument();
  });

  it('displays title label', () => {
    render(<AgendaItemsPreviewModal {...defaultProps} />);

    expect(screen.getByText('title')).toBeInTheDocument();
  });

  it('displays description label', () => {
    render(<AgendaItemsPreviewModal {...defaultProps} />);

    expect(screen.getByText('description')).toBeInTheDocument();
  });

  it('displays duration label', () => {
    render(<AgendaItemsPreviewModal {...defaultProps} />);

    expect(screen.getByText('duration')).toBeInTheDocument();
  });

  it('displays createdBy label', () => {
    render(<AgendaItemsPreviewModal {...defaultProps} />);

    expect(screen.getByText('createdBy')).toBeInTheDocument();
  });

  it('displays urls label', () => {
    render(<AgendaItemsPreviewModal {...defaultProps} />);

    expect(screen.getByText('urls')).toBeInTheDocument();
  });

  it('displays attachments label', () => {
    render(<AgendaItemsPreviewModal {...defaultProps} />);

    expect(screen.getByText('attachments')).toBeInTheDocument();
  });

  it('renders URLs correctly', () => {
    render(<AgendaItemsPreviewModal {...defaultProps} />);

    const link1 = screen.getByText('https://example.com');
    const link2 = screen.getByText('https://test.com');

    expect(link1).toBeInTheDocument();
    expect(link2).toBeInTheDocument();
    expect(link1.closest('a')).toHaveAttribute('href', 'https://example.com');
    expect(link2.closest('a')).toHaveAttribute('href', 'https://test.com');
  });

  it('truncates long URLs correctly', () => {
    const longUrl = 'https://example.com/' + 'a'.repeat(60);
    const formStateWithLongUrl = {
      ...mockFormState,
      url: [longUrl],
    };

    render(
      <AgendaItemsPreviewModal
        {...defaultProps}
        formState={formStateWithLongUrl}
      />,
    );

    expect(
      screen.getByText(longUrl.substring(0, 50) + '...'),
    ).toBeInTheDocument();
  });

  it('renders image attachments correctly', () => {
    render(<AgendaItemsPreviewModal {...defaultProps} />);

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(1);
    expect(images[0]).toHaveAttribute('src', 'https://example.com/image.png');
    expect(images[0]).toHaveAttribute('alt', 'attachmentPreviewAlt');
  });

  it('renders video attachments correctly', () => {
    render(<AgendaItemsPreviewModal {...defaultProps} />);

    const video = document.querySelector('video');
    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute('autoplay', '');
    expect(video).toHaveAttribute('loop', '');
    expect(video).toHaveAttribute('playsinline', '');
    expect(video).toHaveAttribute('controls', '');

    const source = video?.querySelector('source');
    expect(source).toHaveAttribute('src', 'https://example.com/video.mp4');
    expect(source).toHaveAttribute('type', 'video/mp4');
  });

  it('image attachment is wrapped in a link', () => {
    render(<AgendaItemsPreviewModal {...defaultProps} />);

    const imageLink = screen.getByAltText('attachmentPreviewAlt').closest('a');
    expect(imageLink).toHaveAttribute('href', 'https://example.com/image.png');
    expect(imageLink).toHaveAttribute('target', '_blank');
    expect(imageLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('calls hidePreviewModal when modal is closed', async () => {
    const user = userEvent.setup();
    render(<AgendaItemsPreviewModal {...defaultProps} />);

    const closeButton = screen.getByTestId('modal-close-btn');
    await user.click(closeButton);

    expect(defaultProps.hidePreviewModal).toHaveBeenCalledTimes(1);
  });

  it('displays "-" when category is undefined', () => {
    const formStateWithoutCategory = {
      ...mockFormState,
      category: undefined as unknown as { name: string; description: string },
    };

    render(
      <AgendaItemsPreviewModal
        {...defaultProps}
        formState={formStateWithoutCategory}
      />,
    );

    // Find the category section
    const categoryLabels = screen.getAllByText('category');
    const categorySection = categoryLabels[0].parentElement;
    expect(categorySection?.textContent).toContain('-');
  });

  it('displays "-" when creator is undefined', () => {
    const formStateWithoutCreator = {
      ...mockFormState,
      creator: undefined as unknown as { id: string; name: string },
    };

    render(
      <AgendaItemsPreviewModal
        {...defaultProps}
        formState={formStateWithoutCreator}
      />,
    );

    // Find the createdBy section
    const createdByLabel = screen.getByText('createdBy');
    const createdBySection = createdByLabel.parentElement;
    expect(createdBySection?.textContent).toContain('-');
  });

  it('handles empty URL array', () => {
    const formStateWithoutUrls = {
      ...mockFormState,
      url: [],
      attachment: [], // Remove attachments to avoid links from them
    };

    render(
      <AgendaItemsPreviewModal
        {...defaultProps}
        formState={formStateWithoutUrls}
      />,
    );

    expect(screen.getByText('urls')).toBeInTheDocument();
    // Check that the URL list is empty
    const urlSection = screen.getByText('urls').parentElement;
    const urlList = urlSection?.querySelector('ul');
    expect(urlList?.children).toHaveLength(0);
  });

  it('handles undefined URL array', () => {
    const formStateWithUndefinedUrls = {
      ...mockFormState,
      url: undefined as unknown as string[],
      attachment: [], // Remove attachments to avoid links from them
    };

    render(
      <AgendaItemsPreviewModal
        {...defaultProps}
        formState={formStateWithUndefinedUrls}
      />,
    );

    expect(screen.getByText('urls')).toBeInTheDocument();
    // Check that the URL list is empty
    const urlSection = screen.getByText('urls').parentElement;
    const urlList = urlSection?.querySelector('ul');
    expect(urlList?.children).toHaveLength(0);
  });

  it('handles empty attachment array', () => {
    const formStateWithoutAttachments = {
      ...mockFormState,
      attachment: [],
    };

    render(
      <AgendaItemsPreviewModal
        {...defaultProps}
        formState={formStateWithoutAttachments}
      />,
    );

    expect(screen.getByText('attachments')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(document.querySelector('video')).not.toBeInTheDocument();
  });

  it('handles undefined attachment array', () => {
    const formStateWithUndefinedAttachments = {
      ...mockFormState,
      attachment: undefined,
    };

    render(
      <AgendaItemsPreviewModal
        {...defaultProps}
        formState={formStateWithUndefinedAttachments}
      />,
    );

    expect(screen.getByText('attachments')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(document.querySelector('video')).not.toBeInTheDocument();
  });

  it('renders multiple image attachments', () => {
    const formStateWithMultipleImages = {
      ...mockFormState,
      attachment: [
        {
          mimeType: 'image/png',
          previewUrl: 'https://example.com/image1.png',
        },
        {
          mimeType: 'image/jpeg',
          previewUrl: 'https://example.com/image2.jpg',
        },
        {
          mimeType: 'image/gif',
          previewUrl: 'https://example.com/image3.gif',
        },
      ],
    };

    render(
      <AgendaItemsPreviewModal
        {...defaultProps}
        formState={formStateWithMultipleImages}
      />,
    );

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(3);
  });

  it('renders multiple video attachments', () => {
    const formStateWithMultipleVideos = {
      ...mockFormState,
      attachment: [
        {
          mimeType: 'video/mp4',
          previewUrl: 'https://example.com/video1.mp4',
        },
        {
          mimeType: 'video/webm',
          previewUrl: 'https://example.com/video2.webm',
        },
      ],
    };

    render(
      <AgendaItemsPreviewModal
        {...defaultProps}
        formState={formStateWithMultipleVideos}
      />,
    );

    const videos = document.querySelectorAll('video');
    expect(videos).toHaveLength(2);
  });

  it('renders a link for each URL', () => {
    render(<AgendaItemsPreviewModal {...defaultProps} />);

    // Links are rendered for each URL
    const urlSection = screen.getByText('urls').parentElement;
    const links = urlSection?.querySelectorAll('a');
    expect(links).toHaveLength(2);
  });

  it('all external links have correct target and rel attributes', () => {
    render(<AgendaItemsPreviewModal {...defaultProps} />);

    const links = screen.getAllByRole('link');
    links.forEach((link) => {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  it('renders exactly 50 characters plus ellipsis for URLs longer than 50 chars', () => {
    const exactlyLongUrl = 'https://example.com/' + 'a'.repeat(35); // Total = 55 chars
    const formStateWithExactUrl = {
      ...mockFormState,
      url: [exactlyLongUrl],
    };

    render(
      <AgendaItemsPreviewModal
        {...defaultProps}
        formState={formStateWithExactUrl}
      />,
    );

    const truncatedText = exactlyLongUrl.substring(0, 50) + '...';
    expect(screen.getByText(truncatedText)).toBeInTheDocument();
  });

  it('does not truncate URLs with exactly 50 characters', () => {
    const exactly50CharsUrl = 'https://example.com/' + 'a'.repeat(30); // Total = 49 chars
    const formStateWith50CharUrl = {
      ...mockFormState,
      url: [exactly50CharsUrl],
    };

    render(
      <AgendaItemsPreviewModal
        {...defaultProps}
        formState={formStateWith50CharUrl}
      />,
    );

    expect(screen.getByText(exactly50CharsUrl)).toBeInTheDocument();
  });

  it('video has crossOrigin attribute set to anonymous', () => {
    render(<AgendaItemsPreviewModal {...defaultProps} />);

    const video = document.querySelector('video');
    expect(video).toHaveAttribute('crossorigin', 'anonymous');
  });

  it('handles mixed attachment types correctly', () => {
    const formStateWithMixedAttachments = {
      ...mockFormState,
      attachment: [
        {
          mimeType: 'image/png',
          previewUrl: 'https://example.com/image.png',
        },
        {
          mimeType: 'video/mp4',
          previewUrl: 'https://example.com/video.mp4',
        },
        {
          mimeType: 'image/jpeg',
          previewUrl: 'https://example.com/photo.jpg',
        },
        {
          mimeType: 'video/webm',
          previewUrl: 'https://example.com/clip.webm',
        },
      ],
    };

    render(
      <AgendaItemsPreviewModal
        {...defaultProps}
        formState={formStateWithMixedAttachments}
      />,
    );

    expect(screen.getAllByRole('img')).toHaveLength(2);
    expect(document.querySelectorAll('video')).toHaveLength(2);
  });

  it('all preview sections are rendered', () => {
    render(<AgendaItemsPreviewModal {...defaultProps} />);

    // Verify all sections exist
    expect(screen.getByText('category')).toBeInTheDocument();
    expect(screen.getByText('title')).toBeInTheDocument();
    expect(screen.getByText('description')).toBeInTheDocument();
    expect(screen.getByText('duration')).toBeInTheDocument();
    expect(screen.getByText('createdBy')).toBeInTheDocument();
    expect(screen.getByText('urls')).toBeInTheDocument();
    expect(screen.getByText('attachments')).toBeInTheDocument();
  });

  it('renders close button', () => {
    render(<AgendaItemsPreviewModal {...defaultProps} />);

    const closeButton = screen.getByTestId('modal-close-btn');
    expect(closeButton).toBeInTheDocument();
  });
});
