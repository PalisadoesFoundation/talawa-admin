import type { Dispatch, SetStateAction } from 'react';
import React from 'react';
import { act, render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import EditOrgCustomFieldDropDown from './EditCustomFieldDropDown';
import type { InterfaceCustomFieldData } from 'components/OrgProfileFieldSettings/OrgProfileFieldSettings';
import userEvent from '@testing-library/user-event';
import availableFieldTypes from 'utils/fieldTypes';

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

describe('Testing Custom Field Dropdown', () => {
  test('Component Should be rendered properly', async () => {
    const customFieldData = {
      type: 'Number',
      name: 'Age',
    };

    const setCustomFieldData: Dispatch<
      SetStateAction<InterfaceCustomFieldData>
    > = (val) => {
      {
        val;
      }
    };
    const props = {
      customFieldData: customFieldData as InterfaceCustomFieldData,
      setCustomFieldData: setCustomFieldData,
      parentContainerStyle: 'parentContainerStyle',
      btnStyle: 'btnStyle',
      btnTextStyle: 'btnTextStyle',
    };

    const { getByTestId, getByText } = render(
      <BrowserRouter>
        <EditOrgCustomFieldDropDown {...props} />
      </BrowserRouter>,
    );

    expect(getByText('Number')).toBeInTheDocument();

    act(() => {
      userEvent.click(getByTestId('toggleBtn'));
    });

    await wait();

    availableFieldTypes.forEach(async (_, index) => {
      act(() => {
        userEvent.click(getByTestId(`dropdown-btn-${index}`));
      });
    });
  });
});
