import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FiEdit } from 'react-icons/fi';
import { FaCheck, FaX, FaTrash } from 'react-icons/fa6';
import Avatar from 'components/Avatar/Avatar';
import styles from 'style/app-fixed.module.css';
import type { InterfaceGroupChatDetailsProps } from 'types/Chat/interface';
import { getSafeImageSrc } from './GroupChatDetailsUtils';

interface InterfaceGroupChatDetailsHeaderProps {
  chat: InterfaceGroupChatDetailsProps['chat'];
  currentUserRole: string | undefined;
  selectedImage: string;
  editChatTitle: boolean;
  chatName: string;
  setChatName: (s: string) => void;
  setEditChatTitle: (b: boolean) => void;
  onImageClick: () => void;
  fileInputRef?: React.RefObject<HTMLInputElement | null>;
  onImageChange?: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  onSaveTitle: () => Promise<void>;
  onCancelEdit: () => void;
  onDelete: () => Promise<void>;
  t: (k: string, v?: Record<string, unknown>) => string;
}

export default function GroupChatDetailsHeader({
  chat,
  currentUserRole,
  selectedImage,
  editChatTitle,
  chatName,
  setChatName,
  setEditChatTitle,
  onImageClick,
  fileInputRef,
  onImageChange,
  onSaveTitle,
  onCancelEdit,
  onDelete,
  t,
}: InterfaceGroupChatDetailsHeaderProps) {
  return (
    <>
      <Modal.Header closeButton data-testid="groupChatDetails">
        <div className="d-flex justify-content-between w-100">
          <Modal.Title>{t('groupInfo')}</Modal.Title>
          {currentUserRole === 'administrator' && (
            <Button
              type="button"
              variant="outline-danger"
              size="sm"
              onClick={onDelete}
            >
              <FaTrash />
            </Button>
          )}
        </div>
      </Modal.Header>
      <Modal.Body>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className={styles.displayNone}
          onChange={onImageChange}
          data-testid="fileInput"
        />
        <div className={styles.groupInfo}>
          {(() => {
            const safeSelected = getSafeImageSrc(selectedImage);
            const safeAvatar = getSafeImageSrc(chat?.avatarURL);
            if (safeSelected) {
              return (
                <img
                  className={styles.chatImage}
                  src={safeSelected}
                  alt={chat?.name || ''}
                />
              );
            }
            if (safeAvatar) {
              return (
                <img
                  className={styles.chatImage}
                  src={safeAvatar}
                  alt={chat?.name || ''}
                />
              );
            }
            return (
              <Avatar avatarStyle={styles.groupImage} name={chat.name || ''} />
            );
          })()}

          <button
            type="button"
            data-testid="editImageBtn"
            onClick={onImageClick}
            className={styles.editImgBtn}
          >
            <FiEdit />
          </button>

          {editChatTitle ? (
            <div className={styles.editChatNameContainer}>
              <input
                type="text"
                value={chatName}
                data-testid="chatNameInput"
                onChange={(e) => setChatName(e.target.value)}
              />
              <button
                type="button"
                aria-label={t('saveTitle')}
                data-testid="updateTitleBtn"
                className={styles.iconButton}
                onClick={onSaveTitle}
              >
                <FaCheck />
              </button>
              <button
                type="button"
                aria-label={t('cancelEdit')}
                data-testid="cancelEditBtn"
                className={`${styles.iconButton} ${styles.cancelIcon}`}
                onClick={onCancelEdit}
              >
                <FaX />
              </button>
            </div>
          ) : (
            <div className={styles.editChatNameContainer}>
              <h3>{chat?.name}</h3>
              <button
                type="button"
                aria-label={t('editTitle')}
                data-testid="editTitleBtn"
                className={styles.iconButton}
                onClick={() => setEditChatTitle(true)}
              >
                <FiEdit />
              </button>
            </div>
          )}

          <p>
            {chat?.members.edges.length} {t('members')}
          </p>
          <p>{chat?.description}</p>
        </div>
      </Modal.Body>
    </>
  );
}
