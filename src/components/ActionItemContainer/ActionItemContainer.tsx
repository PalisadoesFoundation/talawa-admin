import React, { useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import type { InterfaceActionItemList } from 'utils/interfaces';

function actionItemContainer({
  data,
}: {
  data: InterfaceActionItemList | undefined;
}): JSX.Element {
  return (
    <>
      <div className="mx-1 my-4">
        <div className="mx-4 shadow-sm rounded-top-4">
          <Row className="mx-0 border border-light-subtle rounded-top-4 py-3">
            <Col xs={7} sm={4} md={3} lg={3} className="ps-3 fs-5 fw-bold">
              Assignee
            </Col>
            <Col
              className="fs-5 fw-bold d-none d-sm-block"
              sm={5}
              md={6}
              lg={4}
            >
              Action Item Category
            </Col>
            <Col className="d-none d-lg-block fs-5 fw-bold" md={4} lg={3}>
              Assigner
            </Col>
            <Col xs={5} sm={3} lg={2} className="fs-5 fw-bold">
              Options
            </Col>
          </Row>
        </div>

        <div className="mx-4 bg-light-subtle border border-light-subtle border-top-0 rounded-bottom-4 shadow-sm">
          {data?.actionItemsByOrganization.map((actionItem, index) => (
            <div key={index}>
              <Row className={`${index === 0 ? 'pt-3' : ''} mb-3 mx-2`}>
                <Col
                  sm={4}
                  xs={7}
                  md={3}
                  lg={3}
                  className="align-self-center fw-semibold text-body-secondary"
                >
                  {`${actionItem.assignee.firstName} ${actionItem.assignee.lastName}`}
                </Col>
                <Col
                  sm={5}
                  md={6}
                  lg={4}
                  className="d-none d-sm-block align-self-center fw-semibold text-body-secondary"
                >
                  {actionItem.actionItemCategory.name}
                </Col>
                <Col
                  className="d-none d-lg-block align-self-center fw-semibold text-body-secondary"
                  md={4}
                  lg={3}
                >
                  {`${actionItem.assigner.firstName} ${actionItem.assigner.lastName}`}
                </Col>
                <Col xs={5} sm={3} lg={2} className="p-0">
                  <Button
                    className="btn btn-sm me-2"
                    variant="outline-secondary"
                    // onClick={showDetailsModal}
                  >
                    Details
                  </Button>
                  <Button
                    size="sm"
                    data-testid="editEventModalBtn"
                    // onClick={toggleUpdateModel}
                    className="me-2 d-none d-xl-inline"
                    variant="success"
                  >
                    {' '}
                    <i className="fas fa-edit"></i>
                  </Button>
                  <Button
                    size="sm"
                    data-testid="deleteEventModalBtn"
                    variant="danger"
                    // onClick={toggleDeleteModal}
                  >
                    {' '}
                    <i className="fa fa-trash"></i>
                  </Button>
                </Col>
              </Row>

              {index !== data.actionItemsByOrganization.length - 1 && (
                <hr className="mx-3" />
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default actionItemContainer;
