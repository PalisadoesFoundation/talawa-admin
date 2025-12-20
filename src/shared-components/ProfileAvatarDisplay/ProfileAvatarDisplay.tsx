import React, { useState, useEffect } from 'react';
import { InterfaceProfileAvatarDisplayProps } from 'types/shared-components/ProfileAvatarDisplay/interface';
import Avatar from 'components/Avatar/Avatar';
import Modal from 'react-bootstrap/Modal';
import styles from './ProfileAvatarDisplay.module.css';

/**
 * ProfileAvatarDisplay component renders a profile avatar based on the provided properties.
 * It handles image loading errors and falls back to an initial-based avatar.
 * @param {InterfaceProfileAvatarDisplayProps} props - The properties of the profile avatar display.
 * @param {string} props.imageUrl - The URL of the avatar image.
 * @param {string} props.fallbackName - The name of the user.
 * @param {string} props.altText - The alt text for the avatar image.
 * @param {"small" | "medium" | "large" | "custom"} props.size - The size of the avatar.
 * @param {"circle" | "square" | "rounded"} props.shape - The shape of the avatar.
 * @param {number} props.customSize - The custom size of the avatar.
 * @param {boolean} props.border - Whether to show a border around the avatar.
 * @param {string} props.className - The CSS class name for the avatar.
 * @param {React.CSSProperties} props.style - The inline styles for the avatar.
 * @param {string} props.dataTestId - The data test ID for the avatar.
 * @param {"cover" | "contain" | "fill" | "none" | "scale-down"} props.objectFit - The object fit for the avatar image.
 * @param {boolean} props.enableEnlarge - Whether to enable click-to-enlarge modal functionality.
 * @returns {JSX.Element} The ProfileAvatarDisplay component.
 * @example
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
 */
export const ProfileAvatarDisplay = ({
  imageUrl,
  altText,
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
    border ? styles.containerWithBorder : '',
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
    <Modal
      show={modalOpen}
      onHide={() => setModalOpen(false)}
      centered
      data-testid={dataTestId ? `${dataTestId}-modal` : 'avatar-modal'}
    >
      <Modal.Header closeButton className={styles.modalHeader}>
        <Modal.Title>{fallbackName}</Modal.Title>
      </Modal.Header>
      <Modal.Body className={styles.modalBody}>
        {imageUrl && imageUrl !== 'null' && !imgError ? (
          <img
            src={imageUrl}
            alt={altText}
            className={styles.enlargedImage}
            crossOrigin={crossOrigin}
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
      </Modal.Body>
    </Modal>
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
          role={enableEnlarge ? 'button' : undefined}
          tabIndex={enableEnlarge ? 0 : undefined}
          onKeyDown={
            enableEnlarge
              ? (e) => e.key === 'Enter' && handleClick()
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
        onError={() => (onError ? onError() : null)}
        onLoad={() => (onLoad ? onLoad() : null)}
        onClick={handleClick}
        role={enableEnlarge ? 'button' : undefined}
        tabIndex={enableEnlarge ? 0 : undefined}
        onKeyDown={
          enableEnlarge ? (e) => e.key === 'Enter' && handleClick() : undefined
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
