import React from 'react';
import ActionButton from './ActionButton';

const HomeCallToAction = () => {
  return (
    <>
      <ActionButton
        type="primary"
        href="/docs"
        buttonClassName="custom-button"
        ariaLabel="Learn more about Talawa Admin"
      >
        Learn More
      </ActionButton>
      <ActionButton
        type="secondary"
        href="https://github.com/PalisadoesFoundation/talawa-admin"
        buttonClassName="custom-button"
        target="_blank"
        ariaLabel="View Talawa Admin on GitHub"
      >
        GitHub
      </ActionButton>
    </>
  );
};

export default HomeCallToAction;
