/**
 * Avatar Component
 *
 * This component generates an avatar using the `@dicebear/core` library with the `initials` collection.
 * It creates a customizable avatar based on the provided name and other optional properties.
 *
 * @param  props - The properties for the Avatar component.
 * @param  name - The name used to generate the avatar. Acts as the seed for the avatar creation.
 * @param  alt - 'Dummy Avatar' - The alternative text for the avatar image.
 * @param  size - The size of the avatar in pixels. Defaults to 128 if not provided.
 * @param  avatarStyle - Additional CSS class for styling the avatar image.
 * @param  containerStyle - Additional CSS class for styling the avatar container.
 * @param  dataTestId - The `data-testid` attribute for testing purposes.
 * @param  radius - The border radius of the avatar in pixels. Defaults to 0.
 *
 * @returns  A JSX element containing the avatar image wrapped in a container.
 *
 * @remarks
 * - The avatar generation is memoized using `useMemo` to optimize performance and avoid unnecessary recalculations.
 * - The `createAvatar` function generates a Data URI for the avatar, which is used as the `src` for the `<img>` tag.
 *
 * @example
 * ```tsx
 * <Avatar
 *   name="John Doe"
 *   alt="John's Avatar"
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
  alt = '',
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
        alt={alt}
        className={avatarStyle ? avatarStyle : ''}
        data-testid={dataTestId ? dataTestId : ''}
      />
    </div>
  );
};

export default Avatar;
