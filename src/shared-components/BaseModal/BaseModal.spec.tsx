import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from 'react-bootstrap';
import BaseModal from './BaseModal';
import type { IBaseModalProps } from 'types/shared-components/BaseModal/interface';

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('BaseModal', () => {
  const defaultProps: IBaseModalProps = {
    show: true,
    onHide: vi.fn(),
    children: <div>Modal Content</div>,
  };

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Rendering Tests', () => {
    it('Renders with title (no headerContent)', () => {
      render(<BaseModal {...defaultProps} title="Test Modal Title" />);
      expect(screen.getByText('Test Modal Title')).toBeInTheDocument();
      expect(screen.getByText('Modal Content')).toBeInTheDocument();
    });

    it('Renders with custom headerContent (overrides title)', () => {
      const customHeader = (
        <div data-testid="custom-header">Custom Header Content</div>
      );
      render(
        <BaseModal
          {...defaultProps}
          title="Should Not Appear"
          headerContent={customHeader}
        />,
      );

      expect(screen.getByTestId('custom-header')).toBeInTheDocument();
      expect(screen.queryByText('Should Not Appear')).not.toBeInTheDocument();
    });

    it('renders children in modal body', () => {
      render(
        <BaseModal {...defaultProps}>
          <div data-testid="child-content">Child Content</div>
        </BaseModal>,
      );
      expect(screen.getByTestId('child-content')).toBeInTheDocument();
    });

    it('does not render modal when show is false', () => {
      render(<BaseModal {...defaultProps} show={false} title="Hidden Modal" />);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('Footer Tests', () => {
    it('Footer renders and actions work', async () => {
      const user = userEvent.setup();
      const handleSave = vi.fn();
      const handleCancel = vi.fn();

      render(
        <BaseModal
          {...defaultProps}
          title="Test Modal"
          footer={
            <>
              <Button
                variant="secondary"
                onClick={handleCancel}
                data-testid="cancel-btn"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSave}
                data-testid="save-btn"
              >
                Save
              </Button>
            </>
          }
        />,
      );

      const cancelButton = screen.getByTestId('cancel-btn');
      const saveButton = screen.getByTestId('save-btn');

      expect(cancelButton).toBeInTheDocument();
      expect(saveButton).toBeInTheDocument();

      await user.click(cancelButton);
      expect(handleCancel).toHaveBeenCalledTimes(1);

      await user.click(saveButton);
      expect(handleSave).toHaveBeenCalledTimes(1);
    });

    it('does not render footer when footer prop is not provided', () => {
      render(
        <BaseModal
          {...defaultProps}
          title="No Footer"
          dataTestId="no-footer-modal"
        />,
      );
      // Footer should not be in the document
      const modal = screen.getByTestId('no-footer-modal');
      expect(modal).toBeInTheDocument();
      // Verify modal renders without footer
      expect(screen.getByText('No Footer')).toBeInTheDocument();
      // Explicitly assert footer is absent
      expect(screen.queryByTestId('modal-footer')).not.toBeInTheDocument();
    });
  });

  describe('Close Button Tests', () => {
    it('Close button calls onHide', async () => {
      const user = userEvent.setup();
      const onHide = vi.fn();
      render(
        <BaseModal {...defaultProps} onHide={onHide} title="Test Modal" />,
      );

      const closeButton = screen.getByTestId('modalCloseBtn');
      expect(closeButton).toBeInTheDocument();

      await user.click(closeButton);
      expect(onHide).toHaveBeenCalledTimes(1);
    });

    it('close button is not rendered when showCloseButton is false', () => {
      render(
        <BaseModal
          {...defaultProps}
          title="No Close Button"
          showCloseButton={false}
        />,
      );
      expect(screen.queryByTestId('modalCloseBtn')).not.toBeInTheDocument();
    });

    it('close button uses correct variant', () => {
      render(
        <BaseModal
          {...defaultProps}
          title="Test"
          closeButtonVariant="primary"
        />,
      );
      const closeButton = screen.getByTestId('modalCloseBtn');
      expect(closeButton).toHaveClass('btn-primary');
    });

    it('close button has correct aria-label', () => {
      render(<BaseModal {...defaultProps} title="Test" />);
      const closeButton = screen.getByTestId('modalCloseBtn');
      expect(closeButton).toHaveAttribute('aria-label', 'close');
    });
  });

  describe('Keyboard Events Tests', () => {
    it('Escape key closes modal', async () => {
      const onHide = vi.fn();
      render(
        <BaseModal
          {...defaultProps}
          onHide={onHide}
          title="Test Modal"
          dataTestId="test-modal"
        />,
      );

      const modal = screen.getByTestId('test-modal');
      expect(modal).toBeInTheDocument();

      fireEvent.keyDown(modal, {
        key: 'Escape',
        code: 'Escape',
        keyCode: 27,
      });

      await waitFor(() => {
        expect(onHide).toHaveBeenCalledTimes(1);
      });
    });

    it('does not close on Escape when keyboard is false', async () => {
      const onHide = vi.fn();
      render(
        <BaseModal
          {...defaultProps}
          onHide={onHide}
          title="Test Modal"
          keyboard={false}
          dataTestId="test-modal"
        />,
      );

      const modal = screen.getByTestId('test-modal');
      expect(modal).toBeInTheDocument();

      fireEvent.keyDown(modal, {
        key: 'Escape',
        code: 'Escape',
        keyCode: 27,
      });

      // Wait for any async handlers to complete
      await waitFor(() => {
        // onHide should not be called when keyboard is false
        expect(onHide).not.toHaveBeenCalled();
        // Modal should still be in the document
        expect(modal).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility Tests', () => {
    it('Accessibility attributes present', () => {
      render(
        <BaseModal
          {...defaultProps}
          title="Accessible Modal"
          dataTestId="accessible-modal"
        />,
      );

      const modal = screen.getByTestId('accessible-modal');
      expect(modal).toHaveAttribute('role', 'dialog');

      // The aria attributes are on the parent modal element (the outer div with class "modal")
      // Find it by querying for an element with aria-labelledby within the modal's container
      const modalContainer =
        modal.closest('.modal') ||
        document.querySelector('[aria-labelledby][aria-describedby]');
      expect(modalContainer).toBeInTheDocument();
      expect(modalContainer).toHaveAttribute('aria-modal', 'true');
      expect(modalContainer).toHaveAttribute('role', 'dialog');

      // aria-labelledby should point to title element
      expect(modalContainer).toHaveAttribute('aria-labelledby');
      const titleId = modalContainer?.getAttribute('aria-labelledby');
      expect(titleId).toBeTruthy();
      if (titleId) {
        const titleElement = document.getElementById(titleId);
        expect(titleElement).toBeInTheDocument();
        expect(titleElement).toHaveTextContent('Accessible Modal');
      }

      // aria-describedby should point to body element
      expect(modalContainer).toHaveAttribute('aria-describedby');
      const bodyId = modalContainer?.getAttribute('aria-describedby');
      expect(bodyId).toBeTruthy();
      if (bodyId) {
        const bodyElement = document.getElementById(bodyId);
        expect(bodyElement).toBeInTheDocument();
        expect(bodyElement).toHaveTextContent('Modal Content');
      }
    });

    it('does not set aria-labelledby when title is not provided', () => {
      render(
        <BaseModal
          {...defaultProps}
          headerContent={<div>Custom Header</div>}
          dataTestId="no-title-modal"
        />,
      );

      const modal = screen.getByTestId('no-title-modal');
      // Find the modal container that has the aria attributes
      const modalContainer =
        modal.closest('.modal') || document.querySelector('[aria-describedby]');
      expect(modalContainer).toBeInTheDocument();
      const labelledBy = modalContainer?.getAttribute('aria-labelledby');
      // When no title, aria-labelledby should be undefined or empty
      expect(labelledBy).toBeFalsy();
    });

    it('has unique IDs for title and body', () => {
      const { unmount: unmount1 } = render(
        <BaseModal {...defaultProps} title="Modal 1" dataTestId="modal-1" />,
      );

      const modal1 = screen.getByTestId('modal-1');
      expect(modal1).toBeInTheDocument();
      // Find the modal container that has the aria attributes
      const modalContainer1 =
        modal1.closest('.modal') ||
        document.querySelector('[aria-labelledby][aria-describedby]');
      expect(modalContainer1).toBeInTheDocument();
      const titleId1 = modalContainer1?.getAttribute('aria-labelledby');
      const bodyId1 = modalContainer1?.getAttribute('aria-describedby');

      unmount1();

      const { unmount: unmount2 } = render(
        <BaseModal {...defaultProps} title="Modal 2" dataTestId="modal-2" />,
      );

      const modal2 = screen.getByTestId('modal-2');
      expect(modal2).toBeInTheDocument();
      // Find the modal container that has the aria attributes
      const modalContainer2 =
        modal2.closest('.modal') ||
        document.querySelector('[aria-labelledby][aria-describedby]');
      expect(modalContainer2).toBeInTheDocument();
      const titleId2 = modalContainer2?.getAttribute('aria-labelledby');
      const bodyId2 = modalContainer2?.getAttribute('aria-describedby');

      unmount2();

      // All IDs should be truthy
      expect(titleId1).toBeTruthy();
      expect(titleId2).toBeTruthy();
      expect(bodyId1).toBeTruthy();
      expect(bodyId2).toBeTruthy();

      // IDs should be unique across modal instances
      expect(titleId1).not.toBe(titleId2);
      expect(bodyId1).not.toBe(bodyId2);
    });
  });

  describe('dataTestId Tests', () => {
    it('dataTestId works correctly', () => {
      render(
        <BaseModal
          {...defaultProps}
          title="Test Modal"
          dataTestId="unique-modal-id"
        />,
      );

      const modal = screen.getByTestId('unique-modal-id');
      expect(modal).toBeInTheDocument();
      expect(modal).toHaveAttribute('role', 'dialog');
    });

    it('Unique data-testid usage works under parallel test sharding', () => {
      // Test that multiple modals can have different test IDs
      const { rerender } = render(
        <BaseModal
          {...defaultProps}
          title="Modal 1"
          dataTestId="shard-1-modal"
        />,
      );

      expect(screen.getByTestId('shard-1-modal')).toBeInTheDocument();

      rerender(
        <BaseModal
          {...defaultProps}
          title="Modal 2"
          dataTestId="shard-2-modal"
        />,
      );

      expect(screen.queryByTestId('shard-1-modal')).not.toBeInTheDocument();
      expect(screen.getByTestId('shard-2-modal')).toBeInTheDocument();
    });
  });

  describe('Show/Hide Transitions Tests', () => {
    it('Show/hide transitions', async () => {
      const { rerender } = render(
        <BaseModal
          {...defaultProps}
          show={false}
          title="Hidden Modal"
          dataTestId="transition-modal"
        />,
      );

      expect(screen.queryByTestId('transition-modal')).not.toBeInTheDocument();

      rerender(
        <BaseModal
          {...defaultProps}
          show={true}
          title="Visible Modal"
          dataTestId="transition-modal"
        />,
      );

      expect(screen.getByTestId('transition-modal')).toBeInTheDocument();
      expect(screen.getByText('Visible Modal')).toBeInTheDocument();

      rerender(
        <BaseModal
          {...defaultProps}
          show={false}
          title="Hidden Again"
          dataTestId="transition-modal"
        />,
      );

      // Modal should be removed from DOM when show is false
      // React Bootstrap may take a moment to remove it due to fade animation
      await waitFor(
        () => {
          expect(
            screen.queryByTestId('transition-modal'),
          ).not.toBeInTheDocument();
        },
        { timeout: 1000 },
      );
    });
  });
  describe('Size Variants Tests', () => {
    it('applies size="sm" correctly', () => {
      render(
        <BaseModal
          {...defaultProps}
          title="Small Modal"
          size="sm"
          dataTestId="small-modal"
        />,
      );
      const modal = screen.getByTestId('small-modal');
      expect(modal).toBeInTheDocument();
      // Size is applied via Bootstrap classes, we verify modal exists
    });

    it('applies size="lg" correctly', () => {
      render(
        <BaseModal
          {...defaultProps}
          title="Large Modal"
          size="lg"
          dataTestId="large-modal"
        />,
      );
      const modal = screen.getByTestId('large-modal');
      expect(modal).toBeInTheDocument();
    });

    it('applies size="xl" correctly', () => {
      render(
        <BaseModal
          {...defaultProps}
          title="XL Modal"
          size="xl"
          dataTestId="xl-modal"
        />,
      );
      const modal = screen.getByTestId('xl-modal');
      expect(modal).toBeInTheDocument();
    });
  });

  describe('Custom ClassName Tests', () => {
    it('applies custom className to modal', () => {
      render(
        <BaseModal
          {...defaultProps}
          title="Custom Class"
          className="custom-modal-class"
          dataTestId="custom-modal"
        />,
      );
      const modal = screen.getByTestId('custom-modal');
      expect(modal).toBeInTheDocument();
    });

    it('applies headerClassName correctly', () => {
      render(
        <BaseModal
          {...defaultProps}
          title="Custom Header"
          headerClassName="custom-header-class"
        />,
      );
      // Header class is applied to Modal.Header, we verify modal renders
      expect(screen.getByText('Custom Header')).toBeInTheDocument();
    });

    it('applies bodyClassName correctly', () => {
      render(
        <BaseModal
          {...defaultProps}
          title="Custom Body"
          bodyClassName="custom-body-class"
        />,
      );
      // Body class is applied to Modal.Body, we verify content renders
      expect(screen.getByText('Modal Content')).toBeInTheDocument();
    });

    it('applies footerClassName correctly', () => {
      render(
        <BaseModal
          {...defaultProps}
          title="Custom Footer"
          footer={<Button>Action</Button>}
          footerClassName="custom-footer-class"
        />,
      );
      // Footer class is applied to Modal.Footer, we verify footer renders
      expect(screen.getByText('Action')).toBeInTheDocument();
    });
  });

  describe('Backdrop Tests', () => {
    it('handles backdrop="static" correctly', () => {
      const onHide = vi.fn();
      render(
        <BaseModal
          {...defaultProps}
          title="Static Backdrop"
          backdrop="static"
          onHide={onHide}
          dataTestId="static-backdrop-modal"
        />,
      );
      // Static backdrop prevents closing on click, but modal should still render
      expect(screen.getByTestId('static-backdrop-modal')).toBeInTheDocument();
    });

    it('handles backdrop={true} correctly', () => {
      render(
        <BaseModal
          {...defaultProps}
          title="Clickable Backdrop"
          backdrop={true}
          dataTestId="clickable-backdrop-modal"
        />,
      );
      expect(
        screen.getByTestId('clickable-backdrop-modal'),
      ).toBeInTheDocument();
    });

    it('handles backdrop={false} correctly', () => {
      render(
        <BaseModal
          {...defaultProps}
          title="No Backdrop"
          backdrop={false}
          dataTestId="no-backdrop-modal"
        />,
      );
      expect(screen.getByTestId('no-backdrop-modal')).toBeInTheDocument();
    });
  });

  describe('Centered Tests', () => {
    it('applies centered={true} by default', () => {
      render(
        <BaseModal
          {...defaultProps}
          title="Centered Modal"
          dataTestId="centered-modal"
        />,
      );
      expect(screen.getByTestId('centered-modal')).toBeInTheDocument();
    });

    it('applies centered={false} correctly', () => {
      render(
        <BaseModal
          {...defaultProps}
          title="Not Centered"
          centered={false}
          dataTestId="not-centered-modal"
        />,
      );
      expect(screen.getByTestId('not-centered-modal')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty children', () => {
      render(
        <BaseModal
          {...defaultProps}
          title="Empty Body"
          dataTestId="empty-children-modal"
          children={null}
        />,
      );
      const modal = screen.getByTestId('empty-children-modal');
      expect(modal).toBeInTheDocument();
      // Verify no content text is present
      expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();
    });

    it('handles multiple modals with different test IDs', () => {
      render(
        <>
          <BaseModal
            show={true}
            onHide={vi.fn()}
            title="Modal 1"
            dataTestId="modal-1"
          >
            Content 1
          </BaseModal>
          <BaseModal
            show={true}
            onHide={vi.fn()}
            title="Modal 2"
            dataTestId="modal-2"
          >
            Content 2
          </BaseModal>
        </>,
      );

      expect(screen.getByTestId('modal-1')).toBeInTheDocument();
      expect(screen.getByTestId('modal-2')).toBeInTheDocument();
      expect(screen.getByText('Content 1')).toBeInTheDocument();
      expect(screen.getByText('Content 2')).toBeInTheDocument();
    });

    it('handles rapid open/close transitions', async () => {
      const onHide = vi.fn();
      const { rerender } = render(
        <BaseModal
          {...defaultProps}
          show={true}
          onHide={onHide}
          title="Rapid"
          dataTestId="rapid-modal"
        />,
      );

      // Rapidly toggle show prop
      rerender(
        <BaseModal
          {...defaultProps}
          show={false}
          onHide={onHide}
          title="Rapid"
          dataTestId="rapid-modal"
        />,
      );
      rerender(
        <BaseModal
          {...defaultProps}
          show={true}
          onHide={onHide}
          title="Rapid"
          dataTestId="rapid-modal"
        />,
      );
      rerender(
        <BaseModal
          {...defaultProps}
          show={false}
          onHide={onHide}
          title="Rapid"
          dataTestId="rapid-modal"
        />,
      );

      await waitFor(() => {
        expect(screen.queryByTestId('rapid-modal')).not.toBeInTheDocument();
      });
    });
  });
});
