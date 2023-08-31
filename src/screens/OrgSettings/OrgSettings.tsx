import React, { useState } from 'react';
import OrgUpdate from 'components/OrgUpdate/OrgUpdate';
import OrganizationScreen from 'components/OrganizationScreen/OrganizationScreen';
import { Button, Card, Form, Modal } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useTranslation } from 'react-i18next';
import styles from './OrgSettings.module.css';
import ChangeLanguageDropDown from 'components/ChangeLanguageDropdown/ChangeLanguageDropDown';
import { errorHandler } from 'utils/errorHandler';
import { useMutation } from '@apollo/client';
import { DELETE_ORGANIZATION_MUTATION } from 'GraphQl/Mutations/mutations';

function orgSettings(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'orgSettings',
  });

  document.title = t('title');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const currentUrl = window.location.href.split('=')[1];
  const canDelete = localStorage.getItem('UserType') === 'SUPERADMIN';
  const toggleDeleteModal = (): void => setShowDeleteModal(!showDeleteModal);
  const [del] = useMutation(DELETE_ORGANIZATION_MUTATION);

  const deleteOrg = async (): Promise<void> => {
    try {
      const { data } = await del({
        variables: {
          id: currentUrl,
        },
      });

      /* istanbul ignore next */
      if (data) {
        window.location.replace('/orglist');
      }
    } catch (error: any) {
      /* istanbul ignore next */
      errorHandler(t, error);
    }
  };

  return (
    <>
      <OrganizationScreen screenName="Settings" title={t('title')}>
        <Row className={styles.settingsBody}>
          <Col lg={7}>
            <Card border="0" className="rounded-4 mb-4">
              <div className={styles.cardHeader}>
                <div className={styles.cardTitle}>
                  {t('updateOrganization')}
                </div>
              </div>
              <Card.Body className={styles.cardBody}>
                <OrgUpdate orgid={currentUrl} />
              </Card.Body>
            </Card>
          </Col>
          <Col lg={5}>
            {canDelete && (
              <Card border="0" className="rounded-4 mb-4">
                <div className={styles.cardHeader}>
                  <div className={styles.cardTitle}>
                    {t('deleteOrganization')}
                  </div>
                </div>
                <Card.Body className={styles.cardBody}>
                  <div className={styles.textBox}>{t('longDelOrgMsg')}</div>
                  <Button
                    variant="danger"
                    className={styles.deleteButton}
                    onClick={toggleDeleteModal}
                  >
                    {t('deleteOrganization')}
                  </Button>
                </Card.Body>
              </Card>
            )}
            <Card border="0" className="rounded-4 mb-4">
              <div className={styles.cardHeader}>
                <div className={styles.cardTitle}>{t('otherSettings')}</div>
              </div>
              <Card.Body className={styles.cardBody}>
                <div className={styles.textBox}>
                  <Form.Label className={'text-secondary fw-bold'}>
                    {t('changeLanguage')}
                  </Form.Label>
                  <ChangeLanguageDropDown />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Delete Organization Modal */}
        {canDelete && (
          <Modal show={showDeleteModal} onHide={toggleDeleteModal}>
            <Modal.Header className="bg-danger" closeButton>
              <h5 className="text-white fw-bold">{t('deleteOrganization')}</h5>
            </Modal.Header>
            <Modal.Body>{t('deleteMsg')}</Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={toggleDeleteModal}>
                {t('no')}
              </Button>
              <Button
                variant="success"
                onClick={deleteOrg}
                data-testid="deleteOrganizationBtn"
              >
                {t('yes')}
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </OrganizationScreen>
    </>
  );
}

export default orgSettings;
