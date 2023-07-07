/* istanbul ignore next */
const getOrganizationId = (url: string): string => {
  const id = url.split('=')[1];

  return id.split('#')[0];
};

export default getOrganizationId;
