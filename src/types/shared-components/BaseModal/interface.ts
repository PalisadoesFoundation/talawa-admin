/**
 * BaseModal component props.
 *
 * A reusable modal wrapper component that standardizes modal structure
 * across the Talawa Admin application. Provides consistent header, body,
 * and footer layouts while reducing boilerplate code.
 *
 * @remarks
 * Props:
 * - show: Controls modal visibility.
 * - onHide: Callback when modal is closed via X button, backdrop click, or Escape key.
 * - title: Modal title displayed in header (uses i18n keys).
 * - headerContent: Custom header content that overrides the default title and close button.
 * - children: Modal body content.
 * - footer: Optional footer content with action buttons.
 * - size: Modal size variant: sm, lg, xl.
 * - centered: Whether to vertically center the modal.
 * - backdrop: Backdrop behavior: static prevents close on click, true allows it, false hides backdrop.
 * - keyboard: Whether the modal can be closed by pressing the Escape key.
 * - className: Additional CSS classes for the modal container.
 * - showCloseButton: Whether to show the close button in the header.
 * - closeButtonVariant: Bootstrap button variant for the close button.
 * - headerClassName: Additional CSS classes for the modal header.
 * - headerTestId: Test ID for the modal header.
 * - bodyClassName: Additional CSS classes for the modal body.
 * - footerClassName: Additional CSS classes for the modal footer.
 * - dataTestId: Test ID for automated testing.
 * - id: Optional HTML id attribute for the modal container element.
 */
export interface IBaseModalProps {
  show: boolean;
  onHide: () => void;
  title?: React.ReactNode;
  headerContent?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'lg' | 'xl';
  centered?: boolean;
  backdrop?: 'static' | boolean;
  keyboard?: boolean;
  className?: string;
  showCloseButton?: boolean;
  closeButtonVariant?: string;
  headerClassName?: string;
  headerTestId?: string;
  bodyClassName?: string;
  footerClassName?: string;
  id?: string;
  dataTestId?: string;
}
