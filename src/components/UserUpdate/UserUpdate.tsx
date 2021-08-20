import { useMutation } from '@apollo/client';
import { UPDATE_USER_MUTATION } from 'GraphQl/Mutations/mutations';
import React from 'react';
import styles from './UserUpdate.module.css';

interface UserUpdateProps {
  id: string;
}

function UserUpdate(props: UserUpdateProps): JSX.Element {
  const [formState, setFormState] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    applangcode: '',
    selectedOption: '',
  });

  const [login] = useMutation(UPDATE_USER_MUTATION);

  const login_link = async () => {
    try {
      const { data } = await login({
        variables: {
          firstName: formState.firstName,
          lastName: formState.lastName,
          email: formState.email,
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
      <div id="userupdate" className={styles.userupdatediv}>
        <form>
          {/* <h3 className={styles.settingstitle}>Update Your Details</h3> */}
          <div className={styles.dispflex}>
            <div>
              <label>First Name</label>
              <input
                type="input"
                id="firstname"
                placeholder="Enter First Name"
                autoComplete="off"
                required
                value={formState.firstName}
                onChange={(e) => {
                  setFormState({
                    ...formState,
                    firstName: e.target.value,
                  });
                }}
              />
            </div>
            <div>
              <label>Last Name</label>
              <input
                type="input"
                id="lastname"
                placeholder="Enter Last Name"
                autoComplete="off"
                required
                value={formState.lastName}
                onChange={(e) => {
                  setFormState({
                    ...formState,
                    lastName: e.target.value,
                  });
                }}
              />
            </div>
          </div>
          <div className={styles.dispflex}>
            <div>
              <label>Email</label>
              <input
                type="email"
                id="email"
                placeholder="Enter Email"
                autoComplete="off"
                required
                value={formState.email}
                onChange={(e) => {
                  setFormState({
                    ...formState,
                    email: e.target.value,
                  });
                }}
              />
            </div>
            <div>
              <label>Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter Password"
                required
                value={formState.password}
                onChange={(e) => {
                  setFormState({
                    ...formState,
                    password: e.target.value,
                  });
                }}
              />
            </div>
          </div>
          <div className={styles.dispflex}>
            <div>
              <label>App Language Code</label>
              <input
                type="input"
                id="applangcode"
                placeholder="Enter App Language Code"
                required
                value={formState.applangcode}
                onChange={(e) => {
                  setFormState({
                    ...formState,
                    applangcode: e.target.value,
                  });
                }}
              />
            </div>
            <div>
              <label>User Type</label>
              <div className={styles.radio_buttons}>
                <input
                  id="selectadmin"
                  value="selectadmin"
                  name="selectadmin"
                  type="radio"
                  checked={formState.selectedOption === 'selectadmin'}
                  onChange={(e) => {
                    setFormState({
                      ...formState,
                      selectedOption: e.target.value,
                    });
                  }}
                />
                <label>Admin</label>
                <input
                  id="selectsuperadmin"
                  value="selectsuperadmin"
                  name="selectsuperadmin"
                  type="radio"
                  checked={formState.selectedOption === 'selectsuperadmin'}
                  onChange={(e) => {
                    setFormState({
                      ...formState,
                      selectedOption: e.target.value,
                    });
                  }}
                />
                <label>Superadmins</label>
              </div>
            </div>
          </div>
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
export default UserUpdate;
