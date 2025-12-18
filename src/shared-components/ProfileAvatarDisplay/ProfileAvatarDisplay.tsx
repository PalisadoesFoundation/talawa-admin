import React, { useState, useEffect } from 'react';
import { InterfaceProfileAvatarDisplayProps } from 'types/shared-components/ProfileAvatarDisplay/interface';
import Avatar from 'components/Avatar/Avatar';
import { useTranslation } from 'react-i18next';

/**
 * ProfileAvatarDisplay component renders a profile avatar based on the provided properties.
 * It handles image loading errors and falls back to an initial-based avatar.
 * @param {InterfaceProfileAvatarDisplayProps} props - The properties of the profile avatar display.
 * @param {string} props.avatarUrl - The URL of the avatar image.
 * @param {string} props.altText - The alt text for the avatar image.
 * @param {"small" | "medium" | "large" | "custom"} props.size - The size of the avatar.
 * @param {"circle" | "square" | "rounded"} props.shape - The shape of the avatar.
 * @param {number} props.customSize - The custom size of the avatar.
 * @param {boolean} props.border - Whether to show a border around the avatar.
 * @param {string} props.className - The CSS class name for the avatar.
 * @param {React.CSSProperties} props.style - The inline styles for the avatar.
 * @param {string} props.dataTestId - The data test ID for the avatar.
 * @param {"cover" | "contain" | "fill" | "none" | "scale-down"} props.objectFit - The object fit for the avatar image.
 * @returns {JSX.Element} The ProfileAvatarDisplay component.
 * @example
 * <ProfileAvatarDisplay
 *     avatarUrl="https://example.com/avatar.jpg"
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
 * />
 */
export const ProfileAvatarDisplay = ({
  avatarUrl,
  altText,
  size = 'medium',
  shape = 'circle',
  customSize,
  name,
  border = false,
  className = '',
  style,
  dataTestId,
  objectFit = 'cover',
}: InterfaceProfileAvatarDisplayProps): JSX.Element => {
  const [imgError, setImgError] = useState(false);
  const { t } = useTranslation();
  useEffect(() => {
    setImgError(false);
  }, [avatarUrl]);

  // Size mapping
  const sizeMap: Record<string, number> = {
    small: 32,
    medium: 48,
    large: 96,
  };

  const finalSize =
    size === 'custom' && customSize
      ? customSize
      : sizeMap[size] || sizeMap.medium;

  // Shape mapping
  const borderRadiusMap: Record<string, string> = {
    circle: '50%',
    square: '0',
    rounded: '8px',
  };
  const finalBorderRadius = borderRadiusMap[shape] || borderRadiusMap.circle;

  const containerStyle: React.CSSProperties = {
    width: finalSize,
    height: finalSize,
    borderRadius: finalBorderRadius,
    border: border ? '2px solid #e0e0e0' : 'none',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...style,
  };

  const imgStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: objectFit,
    borderRadius: finalBorderRadius,
  };

  // If avatarUrl is present and no error, show image
  if (avatarUrl && avatarUrl !== 'null' && !imgError) {
    return (
      <div
        className={className}
        style={containerStyle}
        data-testid={dataTestId}
      >
        <img
          src={avatarUrl}
          alt={altText}
          style={imgStyle}
          onError={() => setImgError(true)}
          crossOrigin="anonymous"
        />
      </div>
    );
  }

  // Fallback to Avatar (DiceBear/Initials)
  return (
    <div
      className={className}
      style={{ ...containerStyle }}
      data-testid={dataTestId}
    >
      <Avatar
        name={name}
        size={finalSize}
        radius={shape === 'circle' ? 50 : shape === 'rounded' ? 10 : 0} // Approximate radius for Avatar component
        alt={altText}
        dataTestId={`${dataTestId}${t('fallbacktest')}`}
      />
    </div>
  );
};
