import React, { useState, useEffect } from 'react';
import { InterfaceProfileAvatarDisplayProps } from 'types/shared-components/ProfileAvatarDisplay/interface';
import Avatar from 'shared-components/Avatar/Avatar';
import BaseModal from 'shared-components/BaseModal/BaseModal';
import styles from './ProfileAvatarDisplay.module.css';
import { useTranslation } from 'react-i18next';

/**
 * ProfileAvatarDisplay component renders a profile avatar based on the provided properties.
 * It handles image loading errors and falls back to an initial-based avatar.
 * @param imageUrl - The URL of the avatar image.
 * @param fallbackName - The name of the user.
 * @param size - The size of the avatar.
 * @param shape - The shape of the avatar.
 * @param customSize - The custom size of the avatar.
 * @param border - Whether to show a border around the avatar.
 * @param className - The CSS class name for the avatar.
 * @param style - The inline styles for the avatar.
 * @param dataTestId - The data test ID for the avatar.
 * @param objectFit - The object fit for the avatar image.
 * @param enableEnlarge - Whether to enable click-to-enlarge modal functionality.
 * @returns JSX.Element - The ProfileAvatarDisplay component.
 * @example
 * ```
 * <ProfileAvatarDisplay
 *     imageUrl="https://example.com/avatar.jpg"
 *     altText="User Avatar"
 *     size="medium"
 *     shape="circle"
 *     customSize={48}
 *     name="John Doe"
 *     border={false}
 *     className=""
 *     style={{}}
 *     dataTestId="profile-avatar"
 *     objectFit="cover"
 *     enableEnlarge={true}
 * />
 * ```
 */
export const ProfileAvatarDisplay = ({
  imageUrl,
  size = 'large',
  shape = 'circle',
  customSize,
  fallbackName,
  border = false,
  className = '',
  style,
  dataTestId,
  objectFit = 'cover',
  onClick,
  crossOrigin,
  decoding = 'async',
  loading = 'lazy',
  onError,
  onLoad,
  enableEnlarge = false,
}: InterfaceProfileAvatarDisplayProps): JSX.Element => {
  const [imgError, setImgError] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { t } = useTranslation('translation');
  const altText = t('profileAvatar.altText', { name: fallbackName });
  useEffect(() => {
    setImgError(false);
  }, [imageUrl]);

  // Build container class names
  const shapeClassMap: Record<string, string> = {
    circle: styles.shapeCircle,
    square: styles.shapeSquare,
    rounded: styles.shapeRounded,
  };

  const sizeClassMap: Record<string, string> = {
    small: styles.sizeSmall,
    medium: styles.sizeMedium,
    large: styles.sizeLarge,
  };

  const objectFitClassMap: Record<string, string> = {
    cover: styles.objectFitCover,
    contain: styles.objectFitContain,
    fill: styles.objectFitFill,
    none: styles.objectFitNone,
    'scale-down': styles.objectFitScaleDown,
  };

  const containerClasses = [
    styles.container,
    shapeClassMap[shape] || styles.shapeCircle,
    size !== 'custom' ? sizeClassMap[size] || styles.sizeMedium : '',
    // Only apply default border if border is true and no custom className is provided
    border && !className ? styles.containerWithBorder : '',
    enableEnlarge ? styles.clickable : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const imageClasses = [
    styles.image,
    shapeClassMap[shape] || styles.shapeCircle,
    objectFitClassMap[objectFit] || styles.objectFitCover,
  ]
    .filter(Boolean)
    .join(' ');

  // Custom size requires inline style
  const customSizeStyle: React.CSSProperties =
    size === 'custom' && customSize
      ? { width: customSize, height: customSize, ...style }
      : { ...style };

  // Handle click - open modal if enableEnlarge, otherwise call onClick
  const handleClick = (): void => {
    if (enableEnlarge) {
      setModalOpen(true);
    } else if (onClick) {
      onClick();
    }
  };

  // Render the enlarge modal
  const renderModal = (): JSX.Element => (
    <BaseModal
      show={modalOpen}
      onHide={() => setModalOpen(false)}
      title={fallbackName ? fallbackName : t('profileAvatar.modalTitle')}
      headerClassName={styles.modalHeader}
      bodyClassName={styles.modalBody}
      dataTestId={dataTestId ? dataTestId + '-modal' : 'avatar-modal'}
      backdrop={true}
    >
      {imageUrl && imageUrl !== 'null' && !imgError ? (
        <img
          src={imageUrl}
          alt={t('profileAvatar.enlargedAltText', { name: fallbackName })}
          className={styles.enlargedImage}
          crossOrigin={crossOrigin}
          onLoad={() => (onLoad ? onLoad() : null)}
          onError={() => (onError ? onError() : null)}
        />
      ) : (
        <div className={styles.enlargedFallback}>
          <Avatar
            name={fallbackName}
            radius={shape === 'circle' ? 50 : shape === 'rounded' ? 10 : 0}
            alt={altText}
            dataTestId={
              dataTestId
                ? dataTestId + '-modal-fallback'
                : 'avatar-modal-fallback'
            }
          />
        </div>
      )}
    </BaseModal>
  );

  // If imageUrl is present and no error, show image
  if (imageUrl && imageUrl !== 'null' && !imgError) {
    return (
      <>
        <div
          className={containerClasses}
          style={customSizeStyle}
          data-testid={dataTestId}
          onClick={handleClick}
          role={enableEnlarge || onClick ? 'button' : undefined}
          tabIndex={enableEnlarge || onClick ? 0 : undefined}
          onKeyDown={
            enableEnlarge || onClick
              ? (e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleClick();
                  }
                }
              : undefined
          }
        >
          <img
            src={imageUrl}
            alt={altText}
            className={imageClasses}
            onError={() => (onError ? onError() : setImgError(true))}
            onLoad={() => (onLoad ? onLoad() : null)}
            crossOrigin={crossOrigin}
            decoding={decoding}
            loading={loading}
          />
        </div>
        {enableEnlarge && renderModal()}
      </>
    );
  }

  // Fallback to Avatar (DiceBear/Initials)
  return (
    <>
      <div
        className={containerClasses}
        style={customSizeStyle}
        data-testid={dataTestId}
        onClick={handleClick}
        role={enableEnlarge ? 'button' : undefined}
        tabIndex={enableEnlarge ? 0 : undefined}
        onKeyDown={
          enableEnlarge
            ? (e) => (e.key === 'Enter' || e.key === ' ') && handleClick()
            : undefined
        }
      >
        <Avatar
          name={fallbackName}
          radius={shape === 'circle' ? 50 : shape === 'rounded' ? 10 : 0}
          alt={altText}
          dataTestId={dataTestId ? dataTestId + '-fallback' : 'avatar-fallback'}
        />
      </div>
      {enableEnlarge && renderModal()}
    </>
  );
};
