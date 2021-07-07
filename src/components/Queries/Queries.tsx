import React from 'react';
import { gql } from '@apollo/client';

export const ORGANIZATION_LIST = gql`
  query {
    organizations {
      _id
      image
      creator {
        firstName
        lastName
      }
      name
    }
  }
`;

export const PEOPLE_LIST = gql`
  query {
    users {
      firstName
      lastName
      image
      _id
    }
  }
`;
