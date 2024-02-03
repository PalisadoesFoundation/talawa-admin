import React from 'react';
import { useTranslation } from 'react-i18next';
import OrganizationScreen from 'components/OrganizationScreen/OrganizationScreen';
import { Button, Col, Dropdown, Row } from 'react-bootstrap';
import styles from './OrganizationActionItems.module.css';
import SortIcon from '@mui/icons-material/Sort';

// import { useMutation } from '@apollo/client';
// import { CREATE_ACTION_ITEM_MUTATION } from 'GraphQl/Mutations/mutations';

function organizationActionItems(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationActionItems',
  });

  // const [createActionItem] = useMutation(CREATE_ACTION_ITEM_MUTATION);

  // const handleCreate = async (): Promise<void> => {
  //   try {
  //     const { data } = await createActionItem({
  //       variables: {
  //         assigneeId: '65378abd85008f171cf2990d',
  //         actionItemCategoryId: '65b34002f9726a59bcfba8f2',
  //       },
  //     });

  //     console.log(data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  return (
    <>
      <OrganizationScreen screenName="Action Items" title={t('title')}>
        <div className={`${styles.container} bg-white rounded-4 my-3`}>
          <Row className="mx-3">
            <Col>
              <Button
                className="mt-4 me-3"
                variant="success"
                // onClick={handleCreate}
                data-testid="createActionItem"
              >
                <i className={'fa fa-plus me-2'} />
                {t('createActionItem')}
              </Button>

              <Dropdown
                className={styles.dropdown}
                aria-expanded="false"
                title="Sort action item categories"
                data-testid="sort"
              >
                <Dropdown.Toggle
                  // variant={
                  //   sortingState.option === '' ? 'outline-success' : 'success'
                  // }
                  variant="outline-success"
                  data-testid="sortOrgs"
                  className="mt-4 me-3"
                >
                  <SortIcon className={'me-1'} />
                  {/* {sortingState.selectedOption} */} Sort
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    // onClick={(): void => handleSorting('Latest')}
                    data-testid="latest"
                  >
                    {t('Latest')}
                  </Dropdown.Item>
                  <Dropdown.Item
                    // onClick={(): void => handleSorting('Earliest')}
                    data-testid="oldest"
                  >
                    {t('Earliest')}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
          </Row>

          <Row className="mt-3 mx-3">
            <hr />
          </Row>
        </div>
      </OrganizationScreen>
    </>
  );
}

export default organizationActionItems;
