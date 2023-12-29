require('dotenv').config();
const { spawn } = require('child_process');

const react_script_start = 'npx react-scripts start';
const react_app_rewired_start = 'npx react-app-rewired start';

if (process.env.ALLOW_LOGS === "YES") {
  // Execute the npm command
  spawn(react_app_rewired_start, { stdio: 'inherit', shell: true });

}
else {
  // Execute the npm command
  spawn(react_script_start, { stdio: 'inherit', shell: true });
  }

