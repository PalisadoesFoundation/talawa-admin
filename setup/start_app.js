/**
 * @brief Code to show command to start the application
 * @description After all the steps of the installation havee finished,
 * this code displays the command to start the application
 */
import pkg from 'chalk';
import boxen from 'boxen';
import display_heading from './utils/heading.js';

const start_application = async () => {
  try {
    //Display message
    display_heading('START THE APPLICATION');
    console.log(
      pkg.green(
        'All the installation steps have been executed successfully 🎉. \nYou can start the application using the command below'
      )
    );

    //Display the command
    console.log(
      boxen('yarn serve', {
        float: 'center',
        textAlignment: 'center',
        borderColor: 'magenta',
        borderStyle: 'bold',
        padding: 1,
      })
    );

    process.exit(0);
  } catch (err) {
    console.log(pkg.red('ERROR: Failed to start the application'));
    console.log('REASON: ', err.message);
    process.exit(1);
  }
};

export default start_application;
