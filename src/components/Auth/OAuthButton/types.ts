import { OAuthMode, OAuthSize } from './OAuthButton';

/**
 * Props for the OAuthButton component.
 */
export type Props = {
  mode: OAuthMode;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  size?: OAuthSize;
  className?: string;
  'aria-label'?: string;
  children?: React.ReactNode;
};
