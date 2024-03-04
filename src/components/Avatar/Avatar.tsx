import React, { useMemo } from 'react';
import { createAvatar } from '@dicebear/core';
import { initials } from '@dicebear/collection';

interface InterfaceAvatarProps {
  name: string;
  alt?: string;
  size?: number;
  avatarStyle?: string;
  dataTestId?: string;
  radius?: number;
}

const Avatar = ({
  name,
  alt = 'Dummy Avatar',
  size,
  avatarStyle,
  dataTestId,
  radius,
}: InterfaceAvatarProps): JSX.Element => {
  const avatar = useMemo(() => {
    return createAvatar(initials, {
      size: size || 128,
      seed: name,
      radius: radius || 0,
    }).toDataUriSync();
  }, [name, size]);

  const svg = avatar.toString();

  return (
    <img
      src={svg}
      alt={alt}
      className={avatarStyle ? avatarStyle : ''}
      data-testid={dataTestId ? dataTestId : ''}
    />
  );
};

export default Avatar;
