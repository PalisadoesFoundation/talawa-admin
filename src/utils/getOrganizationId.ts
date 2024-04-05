/* istanbul ignore next */
const getOrganizationId = (url: string): string => {
<<<<<<< HEAD
  const id = url?.split('=')[1];

  return id?.split('#')[0];
=======
  const id = url.split('=')[1];

  return id.split('#')[0];
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
};

export default getOrganizationId;
