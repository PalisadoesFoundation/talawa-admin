import React, { useMemo, useState } from 'react';
import { createAvatar } from '@dicebear/core';
import { initials } from '@dicebear/collection';
import styles from 'components/Avatar/Avatar.module.css';

interface InterfaceAvatarProps {
  name?: string;
  alt?: string;
  size?: number;
  containerStyle?: string;
  avatarStyle?: string;
  dataTestId?: string;
  radius?: number;
  customUrl?: string;
}

/**
 * A component that generates and displays an avatar based on the provided name.
 * The avatar is generated using the DiceBear library with the initials style.
 *
 * @param name - The name used to generate the avatar.
 * @param alt - Alternative text for the avatar image.
 * @param size - Size of the avatar image.
 * @param avatarStyle - Custom CSS class for the avatar image.
 * @param dataTestId - Data-testid attribute for testing purposes.
 * @param radius - Radius of the avatar corners.
 *
 * @returns JSX.Element - The rendered avatar image component.
 */
const Avatar = ({
  name,
  alt = 'Dummy Avatar',
  size,
  avatarStyle,
  containerStyle,
  dataTestId,
  radius,
  customUrl,
}: InterfaceAvatarProps): JSX.Element => {

  const [src, setSrc] = useState<string | null>(customUrl || '');

  // Memoize the avatar creation to avoid unnecessary recalculations
  const avatar = useMemo(() => {
    if (customUrl) {
         try {
          new URL(customUrl);
            return customUrl;
        } catch (e) {
          console.warn('Invalid custom URL provided to Avatar component');
      }
    }

    return createAvatar(initials, {
      size: size,
      seed: name,
      radius: radius || 0,
    }).toDataUri();
  }, [name, size]);

  const svg = avatar?.toString();

  return (
    <div className={`${containerStyle ?? styles.imageContainer}`}>
      <img
        src={svg}
        alt={alt}
        className={avatarStyle ? avatarStyle : ''}
        data-testid={dataTestId ? dataTestId : ''}
        height={size}
        width={size}
      />
    </div>
  );
};

export default Avatar;
