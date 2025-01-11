import { useQuery } from '@apollo/client';
import useLocalStorage from 'utils/useLocalstorage';
import {
  USER_CREATED_ORGANIZATIONS,
  USER_JOINED_ORGANIZATIONS,
  USER_ORGANIZATION_CONNECTION,
} from 'GraphQl/Queries/Queries';
import React, { useEffect, useState } from 'react';

/**
 * Interface for the organization object.
 */
interface InterfaceOrganization {
  _id: string;
  name: string;
  image: string;
  description: string;
  admins: [];
  members: [];
  address: {
    city: string;
    countryCode: string;
    line1: string;
    postalCode: string;
    state: string;
  };
  membershipRequestStatus: string;
  userRegistrationRequired: boolean;
  membershipRequests: {
    _id: string;
    user: {
      _id: string;
    };
  }[];
}

const { getItem } = useLocalStorage();

/**
 * Component to render the organizations of a user with pagination and filtering.
 *
 * @returns \{JSX.Element\} The Organizations component.
 */

export default function Organizations(): JSX.Element {
  const userId: string | null = getItem('userId');
  const [organizations, setOrganizations] = useState<InterfaceOrganization[]>(
    [],
  );

  const { data } = useQuery(USER_ORGANIZATION_CONNECTION, {
    variables: { filter: '' }, // Filter value can be implemented later
  });

  const { data: joinedOrganizationsData } = useQuery(
    USER_JOINED_ORGANIZATIONS,
    {
      variables: { id: userId },
    },
  );

  const { data: createdOrganizationsData } = useQuery(
    USER_CREATED_ORGANIZATIONS,
    {
      variables: { id: userId },
    },
  );

  useEffect(() => {
    if (data) {
      const orgs = data.organizationsConnection.map(
        (organization: InterfaceOrganization) => {
          let membershipRequestStatus = '';
          if (
            organization.members.find(
              (member: { _id: string }) => member._id === userId,
            )
          )
            membershipRequestStatus = 'accepted';
          else if (
            organization.membershipRequests.find(
              (request: { user: { _id: string } }) =>
                request.user._id === userId,
            )
          )
            membershipRequestStatus = 'pending';
          return { ...organization, membershipRequestStatus };
        },
      );
      setOrganizations(orgs);
    }
  }, [data, userId]);

  useEffect(() => {
    if (joinedOrganizationsData?.users?.length > 0) {
      const orgs =
        joinedOrganizationsData.users[0]?.user?.joinedOrganizations.map(
          (org: InterfaceOrganization) => ({
            ...org,
            membershipRequestStatus: 'accepted',
            isJoined: true,
          }),
        ) || [];
      setOrganizations(orgs);
    } else if (createdOrganizationsData?.users?.length > 0) {
      const orgs =
        createdOrganizationsData.users[0]?.appUserProfile?.createdOrganizations.map(
          (org: InterfaceOrganization) => ({
            ...org,
            membershipRequestStatus: 'accepted',
            isJoined: true,
          }),
        ) || [];
      setOrganizations(orgs);
    }
  }, [joinedOrganizationsData, createdOrganizationsData, userId]);

  return (
    <div>
      {organizations.length > 0 ? (
        organizations.map((org) => (
          <div key={org._id}>
            <h3>{org.name}</h3>
            <p>{org.description}</p>
          </div>
        ))
      ) : (
        <p>No organizations found</p>
      )}
    </div>
  );
}
