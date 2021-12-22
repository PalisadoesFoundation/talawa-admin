import { useMutation } from '@apollo/client';
import { UPDATE_ORGANIZATION_MUTATION } from 'GraphQl/Mutations/mutations';
import React from 'react';
import styles from './OrgUpdate.module.css';

interface OrgUpdateProps {
  id: string;
  orgid: string;
}

function OrgUpdate(props: OrgUpdateProps): JSX.Element {
  const [formState, setFormState] = React.useState({
    orgName: '',
    orgDescrip: '',
    creator: '',
    apiUrl: '',
    applangcode: '',
    selectedOption: '',
  });
  const [publicchecked, setPublicChecked] = React.useState(true);
  const [visiblechecked, setVisibleChecked] = React.useState(false);

  const [login] = useMutation(UPDATE_ORGANIZATION_MUTATION);

  const login_link = async () => {
    try {
      const { data } = await login({
        variables: {
          name: formState.orgName,
          description: formState.orgDescrip,
          isPublic: publicchecked,
          visibleInSearch: visiblechecked,
        },
      });
      if (data) {
        window.alert('Successful updated');
        window.location.reload();
      }
    } catch (error) {
      window.alert(error);
    }
  };

  return (
    <>
      <div id="orgupdate" className={styles.userupdatediv}>
        <form>
          {/* <h3 className={styles.settingstitle}>Update Your Details</h3> */}
          <div className={styles.dispflex}>
            <div>
              <label>Name</label>
              <input
                type="input"
                id="orgname"
                placeholder="Enter Organization Name"
                autoComplete="off"
                required
                value={formState.orgName}
                onChange={(e) => {
                  setFormState({
                    ...formState,
                    orgName: e.target.value,
                  });
                }}
              />
            </div>
            <div>
              <label>Description</label>
              <input
                type="input"
                id="orgdescrip"
                placeholder="Enter Description"
                autoComplete="off"
                required
                value={formState.orgDescrip}
                onChange={(e) => {
                  setFormState({
                    ...formState,
                    orgDescrip: e.target.value,
                  });
                }}
              />
            </div>
          </div>
          <div className={styles.dispflex}>
            <div>
              <label>Creator</label>
              <input
                type="creator"
                id="creator"
                placeholder="Enter Creator"
                autoComplete="off"
                required
                value={formState.creator}
                onChange={(e) => {
                  setFormState({
                    ...formState,
                    creator: e.target.value,
                  });
                }}
              />
            </div>
            <div>
              <label>Api Url</label>
              <input
                type="apiUrl"
                id="apiUrl"
                placeholder="Enter Api Url"
                required
                value={formState.apiUrl}
                onChange={(e) => {
                  setFormState({
                    ...formState,
                    apiUrl: e.target.value,
                  });
                }}
              />
            </div>
          </div>
          <div className={styles.dispflex}>
            <div>
              <label htmlFor="orgphoto" className={styles.orgphoto}>
                Display Image:
                <input
                  accept="image/*"
                  id="orgphoto"
                  name="photo"
                  type="file"
                  multiple={false}
                  //onChange=""
                />
              </label>
            </div>
            <div className={styles.checkboxdiv}>
              <div>
                <label htmlFor="ispublic">Is Public:</label>
                <input
                  id="ispublic"
                  type="checkbox"
                  defaultChecked={publicchecked}
                  onChange={() => setPublicChecked(!publicchecked)}
                />
              </div>
              <div>
                <label htmlFor="visible">Is Registrable:</label>
                <input
                  id="registrable"
                  type="checkbox"
                  defaultChecked={visiblechecked}
                  onChange={() => setVisibleChecked(!visiblechecked)}
                />
              </div>
            </div>
          </div>
          <div className={styles.dispbtnflex}>
            <button
              type="button"
              className={styles.greenregbtn}
              value="savechanges"
              onClick={login_link}
            >
              Save Changes
            </button>
            <button
              type="button"
              className={styles.whitebtn}
              value="cancelchanges"
              onClick={() => {
                window.location.reload();
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
export default OrgUpdate;
