import React from 'react';
import styles from './SuperAdminDashboard.module.css';
import { Pie, Line, Bar } from 'react-chartjs-2';
import Navbar from 'react-bootstrap/Navbar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Logo from 'assets/talawa-logo-200x200.png';
const line_state = {
  labels: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  datasets: [
    {
      label: 'Uptime',
      backgroundColor: '#31bb6b',
      borderColor: 'rgba(0,0,0,1)',
      borderWidth: 2,
      data: [65, 59, 80, 81, 56],
    },
  ],
};

const pie_state = {
  labels: ['Joined', 'Closed'],
  datasets: [
    {
      label: 'Organisation',
      backgroundColor: ['#febd59', '#31bb6b'],
      hoverBackgroundColor: ['#febd60', '#31bb6c'],
      data: [65, 45],
    },
  ],
};

const bar_state = {
  labels: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  datasets: [
    {
      label: 'Uptime',
      backgroundColor: '#febd59',
      borderColor: 'rgba(0,0,0,1)',
      borderWidth: 2,
      data: [65, 59, 80, 81, 56],
    },
  ],
};

function SuperAdminDashboard(): JSX.Element {
  return (
    <>
      {/* <div className={styles.first_box}>
        <h2>Dashboard</h2>
        <div className={styles.second_box}>
          <div className={styles.left_one}>
            <h4>List Of Organization</h4>
            <div className={styles.list}></div>
          </div>
          <div className={styles.right_one}>
            <h4>Organisation Statistics</h4>
            <div>
              <Pie
                type
                data={pie_state}
                height={220}
                options={{
                  maintainAspectRatio: false,
                  title: {
                    display: true,
                    text: 'Organisation',
                    fontSize: 20,
                  },
                  legend: {
                    display: true,
                    position: 'right',
                  },
                }}
              />
            </div>
          </div>
        </div>
        <div className={styles.third_box}>
          <div className={styles.left_one}>
            <h4>API Uptime Statistics</h4>
            <div>
              <Line
                type
                data={line_state}
                options={{
                  maintainAspectRatio: false,
                  title: {
                    display: true,
                    text: 'Average Uptime per month',
                    fontSize: 20,
                  },
                  legend: {
                    display: true,
                    position: 'right',
                  },
                }}
              />
            </div>
          </div>
          <div className={styles.right_one}>
            <h4>Organisation Registered Statistics</h4>
            <div>
              <Bar
                type
                data={bar_state}
                options={{
                  title: {
                    display: true,
                    text: 'Average Rainfall per month',
                    fontSize: 20,
                  },
                  legend: {
                    display: true,
                    position: 'right',
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div> */}
      <Navbar className={styles.navbarbg}>
        <Navbar.Brand>
          <a className={styles.logo} href="/">
            <img src={Logo} />
            <strong>Talawa Portal</strong>
          </a>
        </Navbar.Brand>
      </Navbar>
      {/* <div className={styles.mainpage}>
        <div className={styles.sidebar}>
          <div className={styles.sidebarsticky}>
            <p className={styles.logintitle}>You</p>
          </div>
        </div>
        <div>
          <p className={styles.logintitle}>You</p>
        </div>
      </div> */}
      <Row>
        <Col sm={3}>
          <div className={styles.sidebar}>
            <div className={styles.sidebarsticky}>
              <h6 className={styles.logintitle}>You</h6>
              <p>
                Name:
                <span></span>
              </p>
              <p>
                Designation:
                <span></span>
              </p>
              <p>
                Email:
                <span></span>
              </p>
              <p>
                Contact:
                <span></span>
              </p>

              <h6 className={styles.logintitleadmin}>Super Admins</h6>
              <p className={styles.admindetails}>
                <p>Saumya Singh</p>
                <p>+</p>
              </p>
              <p className={styles.admindetails}>
                <p>Yasharth Dubey</p>
                <p>+</p>
              </p>
              <p className={styles.admindetails}>
                <p>Saumya Singh</p>
                <p>+</p>
              </p>
              <p className={styles.admindetails}>
                <p>Yasarth Dubey</p>
                <p>+</p>
              </p>
            </div>
          </div>
        </Col>
        <Col sm={8}>
          <div className={styles.mainpageright}>
            <Row className={styles.justifysp}>
              <p className={styles.logintitle}>Organizations List</p>
              <button>+</button>
            </Row>
            <Row className={styles.orglist}>
              <img
                src="https://via.placeholder.com/200x100"
                className={styles.orgimg}
              />
              <Col className={styles.singledetails}>
                <div className={styles.singledetails_data_left}>
                  <p className={styles.orgname}>Saumya Singh</p>
                  <p className={styles.orgfont}>Gujarat, India</p>
                  <p className={styles.orgfontcreated}>
                    Created: <span>Date</span>
                  </p>
                </div>
                <div className={styles.singledetails_data_right}>
                  <p className={styles.orgfont}>
                    Admins: <span>10</span>
                  </p>
                  <p className={styles.orgfont}>
                    Members: <span>40</span>
                  </p>
                  <button className={styles.orgfontcreated}>Manage</button>
                </div>
              </Col>
            </Row>
            <hr></hr>
            <Row className={styles.orglist}>
              <img
                src="https://via.placeholder.com/200x100"
                className={styles.orgimg}
              />
              <Col className={styles.singledetails}>
                <div className={styles.singledetails_data_left}>
                  <p className={styles.orgname}>Saumya Singh</p>
                  <p className={styles.orgfont}>Gujarat, India</p>
                  <p className={styles.orgfontcreated}>
                    Created: <span>Date</span>
                  </p>
                </div>
                <div className={styles.singledetails_data_right}>
                  <p className={styles.orgfont}>
                    Admins: <span>10</span>
                  </p>
                  <p className={styles.orgfont}>
                    Members: <span>40</span>
                  </p>
                  <button className={styles.orgfontcreated}>Manage</button>
                </div>
              </Col>
            </Row>
            <hr></hr>
            <Row className={styles.orglist}>
              <img
                src="https://via.placeholder.com/200x100"
                className={styles.orgimg}
              />
              <Col className={styles.singledetails}>
                <div className={styles.singledetails_data_left}>
                  <p className={styles.orgname}>Saumya Singh</p>
                  <p className={styles.orgfont}>Gujarat, India</p>
                  <p className={styles.orgfontcreated}>
                    Created: <span>Date</span>
                  </p>
                </div>
                <div className={styles.singledetails_data_right}>
                  <p className={styles.orgfont}>
                    Admins: <span>10</span>
                  </p>
                  <p className={styles.orgfont}>
                    Members: <span>40</span>
                  </p>
                  <button className={styles.orgfontcreated}>Manage</button>
                </div>
              </Col>
            </Row>
            <hr></hr>
          </div>
        </Col>
      </Row>
    </>
  );
}

export default SuperAdminDashboard;
