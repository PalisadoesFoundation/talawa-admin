/*
Driver code for express installation.

This program will install Talawa Admin on the system.
It executes the pre-defined commands on the shell and
then logs the output of each step.

*/

const prompt = require('prompt-sync')();
const { inputData, print_console, exit_process } = require('./setup/utils');

//  1. Shift to talawa-admin Directory
process.chdir(__dirname);

// 2. Display initial data
print_console('\nTALAWA-ADMIN INSTALLATION\n');

// 3. Take input of details from user
const takeUserInput = prompt(
  'Do you want to configure variables for the application, This will override any existing variable. (Enter Y for Yes, any other key to ignore): '
);

print_console('\nUSER INPUT\n');

if (takeUserInput === 'Y' || takeUserInput === 'y') {
  console.log('\n');
  print_console(
    'Enter the details below. All fields are compulsory.\n',
    '#8BD8BD'
  );
  inputData();
} else {
  exit_process('Installation is intruppted.\n');
}

// 4. Start the application
print_console('\nSTARTING APPLICATION\n');
print_console(
  'Talawa Admin has been successfully installed on your device. Now, you can start the application using the command mentioned below. The same command can be used to restart the application.\n'
);

print_console('yarn serve\n', '#00FF00');
