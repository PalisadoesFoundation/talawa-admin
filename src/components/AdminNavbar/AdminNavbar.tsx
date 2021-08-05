import React from 'react';
import styles from './AdminNavbar.module.css';
import Navbar from 'react-bootstrap/Navbar';
import Logo from 'assets/talawa-logo-200x200.png';
import Row from 'react-bootstrap/Row';
interface NavbarProps {
  targets: { url: string; name: string }[];
}

function AdminNavbar({ targets }: NavbarProps): JSX.Element {
  return (
    <>
      <Navbar className={styles.navbarbg}>
        <Navbar.Brand>
          <Row className={styles.navallitem}>
            <a className={styles.logo} href="/">
              <img src={Logo} />
              <strong>Talawa Portal</strong>
            </a>
            <div className={styles.navitems}>
              <a href="/orgdashboard">Dashboard</a>
              <a href="/orgpeople">People</a>
              <a>Events</a>
              <a>Contributions</a>
              <a>Posts</a>
            </div>
            {/* <div className={styles.userimage}>
              <img
                src="https://via.placeholder.com/45"
                className={styles.roundedcircle}
              />
            </div> */}
          </Row>
        </Navbar.Brand>
      </Navbar>
      {/* // <Nav className={styles.sidebar} activeKey="/home">
      //   <div className={styles.sidebarsticky}>
      //     {targets.map(({ name, url }) => (
      //       <Nav.Item key={name} className={styles.navitem}>
      //         <Nav.Link href={url} className={styles.naviteminside}>
      //           {name}
      //         </Nav.Link>
      //       </Nav.Item>
      //     ))}
      //   </div>
      // </Nav> */}
    </>
  );
}

export default AdminNavbar;
