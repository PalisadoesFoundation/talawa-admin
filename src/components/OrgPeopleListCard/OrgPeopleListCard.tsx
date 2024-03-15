import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { REMOVE_MEMBER_MUTATION } from 'GraphQl/Mutations/mutations';
import { useParams, Navigate } from 'react-router-dom';
import { errorHandler } from 'utils/errorHandler';

interface InterfaceOrgPeopleListCardProps {
  id: string | undefined;
  toggleRemoveModal: any;
}

function orgPeopleListCard(
  props: InterfaceOrgPeopleListCardProps,
): JSX.Element {
  if (!props.id) {
    return <Navigate to={'/orglist'} />;
  }
  const { orgId: currentUrl } = useParams();
  const [remove] = useMutation(REMOVE_MEMBER_MUTATION);

  const { t } = useTranslation('translation', {
    keyPrefix: 'orgPeopleListCard',
  });

  const removeMember = async (): Promise<void> => {
    try {
      const { data } = await remove({
        variables: {
          userid: props.id,
          orgid: currentUrl,
        },
      });

      /* istanbul ignore next */
      if (data) {
        toast.success(t('memberRemoved'));
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error: any) {
      /* istanbul ignore next */
      errorHandler(t, error);
    }
  };
  return (
    <div>
      <Modal show={true} onHide={props.toggleRemoveModal}>
        <Modal.Header>
          <h5>{t('removeMember')}</h5>
          <Button variant="danger" onClick={props.toggleRemoveModal}>
            <i className="fa fa-times"></i>
          </Button>
        </Modal.Header>
        <Modal.Body>{t('removeMemberMsg')}</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={props.toggleRemoveModal}>
            {t('no')}
          </Button>
          <Button
            type="button"
            className="btn btn-success"
            onClick={removeMember}
            data-testid="removeMemberBtn"
          >
            {t('yes')}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
export {};
export default orgPeopleListCard;
