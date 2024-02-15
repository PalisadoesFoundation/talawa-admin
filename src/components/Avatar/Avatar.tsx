import React, { useMemo } from 'react';
import { createAvatar } from '@dicebear/core';
import { initials } from '@dicebear/collection';

interface InterfaceAvatarProps {
  name: string;
  alt?: string;
  size?: number;
}

const Avatar = ({ name, alt, size }: InterfaceAvatarProps): JSX.Element => {
  const avatar = useMemo(() => {
    return createAvatar(initials, {
      size: size || 128,
      seed: name,
    }).toDataUriSync();
  }, [name]);

  const svg = avatar.toString();

  return <img src={svg} alt={alt} />;
};

export default Avatar;
