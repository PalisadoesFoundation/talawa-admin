export const updateInstalled = (plugin: any) => {
  return (dispatch: any): void => {
    dispatch({
      type: 'UPDATE_INSTALLED',
      payload: plugin,
    });
  };
};

export const installPlugin = (plugin: any) => {
  return (dispatch: any): void => {
    dispatch({
      type: 'INSTALL_PLUGIN',
      payload: plugin,
    });
  };
};

export const removePlugin = (plugin: any) => {
  return (dispatch: any): void => {
    dispatch({
      type: 'REMOVE_PLUGIN',
      payload: plugin,
    });
  };
};

export const updatePluginLinks = (plugins: any) => {
  return (dispatch: any): void => {
    dispatch({
      type: 'UPDATE_P_TARGETS',
      payload: plugins,
    });
  };
};
<<<<<<< HEAD

export const updateTargets = (orgId: string | undefined) => {
  return (dispatch: any): void => {
    dispatch({
      type: 'UPDATE_TARGETS',
      payload: orgId,
    });
  };
};
=======
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
