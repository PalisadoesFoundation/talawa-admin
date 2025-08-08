import { Dispatch } from 'redux';

export const updateTargets = (orgId: string | undefined) => {
  return (dispatch: Dispatch): void => {
    dispatch({
      type: 'UPDATE_TARGETS',
      payload: orgId,
    });
  };
};
