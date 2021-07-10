import React from 'react';
import styles from './SuperAdminDashboard.module.css';
import AdminNavbar from 'components/AdminNavbar/AdminNavbar';
import { Pie, Line, Bar } from 'react-chartjs-2';

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
      <AdminNavbar
        targets={[
          { name: 'Home', url: '/superdash' },
          { name: 'People', url: '/supermember' },
          { name: 'Organisation', url: '/superorg' },
          { name: 'LogOut', url: '/' },
        ]}
      />
      <div className={styles.first_box}>
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
      </div>
    </>
  );
}

export default SuperAdminDashboard;
