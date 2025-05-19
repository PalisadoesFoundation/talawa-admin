export const updateTargets = (orgId: string | undefined) => {
  return (dispatch: any): void => {
    dispatch({
      type: 'UPDATE_TARGETS',
      payload: orgId,
    });
  };
};
