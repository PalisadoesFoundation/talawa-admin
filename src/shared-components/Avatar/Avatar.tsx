/**
 * Avatar Component
 *
 * This component generates an avatar using the `@dicebear/core` library with the `initials` collection.
 * It creates a customizable avatar based on the provided name and other optional properties.
 *
 * @remarks
 * - The avatar generation is memoized using `useMemo` to optimize performance and avoid unnecessary recalculations.
 * - The `createAvatar` function generates a Data URI for the avatar, which is used as the `src` for the `<img>` tag.
 * - A11y: The alt text defaults to the name prop if not provided. Callers should pass internationalized alt text.
 *
 * @example
 * ```tsx
 * <Avatar
 *   name="John Doe"
 *   alt="John Doe"
 *   size={150}
 *   avatarStyle="custom-avatar-style"
 *   containerStyle="custom-container-style"
 *   dataTestId="avatar-component"
 *   radius={10}
 * />
 * ```
 */
import React, { useMemo } from 'react';
import { createAvatar } from '@dicebear/core';
import { initials } from '@dicebear/collection';
import styles from 'shared-components/Avatar/Avatar.module.css';
import type { InterfaceAvatarProps } from 'types/shared-components/Avatar/interface';

const Avatar = ({
  name,
  alt,
  size,
  avatarStyle,
  containerStyle,
  dataTestId,
  radius,
}: InterfaceAvatarProps): JSX.Element => {
  // Memoize the avatar creation to avoid unnecessary recalculations
  const avatar = useMemo(() => {
    return createAvatar(initials, {
      size: size || 128,
      seed: name,
      radius: radius || 0,
    }).toDataUri();
  }, [name, size]);

  const svg = avatar?.toString();

  return (
    <div className={`${containerStyle ?? styles.imageContainer}`}>
      <img
        src={svg}
        alt={alt ?? name ?? ''}
        className={avatarStyle ? avatarStyle : ''}
        data-testid={dataTestId ? dataTestId : ''}
      />
    </div>
  );
};

export default Avatar;
