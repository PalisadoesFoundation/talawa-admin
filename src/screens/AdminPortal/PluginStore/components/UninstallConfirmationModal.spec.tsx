import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UninstallConfirmationModal from './UninstallConfirmationModal';
import { vi } from 'vitest';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: { pluginName?: string }) => {
      if (options?.pluginName) {
        return `${key} ${options.pluginName}`;
      }
      return key;
    },
  }),
}));

describe('UninstallConfirmationModal', () => {
  const mockOnClose = vi.fn();
  const mockOnConfirm = vi.fn();
  const mockPlugin = {
    name: 'Test Plugin',
    version: '1.0.0',
    description: 'A test plugin',
    author: 'Test Author',
    license: 'MIT',
    homepage: 'https://example.com',
    repository: 'https://github.com/example/test-plugin',
    bugs: 'https://github.com/example/test-plugin/issues',
    keywords: ['test', 'plugin'],
    engines: {
      node: '>=14.0.0',
    },
    os: ['linux', 'darwin', 'win32'],
    cpu: ['x64', 'arm64'],
    dist: {
      tarball: 'https://example.com/test-plugin-1.0.0.tgz',
      shasum: '1234567890abcdef',
    },
    id: 'plugin-1',
    icon: 'icon-url',
  };

  const renderModal = (show = true) => {
    return render(
      <UninstallConfirmationModal
        show={show}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        plugin={mockPlugin}
      />,
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly when shown', () => {
    renderModal();
    expect(screen.getByTestId('uninstall-modal')).toBeInTheDocument();
    expect(screen.getByText('uninstallPlugin')).toBeInTheDocument();
    expect(screen.getByText(/Test Plugin/)).toBeInTheDocument();
  });

  it('does not render when not shown', () => {
    renderModal(false);
    expect(screen.queryByTestId('uninstall-modal')).not.toBeInTheDocument();
  });

  it('calls onClose when cancel button is clicked', async () => {
    renderModal();
    await userEvent.click(screen.getByTestId('uninstall-cancel-btn'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onConfirm when remove button is clicked', async () => {
    renderModal();
    await userEvent.click(screen.getByTestId('uninstall-remove-btn'));
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });
});
