import {
  REMOTE_HOST,
  BACKEND_URL,
  REACT_APP_CUSTOM_PORT,
} from 'Constant/constant';

interface InterfaceConstants {
  remoteHost: string | undefined;
  backendUrl: string | undefined;
}

export const changeBackendUrl = (
  hostname: string,
  { remoteHost, backendUrl }: InterfaceConstants,
): string => {
  console.log(remoteHost);
  if (hostname !== 'localhost' && backendUrl?.includes('localhost')) {
    let left = remoteHost || '';
    if (left.endsWith('/')) {
      left = left.slice(0, -1);
    }
    left = left.concat(':');
    return left;
  } else {
    return 'http://localhost:';
  }
};
class PluginHelper {
  fetchStore = async (): Promise<any> => {
    console.log('port' + REACT_APP_CUSTOM_PORT);
    const result = await fetch(
      `${changeBackendUrl(window.location.hostname, { remoteHost: REMOTE_HOST, backendUrl: BACKEND_URL }) + process.env.PORT}/store`,
    );
    return await result.json();
  };

  fetchInstalled = async (): Promise<any> => {
    const result = await fetch(
      `${changeBackendUrl(window.location.hostname, { remoteHost: REMOTE_HOST, backendUrl: BACKEND_URL })}3005/installed`,
    );
    return await result.json();
  };

  generateLinks = (plugins: any[]): { name: string; url: string }[] => {
    return plugins
      .filter((plugin: any) => plugin.enabled)
      .map((installedPlugin: any) => {
        return {
          name: installedPlugin.name,
          url: `/plugin/${installedPlugin.component.toLowerCase()}`,
        };
      });
  };
}

export default PluginHelper;
