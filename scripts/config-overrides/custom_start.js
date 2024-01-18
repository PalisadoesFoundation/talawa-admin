require('dotenv').config();
const { spawn } = require('child_process');

//const react_script_start = 'npx react-scripts start';
const reactAppRewiredStart =
  'npx react-app-rewired start --config-overrides=scripts/config-overrides/';

spawn(reactAppRewiredStart, { stdio: 'inherit', shell: true });
