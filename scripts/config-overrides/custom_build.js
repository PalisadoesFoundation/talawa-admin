require('dotenv').config();
const { spawn } = require('child_process');

//use default react scritps config 
const react_script_build = 'npx react-scripts build';

//use custom config overriden by react-app-rewired 
const react_app_rewired_build = 'npx react-app-rewired build';

if (process.env.ALLOW_LOGS === "YES") {
  spawn(react_app_rewired_build, { stdio: 'inherit', shell: true });

}
else {
  spawn(react_script_build, { stdio: 'inherit', shell: true });
}
