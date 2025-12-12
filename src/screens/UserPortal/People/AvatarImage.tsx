import React, { useState } from 'react';
import Avatar from '../../../components/Avatar/Avatar';

export interface IAvatarImageProps {
  src: string | null;
  alt: string;
  name: string;
}

export const AvatarImage: React.FC<IAvatarImageProps> = ({
  src,
  alt,
  name,
}) => {
  const [imgError, setImgError] = useState(false);

  if (src && !imgError) {
    return (
      <img
        src={src}
        alt={alt}
        className="people_img"
        onError={() => setImgError(true)}
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          objectFit: 'cover',
        }}
      />
    );
  }

  return <Avatar name={name} />;
};
