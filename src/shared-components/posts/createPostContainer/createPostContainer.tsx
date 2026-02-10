/**
 * CreatePostContainer Component
 *
 * This is a purely visual component that displays a "Start a Post" container.
 * When clicked, it opens the existing CreatePostModal.
 */

import React from 'react';
import { Send } from '@mui/icons-material';
import { Box, Input } from '@mui/material';
import styles from './createPostContainer.module.css';
import { InterfaceCreatePostContainerProps } from 'types/Post/interface';
import { useTranslation } from 'react-i18next';
import Button from 'shared-components/Button';

const CreatePostContainer: React.FC<InterfaceCreatePostContainerProps> = ({
  onClick,
}) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'createPostContainer',
  });
  return (
    <Box
      className={styles.createPostContainer}
      data-testid="createPostContainer"
    >
      <Box className={styles.createPostContent}>
        {/* Title */}
        <Box className={styles.title}>{t('startAPost')}</Box>

        {/* Input Area with Browse Files Button */}
        <Box className={styles.inputArea}>
          <Button
            className={styles.browseFilesButton}
            data-testid="browseFilesButton"
          >
            {t('browseFiles')}
          </Button>

          <Input
            className={styles.postInput}
            placeholder={t('startYourPost')}
            onClick={onClick}
            disableUnderline
            readOnly
            data-testid="postInput"
            data-cy="createPostInput"
          />
        </Box>

        {/* Send Button */}
        <Box className={styles.sendButtonContainer}>
          <Button className={styles.sendButton} data-testid="sendPostButton">
            <Send />
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CreatePostContainer;
