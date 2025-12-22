/**
 * BaseModal Component Props
 *
 * A reusable modal wrapper component that standardizes modal structure
 * across the Talawa Admin application. Provides consistent header, body,
 * and footer layouts while reducing boilerplate code.
 *
 * @interface IBaseModalProps
 * @property {boolean} show - Controls modal visibility
 * @property {() => void} onHide - Callback when modal is closed (via X button, backdrop click, or Escape key)
 * @property {string} [title] - Modal title displayed in header (uses i18n keys)
 * @property {React.ReactNode} [headerContent] - Custom header content (overrides default title + close button)
 * @property {React.ReactNode} children - Modal body content
 * @property {React.ReactNode} [footer] - Optional footer content with action buttons
 * @property {'sm' | 'lg' | 'xl'} [size] - Modal size variant (default: responsive)
 * @property {boolean} [centered=true] - Whether to vertically center modal
 * @property {'static' | boolean} [backdrop='static'] - Backdrop behavior: 'static' prevents close on click, true allows it, false hides backdrop
 * @property {boolean} [keyboard=true] - Whether the modal can be closed by pressing the Escape key
 * @property {string} [className] - Additional CSS classes for modal container
 * @property {boolean} [showCloseButton=true] - Whether to show X close button in header
 * @property {string} [closeButtonVariant='danger'] - Bootstrap button variant for close button
 * @property {string} [headerClassName] - Additional CSS classes for Modal.Header
 * @property {string} [bodyClassName] - Additional CSS classes for Modal.Body
 * @property {string} [footerClassName] - Additional CSS classes for Modal.Footer
 * @property {string} [dataTestId] - Test ID for automated testing
 */
export interface IBaseModalProps {
  show: boolean;
  onHide: () => void;
  title?: string;
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
  bodyClassName?: string;
  footerClassName?: string;
  dataTestId?: string;
}
