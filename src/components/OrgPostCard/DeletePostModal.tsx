import React, { type FC } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

interface InterfaceDeletePostModalProps {
  show: boolean;
  onHide: () => void;
  onDelete: () => void;
}

const DeletePostModal: FC<InterfaceDeletePostModalProps> = ({
  show,
  onHide,
  onDelete,
}) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'orgPostCard',
  });
  const { t: tCommon } = useTranslation('common');

  const handleConfirmDelete = (): void => {
    onDelete();
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} data-testid="delete-post-modal">
      <Modal.Header>
        <h5>{t('deletePost')}</h5>
        <Button variant="danger" onClick={onHide}>
          <i className="fa fa-times" />
        </Button>
      </Modal.Header>
      <Modal.Body>{t('deletePostMsg')}</Modal.Body>
      <Modal.Footer>
        <Button
          variant="danger"
          onClick={onHide}
          data-testid="deleteModalNoBtn"
        >
          {tCommon('no')}
        </Button>
        <Button
          type="button"
          className="btn btn-success"
          onClick={handleConfirmDelete}
          data-testid="deletePostBtn"
        >
          {tCommon('yes')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeletePostModal;
