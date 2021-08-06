import React, { useState, FormEvent } from 'react';
import styles from './OrganizationDashboard.module.css';
import Navbar from 'react-bootstrap/Navbar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import AdminNavbar from 'components/AdminNavbar/AdminNavbar';
import { Pie, Line, Bar } from 'react-chartjs-2';
import AboutImg from 'assets/images/dogo.png';
import Modal from 'react-modal';

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

function OrganizationDashboard(): JSX.Element {
  return (
    <>
      <AdminNavbar
        targets={[
          { name: 'Dashboard', url: '/orgdashboard' },
          { name: 'People', url: '/supermember' },
          { name: 'Organisation', url: '/superorg' },
          { name: 'LogOut', url: '/' },
        ]}
      />
      <Row className={styles.toporginfo}>
        <p></p>
        <p className={styles.toporgname}>Organization for Dogs</p>
        <p className={styles.toporgloc}>Location : </p>
      </Row>
      <Row>
        <Col sm={3}>
          <div className={styles.sidebar}>
            <div className={styles.sidebarsticky}>
              <h6 className={styles.titlename}>About</h6>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                {/* in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum. */}
              </p>
              <img src={AboutImg} className={styles.org_about_img} />
              <h6 className={styles.titlename}>Tags</h6>
              <p className={styles.tagdetails}>
                <button>Shelter</button>
                <button>Donation</button>
              </p>
              <p className={styles.tagdetails}>
                <button>Dogs</button>
                <button>Care</button>
              </p>
              <p className={styles.tagdetails}>
                <button>NGO</button>
              </p>
            </div>
          </div>
        </Col>
        <Col sm={8}>
          <div className={styles.mainpageright}>
            <Row className={styles.justifysp}>
              <p className={styles.titlename}>Statistics</p>
              {/* <button className={styles.invitebtn} onClick={showInviteModal}>
                Invite Super Admins
              </button> */}
            </Row>
          </div>
        </Col>
      </Row>
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
    </>
  );
}

export default OrganizationDashboard;
