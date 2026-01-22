/**
 * MessageImage Component
 *
 * This component handles the display of image attachments in messages. It fetches the image
 * URL from MinIO storage and manages loading, success, and error states.
 *
 * @remarks
 * - Memoized component for performance optimization.
 * - Uses useEffect to fetch image data on mount and when dependencies change.
 * - Prevents memory leaks by checking component mount status before state updates.
 *
 * @param props - The props for the MessageImage component.
 * @returns The rendered MessageImage component.
 *
 * @example
 * ```tsx
 * <MessageImage
 *   media="uploads/img1.jpg"
 *   organizationId="org123"
 *   getFileFromMinio={getFileFromMinio}
 * />
 * ```
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './MessageImage.module.css';

interface InterfaceMessageImageProps {
  media: string;
  organizationId?: string;
  getFileFromMinio: (
    objectName: string,
    organizationId: string,
  ) => Promise<string>;
}

const MessageImage = React.memo(
  ({ media, organizationId, getFileFromMinio }: InterfaceMessageImageProps) => {
    const { t } = useTranslation('translation', {
      keyPrefix: 'userChatRoom',
    });
    const [imageState, setImageState] = React.useState<{
      url: string | null;
      loading: boolean;
      error: boolean;
    }>({
      url: null,
      loading: !!media,
      error: false,
    });

    React.useEffect(() => {
      if (!media) {
        setImageState((prev) => ({ ...prev, error: true, loading: false }));
        return;
      }

      const orgId = organizationId || 'organization';
      let stillMounted = true;

      const loadImage = async (): Promise<void> => {
        try {
          const url = await getFileFromMinio(media, orgId);
          if (stillMounted)
            setImageState({ url, loading: false, error: false });
        } catch (error) {
          console.error('Error fetching image from MinIO:', error);
          if (stillMounted)
            setImageState({ url: null, loading: false, error: true });
        }
      };

      loadImage();
      return () => {
        stillMounted = false;
      };
    }, [media, organizationId, getFileFromMinio]);

    if (imageState.loading) {
      return (
        <div className={styles.messageAttachment}>{t('loadingImage')}</div>
      );
    }

    if (imageState.error || !imageState.url) {
      return (
        <div className={styles.messageAttachment}>{t('imageNotAvailable')}</div>
      );
    }

    return (
      <img
        className={styles.messageAttachment}
        src={imageState.url}
        alt={t('attachment')}
        onError={() => setImageState((prev) => ({ ...prev, error: true }))}
      />
    );
  },
);

MessageImage.displayName = 'MessageImage';

export default MessageImage;
