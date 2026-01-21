import React from 'react';
import styles from './ChatRoom.module.css';

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
      return <div className={styles.messageAttachment}>Loading image...</div>;
    }

    if (imageState.error || !imageState.url) {
      return (
        <div className={styles.messageAttachment}>Image not available</div>
      );
    }

    return (
      <img
        className={styles.messageAttachment}
        src={imageState.url}
        alt="attachment"
        onError={() => setImageState((prev) => ({ ...prev, error: true }))}
      />
    );
  },
);

MessageImage.displayName = 'MessageImage';

export default MessageImage;
