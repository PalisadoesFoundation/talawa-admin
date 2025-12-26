/**
 * EmptyState Component
 *
 * A reusable component for displaying consistent empty state UI across the application.
 * Supports icons, messages, descriptions, and action buttons.
 *
 * @component
 * @category Shared Components
 *
 * @remarks
 * - All text is i18n-ready - pass translation keys or plain strings
 * - Accessibility: Uses role="status" and aria-label for screen readers
 * - Flexible icon system: accepts icon names or custom ReactNode
 *
 * @example
 * ```tsx
 * // Simple message only
 * <EmptyState message="noUserFound" />
 *
 * // With icon and action
 * <EmptyState
 *   icon="groups"
 *   message="noOrganizations"
 *   description="createOrgDescription"
 *   action={{
 *     label: "createOrganization",
 *     onClick: handleCreate,
 *     variant: "primary"
 *   }}
 * />
 * ```
 *
 * @param {string} [message] - Primary message to display (i18n key or plain string)
 *
 * @param {string | undefined} [description] - Optional secondary description text
 *
 * @param {React.ReactNode} [icon] - Icon to display above the message (string name or ReactNode)
 *
 * @param {{action: {
 *   label: string;
 *   onClick: () => void;
 *   variant?: "primary" | "secondary" | "outlined" | undefined;
 *  } | undefined}} [action] - Action button configuration
 *
 * @param {string | undefined} [className] - Custom CSS class name
 *
 * @param {string} [dataTestId = 'empty-state'] - Test identifier
 *
 * @returns {JSX.Element} The rendered EmptyState component
 *
 * @see {@link InterfaceEmptyStateProps} for prop definitions
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Stack, Button, Typography } from '@mui/material';
import IconComponent from 'components/IconComponent/IconComponent';
import type { InterfaceEmptyStateProps } from 'types/shared-components/EmptyState/interface';

const EmptyState: React.FC<InterfaceEmptyStateProps> = ({
  message,
  description,
  icon,
  action,
  className,
  dataTestId = 'empty-state',
}) => {
  const { t } = useTranslation();

  /**
   * Helper to handle both i18n keys and plain strings
   * @param {string} [text] - Text to translate or return as it is
   * @returns {string} - Translated text or original string
   */
  const getText = (text: string): string => {
    try {
      // i18next returns the key if translation doesn't exist
      // We treat the input as plain text if it equals the output
      return t(text, { defaultValue: text });
    } catch {
      return text;
    }
  };

  /**
   * Helper to map custom variant to MUI Button variant
   * @param {('primary' | 'secondary' | 'outlined') | undefined} [variant] - Button variant type
   * @returns {string} - MUI Button variant
   */
  const getButtonVariant = (
    variant: 'primary' | 'secondary' | 'outlined' | undefined,
  ): 'contained' | 'outlined' | 'text' => {
    switch (variant) {
      case 'primary':
        return 'contained';
      case 'secondary':
        return 'text';
      case 'outlined':
        return 'outlined';
      default:
        return 'contained';
    }
  };

  const messageText = getText(message);
  const descriptionText = description ? getText(description) : undefined;
  const buttonVariant = getButtonVariant(action?.variant);

  return (
    <Stack
      height="100%"
      alignItems="center"
      justifyContent="center"
      spacing={2}
      padding={4}
      role="status"
      aria-live="polite"
      aria-label={messageText}
      className={className}
      data-testid={dataTestId}
    >
      {/* Icon Section */}
      {icon && (
        <div data-testid={`${dataTestId}-icon`}>
          {typeof icon === 'string' ? (
            <IconComponent
              name={icon}
              fill="var(--bs-secondary)"
              width="48px"
              height="48px"
            />
          ) : (
            icon
          )}
        </div>
      )}

      {/* Message Section */}
      <Typography
        variant="h6"
        color="text.secondary"
        textAlign="center"
        data-testid={`${dataTestId}-message`}
        aria-describedby={
          descriptionText ? `${dataTestId}-description` : undefined
        }
        id={`${dataTestId}-message`}
      >
        {messageText}
      </Typography>

      {/* Description Section */}
      {descriptionText && (
        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
          data-testid={`${dataTestId}-description`}
          id={`${dataTestId}-description`}
        >
          {descriptionText}
        </Typography>
      )}

      {/* Action Button Section */}
      {action && (
        <Button
          variant={buttonVariant}
          onClick={action.onClick}
          data-testid={`${dataTestId}-action`}
        >
          {getText(action.label)}
        </Button>
      )}
    </Stack>
  );
};

export default EmptyState;
