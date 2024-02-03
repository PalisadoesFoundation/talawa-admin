import React from 'react';
import { useTranslation } from 'react-i18next';
import OrganizationScreen from 'components/OrganizationScreen/OrganizationScreen';
import { Button, Card, Col, Dropdown, Form, Row } from 'react-bootstrap';
import styles from './OrganizationActionItems.module.css';
import SortIcon from '@mui/icons-material/Sort';

import { useQuery } from '@apollo/client';
// import { CREATE_ACTION_ITEM_MUTATION } from 'GraphQl/Mutations/mutations';

import { ACTION_ITEM_CATEGORY_LIST } from 'GraphQl/Queries/ActionItemCategoryQueries';
import type { InterfaceActionItemCategoryList } from 'utils/interfaces';
import Loader from 'components/Loader/Loader';
import { Category, Search, WarningAmberRounded } from '@mui/icons-material';

function organizationActionItems(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationActionItems',
  });

  const currentUrl = window.location.href.split('=')[1];

  const {
    data,
    loading,
    error,
    refetch,
  }: {
    data: InterfaceActionItemCategoryList | undefined;
    loading: boolean;
    error?: Error | undefined;
    refetch: any;
  } = useQuery(ACTION_ITEM_CATEGORY_LIST, {
    variables: {
      organizationId: currentUrl,
    },
    notifyOnNetworkStatusChange: true,
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

  if (loading) {
    return <Loader styles={styles.message} size="lg" />;
  }

  if (error) {
    return (
      <div className={styles.message}>
        <WarningAmberRounded className={styles.icon} fontSize="large" />
        <h6 className="fw-bold text-danger text-center">
          Error occured while loading Action Item Categories Data
          <br />
          {`${error.message}`}
        </h6>
      </div>
    );
  }

  return (
    <>
      <OrganizationScreen screenName="Action Items" title={t('title')}>
        <div className={`${styles.container} bg-white rounded-4 my-3`}>
          <div className={`${styles.btnsContainer} mt-4 mx-4`}>
            <div className={styles.input}>
              <Form.Control
                type="name"
                id="searchOrgname"
                className="bg-white"
                placeholder={t('searchByName')}
                data-testid="searchByName"
                autoComplete="off"
                required
                // onKeyUp={handleSearchByEnter}
              />
              <Button
                tabIndex={-1}
                className={`position-absolute z-10 bottom-0 end-0 h-100 d-flex justify-content-center align-items-center`}
                // onClick={handleSearchByBtnClick}
                data-testid="searchBtn"
              >
                <Search />
              </Button>
            </div>
            <div className={styles.btnsBlock}>
              <div className={`${styles.dropdownContainer} d-flex flex-wrap`}>
                <Dropdown
                  aria-expanded="false"
                  title="Sort organizations"
                  data-testid="sort"
                  className={styles.dropdownToggle}
                >
                  <Dropdown.Toggle
                    // variant={
                    //   sortingState.option === ''
                    //     ? 'outline-success'
                    //     : 'success'
                    // }
                    variant="outline-success"
                    data-testid="sortOrgs"
                  >
                    <SortIcon className={'me-1'} />
                    Sort
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item
                      // onClick={(): void => handleSorting('Latest')}
                      data-testid="latest"
                    >
                      {t('latest')}
                    </Dropdown.Item>
                    <Dropdown.Item
                      // onClick={(): void => handleSorting('Earliest')}
                      data-testid="oldest"
                    >
                      {t('earliest')}
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>

                <Dropdown
                  aria-expanded="false"
                  title="Sort organizations"
                  data-testid="sort"
                  className={styles.dropdownToggle}
                >
                  <Dropdown.Toggle
                    // variant={
                    //   sortingState.option === ''
                    //     ? 'outline-success'
                    //     : 'success'
                    // }
                    variant="outline-success"
                    data-testid="sortOrgs"
                    className="me-0"
                  >
                    Action Item Category
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {data?.actionItemCategoriesByOrganization.map(
                      (category, index) => (
                        <Dropdown.Item
                          key={index}
                          // onClick={
                          //   /* istanbul ignore next */
                          //   () => setOrgSetting(setting)
                          // }
                          // className={
                          //   orgSetting === setting ? 'text-secondary' : ''
                          // }
                          className="my-1"
                        >
                          {category.name}
                        </Dropdown.Item>
                      )
                    )}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
              <Button
                variant="success"
                // onClick={toggleModal}
                data-testid="createOrganizationBtn"
              >
                <i className={'fa fa-plus me-2'} />
                {t('createActionItem')}
              </Button>
            </div>
          </div>

          <hr />

          <Row className="mt-5 mx-4">
            {Array.from({ length: 10 }, (_, index) => (
              <Col xs={12} md={6} lg={4} key={index}>
                <Card className="rounded-4 mx-auto mb-4 shadow-sm border border-light-subtle">
                  <div className={styles.cardHeader}>
                    <div className={styles.cardTitle}>Wilt Shepherd</div>
                  </div>
                  <Card.Body className={`${styles.cardBody} rounded-bottom-4`}>
                    <Card.Title className="fw-semibold text-secondary">
                      Membership Drive
                    </Card.Title>
                    <Card.Text>
                      Coordinate with other assignees to figure out a plan.
                    </Card.Text>

                    <div className="d-flex">
                      <div>
                        <Button className="btn btn-sm" variant="primary">
                          Details
                        </Button>
                      </div>

                      <div className="ms-auto">
                        <Button
                          size="sm"
                          data-testid="editEventModalBtn"
                          // onClick={toggleUpdateModel}
                          className="me-2"
                        >
                          {' '}
                          <i className="fas fa-edit"></i>
                        </Button>
                        <Button
                          size="sm"
                          data-testid="deleteEventModalBtn"
                          // onClick={toggleDeleteModal}
                        >
                          {' '}
                          <i className="fa fa-trash"></i>
                        </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </OrganizationScreen>
    </>
  );
}

export default organizationActionItems;
