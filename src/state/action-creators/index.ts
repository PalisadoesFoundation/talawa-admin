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
