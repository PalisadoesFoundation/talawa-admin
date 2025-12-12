import React, { useState } from 'react';
import Avatar from '../../../components/Avatar/Avatar';

/**
 * Interface for the AvatarImage component props.
 */
export interface IAvatarImageProps {
  src: string | null;
  alt: string;
  name: string;
}

/**
 * AvatarImage component to display user avatar with fallback.
 *
 * @param props - The props for the component.
 * @param props.src - The source URL of the avatar image.
 * @param props.alt - The alt text for the image.
 * @param props.name - The name of the user (used for the fallback Avatar).
 * @returns The rendered AvatarImage component.
 */
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
