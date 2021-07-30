import { useMutation } from '@apollo/client';
import React from 'react';
import { CREATE_ORGANIZATION_MUTATION } from 'GraphQl/Mutations/mutations';

function OrgCreationPage(): JSX.Element {
  /*const [formState, setFormState] = useState({
    name: '',
    description: '',
  });*/

  const [createOrg] = useMutation(CREATE_ORGANIZATION_MUTATION);

  const createOrganizationHandler = async () => {
    const { data } = await createOrg({
      variables: {
        name: '',
        attendees: '',
      },
    });
    if (data) {
      console.log(data.createOrganization);
    }
  };

  return (
    <>
      <form onSubmit={createOrganizationHandler}>
        <input type="text" id="name" placeholder="Name" autoComplete="off" />
        <input
          type="text"
          id="description"
          placeholder="Description"
          autoComplete="off"
        />
      </form>
    </>
  );
}

export default OrgCreationPage;
