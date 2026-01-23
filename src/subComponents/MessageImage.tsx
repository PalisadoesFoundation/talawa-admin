import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { InterfaceMessageImageProps } from 'types/Chat/interface';
import styles from 'components/UserPortal/ChatRoom/ChatRoom.module.css';

const MessageImageBase: React.FC<InterfaceMessageImageProps> = ({
  media,
  organizationId,
  getFileFromMinio,
}) => {
  const [imageState, setImageState] = useState<{
    url: string | null;
    loading: boolean;
    error: boolean;
  }>({
    url: null,
    loading: !!media,
    error: false,
  });

  const { t } = useTranslation('translation', {
    keyPrefix: 'userChatRoom',
  });

  useEffect(() => {
    if (!media) {
      setImageState((prev) => ({ ...prev, error: true, loading: false }));
      return;
    }

    const orgId = organizationId || 'organization';

    let stillMounted = true;
    const loadImage = async (): Promise<void> => {
      try {
        const url = await getFileFromMinio(media, orgId);
        if (stillMounted) setImageState({ url, loading: false, error: false });
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
    return <div className={styles.messageAttachment}>{t('loadingImage')}</div>;
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
};

export const MessageImage = React.memo(MessageImageBase);
