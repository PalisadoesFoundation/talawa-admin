import React from 'react';
import styles from './UserUpdate.module.css';

interface UserUpdateProps {
  id: string;
  userid: string;
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
  return (
    <>
      <div id="userupdate" className={styles.userupdatediv}>
        <form>
          {/* <h3 className={styles.settingstitle}>Update Your Details</h3> */}
          <div className={styles.dispflex}>
            <div>
              <label>User ID</label>
              <input
                className={styles.idtitle}
                type="userid"
                id={props.userid}
                name="userid"
                value={props.userid}
                readOnly
              ></input>
            </div>
          </div>
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
              // onClick={login_link}
            >
              Save Changes
            </button>
            <button
              type="button"
              className={styles.whitebtn}
              value="cancelchanges"
              // onClick={login_link}
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
